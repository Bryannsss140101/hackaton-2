import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { teamService } from '../services/teamService';
import type { TeamMember, Task } from '../types';
import { PersonIcon } from '@radix-ui/react-icons';
import { TASK_STATUS_LABELS, TASK_PRIORITY_COLORS } from '../utils/constants';

export const TeamPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberTasks, setMemberTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await teamService.getMembers();
      setMembers(data.members);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = async (member: TeamMember) => {
    setSelectedMember(member);
    setLoadingTasks(true);
    try {
      const data = await teamService.getMemberTasks(member.id);
      setMemberTasks(data.tasks);
    } catch (error) {
      console.error('Error loading member tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipo</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List */}
            <div>
              <Card>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Miembros del Equipo</h2>
                {members.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay miembros</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => handleMemberClick(member)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedMember?.id === member.id
                            ? 'bg-primary-100 border-2 border-primary-500'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold mr-3">
                          <PersonIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Member Tasks */}
            <div>
              {selectedMember ? (
                <Card>
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Tareas de {selectedMember.name}
                  </h2>
                  
                  {loadingTasks ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : memberTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tiene tareas asignadas</p>
                  ) : (
                    <div className="space-y-3">
                      {memberTasks.map((task) => (
                        <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              📅 {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'IN_PROGRESS'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {TASK_STATUS_LABELS[task.status]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-16 text-gray-500">
                    <PersonIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Selecciona un miembro para ver sus tareas</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
