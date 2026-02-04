import { useState } from 'react';
import Header from '../components/Header';
import FileUploader from '../components/CargarAchivos';
import ReportSummary from '../components/Sintesis';
import ReportTable, { TimeMetrics } from '../components/Indice';
import ReportActions from '../components/EstadoAccion';
import { ProcesadorExcel } from '../services/ProcesadorExcel';
import { ValidadorFormato } from '../utils/ValidacionFormato';
import type { FileState, ReportData } from '../types/reporte.tipos';

function Cierre() {
  // Estados
  const [files, setFiles] = useState<FileState>({
    huella: null,
    recepcion: null,
    pallets: null
  });
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Maneja el cambio de archivos
   */
  const handleFileChange = (type: keyof FileState, file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    setError(null);
  };

  /**
   * Procesa los archivos Excel y genera el reporte
   */
  const handleGenerateReport = async () => {
    // Validación básica
    if (!files.huella || !files.recepcion) {
      setError('Por favor selecciona al menos Huella de Cosecha y Recepción');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ VALIDAR FORMATO DE ARCHIVOS PRIMERO
      const validacion = await ValidadorFormato.validarAmbosArchivos(
        files.huella,
        files.recepcion
      );

      // Si la validación falla, mostrar mensaje y detener
      if (!validacion.esValido) {
        setError(validacion.mensaje);
        setLoading(false);
        return;
      }

      // Si la validación es exitosa, procesar archivos
      const report = await ProcesadorExcel.processFiles(files.huella, files.recepcion);
      setReportData(report);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
              <span className="text-5xl">📊</span>
              Cierre de Recepción - Zarzamora
            </h1>
          </div>

          {/* Sección de carga de archivos */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white p-3 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Cargar Archivos Excel</h2>
                <p className="text-sm text-gray-600">Selecciona los archivos para generar el reporte</p>
              </div>
            </div>

            {/* Grid de carga de archivos - Solo 2 archivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FileUploader
                label="Huella de Cosecha"
                file={files.huella}
                onChange={(file) => handleFileChange('huella', file)}
                required
              />
              <FileUploader
                label="Reporte Recepcional"
                file={files.recepcion}
                onChange={(file) => handleFileChange('recepcion', file)}
                required
              />
            </div>

            {/* Botón de generar */}
            <button
              onClick={handleGenerateReport}
              disabled={loading || !files.huella || !files.recepcion}
              className={`
                w-full py-4 px-8 rounded-xl font-bold text-lg
                transition-all duration-200 transform
                flex items-center justify-center gap-3
                ${loading || !files.huella || !files.recepcion
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando archivos...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>GENERAR REPORTE</span>
                </>
              )}
            </button>

            {/* Mensaje de error mejorado */}
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-800 mb-1">Error al procesar</p>
                  <pre className="text-sm text-red-700 whitespace-pre-wrap font-sans">{error}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Sección de resultados */}
          {reportData && (
            <div className="space-y-6">
              {/* Resumen */}
              <ReportSummary reportData={reportData} />

              {/* Tiempo Operativo */}
              <TimeMetrics
                title="0- Tiempo operativo día"
                metrics={[
                  { label: 'Traslado', value: reportData.tiempoOperativo.traslado },
                  { label: 'Descarga', value: reportData.tiempoOperativo.descarga },
                  { label: 'Inspección', value: reportData.tiempoOperativo.inspeccion },
                  { label: 'Paletizado', value: reportData.tiempoOperativo.paletizado },
                  { label: 'Prefrio', value: reportData.tiempoOperativo.prefrio },
                  { label: 'Salvataje', value: reportData.tiempoOperativo.salvataje }
                ]}
              />

              {/* Tabla por Especie - CON TOTAL */}
              <ReportTable
                title="1- Recepción por especie día"
                icon="🫐"
                headers={['Especie', 'Cajas Recepción', 'Devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas']}
                data={reportData.porEspecie.map(item => [
                  item.nombre,
                  item.cajasRecepcion,
                  item.cajasDevolucion,
                  item.cajasFinales,
                  item.kilosFinales,
                  item.entregas
                ])}
                showTotal={true}
              />

              {/* Tabla por SKU - CON TOTAL */}
              <ReportTable
                title="2- Recepción por SKU día"
                icon="📦"
                headers={['SKU', 'Cajas Recepción', 'Devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas']}
                data={reportData.porSKU.map(item => [
                  item.nombre,
                  item.cajasRecepcion,
                  item.cajasDevolucion,
                  item.cajasFinales,
                  item.kilosFinales,
                  item.entregas
                ])}
                showTotal={true}
              />

              {/* Tabla por Productor - CON TOTAL y scroll */}
              <ReportTable
                title="3- Recepción por productor día"
                icon="👨‍🌾"
                headers={['Productor', 'Cajas Recepción', 'Devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas']}
                data={reportData.porProductor.map(item => [
                  item.nombre,
                  item.cajasRecepcion,
                  item.cajasDevolucion,
                  item.cajasFinales,
                  item.kilosFinales,
                  item.entregas
                ])}
                maxHeight="600px"
                showTotal={true}
              />

              {/* Acciones */}
              <ReportActions reportData={reportData} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cierre;