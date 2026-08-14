<div align="center">

# 🚀 TaskFlow - Gerenciador de Tarefas Inteligente

<p align="center">
  <strong>Uma aplicação web moderna, fluida e completa para gestão de produtividade pessoal e de equipes.</strong>
</p>

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Sobre o Projeto

O **TaskFlow** é um sistema moderno de gerenciamento de tarefas desenvolvido para proporcionar uma experiência fluida, intuitiva e altamente responsiva. O projeto une boas práticas de Engenharia de Software, arquitetura limpa em componentes React e integração visual rica com gráficos estatísticos e micro-animações.

A aplicação conta com persistência local nativa (*offline-first* via `localStorage`) e arquitetura desacoplada pronta para conexão com banco de dados em nuvem via **Supabase**.

---

## ✨ Principais Funcionalidades

- 📋 **CRUD Completo de Tarefas**: Crie, edite, organize e conclua tarefas com títulos, descrições detalhadas, datas de entrega e horários.
- 🏷️ **Categorização com Cores**: Classifique atividades por categorias personalizadas com paleta de cores e ícones dinâmicos.
- 🎯 **Gestão de Prioridades**: Níveis de prioridade (Alta, Média, Baixa) com sinalização visual clara e badges intuitivos.
- 🔍 **Filtros e Busca em Tempo Real**: Filtre por status (Todas, Pendentes, Concluídas), prioridade, categoria e ordene por prazos ou data de criação.
- 📅 **Visualização em Calendário**: Acompanhe suas entregas e compromissos distribuídos visualmente ao longo do mês.
- 📊 **Dashboard Analítico**: Métricas de produtividade com gráficos interativos (taxa de conclusão, distribuição por categorias e prioridades).
- 🎉 **Feedback Visual e Gamificação**: Efeito de celebração com confetes dinâmicos ao finalizar tarefas e animações suaves de transição.
- ☁️ **Pronto para a Nuvem (Supabase)**: Acompanha *schema* SQL pronto com políticas de segurança em nível de linha (*Row Level Security - RLS*).

---

## 🛠️ Stack Tecnológica

| Camada / Ferramenta | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend Framework** | `React 19` | Biblioteca declarativa e moderna para interfaces |
| **Linguagem** | `TypeScript 5.7` | Tipagem estática robusta para maior segurança |
| **Build Tool / Bundler** | `Vite 6` | Build ultra rápido com Hot Module Replacement (HMR) |
| **Estilização** | `Tailwind CSS v4` | Framework CSS utilitário de alta performance |
| **Ícones** | `Lucide React` | Conjunto moderno e consistente de ícones vetoriais |
| **Gráficos e Métricas** | `Recharts` | Gráficos responsivos em SVG |
| **Animações** | `Framer Motion` & `Canvas Confetti` | Micro-interações e efeitos visuais |
| **Armazenamento** | `LocalStorage` / `Supabase` | Persistência local e suporte a backend BaaS |

---

## 📁 Estrutura do Projeto

```plaintext
lista-de-tarefas/
├── .agents/                 # Configurações de automação e agentes
├── dist/                    # Build de produção gerado pelo Vite
├── public/                  # Arquivos estáticos públicos
├── src/
│   ├── components/          # Componentes modulares da interface
│   │   ├── analytics/       # Gráficos e painel de métricas (AnalyticsDashboard)
│   │   ├── calendar/        # Visualização de calendário mensal (CalendarView)
│   │   ├── common/          # Componentes reutilizáveis (Button, Modal, Badge, Toast)
│   │   ├── layout/          # Estrutura geral (Navbar, HeaderStats)
│   │   └── tasks/           # Componentes de tarefas (TaskList, TaskCard, TaskFilters, Modais)
│   ├── context/             # Gerenciamento global de estado (TaskContext)
│   ├── services/            # Camada de serviços e adaptadores (Storage, Supabase, Types)
│   ├── utils/               # Utilitários de data e dados iniciais de demonstração
│   ├── App.tsx              # Componente raiz da aplicação
│   ├── index.css            # Folha de estilos global e Tailwind CSS
│   └── main.tsx             # Ponto de entrada da aplicação
├── supabase/
│   └── schema.sql           # Schema SQL com tabelas, índices e políticas RLS
├── .env.example             # Modelo documentado de variáveis de ambiente
├── .gitignore               # Regras de exclusão para versionamento Git
├── package.json             # Manifesto de dependências e scripts do projeto
├── tsconfig.json            # Configuração principal do compilador TypeScript
└── vite.config.ts           # Configuração de plugins e build do Vite
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Git](https://git-scm.com/) instalado no seu sistema

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/marceloinhuma-maker/Lista-Tarefas-.git
   cd Lista-Tarefas-
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no seu navegador:**
   ```
   http://localhost:5173
   ```

---

## ⚙️ Configuração Opcional do Supabase

Caso deseje sincronizar suas tarefas na nuvem com banco de dados PostgreSQL do Supabase:

1. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as credenciais obtidas no painel do [Supabase](https://supabase.com):
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
   ```

3. Execute o script `supabase/schema.sql` no **SQL Editor** do Supabase para criar as tabelas e políticas de segurança RLS.

---

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento local com Vite.
- `npm run build`: Executa a checagem de tipos (`tsc -b`) e compila a aplicação otimizada para produção em `/dist`.
- `npm run preview`: Executa um servidor local para testar o build de produção.

---

## 👤 Autor

Desenvolvido por **[Marcelo](https://github.com/marceloinhuma-maker)**.

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).
