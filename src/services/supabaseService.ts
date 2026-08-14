/// <reference types="vite/client" />
/**
 * Adaptador de Serviços para Supabase
 * 
 * Este arquivo fornece a estrutura pronta para chavear de LocalStorage para Supabase
 * assim que você configurar as variáveis de ambiente:
 * VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 */

import { Task, Category, UserProfile, PriorityLevel } from './types';

export class SupabaseService {
  private static isConfigured(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return Boolean(url && key && url !== 'https://your-project.supabase.co');
  }

  static async getTasks(): Promise<Task[]> {
    if (!this.isConfigured()) {
      console.info('Supabase não configurado. Utilizando LocalStorage fallback.');
      return [];
    }
    // Quando configurado:
    // const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    // if (error) throw error;
    // return data.map(this.mapFromDb);
    return [];
  }

  static async createTask(_taskData: {
    title: string;
    description?: string;
    categoryId: string;
    priority: PriorityLevel;
    dueDate: string;
    dueTime?: string;
  }): Promise<Task> {
    if (!this.isConfigured()) {
      throw new Error('Supabase não configurado.');
    }
    throw new Error('Supabase Client não inicializado');
  }

  static async updateTask(task: Task): Promise<Task> {
    if (!this.isConfigured()) {
      throw new Error('Supabase não configurado.');
    }
    return task;
  }

  static async deleteTask(_id: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Supabase não configurado.');
    }
    return true;
  }

  static async getCategories(): Promise<Category[]> {
    return [];
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    return null;
  }
}
