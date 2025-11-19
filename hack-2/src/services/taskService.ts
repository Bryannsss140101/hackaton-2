import api from './api';
import type { Task, TasksResponse, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const taskService = {
  async getTasks(params?: {
    projectId?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> {
    console.log('📝 Fetching tasks with params:', params);
    const response = await api.get<TasksResponse>('/tasks', { params });
    console.log('📝 Tasks fetched:', {
      total: response.data.tasks.length,
      totalPages: response.data.totalPages,
      tasks: response.data.tasks,
    });
    return response.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    console.log('Creating task with data:', data);
    const response = await api.post<Task>('/tasks', data);
    console.log('Task created:', response.data);
    return response.data;
  },

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
