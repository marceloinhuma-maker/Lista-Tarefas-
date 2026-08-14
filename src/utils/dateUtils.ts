/**
 * Funções auxiliares para manipulação e formatação de datas em Português do Brasil (pt-BR)
 */

export function formatDatePtBR(dateString?: string): string {
  if (!dateString) return 'Sem data';
  
  // Garantir que a data seja interpretada no fuso local sem desvios de UTC
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatShortDatePtBR(dateString?: string): string {
  if (!dateString) return 'Sem data';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextWeekString(): string {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const year = nextWeek.getFullYear();
  const month = String(nextWeek.getMonth() + 1).padStart(2, '0');
  const day = String(nextWeek.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isPastDate(dateString?: string): boolean {
  if (!dateString) return false;
  const today = getTodayString();
  return dateString < today;
}

export function isToday(dateString?: string): boolean {
  if (!dateString) return false;
  return dateString === getTodayString();
}

export function isTomorrow(dateString?: string): boolean {
  if (!dateString) return false;
  return dateString === getTomorrowString();
}

export interface DueDateStatus {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  badgeClass: string;
  dotColor: string;
}

export function getDueDateStatus(dateString?: string, completed: boolean = false): DueDateStatus {
  if (!dateString) {
    return {
      label: 'Sem data',
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
      dotColor: 'bg-slate-400'
    };
  }

  if (completed) {
    return {
      label: formatDatePtBR(dateString),
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotColor: 'bg-emerald-500'
    };
  }

  if (isPastDate(dateString)) {
    return {
      label: `Atrasada (${formatShortDatePtBR(dateString)})`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
      dotColor: 'bg-rose-500 animate-pulse'
    };
  }

  if (isToday(dateString)) {
    return {
      label: 'Vence Hoje',
      isOverdue: false,
      isToday: true,
      isTomorrow: false,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
      dotColor: 'bg-amber-500'
    };
  }

  if (isTomorrow(dateString)) {
    return {
      label: 'Vence Amanhã',
      isOverdue: false,
      isToday: false,
      isTomorrow: true,
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dotColor: 'bg-indigo-500'
    };
  }

  return {
    label: formatDatePtBR(dateString),
    isOverdue: false,
    isToday: false,
    isTomorrow: false,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dotColor: 'bg-slate-400'
  };
}

export function getMonthNamePtBR(monthIndex: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex] || '';
}

export function getWeekDaysPtBR(): string[] {
  return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
}
