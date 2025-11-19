import api from './api';
import type { Project, ProjectsResponse } from '../types';

export const projectService = {
  async getProjects(page = 1, limit = 10, search = ''): Promise<ProjectsResponse> {
    console.log('📋 Fetching projects:', { page, limit, search });
    const response = await api.get<ProjectsResponse>('/projects', {
      params: { page, limit, search },
    });
    console.log('📋 Projects fetched:', {
      total: response.data.projects.length,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      projects: response.data.projects,
    });
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: { name: string; description: string; status: string }): Promise<Project> {
    console.log('Creating project with data:', data);
    const response = await api.post<Project>('/projects', data);
    console.log('Project created:', response.data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
