/// <reference types="vite/client" />
/**
 * Serviço de Integração com Supabase
 * Todas as operações são filtradas por user_id via RLS (Row Level Security).
 */

import { supabase } from '../lib/supabase';
import { Task, Category, UserProfile, PriorityLevel } from './types';
import { INITIAL_USER } from '../utils/initialData';

// ─── Tipos do banco de dados (snake_case) ────────────────────────────────────

interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  category_id: string | null;
  priority: PriorityLevel;
  due_date: string | null;
  due_time: string | null;
  created_at: string;
  completed_at: string | null;
}

interface DbCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  bg_light: string;
  text_color: string;
  border_color: string;
  icon: string | null;
  is_custom: boolean;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getCurrentUserId(): Promise<string> {
  const {
    data: { session }
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error('Usuário não autenticado.');
  return userId;
}

function mapTaskFromDb(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    completed: row.completed,
    categoryId: row.category_id ?? '',
    priority: row.priority,
    dueDate: row.due_date ?? '',
    dueTime: row.due_time ?? undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? null
  };
}

function mapCategoryFromDb(row: DbCategory): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    bgLight: row.bg_light,
    textColor: row.text_color,
    borderColor: row.border_color,
    icon: row.icon ?? 'Tag',
    isCustom: row.is_custom
  };
}

// ─── Serviço Principal ────────────────────────────────────────────────────────

export class SupabaseService {
  // ── Tarefas ───────────────────────────────────────────────────────────────

  static async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Erro ao buscar tarefas: ${error.message}`);
    return (data as DbTask[]).map(mapTaskFromDb);
  }

  static async createTask(taskData: {
    title: string;
    description?: string;
    categoryId: string;
    priority: PriorityLevel;
    dueDate: string;
    dueTime?: string;
  }): Promise<Task> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: taskData.title.trim(),
        description: taskData.description?.trim() || null,
        completed: false,
        category_id: taskData.categoryId || null,
        priority: taskData.priority,
        due_date: taskData.dueDate || null,
        due_time: taskData.dueTime || null,
        completed_at: null
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar tarefa: ${error.message}`);
    return mapTaskFromDb(data as DbTask);
  }

  static async updateTask(updatedTask: Task): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title.trim(),
        description: updatedTask.description?.trim() || null,
        completed: updatedTask.completed,
        category_id: updatedTask.categoryId || null,
        priority: updatedTask.priority,
        due_date: updatedTask.dueDate || null,
        due_time: updatedTask.dueTime || null,
        completed_at: updatedTask.completedAt ?? null
      })
      .eq('id', updatedTask.id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    return mapTaskFromDb(data as DbTask);
  }

  static async toggleTask(id: string): Promise<Task> {
    const { data: current, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(`Erro ao buscar tarefa: ${fetchError.message}`);

    const isNowCompleted = !(current as DbTask).completed;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed: isNowCompleted,
        completed_at: isNowCompleted ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao alternar tarefa: ${error.message}`);
    return mapTaskFromDb(data as DbTask);
  }

  static async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw new Error(`Erro ao excluir tarefa: ${error.message}`);
    return true;
  }

  static async restoreTask(task: Task): Promise<void> {
    const userId = await getCurrentUserId();

    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', task.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('tasks')
        .update({ completed: task.completed, completed_at: task.completedAt ?? null })
        .eq('id', task.id);
    } else {
      await supabase.from('tasks').insert({
        id: task.id,
        user_id: userId,
        title: task.title,
        description: task.description || null,
        completed: task.completed,
        category_id: task.categoryId || null,
        priority: task.priority,
        due_date: task.dueDate || null,
        due_time: task.dueTime || null,
        created_at: task.createdAt,
        completed_at: task.completedAt ?? null
      });
    }
  }

  // ── Categorias ────────────────────────────────────────────────────────────

  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Erro ao buscar categorias: ${error.message}`);
    return (data as DbCategory[]).map(mapCategoryFromDb);
  }

  static async createCategory(categoryData: {
    name: string;
    color: string;
    icon?: string;
    bgLight?: string;
    textColor?: string;
    borderColor?: string;
    isCustom?: boolean;
  }): Promise<Category> {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: categoryData.name.trim(),
        color: categoryData.color,
        bg_light: categoryData.bgLight ?? 'bg-slate-100',
        text_color: categoryData.textColor ?? 'text-slate-800',
        border_color: categoryData.borderColor ?? 'border-slate-300',
        icon: categoryData.icon || 'Tag',
        is_custom: categoryData.isCustom ?? true
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar categoria: ${error.message}`);
    return mapCategoryFromDb(data as DbCategory);
  }

  // ── Perfil do Usuário (localStorage — dados locais por e-mail) ────────────

  static async getUserProfile(): Promise<UserProfile> {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const email = session?.user?.email ?? '';
    const stored = localStorage.getItem(`taskflow_user_${email}`);

    if (stored) {
      return JSON.parse(stored) as UserProfile;
    }

    const defaultProfile: UserProfile = {
      ...INITIAL_USER,
      email,
      name: email.split('@')[0] || 'Usuário'
    };
    localStorage.setItem(`taskflow_user_${email}`, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  static async updateUserProfile(profile: UserProfile): Promise<UserProfile> {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const email = session?.user?.email ?? profile.email;
    localStorage.setItem(`taskflow_user_${email}`, JSON.stringify(profile));
    return profile;
  }

  // ── Reset para dados de demonstração ─────────────────────────────────────

  static async clearUserData(): Promise<void> {
    // Deleta apenas os dados do usuário autenticado (RLS garante o escopo)
    await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
  }
}
