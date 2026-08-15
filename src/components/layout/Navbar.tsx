import React from 'react';
import {
  CheckSquare,
  BarChart3,
  Calendar as CalendarIcon,
  Plus,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../services/types';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openCreateModal,
    openLogoutModal,
    userProfile,
    stats
  } = useTasks();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'tasks',
      label: 'Tarefas',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: stats.pending > 0 ? stats.pending : undefined
    },
    {
      id: 'analytics',
      label: 'Análises',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'calendar',
      label: 'Calendário',
      icon: <CalendarIcon className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  TaskFlow
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Gerenciador de Tarefas & Produtividade
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Add Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => openCreateModal()}
              icon={<Plus className="w-4 h-4" />}
              className="font-semibold shadow-sm"
            >
              <span className="hidden sm:inline">Nova Tarefa</span>
              <span className="sm:hidden">Nova</span>
            </Button>

            <div className="h-6 w-px bg-slate-200 mx-0.5 hidden sm:block" />

            {/* User Profile / Logout Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={openLogoutModal}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                title={user?.email ?? userProfile.name}
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {userProfile.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 max-w-[120px] truncate">
                    {user?.email ?? ''}
                  </span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                title="Sair da conta"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-slate-100 py-2 justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
