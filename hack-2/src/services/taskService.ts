import { api } from './api'
import type { Task, TaskPriority, TaskStatus } from '../types'

export const taskService = {
  async list(filters: {
    projectId?: string
    status?: TaskStatus
    priority?: TaskPriority
    page?: number
    limit?: number
  }) {
    const {
      projectId = '',
      status = '',
      priority = '',
      page = 1,
      limit = 20,
    } = filters

    const { data } = await api.get(
      `/tasks?projectId=${projectId}&status=${status}&priority=${priority}&page=${page}&limit=${limit}`,
    )

    return data as { tasks: Task[]; totalPages: number }
  },

  async create(body: {
    title: string
    description?: string
    projectId: string
    priority: TaskPriority
    dueDate?: string
  }) {
    const { data } = await api.post('/tasks', body)
    return data
  },

  async update(id: string, body: Partial<Task>) {
    const { data } = await api.put(`/tasks/${id}`, body)
    return data
  },

  async updateStatus(id: string, status: TaskStatus) {
    const { data } = await api.patch(`/tasks/${id}/status`, { status })
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete(`/tasks/${id}`)
    return data
  },
}
