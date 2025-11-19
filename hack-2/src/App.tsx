import React from 'react'

const stats = [
  { label: 'Total de tareas', value: 24 },
  { label: 'Completadas', value: 12 },
  { label: 'Pendientes', value: 8 },
  { label: 'Vencidas', value: 4 },
]

const quickActions = [
  { label: 'Crear tarea', primary: true },
  { label: 'Ver proyectos', primary: false },
]

const activity = [
  { id: 1, text: 'Bryan completó la tarea "Configurar API de TechFlow"', time: 'Hace 10 min' },
  { id: 2, text: 'Se creó el proyecto "Hackathon DBP - Equipo 2"', time: 'Hace 30 min' },
  { id: 3, text: 'Andre asignó la tarea "Diseñar dashboard" a Bryan', time: 'Hace 1 h' },
]

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Barra superior */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            TechFlow <span className="text-sky-600">Dashboard</span>
          </h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">Hackathon #2 · DBP</span>
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-medium">
              AV
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Título + acciones rápidas */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Resumen general</h2>
            <p className="text-sm text-slate-500">
              Vista rápida del estado de tus tareas y proyectos.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickActions.map(action => (
              <button
                key={action.label}
                className={
                  action.primary
                    ? 'px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition'
                    : 'px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition'
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <article
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-1"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </span>
              <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
            </article>
          ))}
        </section>

        {/* Layout de abajo: gráfico (placeholder) + actividad */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Columna izquierda: placeholder de gráfico / progreso */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Progreso de tareas</h3>
            <p className="text-xs text-slate-500 mb-4">
              Aquí luego podemos poner un gráfico o barras de progreso.
            </p>

            <div className="h-40 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
              Placeholder de gráfico
            </div>
          </div>

          {/* Columna derecha: feed de actividad */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Actividad reciente</h3>
            <ul className="space-y-3 text-sm">
              {activity.map(item => (
                <li key={item.id} className="flex flex-col gap-0.5">
                  <span className="text-slate-800">{item.text}</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
