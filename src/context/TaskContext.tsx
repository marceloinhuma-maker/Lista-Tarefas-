import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Category,
  UserProfile,
  PriorityLevel,
  FilterStatus,
  SortBy,
  ActiveTab,
  TaskStats
} from '../services/types';
import { SupabaseService } from '../services/supabaseService';
import { INITIAL_CATEGORIES, INITIAL_TASKS } from '../utils/initialData';
import { isToday, isPastDate } from '../utils/dateUtils';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface TaskContextType {
  // State
  tasks: Task[];
  categories: Category[];
  userProfile: UserProfile;
  activeTab: ActiveTab;
  filterStatus: FilterStatus;
  searchQuery: string;
  selectedCategory: string | null;
  selectedPriority: PriorityLevel | null;
  sortBy: SortBy;
  isLoading: boolean;
  stats: TaskStats;
  toast: ToastMessage | null;

  // Modal Controls
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLogoutModalOpen: boolean;
  isCategoryModalOpen: boolean;
  taskToEdit: Task | null;
  taskToDelete: Task | null;

  // Setters & Actions
  setActiveTab: (tab: ActiveTab) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (catId: string | null) => void;
  setSelectedPriority: (priority: PriorityLevel | null) => void;
  setSortBy: (sort: SortBy) => void;

  // Modal Triggers
  openCreateModal: (defaultDueDate?: string) => void;
  openEditModal: (task: Task) => void;
  closeFormModal: () => void;
  openDeleteModal: (task: Task) => void;
  closeDeleteModal: () => void;
  openLogoutModal: () => void;
  closeLogoutModal: () => void;
  openCategoryModal: () => void;
  closeCategoryModal: () => void;

  // CRUD Actions
  createTask: (data: {
    title: string;
    description?: string;
    categoryId: string;
    priority: PriorityLevel;
    dueDate: string;
    dueTime?: string;
  }) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createCategory: (data: { name: string; color: string; icon?: string }) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  resetToDemo: () => Promise<void>;
  showToast: (
    message: string,
    type?: 'success' | 'info' | 'warning' | 'error',
    actionLabel?: string,
    onAction?: () => void
  ) => void;
  hideToast: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Usuário',
    email: '',
    avatarUrl: '',
    occupation: ''
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Carregar dados do Supabase (com seed automático na primeira execução)
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Carregar categorias; se vazio, semear dados de demonstração
        let loadedCategories = await SupabaseService.getCategories();
        let loadedTasks = await SupabaseService.getTasks();

        if (loadedCategories.length === 0) {
          const seeded = await seedDemoData();
          loadedTasks = seeded.tasks;
          loadedCategories = seeded.categories;
        }

        const loadedUser = await SupabaseService.getUserProfile();
        setTasks(loadedTasks);
        setCategories(loadedCategories);
        setUserProfile(loadedUser);
      } catch (error) {
        console.error('Falha ao carregar dados do Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toast Helper
  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToast({
      id: String(Date.now()),
      type,
      message,
      actionLabel,
      onAction
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  // ── Função de seed de demonstração ──────────────────────────────────────
  const seedDemoData = async () => {
    // Criar categorias iniciais com todos os campos de cor
    for (const cat of INITIAL_CATEGORIES) {
      await SupabaseService.createCategory({
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        bgLight: cat.bgLight,
        textColor: cat.textColor,
        borderColor: cat.borderColor,
        isCustom: false
      });
    }
    const createdCats = await SupabaseService.getCategories();

    // Mapear nomes das categorias iniciais para os IDs reais do banco
    const catMap: Record<string, string> = {
      trabalho: createdCats.find((c) => c.name === 'Trabalho')?.id ?? '',
      pessoal: createdCats.find((c) => c.name === 'Pessoal')?.id ?? '',
      estudos: createdCats.find((c) => c.name === 'Estudos')?.id ?? '',
      financas: createdCats.find((c) => c.name === 'Finanças')?.id ?? '',
      saude: createdCats.find((c) => c.name === 'Saúde')?.id ?? ''
    };

    for (const task of INITIAL_TASKS) {
      await SupabaseService.createTask({
        title: task.title,
        description: task.description,
        categoryId: catMap[task.categoryId] ?? createdCats[0]?.id ?? '',
        priority: task.priority,
        dueDate: task.dueDate,
        dueTime: task.dueTime
      });
    }

    return {
      tasks: await SupabaseService.getTasks(),
      categories: createdCats
    };
  };

  // Estatísticas calculadas
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => !t.completed && isPastDate(t.dueDate)).length;
    const dueToday = tasks.filter((t) => !t.completed && isToday(t.dueDate)).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      dueToday,
      completionRate
    };
  }, [tasks]);

  // Modal Handlers
  const openCreateModal = (defaultDueDate?: string) => {
    setTaskToEdit(
      defaultDueDate
        ? ({
            id: '',
            title: '',
            description: '',
            completed: false,
            categoryId: categories[0]?.id || 'trabalho',
            priority: 'medium',
            dueDate: defaultDueDate,
            createdAt: ''
          } as Task)
        : null
    );
    setIsFormModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setTaskToEdit(null);
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const openCategoryModal = () => setIsCategoryModalOpen(true);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  // CRUD Actions
  const createTask = async (data: {
    title: string;
    description?: string;
    categoryId: string;
    priority: PriorityLevel;
    dueDate: string;
    dueTime?: string;
  }) => {
    const newTask = await SupabaseService.createTask(data);
    setTasks((prev) => [newTask, ...prev]);
    closeFormModal();
    showToast('Tarefa criada com sucesso!', 'success');
  };

  const updateTask = async (task: Task) => {
    const updated = await SupabaseService.updateTask(task);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    closeFormModal();
    showToast('Tarefa atualizada com sucesso!', 'success');
  };

  const toggleTask = async (id: string) => {
    const updated = await SupabaseService.toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    if (updated.completed) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
      });
      showToast('Tarefa concluída! Parabéns! 🎉', 'success');
    }
  };

  const deleteTask = async (id: string) => {
    const taskToRemove = tasks.find((t) => t.id === id);
    if (!taskToRemove) return;

    await SupabaseService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    closeDeleteModal();

    showToast('Tarefa excluída', 'info', 'Desfazer', async () => {
      await SupabaseService.restoreTask(taskToRemove);
      setTasks((prev) => [taskToRemove, ...prev]);
      showToast('Tarefa restaurada!', 'success');
    });
  };

  const createCategory = async (data: { name: string; color: string; icon?: string }) => {
    const newCat = await SupabaseService.createCategory(data);
    setCategories((prev) => [...prev, newCat]);
    closeCategoryModal();
    showToast('Nova categoria criada!', 'success');
  };

  const updateProfile = async (profile: UserProfile) => {
    const updated = await SupabaseService.updateUserProfile(profile);
    setUserProfile(updated);
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const resetToDemo = async () => {
    try {
      setIsLoading(true);
      await SupabaseService.clearUserData();
      const seeded = await seedDemoData();
      const loadedUser = await SupabaseService.getUserProfile();
      setTasks(seeded.tasks);
      setCategories(seeded.categories);
      setUserProfile(loadedUser);
      closeLogoutModal();
      showToast('Dados restaurados para a demonstração!', 'info');
    } catch (error) {
      console.error('Erro ao restaurar dados de demonstração:', error);
      showToast('Erro ao restaurar dados.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        userProfile,
        activeTab,
        filterStatus,
        searchQuery,
        selectedCategory,
        selectedPriority,
        sortBy,
        isLoading,
        stats,
        toast,
        isFormModalOpen,
        isDeleteModalOpen,
        isLogoutModalOpen,
        isCategoryModalOpen,
        taskToEdit,
        taskToDelete,
        setActiveTab,
        setFilterStatus,
        setSearchQuery,
        setSelectedCategory,
        setSelectedPriority,
        setSortBy,
        openCreateModal,
        openEditModal,
        closeFormModal,
        openDeleteModal,
        closeDeleteModal,
        openLogoutModal,
        closeLogoutModal,
        openCategoryModal,
        closeCategoryModal,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        createCategory,
        updateProfile,
        resetToDemo,
        showToast,
        hideToast
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser utilizado dentro de um TaskProvider');
  }
  return context;
};
