import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button = ({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const base =
    'px-3 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClass =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'

  const finalClassName = `${base} ${variantClass} ${className}`

  return <button className={finalClassName} {...props} />
}
