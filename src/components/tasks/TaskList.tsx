import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Inbox, Plus, Filter } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { Button } from '../common/Button';

export const TaskList: React.FC = () => {
  const {
    tasks,
    filterStatus,
    searchQuery,
    selectedCategory,
    selectedPriority,
    sortBy,
    openCreateModal,
    isLoading
  } = useTasks();

  // Filtragem e Ordenação
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filtro de status: Todas, Pendentes, Concluídas
        if (filterStatus === 'pending' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;

        // Filtro de busca textual
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Filtro de categoria
        if (selectedCategory && task.categoryId !== selectedCategory) {
          return false;
        }

        // Filtro de prioridade
        if (selectedPriority && task.priority !== selectedPriority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const priorityWeights = { high: 3, medium: 2, low: 1 };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // Mais recentes primeiro (createdAt)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, filterStatus, searchQuery, selectedCategory, selectedPriority, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="animate-pulse h-24 bg-white rounded-2xl border border-slate-200/80 p-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros e Busca */}
      <TaskFilters />

      {/* Lista de Tarefas */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200/90 shadow-2xs my-4"
        >
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
            {searchQuery || selectedCategory || selectedPriority ? (
              <Filter className="w-8 h-8 opacity-75" />
            ) : filterStatus === 'completed' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
            ) : (
              <Inbox className="w-8 h-8 opacity-75" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {searchQuery || selectedCategory || selectedPriority
              ? 'Nenhuma tarefa encontrada para este filtro'
              : filterStatus === 'completed'
              ? 'Nenhuma tarefa concluída ainda'
              : 'Sua lista de tarefas está vazia'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
            {searchQuery || selectedCategory || selectedPriority
              ? 'Tente ajustar ou limpar os filtros para encontrar o que procura.'
              : filterStatus === 'completed'
              ? 'Marque tarefas como concluídas na lista para vê-las aqui.'
              : 'Crie sua primeira tarefa agora para organizar seu dia com clareza e foco.'}
          </p>

          {(!searchQuery && !selectedCategory && !selectedPriority && filterStatus !== 'completed') && (
            <Button
              variant="primary"
              onClick={() => openCreateModal()}
              icon={<Plus className="w-4 h-4" />}
            >
              Criar Nova Tarefa
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};
