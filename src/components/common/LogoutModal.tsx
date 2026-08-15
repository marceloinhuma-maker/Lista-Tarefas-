import React from 'react';
import { LogOut, RotateCcw, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';

export const LogoutModal: React.FC = () => {
  const { isLogoutModalOpen, closeLogoutModal, userProfile, resetToDemo } = useTasks();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    closeLogoutModal();
    await signOut();
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
            <h4 className="text-sm font-semibold text-slate-800 truncate">{userProfile.name}</h4>
            <p className="text-xs text-slate-500 truncate">{user?.email ?? userProfile.email}</p>
            {userProfile.occupation && (
              <span className="inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">
                {userProfile.occupation}
              </span>
            )}
          </div>
          <div className="ml-auto flex-shrink-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seus dados estão armazenados com segurança no <strong>Supabase</strong> e protegidos por
          autenticação.
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
            onClick={handleSignOut}
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
