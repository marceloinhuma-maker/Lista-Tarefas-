-- =======================================================
-- SCHEMA SQL PARA SUPABASE - TaskFlow (Lista de Tarefas)
-- =======================================================

-- 1. Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL DEFAULT '#4f46e5',
    icon VARCHAR(50) DEFAULT 'Tag',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    priority VARCHAR(10) CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium' NOT NULL,
    due_date DATE,
    due_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Índices para Otimização de Consultas
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança RLS (Somente o próprio usuário acessa seus dados)
CREATE POLICY "Usuários podem ver suas próprias categorias"
    ON public.categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar categorias"
    ON public.categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias categorias"
    ON public.categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias categorias"
    ON public.categories FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver suas próprias tarefas"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar tarefas"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias tarefas"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);
