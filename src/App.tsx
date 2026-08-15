import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { HeaderStats } from './components/layout/HeaderStats';
import { TaskList } from './components/tasks/TaskList';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { CalendarView } from './components/calendar/CalendarView';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { TaskDeleteModal } from './components/tasks/TaskDeleteModal';
import { LogoutModal } from './components/common/LogoutModal';
import { CategoryModal } from './components/common/CategoryModal';
import { Toast } from './components/common/Toast';
import { Database, ShieldCheck, Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useTasks();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <HeaderStats />

      <div className="transition-all duration-300">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'calendar' && <CalendarView />}
      </div>

      <footer className="mt-16 pt-8 pb-12 border-t border-slate-200/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Database className="w-4 h-4 text-indigo-500" />
          <span>
            Persistência: <strong>Supabase</strong> · Dados seguros na nuvem
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>TaskFlow Pro • Alta Performance & Design Moderno</span>
        </div>
      </footer>

      <TaskFormModal />
      <TaskDeleteModal />
      <LogoutModal />
      <CategoryModal />
      <Toast />
    </main>
  );
};

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
      <Loader2 className="w-7 h-7 animate-spin" />
    </div>
    <p className="text-sm text-slate-500 font-medium animate-pulse">Carregando TaskFlow...</p>
  </div>
);

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <LoginPage />;

  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <MainContent />
      </div>
    </TaskProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
