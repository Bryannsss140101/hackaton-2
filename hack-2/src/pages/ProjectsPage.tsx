import React, { useEffect, useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Select } from '../components/common/Select';
import { projectService } from '../services/projectService';
import type { Project } from '../types';
import { PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { PROJECT_STATUS_LABELS } from '../utils/constants';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  }>({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadProjects();
  }, [currentPage, search]);

  const loadProjects = async () => {
    try {
      console.log('🔄 Loading projects page:', currentPage, 'search:', search);
      setLoading(true);
      setLoadError('');
      const data = await projectService.getProjects(currentPage, 10, search);
      console.log('✅ Projects loaded successfully:', data);
      setProjects(data.projects);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('❌ Error loading projects:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMsg = error.response?.data?.message || error.message || 'Error al cargar proyectos';
      setLoadError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', description: '', status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación
    if (!formData.name.trim()) {
      setError('El nombre del proyecto es requerido');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }
    
    try {
      setSubmitting(true);
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
        alert('Proyecto actualizado exitosamente');
      } else {
        await projectService.createProject(formData);
        alert('Proyecto creado exitosamente');
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error al guardar el proyecto';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(id);
        loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Error Message */}
        {loadError && (
          <Card className="bg-red-50 border-red-200">
            <p className="text-center text-red-700 py-4">❌ {loadError}</p>
          </Card>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500 py-8">No hay proyectos. Crea uno nuevo para empezar.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex space-x-2 mt-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(project)}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="flex-1"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <Input
              label="Nombre del Proyecto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <TextArea
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' })}
              options={[
                { value: 'ACTIVE', label: 'Activo' },
                { value: 'COMPLETED', label: 'Completado' },
                { value: 'ON_HOLD', label: 'En Espera' },
              ]}
            />

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Guardando...' : (editingProject ? 'Actualizar' : 'Crear')}
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
