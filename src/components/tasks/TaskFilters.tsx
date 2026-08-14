import React from 'react';
import {
  Search,
  X,
  PlusCircle,
  ArrowUpDown
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { FilterStatus, PriorityLevel, SortBy } from '../../services/types';

export const TaskFilters: React.FC = () => {
  const {
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    sortBy,
    setSortBy,
    categories,
    openCategoryModal,
    tasks
  } = useTasks();

  const statusOptions: { id: FilterStatus; label: string; count: number }[] = [
    {
      id: 'all',
      label: 'Todas',
      count: tasks.length
    },
    {
      id: 'pending',
      label: 'Pendentes',
      count: tasks.filter((t) => !t.completed).length
    },
    {
      id: 'completed',
      label: 'Concluídas',
      count: tasks.filter((t) => t.completed).length
    }
  ];

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== null ||
    selectedPriority !== null ||
    filterStatus !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPriority(null);
    setFilterStatus('all');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Top Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Buttons: Todas | Pendentes | Concluídas */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70 w-full sm:w-fit overflow-x-auto">
          {statusOptions.map((opt) => {
            const isActive = filterStatus === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setFilterStatus(opt.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar and Sort Options */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
            >
              <option value="dueDate">Data de Vencimento</option>
              <option value="priority">Prioridade</option>
              <option value="createdAt">Mais Recentes</option>
              <option value="title">Ordem Alfabética</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills & Priority Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        {/* Categories Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs shadow-indigo-100'
                : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-300'
            }`}
          >
            Todas Categorias
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                style={{
                  backgroundColor: isSelected ? cat.color : `${cat.color}12`,
                  color: isSelected ? '#ffffff' : cat.color,
                  borderColor: isSelected ? cat.color : `${cat.color}35`
                }}
                className="text-xs px-3 py-1.5 rounded-full font-semibold border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:opacity-90"
              >
                <span
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : cat.color
                  }}
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                />
                <span>{cat.name}</span>
              </button>
            );
          })}

          <button
            onClick={openCategoryModal}
            className="text-xs px-2.5 py-1.5 rounded-full font-medium border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          {(['high', 'medium', 'low'] as PriorityLevel[]).map((pri) => {
            const isSelected = selectedPriority === pri;
            const labels = {
              high: 'Alta',
              medium: 'Média',
              low: 'Baixa'
            };
            const activeColors = {
              high: 'bg-rose-600 text-white border-rose-600',
              medium: 'bg-amber-600 text-white border-amber-600',
              low: 'bg-emerald-600 text-white border-emerald-600'
            };
            return (
              <button
                key={pri}
                onClick={() =>
                  setSelectedPriority(isSelected ? null : pri)
                }
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  isSelected
                    ? activeColors[pri]
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {labels[pri]}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 ml-1 underline cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
