import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTasks } from '../../context/TaskContext';
import { PriorityLevel } from '../../services/types';
import {
  getTodayString,
  getTomorrowString,
  getNextWeekString
} from '../../utils/dateUtils';

export const TaskFormModal: React.FC = () => {
  const {
    isFormModalOpen,
    closeFormModal,
    taskToEdit,
    createTask,
    updateTask,
    categories,
    openCategoryModal
  } = useTasks();

  const isEditing = Boolean(taskToEdit && taskToEdit.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setCategoryId(taskToEdit.categoryId || categories[0]?.id || 'trabalho');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.dueDate || getTodayString());
      setDueTime(taskToEdit.dueTime || '');
    } else {
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || 'trabalho');
      setPriority('medium');
      setDueDate(getTodayString());
      setDueTime('');
    }
    setError('');
  }, [taskToEdit, isFormModalOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }

    if (isEditing && taskToEdit) {
      await updateTask({
        ...taskToEdit,
        title: title.trim(),
        description: description.trim(),
        categoryId,
        priority,
        dueDate,
        dueTime: dueTime || undefined
      });
    } else {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        priority,
        dueDate,
        dueTime: dueTime || undefined
      });
    }
  };

  const priorityOptions: { level: PriorityLevel; label: string; activeClass: string }[] = [
    {
      level: 'high',
      label: 'ALTA',
      activeClass: 'bg-rose-50 text-rose-700 border-rose-400 ring-2 ring-rose-300'
    },
    {
      level: 'medium',
      label: 'MÉDIA',
      activeClass: 'bg-amber-50 text-amber-800 border-amber-400 ring-2 ring-amber-300'
    },
    {
      level: 'low',
      label: 'BAIXA',
      activeClass: 'bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-300'
    }
  ];

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={closeFormModal}
      title={isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
      subtitle={
        isEditing
          ? 'Atualize os detalhes, prazo ou prioridade desta tarefa'
          : 'Preencha as informações para organizar sua atividade'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Título da Tarefa */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Título da Tarefa <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="O que precisa ser feito?"
            maxLength={120}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            autoFocus
          />
          {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
        </div>

        {/* Descrição Opcional */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Descrição / Detalhes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione notas, links ou detalhes importantes (opcional)..."
            rows={3}
            maxLength={500}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Categorização */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Categoria
            </label>
            <button
              type="button"
              onClick={openCategoryModal}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Categoria</span>
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  style={{
                    backgroundColor: isSelected ? cat.color : `${cat.color}12`,
                    color: isSelected ? '#ffffff' : cat.color,
                    borderColor: isSelected ? cat.color : `${cat.color}35`
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected ? 'shadow-xs scale-105' : 'hover:opacity-90'
                  }`}
                >
                  <span
                    style={{
                      backgroundColor: isSelected ? '#ffffff' : cat.color
                    }}
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priorização & Prazo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Prioridade */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setPriority(opt.level)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold uppercase tracking-wider border text-center transition-all cursor-pointer ${
                      isSelected
                        ? opt.activeClass
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Data de Vencimento
            </label>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                />
              </div>

              {/* Atalhos Rápidos de Data */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDueDate(getTodayString())}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getTomorrowString())}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Amanhã
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getNextWeekString())}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  Próx. Semana
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé e Ações */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" type="button" onClick={closeFormModal}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
