import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AppLayout } from '../components/common/AppLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import type {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from '../types'

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  // filtros
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('')
  const [filterProjectId, setFilterProjectId] = useState('')

  // formulario
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [dueDate, setDueDate] = useState('')

  const fetchProjects = async () => {
    const res = await projectService.list(1, 100, '')
    setProjects(res.projects)
  }

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await taskService.list({
        status: filterStatus || undefined,
        priority: filterPriority || undefined,
        projectId: filterProjectId || undefined,
        page: 1,
        limit: 50,
      })
      setTasks(res.tasks)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchProjects()
    void fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setProjectId('')
    setPriority('MEDIUM')
    setDueDate('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !projectId) return

    if (editingId) {
      await taskService.update(editingId, {
        title,
        description,
        projectId,
        priority,
        dueDate: dueDate || undefined,
      })
    } else {
      await taskService.create({
        title,
        description,
        projectId,
        priority,
        dueDate: dueDate || undefined,
      })
    }

    resetForm()
    await fetchTasks()
  }

  const handleEditClick = (task: Task) => {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description ?? '')
    setProjectId(task.projectId)
    setPriority(task.priority)
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar tarea?')) return
    await taskService.remove(id)
    await fetchTasks()
  }

  const handleMarkCompleted = async (id: string) => {
    await taskService.updateStatus(id, 'COMPLETED')
    await fetchTasks()
  }

  const handleApplyFilters = async () => {
    await fetchTasks()
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tareas</h2>
      </div>

      {/* filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select
            className="mt-1 border rounded-md px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
          >
            <option value="">Todos</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Prioridad</label>
          <select
            className="mt-1 border rounded-md px-3 py-2 text-sm"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskPriority | '')}
          >
            <option value="">Todas</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Proyecto</label>
          <select
            className="mt-1 border rounded-md px-3 py-2 text-sm min-w-40"
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
          >
            <option value="">Todos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button type="button" onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </div>
      </div>

      {/* form tarea */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="text-sm font-medium text-gray-700">Proyecto</label>
          <select
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">Seleccionar proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Prioridad</label>
            <select
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Fecha límite</label>
            <input
              type="date"
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full">
            {editingId ? 'Guardar cambios' : 'Crear tarea'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {/* lista tareas */}
      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No hay tareas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <div key={t.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-xs text-gray-500">
                    Proyecto:{' '}
                    <span className="font-medium">
                      {t.project?.name ?? t.projectId}
                    </span>
                  </p>
                  {t.dueDate && (
                    <p className="text-xs text-gray-500">
                      Vence: {new Date(t.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {t.status}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-1 rounded-full ${priorityColor(
                      t.priority,
                    )}`}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{t.description}</p>
              <div className="flex justify-end gap-2">
                {t.status !== 'COMPLETED' && (
                  <Button
                    type="button"
                    className="text-xs"
                    onClick={() => handleMarkCompleted(t.id)}
                  >
                    Marcar completada
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleEditClick(t)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleDelete(t.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
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
