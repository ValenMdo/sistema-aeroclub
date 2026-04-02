import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

/**
 * Componente Alert - Mensajes de alerta
 * 
 * Props:
 * - type: 'success' | 'error' | 'warning' | 'info' - Tipo de alerta
 * - message: string - Mensaje a mostrar
 * - onClose: function - Función para cerrar la alerta (opcional)
 */
export default function Alert({ type = 'info', message, onClose, className = '' }) {
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 rounded-lg border flex items-start gap-3 ${config.bg} ${config.border} ${className}`}
    >
      <Icon className={`${config.text} flex-shrink-0`} size={20} />
      <p className={`text-sm flex-1 ${config.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
