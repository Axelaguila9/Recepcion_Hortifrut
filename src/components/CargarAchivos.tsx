import React from 'react';

interface FileUploaderProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}

/**
 * Componente para cargar archivos Excel con preview visual
 */
const CargarArchivos: React.FC<FileUploaderProps> = ({ 
  label, 
  file, 
  onChange, 
  required = false 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange(selectedFile);
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-sm mb-2 text-gray-800 font-medium">
        {required && <span className="text-red-500">* </span>}
        {label}
      </h3>
      
      <label className="w-full cursor-pointer group">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className={`
          border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
          ${file 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 group-hover:shadow-md'
          }
        `}>
          <div className="flex flex-col items-center">
            {/* Icono de documento */}
            <svg 
              className={`w-12 h-12 mb-3 transition-colors ${
                file ? 'text-emerald-500' : 'text-gray-400 group-hover:text-emerald-400'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>

            {/* Estado del archivo */}
            {file ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-bold text-emerald-600">Archivo cargado</p>
                </div>
                <p className="text-xs text-gray-600 truncate max-w-full px-2">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Click para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  Archivos .xlsx, .xls
                </p>
              </>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default CargarArchivos;