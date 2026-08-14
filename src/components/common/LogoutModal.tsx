import React from 'react';
import { LogOut, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTasks } from '../../context/TaskContext';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, closeLogoutModal, userProfile, resetToDemo, showToast } = useTasks();

  const handleSimulateLogout = () => {
    closeLogoutModal();
    showToast('Sessão encerrada com sucesso! Até breve!', 'info');
  };

  return (
    <Modal
      isOpen={isLogoutModalOpen}
      onClose={closeLogoutModal}
      title="Sessão e Conta"
      subtitle="Gerenciar perfil e dados de demonstração"
      maxWidth="sm"
    >
      <div className="space-y-5">
        {/* User Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 truncate">
              {userProfile.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
            <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">
              {userProfile.occupation}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seus dados estão armazenados com segurança no <strong>LocalStorage</strong> e prontos para sincronização com o <strong>Supabase</strong>.
        </p>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
          <Button
            variant="outline"
            onClick={resetToDemo}
            icon={<RotateCcw className="w-4 h-4 text-amber-600" />}
            className="w-full text-slate-700 hover:text-amber-800 hover:border-amber-200 justify-center"
          >
            Restaurar Dados de Demonstração
          </Button>

          <Button
            variant="danger"
            onClick={handleSimulateLogout}
            icon={<LogOut className="w-4 h-4" />}
            className="w-full justify-center"
          >
            Sair da Conta
          </Button>
        </div>
      </div>
    </Modal>
  );
};
