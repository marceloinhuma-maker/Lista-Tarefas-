import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Trash2,
  Edit3,
  Check,
  Clock
} from 'lucide-react';
import { Task } from '../../services/types';
import { useTasks } from '../../context/TaskContext';
import { getDueDateStatus } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTask, openEditModal, openDeleteModal, categories } = useTasks();

  const category = categories.find((c) => c.id === task.categoryId) || {
    id: 'outros',
    name: 'Geral',
    color: '#64748b',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200'
  };

  const priorityConfigs = {
    high: {
      label: 'ALTA',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500'
    },
    medium: {
      label: 'MÉDIA',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500'
    },
    low: {
      label: 'BAIXA',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500'
    }
  };

  const currentPriority = priorityConfigs[task.priority] || priorityConfigs.medium;
  const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 border-slate-200/60 opacity-65 hover:opacity-90'
          : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Custom Checkbox no lado esquerdo */}
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`mt-0.5 relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/40'
          }`}
          aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          {task.completed && (
            <Check className="w-4 h-4 text-white stroke-[3] animate-check-pop" />
          )}
        </button>

        {/* Informações da Tarefa */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            {/* Título da Tarefa em Destaque */}
            <h3
              onClick={() => toggleTask(task.id)}
              className={`text-base font-semibold tracking-tight transition-all cursor-pointer select-none leading-snug break-words ${
                task.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-900 hover:text-indigo-600'
              }`}
            >
              {task.title}
            </h3>

            {/* Ações (Editar e Lixeira no canto direito) */}
            <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
              <button
                type="button"
                onClick={() => openEditModal(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                title="Editar Tarefa"
                aria-label="Editar Tarefa"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => openDeleteModal(task)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Excluir Tarefa"
                aria-label="Excluir Tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Descrição Opcional */}
          {task.description && (
            <p
              className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                task.completed ? 'line-through text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Tags Coloridas (Categoria, Prioridade e Data com Ícone de Calendário) */}
          <div className="flex items-center gap-2 flex-wrap mt-3 pt-2.5 border-t border-slate-100/80">
            {/* Tag Categoria */}
            <span
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
                borderColor: `${category.color}30`
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider border uppercase select-none"
            >
              <span
                style={{ backgroundColor: category.color }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
              />
              {category.name}
            </span>

            {/* Tag Prioridade (ALTA, MÉDIA, BAIXA) */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider border uppercase select-none ${currentPriority.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentPriority.dotColor}`}
              />
              {currentPriority.label}
            </span>

            {/* Data de Vencimento com Ícone de Calendário */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border select-none ${dueDateStatus.badgeClass}`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{dueDateStatus.label}</span>
              {task.dueTime && (
                <span className="flex items-center gap-1 text-[10px] opacity-75">
                  <Clock className="w-3 h-3" />
                  {task.dueTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
