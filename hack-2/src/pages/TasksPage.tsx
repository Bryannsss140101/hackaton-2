import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { Task, Project, TeamMember } from '../types';
import { PlusIcon } from '@radix-ui/react-icons';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from '../utils/constants';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    projectId: '',
  });

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    projectId: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: string;
    assignedTo: string;
  }>({
    title: '',
    description: '',
    projectId: '',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadInitialData = async () => {
    try {
      console.log('🔄 Loading projects and members...');
      const [projectsData, membersData] = await Promise.all([
        projectService.getProjects(1, 100),
        teamService.getMembers(),
      ]);
      console.log('✅ Projects loaded:', projectsData.projects.length);
      console.log('✅ Members loaded:', membersData.members.length);
      setProjects(projectsData.projects);
      setMembers(membersData.members);
    } catch (error: any) {
      console.error('❌ Error loading initial data:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        projectId: filters.projectId || undefined,
        limit: 50,
      });
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    console.log('🔵 Opening task modal...', { task, projects: projects.length });
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split('T')[0],
        assignedTo: task.assignedTo || '',
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        projectId: projects[0]?.id || '',
        priority: 'MEDIUM',
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: '',
      });
    }
    console.log('🔵 Setting isModalOpen to true');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación
    if (!formData.title.trim()) {
      setError('El título de la tarea es requerido');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }
    if (!formData.projectId) {
      setError('Debes seleccionar un proyecto');
      return;
    }
    if (!formData.dueDate) {
      setError('La fecha de vencimiento es requerida');
      return;
    }
    
    try {
      setSubmitting(true);
      if (editingTask) {
        // Convertir la fecha a formato ISO completo si se está editando
        const updateData = {
          ...formData,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : formData.dueDate,
        };
        await taskService.updateTask(editingTask.id, updateData);
        alert('Tarea actualizada exitosamente');
      } else {
        // Convertir la fecha a formato ISO completo
        const dueDateISO = new Date(formData.dueDate).toISOString();
        
        await taskService.createTask({
          title: formData.title,
          description: formData.description,
          projectId: formData.projectId,
          priority: formData.priority,
          dueDate: dueDateISO,
          assignedTo: formData.assignedTo || undefined,
        });
        alert('Tarea creada exitosamente');
      }
      setIsModalOpen(false);
      await loadTasks();
    } catch (error: any) {
      console.error('Error saving task:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar la tarea';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tareas</h1>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <h3 className="font-semibold mb-3 text-gray-900">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Estado"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'Todos' },
                { value: 'TODO', label: 'Por Hacer' },
                { value: 'IN_PROGRESS', label: 'En Progreso' },
                { value: 'COMPLETED', label: 'Completado' },
              ]}
            />

            <Select
              label="Prioridad"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              options={[
                { value: '', label: 'Todas' },
                { value: 'LOW', label: 'Baja' },
                { value: 'MEDIUM', label: 'Media' },
                { value: 'HIGH', label: 'Alta' },
                { value: 'URGENT', label: 'Urgente' },
              ]}
            />

            <Select
              label="Proyecto"
              value={filters.projectId}
              onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
              options={[
                { value: '', label: 'Todos' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
        </Card>

        {/* Tasks List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">No hay tareas</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TASK_PRIORITY_COLORS[task.priority]}`}>
                        {TASK_PRIORITY_LABELS[task.priority]}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${TASK_STATUS_COLORS[task.status]}`}>
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.assignedTo && (
                        <span>👤 Asignado a: {members.find((m) => m.id === task.assignedTo)?.name || 'Usuario'}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {task.status !== 'COMPLETED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStatusChange(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'COMPLETED')}
                      >
                        {task.status === 'TODO' ? 'Iniciar' : 'Completar'}
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" onClick={() => handleOpenModal(task)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(task.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <Input
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextArea
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Proyecto"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                required
              />

              <Select
                label="Prioridad"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                options={[
                  { value: 'LOW', label: 'Baja' },
                  { value: 'MEDIUM', label: 'Media' },
                  { value: 'HIGH', label: 'Alta' },
                  { value: 'URGENT', label: 'Urgente' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editingTask && (
                <Select
                  label="Estado"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  options={[
                    { value: 'TODO', label: 'Por Hacer' },
                    { value: 'IN_PROGRESS', label: 'En Progreso' },
                    { value: 'COMPLETED', label: 'Completado' },
                  ]}
                />
              )}

              <Input
                label="Fecha Límite"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <Select
              label="Asignar a"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              options={[
                { value: '', label: 'Sin asignar' },
                ...members.map((m) => ({ value: m.id, label: m.name })),
              ]}
            />

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Guardando...' : (editingTask ? 'Actualizar' : 'Crear')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
