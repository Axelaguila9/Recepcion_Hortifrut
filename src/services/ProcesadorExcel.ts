// ===================================
// SERVICIO DE PROCESAMIENTO DE EXCEL
// ===================================

import * as XLSX from 'xlsx';
import type { 
  ReportData, 
  TiempoOperativo, 
  HuellaRow, 
  RecepcionRow 
} from '../types/reporte.tipos';
import { 
  convertExcelTimeToMinutes, 
  calcularPromedio,
  esValorTiempoValido
} from '../utils/CalculosTiempo';
import { 
  agruparPorEspecie, 
  agruparPorSKU, 
  agruparPorProductor,
  calcularTotales 
} from '../utils/AgregacionesDatos';

/**
 * Clase para procesar archivos Excel y generar reportes
 */
export class ProcesadorExcel {
  
  /**
   * Lee un archivo Excel y retorna el WorkBook
   */
  static async readExcelFile(file: File): Promise<XLSX.WorkBook> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          resolve(workbook);
        } catch (error) {
          reject(new Error(`Error al leer archivo: ${(error as Error).message}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Error al cargar el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Procesa los archivos y genera el reporte completo
   */
  static async processFiles(
    huellaFile: File,
    recepcionFile: File
  ): Promise<ReportData> {
    try {
      // Leer archivo de Huella de Cosecha
      const huellaWorkbook = await this.readExcelFile(huellaFile);
      const huellaSheet = huellaWorkbook.Sheets[huellaWorkbook.SheetNames[0]];
      const huellaData: HuellaRow[] = XLSX.utils.sheet_to_json(huellaSheet);

      // Leer archivo de Recepción
      const recepcionWorkbook = await this.readExcelFile(recepcionFile);
      const recepcionSheet = recepcionWorkbook.Sheets[recepcionWorkbook.SheetNames[0]];
      const recepcionData: RecepcionRow[] = XLSX.utils.sheet_to_json(recepcionSheet);

      // Generar reporte
      return this.generateReport(huellaData, recepcionData);
    } catch (error) {
      throw new Error(`Error al procesar archivos: ${(error as Error).message}`);
    }
  }

  /**
   * Genera el reporte completo a partir de los datos
   */
  private static generateReport(
    huellaData: HuellaRow[],
    recepcionData: RecepcionRow[]
  ): ReportData {
    // NO generar fecha - dejar vacío
    const fecha = '';
    
    // Calcular tiempos operativos
    const tiempoOperativo = this.calcularTiempoOperativo(huellaData);
    
    // Agrupar datos
    const porEspecie = agruparPorEspecie(recepcionData);
    const porSKU = agruparPorSKU(recepcionData);
    const porProductor = agruparPorProductor(recepcionData);
    
    // Calcular totales
    const { totalCajas, totalKilos } = calcularTotales(recepcionData);

    return {
      fecha,
      tiempoOperativo,
      porEspecie,
      porSKU,
      porProductor,
      totalCajas,
      totalKilos,
      huellaDataCruda: huellaData,
      recepcionDataCruda: recepcionData
    };
  }

  /**
   * Calcula todos los tiempos operativos promedio
   */
  private static calcularTiempoOperativo(huellaData: HuellaRow[]): TiempoOperativo {
    const tiempos: Record<string, number[]> = {
      traslado: [],
      descarga: [],
      inspeccion: [],
      paletizado: [],
      prefrio: [],
      salvataje: []
    };

    huellaData.forEach(row => {
      // 1. Traslado = Hora Recepción en Co - Hora Huerto
      if (row['Hora Huerto'] && row['Hora Recepción en Co']) {
        const diff = convertExcelTimeToMinutes(row['Hora Huerto'], row['Hora Recepción en Co']);
        if (esValorTiempoValido(diff, 500)) {
          tiempos.traslado.push(diff);
        }
      }

      // 2. Descarga = Hora Inicio de Inspe - Hora Recepción en Co
      if (row['Hora Recepción en Co'] && row['Hora Inicio de Inspe']) {
        const diff = convertExcelTimeToMinutes(row['Hora Recepción en Co'], row['Hora Inicio de Inspe']);
        if (esValorTiempoValido(diff, 500)) {
          tiempos.descarga.push(diff);
        }
      }

      // 3. Inspección = Hora Fin Rev. Calida - Hora Inicio de Inspe
      if (row['Hora Inicio de Inspe'] && row['Hora Fin Rev. Calida']) {
        const diff = convertExcelTimeToMinutes(row['Hora Inicio de Inspe'], row['Hora Fin Rev. Calida']);
        if (esValorTiempoValido(diff, 500)) {
          tiempos.inspeccion.push(diff);
        }
      }

      // 4. Paletizado = (Hora Inicio PreFrio - Hora Fin Rev. Calida) * 60 * 24
      if (row['Hora Fin Rev. Calida'] && row['Hora Inicio PreFrio']) {
        const diff = convertExcelTimeToMinutes(
          row['Hora Fin Rev. Calida'],
          row['Hora Inicio PreFrio']
        );
        tiempos.paletizado.push(diff);
      }

      // 5. Prefrio - Replica EXACTAMENTE la fórmula de Excel
      if (row['Hora Inicio PreFrio'] && row['Hora Fin PreFrio']) {
        const inicio = row['Hora Inicio PreFrio'];
        const fin = row['Hora Fin PreFrio'];
        
        let diff;
        let inicioNum: number;
        let finNum: number;
        
        if (typeof inicio === 'string') {
          const [h, m, s] = inicio.split(':').map(Number);
          inicioNum = (h + m/60 + s/3600) / 24;
        } else {
          inicioNum = inicio;
        }
        
        if (typeof fin === 'string') {
          const [h, m, s] = fin.split(':').map(Number);
          finNum = (h + m/60 + s/3600) / 24;
        } else {
          finNum = fin;
        }
        
        if (inicioNum < finNum) {
          diff = convertExcelTimeToMinutes(inicio, fin);
        } else {
          diff = convertExcelTimeToMinutes(inicio, fin) * 24;
        }
        
        tiempos.prefrio.push(diff);
      }

      // 6. Salvataje = Hora Fin Reembalado - Hora Fin Rev. Calida
      if (row['Hora Fin Rev. Calida'] && row['Hora Fin Reembalado']) {
        const diff = convertExcelTimeToMinutes(row['Hora Fin Rev. Calida'], row['Hora Fin Reembalado']);
        if (esValorTiempoValido(diff)) {
          tiempos.salvataje.push(diff);
        }
      }
    });

    // Calcular promedios
    return {
      traslado: calcularPromedio(tiempos.traslado),
      descarga: calcularPromedio(tiempos.descarga),
      inspeccion: calcularPromedio(tiempos.inspeccion),
      paletizado: calcularPromedio(tiempos.paletizado),
      prefrio: calcularPromedio(tiempos.prefrio),
      salvataje: calcularPromedio(tiempos.salvataje)
    };
  }
}