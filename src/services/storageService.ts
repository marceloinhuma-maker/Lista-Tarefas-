import { Task, Category, UserProfile, PriorityLevel } from './types';
import { INITIAL_CATEGORIES, INITIAL_TASKS, INITIAL_USER } from '../utils/initialData';

const TASKS_KEY = 'taskflow_tasks_v1';
const CATEGORIES_KEY = 'taskflow_categories_v1';
const USER_KEY = 'taskflow_user_v1';

export class LocalStorageService {
  /**
   * Obtém todas as tarefas salvas ou inicializa com os dados de demonstração
   */
  static async getTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data) as Task[];
    } catch (error) {
      console.error('Erro ao ler tarefas do LocalStorage:', error);
      return INITIAL_TASKS;
    }
  }

  /**
   * Cria uma nova tarefa
   */
  static async createTask(taskData: {
    title: string;
    description?: string;
    categoryId: string;
    priority: PriorityLevel;
    dueDate: string;
    dueTime?: string;
  }): Promise<Task> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      completed: false,
      categoryId: taskData.categoryId,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    const updatedTasks = [newTask, ...tasks];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return newTask;
  }

  /**
   * Atualiza uma tarefa existente
   */
  static async updateTask(updatedTask: Task): Promise<Task> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === updatedTask.id);
    if (index === -1) {
      throw new Error(`Tarefa com ID ${updatedTask.id} não encontrada.`);
    }

    tasks[index] = {
      ...updatedTask,
      title: updatedTask.title.trim(),
      description: updatedTask.description?.trim()
    };

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  }

  /**
   * Alterna o estado de conclusão da tarefa
   */
  static async toggleTask(id: string): Promise<Task> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com ID ${id} não encontrada.`);
    }

    const currentTask = tasks[index];
    const isNowCompleted = !currentTask.completed;

    tasks[index] = {
      ...currentTask,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : null
    };

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[index];
  }

  /**
   * Remove uma tarefa por ID
   */
  static async deleteTask(id: string): Promise<boolean> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Restaura uma tarefa (para a funcionalidade de Desfazer/Undo)
   */
  static async restoreTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const updated = [task, ...tasks.filter((t) => t.id !== task.id)];
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
  }

  /**
   * Obtém todas as categorias
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data) as Category[];
    } catch (error) {
      console.error('Erro ao ler categorias do LocalStorage:', error);
      return INITIAL_CATEGORIES;
    }
  }

  /**
   * Adiciona uma nova categoria customizada
   */
  static async createCategory(categoryData: {
    name: string;
    color: string;
    icon?: string;
  }): Promise<Category> {
    const categories = await this.getCategories();
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      color: categoryData.color,
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-800',
      borderColor: 'border-slate-300',
      icon: categoryData.icon || 'Tag',
      isCustom: true
    };

    const updated = [...categories, newCategory];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return newCategory;
  }

  /**
   * Obtém perfil do usuário
   */
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const data = localStorage.getItem(USER_KEY);
      if (!data) {
        localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return JSON.parse(data) as UserProfile;
    } catch (error) {
      return INITIAL_USER;
    }
  }

  /**
   * Atualiza perfil do usuário
   */
  static async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    return profile;
  }

  /**
   * Redefine dados para o estado inicial de demonstração
   */
  static async resetToDemoData(): Promise<void> {
    localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_USER));
  }
}
