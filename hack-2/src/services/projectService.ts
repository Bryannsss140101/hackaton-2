import { api } from './api'
import type { Project, ProjectStatus } from '../types'

export const projectService = {
  async list(page = 1, limit = 10, search = '') {
    const { data } = await api.get(
      `/projects?page=${page}&limit=${limit}&search=${search}`,
    )
    return data as { projects: Project[]; totalPages: number; currentPage: number }
  },

  async create(body: { name: string; description?: string; status: ProjectStatus }) {
    const { data } = await api.post('/projects', body)
    return data
  },

  async update(id: string, body: Partial<Project>) {
    const { data } = await api.put(`/projects/${id}`, body)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete(`/projects/${id}`)
    return data
  },
}
