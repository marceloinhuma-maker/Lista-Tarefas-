import React from 'react';
import { Calendar, Target, CheckCircle2, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const HeaderStats: React.FC = () => {
  const { userProfile, stats } = useTasks();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs mb-6 sm:mb-8 relative overflow-hidden">
      {/* Decorative gradient sphere */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-indigo-100/50 to-sky-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100/80">
            <Calendar className="w-3.5 h-3.5" />
            <span className="capitalize">{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {userProfile.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500">
            {stats.pending > 0
              ? `Você tem ${stats.pending} ${stats.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'} hoje. Vamos produzir!`
              : 'Tudo em dia! Excelente trabalho de produtividade.'}
          </p>
        </div>

        {/* Right Progress & Quick Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
          {/* Progress Circular/Linear */}
          <div className="space-y-2 min-w-[180px]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Progresso Diário
              </span>
              <span className="text-indigo-600 font-bold">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {stats.completed} de {stats.total} tarefas finalizadas
            </p>
          </div>

          <div className="h-10 w-px bg-slate-200 hidden sm:block" />

          {/* Quick Metrics Icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-900 leading-tight">
                  {stats.completed}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Concluídas</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-900 leading-tight">
                  {stats.pending}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Pendentes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
