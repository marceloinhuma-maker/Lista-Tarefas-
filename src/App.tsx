import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
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
import { Database, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useTasks();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Welcome & Progress Bar (Always visible on Tasks and Overview) */}
      <HeaderStats />

      {/* Dynamic Tab Views */}
      <div className="transition-all duration-300">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'calendar' && <CalendarView />}
      </div>

      {/* Footer Info */}
      <footer className="mt-16 pt-8 pb-12 border-t border-slate-200/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Database className="w-4 h-4 text-indigo-500" />
          <span>
            Persistência: <strong>LocalStorage</strong> (Pronto para <strong>Supabase</strong>)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>TaskFlow Pro • Alta Performance & Design Moderno</span>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <TaskFormModal />
      <TaskDeleteModal />
      <LogoutModal />
      <CategoryModal />
      <Toast />
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <MainContent />
      </div>
    </TaskProvider>
  );
};

export default App;
