import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import {
  getMonthNamePtBR,
  getWeekDaysPtBR,
  getTodayString
} from '../../utils/dateUtils';
import { TaskCard } from '../tasks/TaskCard';
import { Button } from '../common/Button';

export const CalendarView: React.FC = () => {
  const { tasks, openCreateModal } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateString, setSelectedDateString] = useState<string>(getTodayString());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateString(getTodayString());
  };

  // Cálculo de dias do mês
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Dias do mês anterior para preenchimento
  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1
  );

  // Dias do mês atual
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Total de células para completar grade 7x5 ou 7x6
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  const nextMonthDays = Array.from(
    { length: nextMonthDaysCount },
    (_, i) => i + 1
  );

  // Tarefas da data selecionada
  const tasksForSelectedDate = tasks.filter(
    (t) => t.dueDate === selectedDateString
  );

  const formatSelectedDateTitle = () => {
    const [year, month, day] = selectedDateString.split('-').map(Number);
    if (!year || !month || !day) return selectedDateString;
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Calendar Grid Section */}
      <div className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Header with Month / Year and Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 capitalize">
              {getMonthNamePtBR(currentMonth)} {currentYear}
            </h3>
            <p className="text-xs text-slate-400">
              Clique em um dia para inspecionar ou agendar tarefas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              Hoje
            </button>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                title="Próximo Mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {getWeekDaysPtBR().map((dayName) => (
            <div
              key={dayName}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 py-1"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Previous Month Inactive Days */}
          {prevMonthDays.map((day) => (
            <div
              key={`prev-${day}`}
              className="min-h-[55px] sm:min-h-[70px] p-1.5 rounded-2xl bg-slate-50/40 text-slate-300 text-xs font-medium select-none"
            >
              <span>{day}</span>
            </div>
          ))}

          {/* Current Month Active Days */}
          {currentMonthDays.map((day) => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              '0'
            )}-${String(day).padStart(2, '0')}`;
            const isTodayDate = dateStr === getTodayString();
            const isSelected = dateStr === selectedDateString;
            const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
            const pendingTasksCount = dayTasks.filter((t) => !t.completed).length;
            const completedTasksCount = dayTasks.filter((t) => t.completed).length;

            return (
              <button
                key={`current-${day}`}
                type="button"
                onClick={() => setSelectedDateString(dateStr)}
                className={`min-h-[55px] sm:min-h-[70px] p-1.5 sm:p-2 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/20'
                    : isTodayDate
                    ? 'border-indigo-300 bg-white'
                    : 'border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isTodayDate
                        ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center -ml-1 -mt-1'
                        : isSelected
                        ? 'text-indigo-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Day Tasks Indicator Dots */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {pendingTasksCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500" title={`${pendingTasksCount} pendente(s)`} />
                  )}
                  {completedTasksCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title={`${completedTasksCount} concluída(s)`} />
                  )}
                </div>
              </button>
            );
          })}

          {/* Next Month Inactive Days */}
          {nextMonthDays.map((day) => (
            <div
              key={`next-${day}`}
              className="min-h-[55px] sm:min-h-[70px] p-1.5 rounded-2xl bg-slate-50/40 text-slate-300 text-xs font-medium select-none"
            >
              <span>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Agenda Section */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                Agenda do Dia
              </span>
              <h4 className="text-base font-bold text-slate-900 capitalize mt-0.5">
                {formatSelectedDateTitle()}
              </h4>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openCreateModal(selectedDateString)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Adicionar
            </Button>
          </div>

          {/* Task List for Selected Date */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="py-12 text-center text-slate-400">
                <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Nenhuma tarefa agendada
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Aproveite o dia livre ou adicione uma atividade.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openCreateModal(selectedDateString)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                  className="mt-4"
                >
                  Criar Tarefa para este Dia
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
