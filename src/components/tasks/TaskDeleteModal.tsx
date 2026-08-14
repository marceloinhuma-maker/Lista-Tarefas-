import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useTasks } from '../../context/TaskContext';

export const TaskDeleteModal: React.FC = () => {
  const { isDeleteModalOpen, closeDeleteModal, taskToDelete, deleteTask } = useTasks();

  if (!taskToDelete) return null;

  const handleDelete = async () => {
    await deleteTask(taskToDelete.id);
  };

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      title="Excluir Tarefa"
      subtitle="Confirme se realmente deseja remover esta tarefa"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3.5 p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {taskToDelete.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Esta ação removerá a tarefa. Você ainda poderá desfazê-la brevemente pelo aviso na tela.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button variant="ghost" type="button" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            icon={<Trash2 className="w-4 h-4" />}
          >
            Excluir Tarefa
          </Button>
        </div>
      </div>
    </Modal>
  );
};
