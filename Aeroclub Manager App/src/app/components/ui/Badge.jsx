import React from 'react';

/**
 * Componente Badge - Etiqueta de estado
 * 
 * Muestra un badge con diferentes variantes de color.
 * 
 * Variantes disponibles:
 * - success (verde): para estados positivos
 * - warning (amarillo): para estados de advertencia
 * - danger (rojo): para estados negativos
 * - info (azul): para información general
 * - default (gris): para estados neutros
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
