import React from 'react';

interface ReportTableProps {
  title: string;
  icon?: string;
  headers: string[];
  data: (string | number)[][];
  maxHeight?: string;
  showTotal?: boolean;
}

/**
 * Componente de tabla genérica para mostrar datos del reporte
 */
const Indice: React.FC<ReportTableProps> = ({ 
  title, 
  icon = '📊', 
  headers, 
  data,
  maxHeight,
  showTotal = false
}) => {
  // Calcular totales si showTotal es true
  const calculateTotals = () => {
    if (!showTotal || data.length === 0) return null;

    const totals: (string | number)[] = ['Total general'];
    
    // Calcular suma para cada columna numérica (columnas 1 en adelante)
    for (let colIndex = 1; colIndex < headers.length; colIndex++) {
      const sum = data.reduce((acc, row) => {
        const value = row[colIndex];
        return acc + (typeof value === 'number' ? value : 0);
      }, 0);
      totals.push(sum);
    }
    
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
      {/* Header de la sección */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </h3>
      </div>

      {/* Contenedor scrollable */}
      <div 
        className={`overflow-auto ${maxHeight || ''}`}
        style={{ maxHeight: maxHeight || 'none' }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800 z-10 shadow-md">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`
                    px-6 py-3 text-sm font-semibold text-white
                    ${index === 0 ? 'text-left' : 'text-right'}
                    border-b-2 border-gray-600
                  `}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={headers.length} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              <>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`
                      ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      hover:bg-blue-50 transition-colors duration-150
                    `}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`
                          px-6 py-3 text-sm border-b border-gray-200
                          ${cellIndex === 0 
                            ? 'text-left font-semibold text-gray-800' 
                            : 'text-right text-gray-700'
                          }
                        `}
                      >
                        {typeof cell === 'number' 
                          ? cell.toLocaleString() 
                          : cell
                        }
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Fila de totales */}
                {totals && (
                  <tr className="bg-gray-800 text-white font-bold sticky bottom-0 shadow-lg">
                    {totals.map((total, index) => (
                      <td
                        key={index}
                        className={`
                          px-6 py-3 text-sm border-t-2 border-gray-600
                          ${index === 0 ? 'text-left' : 'text-right'}
                        `}
                      >
                        {typeof total === 'number' ? total.toLocaleString() : total}
                      </td>
                    ))}
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con contador de filas */}
      {data.length > 0 && (
        <div className="bg-gray-50 px-6 py-2 text-xs text-gray-600 border-t border-gray-200">
          Total de registros: <span className="font-semibold">{data.length}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Componente especializado para mostrar métricas de tiempo
 */
interface TimeMetricsProps {
  title: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export const TimeMetrics: React.FC<TimeMetricsProps> = ({ title, metrics }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl">⏱️</span>
          {title}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200"
            >
              <p className="text-xs text-gray-600 font-medium mb-2">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">minutos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Indice;