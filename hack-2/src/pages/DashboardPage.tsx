import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      const tasksRes = await taskService.getTasks({ limit: 20 });
      console.log('Tasks response:', tasksRes);

      const tasks = tasksRes.tasks;
      const now = new Date();
      
      const dashboardStats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'COMPLETED').length,
        pending: tasks.filter((t) => t.status !== 'COMPLETED').length,
        overdue: tasks.filter((t) => t.status !== 'COMPLETED' && new Date(t.dueDate) < now).length,
      };
      
      console.log('Dashboard stats:', dashboardStats);
      setStats(dashboardStats);
      setRecentTasks(tasks.slice(0, 5));
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-blue-600">Total Tareas</span>
              <span className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-green-600">Completadas</span>
              <span className="text-3xl font-bold text-green-900 mt-2">{stats.completed}</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-yellow-600">Pendientes</span>
              <span className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-red-600">Vencidas</span>
              <span className="text-3xl font-bold text-red-900 mt-2">{stats.overdue}</span>
            </div>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tareas Recientes</h2>
            <Link to="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todas
            </Link>
          </div>
          
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay tareas recientes</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'COMPLETED' ? 'Completado' : task.status === 'IN_PROGRESS' ? 'En Progreso' : 'Por Hacer'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};
