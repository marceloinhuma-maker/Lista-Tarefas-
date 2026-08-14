export type PriorityLevel = 'high' | 'medium' | 'low';

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'title';

export type ActiveTab = 'tasks' | 'analytics' | 'calendar';

export interface Category {
  id: string;
  name: string;
  color: string; // Hex color code or tailwind color name
  bgLight: string;
  textColor: string;
  borderColor: string;
  icon?: string;
  isCustom?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  priority: PriorityLevel;
  dueDate: string; // YYYY-MM-DD format
  dueTime?: string; // HH:mm format
  createdAt: string; // ISO String
  completedAt?: string | null; // ISO String
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  occupation: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  completionRate: number;
}
