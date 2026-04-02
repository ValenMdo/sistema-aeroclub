import React from 'react';

/**
 * Componente FormInput - Input reutilizable para formularios
 * 
 * Props:
 * - label: string - Etiqueta del input
 * - error: string - Mensaje de error
 * - required: boolean - Si el campo es obligatorio
 * - ...inputProps - Resto de props del input (type, value, onChange, etc.)
 */
export default function FormInput({
  label,
  error,
  required = false,
  className = '',
  ...inputProps
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
