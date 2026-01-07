import React, { useState } from 'react';
import type { ReportData } from '../types/reporte.tipos';
import { ExportadorExcel } from '../services/ExportadorExcel';
import { ServicioEmail } from '../services/ServicioEmail';

interface ReportActionsProps {
  reportData: ReportData;
}

/**
 * Componente con botones de acción para el reporte
 */
const EstadoAccion: React.FC<ReportActionsProps> = ({ reportData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

const handleExportExcel = () => {
  try {
    setIsExporting(true);
    
    // Verificar que existan los datos crudos
    if (reportData.huellaDataCruda && reportData.recepcionDataCruda) {
      ExportadorExcel.exportReport(
        reportData,
        reportData.huellaDataCruda,
        reportData.recepcionDataCruda
      );
    } else {
      alert('Error: No hay datos crudos disponibles. Asegúrate de procesar los archivos primero.');
      setIsExporting(false);
      return;
    }
    
    setTimeout(() => {
      setIsExporting(false);
    }, 1000);
  } catch (error) {
    console.error('Error al exportar:', error);
    alert('Error al generar el archivo Excel');
    setIsExporting(false);
  }
};

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      await ServicioEmail.sendReportByEmail(reportData);
      setIsSendingEmail(false);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      alert('Error al generar el correo');
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🎯</span>
        Acciones
      </h3>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Botón Descargar Excel */}
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className={`
            flex-1 flex items-center justify-center gap-3 
            px-6 py-3 rounded-lg font-semibold text-white
            transition-all duration-200 transform
            ${isExporting
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
            }
          `}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Descargando...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Descargar Excel</span>
            </>
          )}
        </button>

        {/* Botón Enviar por Correo */}
        <button
          onClick={handleSendEmail}
          disabled={isSendingEmail}
          className={`
            flex-1 flex items-center justify-center gap-3 
            px-6 py-3 rounded-lg font-semibold text-white
            transition-all duration-200 transform
            ${isSendingEmail
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
            }
          `}
        >
          {isSendingEmail ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Preparando...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Enviar por Correo</span>
            </>
          )}
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-gray-600">
          <strong>💡 Tip:</strong> Al enviar por correo, la imagen se copiará automáticamente. 
          Solo presiona Ctrl+V en tu cliente de correo para pegarla.
        </p>
      </div>
    </div>
  );
};

export default EstadoAccion;