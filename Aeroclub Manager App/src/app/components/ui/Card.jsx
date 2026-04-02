import React from 'react';

/**
 * Componente Card - Tarjeta reutilizable
 * 
 * Muestra contenido en una tarjeta con estilos consistentes.
 */
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg text-gray-800 ${className}`}>{children}</h3>;
}
