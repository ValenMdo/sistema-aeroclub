import React from 'react';

/**
 * Componente Loader - Indicador de carga
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' - Tamaño del loader
 * - text: string - Texto opcional a mostrar
 */
export default function Loader({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]} mb-4`}
      ></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
}
