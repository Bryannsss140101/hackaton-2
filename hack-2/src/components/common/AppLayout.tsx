import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        location.pathname === to ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-blue-600">TechFlow</h1>

        <nav className="flex flex-col gap-1">
          {navItem('/dashboard', 'Dashboard')}
          {navItem('/projects', 'Proyectos')}
          {navItem('/tasks', 'Tareas')}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
