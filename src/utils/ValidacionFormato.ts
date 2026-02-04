// ===================================
// VALIDACIÓN DE FORMATO EXCEL
// - Valida títulos exactos
// - Valida celdas obligatorias en Huella
// ===================================

import * as XLSX from 'xlsx';

/**
 * Títulos esperados para archivo de Recepción (26 columnas)
 */
const TITULOS_RECEPCION = [
  'Productor',
  'Nombre Productor',
  'Fecha Contabilizacion',
  'Centro',
  'Den. centro',
  'Material',
  'Denominacion Material',
  'Lote',
  'Cajas Recepcion',
  'Kilos Recepcion',
  'Cajas Recepcion Dev.',
  'Kilos Recepcion Dev.',
  'Cajas Recepcion Final',
  'Kilos Recepcion Final',
  'Codigo Variedad',
  'Variedad',
  'Fecha Embalaje',
  'Den. Especie',
  'Den. Manejo',
  'Tipo Caja',
  'Tipo Etiqueta',
  'Tipo Tecnología',
  'Den. Tipo Formato',
  'HUERTO',
  'SECTOR',
  'CICLO'
];

/**
 * Títulos esperados para archivo de Huella de Cosecha (13 columnas)
 */
const TITULOS_HUELLA = [
  'Lote',
  'Fecha de Cosecha',
  'Fecha Fin Prefrio',
  'Hora Huerto',
  'Hora Inicio Cosecha',
  'Hora Recepción en Co',
  'Hora Inicio de Inspe',
  'Hora Fin Rev. Calida',
  'Hora Inicio PreFrio',
  'Hora Fin PreFrio',
  'Hora Fin Reembalado',
  'Hora Inicio Reembala',
  'Lote Reembalado'
];

/**
 * Columnas OBLIGATORIAS en Huella (no pueden tener celdas vacías)
 */
const COLUMNAS_OBLIGATORIAS_HUELLA = [
  'Lote',
  'Fecha de Cosecha',
  'Fecha Fin Prefrio',
  'Hora Huerto',
  'Hora Inicio Cosecha',
  'Hora Recepción en Co',
  'Hora Fin PreFrio'
];

/**
 * Resultado de validación
 */
export interface ResultadoValidacion {
  esValido: boolean;
  mensaje: string;
}

/**
 * Validador de formato Excel
 */
export class ValidadorFormato {
  
  /**
   * Valida archivo de Recepción
   */
  static async validarArchivoRecepcion(file: File): Promise<ResultadoValidacion> {
    try {
      const workbook = await this.leerArchivo(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const titulos = this.obtenerTitulos(sheet);
      
      return this.compararTitulos(titulos, TITULOS_RECEPCION, 'Recepción');
    } catch (error) {
      return {
        esValido: false,
        mensaje: `❌ Error al leer el archivo: ${(error as Error).message}`
      };
    }
  }

  /**
   * Valida archivo de Huella de Cosecha
   * - Valida títulos
   * - Valida que columnas obligatorias no tengan celdas vacías
   */
  static async validarArchivoHuella(file: File): Promise<ResultadoValidacion> {
    try {
      const workbook = await this.leerArchivo(file);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const titulos = this.obtenerTitulos(sheet);
      
      // Paso 1: Validar títulos
      const validacionTitulos = this.compararTitulos(titulos, TITULOS_HUELLA, 'Huella de Cosecha');
      if (!validacionTitulos.esValido) {
        return validacionTitulos;
      }

      // Paso 2: Validar celdas obligatorias
      const validacionCeldas = this.validarCeldasObligatorias(sheet, titulos);
      if (!validacionCeldas.esValido) {
        return validacionCeldas;
      }

      return {
        esValido: true,
        mensaje: '✅ Formato correcto de Huella de Cosecha'
      };
    } catch (error) {
      return {
        esValido: false,
        mensaje: `❌ Error al leer el archivo: ${(error as Error).message}`
      };
    }
  }

  /**
   * Valida ambos archivos
   */
  static async validarAmbosArchivos(
    huellaFile: File,
    recepcionFile: File
  ): Promise<ResultadoValidacion> {
    
    // Validar Huella
    const validacionHuella = await this.validarArchivoHuella(huellaFile);
    if (!validacionHuella.esValido) {
      return {
        esValido: false,
        mensaje: `📋 Archivo de Huella de Cosecha:\n${validacionHuella.mensaje}`
      };
    }

    // Validar Recepción
    const validacionRecepcion = await this.validarArchivoRecepcion(recepcionFile);
    if (!validacionRecepcion.esValido) {
      return {
        esValido: false,
        mensaje: `📋 Archivo de Recepción:\n${validacionRecepcion.mensaje}`
      };
    }

    return {
      esValido: true,
      mensaje: '✅ Ambos archivos tienen el formato correcto'
    };
  }

  /**
   * Lee un archivo Excel y retorna el WorkBook
   */
  private static leerArchivo(file: File): Promise<XLSX.WorkBook> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          resolve(workbook);
        } catch (error) {
          reject(new Error('Error al procesar el archivo'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error al cargar el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Obtiene los títulos (primera fila) de una hoja
   */
  private static obtenerTitulos(sheet: XLSX.WorkSheet): string[] {
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const titulos: string[] = [];
    
    // Leer primera fila
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = sheet[cellAddress];
      
      if (cell && cell.v) {
        titulos.push(String(cell.v).trim());
      }
    }
    
    return titulos;
  }

  /**
   * Compara títulos encontrados con los esperados
   */
  private static compararTitulos(
    titulosEncontrados: string[],
    titulosEsperados: string[],
    nombreArchivo: string
  ): ResultadoValidacion {
    
    // Verificar número de columnas
    if (titulosEncontrados.length !== titulosEsperados.length) {
      return {
        esValido: false,
        mensaje: `❌ Este NO es el formato de "${nombreArchivo}".\n\n` +
                 `Esperaba ${titulosEsperados.length} columnas, encontré ${titulosEncontrados.length} columnas.\n\n` +
                 `Por favor sube el archivo correcto.`
      };
    }

    // Verificar que todos los títulos coincidan exactamente
    for (let i = 0; i < titulosEsperados.length; i++) {
      if (titulosEncontrados[i] !== titulosEsperados[i]) {
        return {
          esValido: false,
          mensaje: `❌ Este NO es el formato de "${nombreArchivo}".\n\n` +
                   `Los títulos no coinciden.\n` +
                   `Columna ${i + 1}:\n` +
                   `  Esperaba: "${titulosEsperados[i]}"\n` +
                   `  Encontré: "${titulosEncontrados[i]}"\n\n` +
                   `Por favor sube el archivo correcto.`
        };
      }
    }

    return {
      esValido: true,
      mensaje: `✅ Formato correcto de ${nombreArchivo}`
    };
  }

  /**
   * Valida que las columnas obligatorias de Huella no tengan celdas vacías
   */
  private static validarCeldasObligatorias(
    sheet: XLSX.WorkSheet,
    titulos: string[]
  ): ResultadoValidacion {
    
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    
    // Obtener índices de las columnas obligatorias
    const indicesObligatorios: { nombre: string; indice: number }[] = [];
    
    COLUMNAS_OBLIGATORIAS_HUELLA.forEach(nombreCol => {
      const indice = titulos.indexOf(nombreCol);
      if (indice !== -1) {
        indicesObligatorios.push({ nombre: nombreCol, indice });
      }
    });

    // Revisar cada fila (empezando desde la fila 2, después de los títulos)
    for (let row = 1; row <= range.e.r; row++) {
      for (const { nombre, indice } of indicesObligatorios) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: indice });
        const cell = sheet[cellAddress];
        
        // Verificar si la celda está vacía
        const estaVacia = !cell || cell.v === null || cell.v === undefined || 
                         (typeof cell.v === 'string' && cell.v.trim() === '');
        
        if (estaVacia) {
          return {
            esValido: false,
            mensaje: `❌ El archivo tiene celdas vacías en columnas obligatorias.\n\n` +
                     `Fila ${row + 1}: La columna "${nombre}" está vacía.\n\n` +
                     `Todas estas columnas deben tener valores:\n` +
                     COLUMNAS_OBLIGATORIAS_HUELLA.map(c => `  • ${c}`).join('\n') +
                     `\n\nPor favor completa todos los datos obligatorios.`
          };
        }
      }
    }

    return {
      esValido: true,
      mensaje: '✅ Todas las celdas obligatorias tienen valores'
    };
  }
}