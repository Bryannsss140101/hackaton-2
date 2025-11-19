export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  createdAt?: string
  updatedAt?: string
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt?: string
  updatedAt?: string

  project?: Project
}
