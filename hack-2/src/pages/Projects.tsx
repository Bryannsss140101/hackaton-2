import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AppLayout } from '../components/common/AppLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { projectService } from '../services/projectService'
import type { Project, ProjectStatus } from '../types'

export const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE')

  const limit = 5

  const fetchProjects = async (pageParam = page, searchParam = search) => {
    setLoading(true)
    try {
      const res = await projectService.list(pageParam, limit, searchParam)
      setProjects(res.projects)
      setTotalPages(res.totalPages)
      setPage(res.currentPage)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setStatus('ACTIVE')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingId) {
      await projectService.update(editingId, { name, description, status })
    } else {
      await projectService.create({ name, description, status })
    }

    resetForm()
    await fetchProjects(page, search)
  }

  const handleEditClick = (project: Project) => {
    setEditingId(project.id)
    setName(project.name)
    setDescription(project.description ?? '')
    setStatus(project.status)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar proyecto?')) return
    await projectService.remove(id)
    const newPage = projects.length === 1 && page > 1 ? page - 1 : page
    await fetchProjects(newPage, search)
  }

  const handleSearch = async () => {
    await fetchProjects(1, search)
  }

  const handleChangePage = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    await fetchProjects(newPage, search)
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Proyectos</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Buscar proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <Button type="button" onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </div>

      {/* Form crear/editar */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <select
            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ON_HOLD">ON_HOLD</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" className="w-full">
            {editingId ? 'Guardar cambios' : 'Crear proyecto'}
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

      {/* Lista */}
      {loading ? (
        <p>Cargando proyectos...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-gray-500">No hay proyectos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-gray-500">
                    Estado: <span className="font-medium">{p.status}</span>
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {p.id.slice(0, 6)}...
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{p.description}</p>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleEditClick(p)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center mt-4 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => handleChangePage(page - 1)}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => handleChangePage(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </AppLayout>
  )
}
