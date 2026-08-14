import { Category, Task, UserProfile } from '../services/types';
import { getTodayString, getTomorrowString, getNextWeekString } from './dateUtils';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'trabalho',
    name: 'Trabalho',
    color: '#4f46e5', // indigo
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    icon: 'Briefcase'
  },
  {
    id: 'pessoal',
    name: 'Pessoal',
    color: '#059669', // emerald
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: 'User'
  },
  {
    id: 'estudos',
    name: 'Estudos',
    color: '#d97706', // amber
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-750',
    borderColor: 'border-amber-200',
    icon: 'BookOpen'
  },
  {
    id: 'financas',
    name: 'Finanças',
    color: '#7c3aed', // violet
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: 'DollarSign'
  },
  {
    id: 'saude',
    name: 'Saúde',
    color: '#e11d48', // rose
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    icon: 'Heart'
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Alexandre Souza',
  email: 'alexandre.souza@empresa.com.br',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  occupation: 'Desenvolvedor Full Stack'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalizar documentação da API e arquitetura',
    description: 'Revisar endpoints de tarefas e autenticação para integração com o Supabase.',
    completed: false,
    categoryId: 'trabalho',
    priority: 'high',
    dueDate: getTodayString(),
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    completedAt: null
  },
  {
    id: 'task-2',
    title: 'Estudar padrões avançados de Tailwind CSS v4',
    description: 'Praticar tokens de design com `@theme`, container queries e otimizações.',
    completed: false,
    categoryId: 'estudos',
    priority: 'medium',
    dueDate: getTomorrowString(),
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    completedAt: null
  },
  {
    id: 'task-3',
    title: 'Treino de cardio e musculação (45 min)',
    description: 'Manter a consistência na academia no início do dia.',
    completed: true,
    categoryId: 'saude',
    priority: 'medium',
    dueDate: getTodayString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'task-4',
    title: 'Organizar planilha de investimentos do mês',
    description: 'Conferir extratos bancários, aportes em renda fixa e despesas fixas.',
    completed: false,
    categoryId: 'financas',
    priority: 'low',
    dueDate: getNextWeekString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    completedAt: null
  },
  {
    id: 'task-5',
    title: 'Comprar presente de aniversário da mãe',
    description: 'Pesquisar opções de flores e livro que ela comentou na semana passada.',
    completed: false,
    categoryId: 'pessoal',
    priority: 'high',
    dueDate: getTomorrowString(),
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    completedAt: null
  },
  {
    id: 'task-6',
    title: 'Configurar rotinas de backup local e cloud',
    description: 'Automatizar sincronização periódica de arquivos de desenvolvimento.',
    completed: true,
    categoryId: 'trabalho',
    priority: 'low',
    dueDate: getTodayString(),
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
