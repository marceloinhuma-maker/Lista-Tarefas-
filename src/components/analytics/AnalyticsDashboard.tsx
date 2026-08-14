import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Award,
  TrendingUp
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const AnalyticsDashboard: React.FC = () => {
  const { tasks, categories, stats } = useTasks();

  // Dados por Categoria para o Gráfico
  const categoryData = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const completedCount = catTasks.filter((t) => t.completed).length;
    const pendingCount = catTasks.length - completedCount;

    return {
      name: cat.name,
      total: catTasks.length,
      concluidas: completedCount,
      pendentes: pendingCount,
      color: cat.color
    };
  });

  // Dados por Prioridade para o Gráfico Donut
  const priorityData = [
    {
      name: 'Alta',
      value: tasks.filter((t) => t.priority === 'high').length,
      color: '#e11d48'
    },
    {
      name: 'Média',
      value: tasks.filter((t) => t.priority === 'medium').length,
      color: '#d97706'
    },
    {
      name: 'Baixa',
      value: tasks.filter((t) => t.priority === 'low').length,
      color: '#059669'
    }
  ].filter((p) => p.value > 0);

  const getProductivityFeedback = () => {
    if (stats.total === 0) return 'Comece adicionando tarefas para gerar suas análises.';
    if (stats.completionRate >= 80) return 'Ritmo excelente! Produtividade acima da média.';
    if (stats.completionRate >= 50) return 'Bom ritmo! Você já concluiu mais da metade do planejado.';
    return 'Foco nas pendências mais urgentes para aumentar seu rendimento.';
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total de Tarefas
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.total}
            </h3>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">
              {stats.pending} em andamento
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Concluídas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Concluídas
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.completed}
            </h3>
            <span className="text-[11px] text-emerald-600/80 font-medium mt-1 inline-block">
              {stats.completionRate}% do total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pendentes */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendentes
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {stats.pending}
            </h3>
            <span className="text-[11px] text-amber-600/80 font-medium mt-1 inline-block">
              {stats.dueToday} para hoje
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Atrasadas */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Atrasadas
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
              {stats.overdue}
            </h3>
            <span className="text-[11px] text-rose-600/80 font-medium mt-1 inline-block">
              {stats.overdue === 0 ? 'Nenhuma atrasada' : 'Requer atenção'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Motivation & Efficiency Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Flame className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold">
              Desempenho Geral: {stats.completionRate}%
            </h4>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
              {getProductivityFeedback()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-xs border border-white/20">
          <Award className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Modo Foco Ativo
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Tasks by Category */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Tarefas por Categoria
              </h4>
              <p className="text-xs text-slate-400">
                Distribuição de tarefas concluídas e pendentes em cada área
              </p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {tasks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Bar
                    dataKey="concluidas"
                    name="Concluídas"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="pendentes"
                    name="Pendentes"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Sem dados para exibir o gráfico
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Priority Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Distribuição por Prioridade
            </h4>
            <p className="text-xs text-slate-400">
              Proporção de tarefas por urgência
            </p>
          </div>

          <div className="h-52 w-full my-2 flex items-center justify-center">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Sem tarefas cadastradas</div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {priorityData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  {item.value} ({Math.round((item.value / stats.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
