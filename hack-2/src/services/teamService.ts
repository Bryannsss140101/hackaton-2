import api from './api';
import type { TeamMember, TasksResponse } from '../types';

export const teamService = {
  async getMembers(): Promise<{ members: TeamMember[] }> {
    console.log('👥 Fetching team members...');
    const response = await api.get('/team/members');
    console.log('👥 Team members fetched:', response.data);
    return response.data;
  },

  async getMemberTasks(memberId: string): Promise<TasksResponse> {
    console.log('👥 Fetching tasks for member:', memberId);
    const response = await api.get(`/team/members/${memberId}/tasks`);
    console.log('👥 Member tasks fetched:', response.data);
    return response.data;
  },
};
