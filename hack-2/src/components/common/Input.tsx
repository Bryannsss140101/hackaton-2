import type { InputHTMLAttributes } from 'react'

export const Input = ({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`mt-1 border rounded-md px-3 py-2 text-sm ${className || ''}`}
      {...props}
    />
  </div>
)
