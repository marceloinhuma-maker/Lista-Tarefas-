import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTasks } from '../../context/TaskContext';

const PRESET_COLORS = [
  '#4f46e5', // indigo
  '#059669', // emerald
  '#d97706', // amber
  '#7c3aed', // purple
  '#e11d48', // rose
  '#0284c7', // sky
  '#0d9488', // teal
  '#ea580c', // orange
  '#475569'  // slate
];

export const CategoryModal: React.FC = () => {
  const { isCategoryModalOpen, closeCategoryModal, createCategory } = useTasks();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da categoria.');
      return;
    }

    await createCategory({
      name: name.trim(),
      color: selectedColor,
      icon: 'Tag'
    });

    setName('');
    setError('');
  };

  return (
    <Modal
      isOpen={isCategoryModalOpen}
      onClose={closeCategoryModal}
      title="Nova Categoria"
      subtitle="Crie uma categoria personalizada para organizar suas tarefas"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nome da Categoria
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ex: Projetos, Academia, Leitura..."
            maxLength={30}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            autoFocus
          />
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Cor de Identificação
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                  selectedColor === color
                    ? 'ring-3 ring-offset-2 ring-indigo-500 scale-110'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
              >
                {selectedColor === color && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button variant="ghost" type="button" onClick={closeCategoryModal}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar Categoria
          </Button>
        </div>
      </form>
    </Modal>
  );
};
