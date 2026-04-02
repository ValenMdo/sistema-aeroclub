import React from 'react';

/**
 * Componente Select - Selector reutilizable
 * 
 * Props:
 * - label: string - Etiqueta del selector
 * - options: Array<{ value: string, label: string }> - Opciones
 * - error: string - Mensaje de error
 * - required: boolean - Si el campo es obligatorio
 * - ...selectProps - Resto de props del select
 */
export default function Select({
  label,
  options = [],
  error,
  required = false,
  className = '',
  ...selectProps
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...selectProps}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
