import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '../components/common/AppLayout'
import { Button } from '../components/common/Button'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import type { Project, Task } from '../types'

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.list(1, 100, ''),
          taskService.list({ page: 1, limit: 100 }),
        ])

        setProjects(projRes.projects)
        setTasks(taskRes.tasks)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Estadísticas
  const { total, completed, pending, overdue } = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length
    const pending = tasks.filter((t) => t.status !== 'COMPLETED').length

    const now = new Date()
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false
      const due = new Date(t.dueDate)
      return t.status !== 'COMPLETED' && due < now
    }).length

    return { total, completed, pending, overdue }
  }, [tasks])

  // Actividad reciente
  const recentActivities = useMemo(() => {
    const toDate = (t: Task) => t.updatedAt || t.createdAt || ''

    return [...tasks]
      .filter((t) => toDate(t))
      .sort((a, b) => {
        const da = new Date(toDate(a)).getTime()
        const db = new Date(toDate(b)).getTime()
        return db - da
      })
      .slice(0, 8)
  }, [tasks])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Header + acciones rápidas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Resumen de tus proyectos y tareas en TechFlow.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/tasks">
            <Button>+ Crear tarea</Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline">Ver proyectos</Button>
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total de tareas" value={total} />
        <StatCard title="Tareas completadas" value={completed} />
        <StatCard title="Tareas pendientes" value={pending} />
        <StatCard title="Tareas vencidas" value={overdue} highlight={overdue > 0} />
      </div>

      {/* Feed + resumen de proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed de actividad reciente */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Actividad reciente</h3>
            <span className="text-xs text-gray-400">
              Últimas {recentActivities.length} tareas
            </span>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no hay actividad reciente. Crea o actualiza tareas para verlas aquí.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentActivities.map((task) => {
                const dateLabel = task.updatedAt
                  ? `Actualizada el ${formatDateTime(task.updatedAt)}`
                  : task.createdAt
                  ? `Creada el ${formatDateTime(task.createdAt)}`
                  : ''

                return (
                  <li key={task.id} className="py-3 flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.project?.name
                          ? `Proyecto: ${task.project.name}`
                          : `Proyecto ID: ${task.projectId}`}
                      </p>
                      {dateLabel && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {dateLabel}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {task.status}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full ${priorityColor(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Resumen de proyectos */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Resumen de proyectos</h3>
          <p className="text-sm text-gray-500 mb-2">
            Total de proyectos: <span className="font-semibold">{projects.length}</span>
          </p>

          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <ProjectCountLine projects={projects} status="ACTIVE" label="Activos" />
            <ProjectCountLine projects={projects} status="COMPLETED" label="Completados" />
            <ProjectCountLine projects={projects} status="ON_HOLD" label="En pausa" />
          </div>

          <h4 className="text-xs font-semibold text-gray-500 mb-2">
            Algunos proyectos
          </h4>
          <ul className="space-y-1 max-h-40 overflow-auto text-sm">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <span className="truncate">{p.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-2">
                  {p.status}
                </span>
              </li>
            ))}
            {projects.length === 0 && (
              <li className="text-xs text-gray-400">
                No tienes proyectos aún. Crea uno desde la sección Proyectos.
              </li>
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}

/* Helpers */

const StatCard = ({
  title,
  value,
  highlight,
}: {
  title: string
  value: number
  highlight?: boolean
}) => (
  <div
    className={`bg-white rounded-lg shadow p-4 border ${
      highlight ? 'border-red-300' : 'border-transparent'
    }`}
  >
    <p className="text-sm text-gray-500">{title}</p>
    <p
      className={`text-2xl font-bold ${
        highlight ? 'text-red-600' : 'text-gray-900'
      }`}
    >
      {value}
    </p>
  </div>
)

const formatDateTime = (dateString: string) => {
  const d = new Date(dateString)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

const priorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-700'
    case 'HIGH':
      return 'bg-orange-100 text-orange-700'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-700'
    case 'LOW':
    default:
      return 'bg-green-100 text-green-700'
  }
}

const ProjectCountLine = ({
  projects,
  status,
  label,
}: {
  projects: Project[]
  status: Project['status']
  label: string
}) => {
  const count = projects.filter((p) => p.status === status).length
  return (
    <p>
      {label}: <span className="font-semibold">{count}</span>
    </p>
  )
}
