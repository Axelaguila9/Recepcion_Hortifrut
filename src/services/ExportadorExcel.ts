// ===================================
// EXPORTADOR DE EXCEL CON ESTILOS
// Usa ExcelJS para soportar colores y formatos
// ===================================

import ExcelJS from 'exceljs';
import type { ReportData, HuellaRow, RecepcionRow } from '../types/reporte.tipos';

/**
 * Clase para exportar reportes a formato Excel con estilos completos
 */
export class ExportadorExcel {
  
  /**
   * Genera y descarga un archivo Excel con las 3 hojas completas
   */
  static async exportReport(
    reportData: ReportData,
    huellaData: HuellaRow[],
    recepcionData: RecepcionRow[]
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    // Crear Hoja 1: ZMM_HUELLA DE COSECHA
    await this.createHuellaSheet(workbook, huellaData);

    // Crear Hoja 2: ZMM_RECEPIONES  
    await this.createRecepcionesSheet(workbook, recepcionData);

    // Crear Hoja 3: REPORTES
    await this.createReportesSheet(workbook, reportData);

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fecha = reportData.fecha.replace(/ /g, '_');
    link.download = `Reporte_${fecha}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Crea la hoja ZMM_HUELLA DE COSECHA
   */
  private static async createHuellaSheet(workbook: ExcelJS.Workbook, huellaData: HuellaRow[]): Promise<void> {
    const worksheet = workbook.addWorksheet('ZMM_HUELLA DE COSECHA');

    // Headers
    const headers = [
      'Lote', 'Fecha de Cosecha', 'Fecha Fin Prefrio', 'Hora Huerto', 'Hora Inicio Cosecha',
      'Hora Recepción en Co', 'Hora Inicio de Inspe', 'Hora Fin Rev. Calida', 'Hora Inicio PreFrio',
      'Hora Fin PreFrio', 'Hora Fin Reembalado', 'Hora Inicio Reembala', 'Lote Reembalado',
      'Traslado', 'Descarga', 'Inspección', 'Paletizado', 'Prefrio', 'Reembalaje'
    ];

    worksheet.addRow(headers);

    // Agregar datos
    huellaData.forEach((row, index) => {
      const rowIndex = index + 2;
      
      worksheet.addRow([
        row['Lote'] || '',
        row['Fecha de Cosecha'] || '',
        row['Fecha Fin Prefrio'] || '',
        row['Hora Huerto'] || '',
        row['Hora Inicio Cosecha'] || '',
        row['Hora Recepción en Co'] || '',
        row['Hora Inicio de Inspe'] || '',
        row['Hora Fin Rev. Calida'] || '',
        row['Hora Inicio PreFrio'] || '',
        row['Hora Fin PreFrio'] || '',
        row['Hora Fin Reembalado'] || '',
        row['Hora Inicio Reembala'] || '',
        row['Lote Reembalado'] || ''
      ]);

      // Agregar fórmulas
      const currentRow = worksheet.getRow(rowIndex);
      currentRow.getCell(14).value = { formula: `(F${rowIndex}-D${rowIndex})*60*24` };
      currentRow.getCell(15).value = { formula: `(G${rowIndex}-F${rowIndex})*60*24` };
      currentRow.getCell(16).value = { formula: `(H${rowIndex}-G${rowIndex})*60*24` };
      currentRow.getCell(17).value = { formula: `(I${rowIndex}-H${rowIndex})*60*24` };
      currentRow.getCell(18).value = { formula: `IF(I${rowIndex}<J${rowIndex},(J${rowIndex}-I${rowIndex})*60*24,(J${rowIndex}-I${rowIndex})*60*24*24)` };
      currentRow.getCell(19).value = { formula: `IFERROR((K${rowIndex}-H${rowIndex})*60*24,0)` };
      currentRow.commit();
    });

    // Anchos de columna
    worksheet.columns = [
      { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, { width: 15 },
      { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 15 },
      { width: 18 }, { width: 18 }, { width: 15 }, { width: 10 }, { width: 10 },
      { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }
    ];
  }

  /**
   * Crea la hoja ZMM_RECEPIONES
   */
  private static async createRecepcionesSheet(workbook: ExcelJS.Workbook, recepcionData: RecepcionRow[]): Promise<void> {
    const worksheet = workbook.addWorksheet('ZMM_RECEPIONES');

    // Headers
    const headers = [
      'Productor', 'Nombre Productor', 'Fecha Contabilizacion', 'Centro', 'Den. centro', 'Material',
      'Denominacion Material', 'Lote', 'Cajas Recepcion', 'Kilos Recepcion', 'Cajas Recepcion Dev.',
      'Kilos Recepcion Dev.', 'Cajas Recepcion Final', 'Kilos Recepcion Final', 'Codigo Variedad',
      'Variedad', 'Fecha Embalaje', 'Den. Especie', 'Den. Manejo', 'Tipo Caja', 'Tipo Etiqueta',
      'Tipo Tecnología', 'Den. Tipo Formato', 'HUERTO', 'SECTOR', 'Hora Inicio Cosecha', 'Hora Huerto',
      'Hora Recepción en Co', 'Hora Inicio de Inspe', 'Hora Fin Rev. Calida', 'Hora Inicio PreFrio',
      'Hora Fin PreFrio', 'Traslado', 'Descarga', 'Inspección', 'Paletizado', 'Prefrio', 'Id_Entrega'
    ];

    worksheet.addRow(headers);

    // Agregar datos
    recepcionData.forEach((row, index) => {
      const rowIndex = index + 2;
      
      worksheet.addRow([
        row['Productor'] || '', row['Nombre Productor'] || '', row['Fecha Contabilizacion'] || '',
        row['Centro'] || '', row['Den. centro'] || '', row['Material'] || '',
        row['Denominacion Material'] || '', row['Lote'] || '', row['Cajas Recepcion'] || 0,
        row['Kilos Recepcion'] || 0, row['Cajas Recepcion Dev.'] || 0, row['Kilos Recepcion Dev.'] || 0,
        row['Cajas Recepcion Final'] || 0, row['Kilos Recepcion Final'] || 0, row['Codigo Variedad'] || '',
        row['Variedad'] || '', row['Fecha Embalaje'] || '', row['Den. Especie'] || '',
        row['Den. Manejo'] || '', row['Tipo Caja'] || '', row['Tipo Etiqueta'] || '',
        row['Tipo Tecnología'] || '', row['Den. Tipo Formato'] || '', row['HUERTO'] || '',
        row['SECTOR'] || ''
      ]);

      // Agregar fórmulas VLOOKUP
      const currentRow = worksheet.getRow(rowIndex);
      currentRow.getCell(26).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,5,0)` };
      currentRow.getCell(27).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,4,0)` };
      currentRow.getCell(28).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,6,0)` };
      currentRow.getCell(29).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,7,0)` };
      currentRow.getCell(30).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,8,0)` };
      currentRow.getCell(31).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,9,0)` };
      currentRow.getCell(32).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,10,0)` };
      currentRow.getCell(33).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,14,0)` };
      currentRow.getCell(34).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,15,0)` };
      currentRow.getCell(35).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,16,0)` };
      currentRow.getCell(36).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,17,0)` };
      currentRow.getCell(37).value = { formula: `VLOOKUP(H${rowIndex},'ZMM_HUELLA DE COSECHA'!A:S,18,0)` };
      currentRow.getCell(38).value = { formula: `IFERROR(CONCATENATE(A${rowIndex},AB${rowIndex}),"")` };
      currentRow.commit();
    });

    // Anchos de columna uniformes
    worksheet.columns.forEach((col, i) => {
      col.width = i === 1 ? 30 : 12; // Nombre Productor más ancho
    });
  }

  /**
   * Crea la hoja REPORTES con colores y estilos
   */
  private static async createReportesSheet(workbook: ExcelJS.Workbook, reportData: ReportData): Promise<void> {
    const worksheet = workbook.addWorksheet('REPORTES');

    const fecha = new Date();
    const dia = fecha.getDate() - 1;
    const mes = fecha.toLocaleDateString('es-MX', { month: 'long' });
    const anio = fecha.getFullYear();

    let currentRow = 1;

    // ============ SECCIÓN 0: TIEMPO OPERATIVO (Arriba, solo) ============
    worksheet.getCell(`A${currentRow}`).value = `0- Tiempo operativo día: ${dia} ${mes} ${anio} Tiempo promedio en minutos`;
    currentRow++;

    // Headers Tiempo Operativo
    const timeHeaders = ['Traslado', 'Descarga', 'Inspección', 'Paletizado', 'Prefrio', 'Salvataje'];
    timeHeaders.forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    currentRow++;

    // Datos Tiempo Operativo
    [reportData.tiempoOperativo.traslado, reportData.tiempoOperativo.descarga,
     reportData.tiempoOperativo.inspeccion, reportData.tiempoOperativo.paletizado,
     reportData.tiempoOperativo.prefrio, reportData.tiempoOperativo.salvataje
    ].forEach((val, i) => {
      worksheet.getCell(currentRow, i + 1).value = val;
    });
    currentRow++;
    currentRow++; // Espacio pequeño

    // ============ SECCIÓN 1: POR ESPECIE ============
    worksheet.getCell(`A${currentRow}`).value = `1- Recepción por especie día: ${dia} ${mes} ${anio}`;
    currentRow++;

    // Headers Especie
    ['Etiquetas de fila', 'Cajas Recepcion', 'Cajas devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas'].forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    currentRow++;

    // Datos Especie
    reportData.porEspecie.forEach(item => {
      worksheet.getCell(currentRow, 1).value = item.nombre;
      worksheet.getCell(currentRow, 2).value = item.cajasRecepcion;
      worksheet.getCell(currentRow, 3).value = item.cajasDevolucion;
      worksheet.getCell(currentRow, 4).value = item.cajasFinales;
      worksheet.getCell(currentRow, 5).value = item.kilosFinales;
      worksheet.getCell(currentRow, 6).value = item.entregas;
      currentRow++;
    });

    // Total Especie
    const especieTotalRow = currentRow;
    worksheet.getCell(especieTotalRow, 1).value = 'Total general';
    worksheet.getCell(especieTotalRow, 2).value = reportData.totalCajas;
    worksheet.getCell(especieTotalRow, 3).value = reportData.porEspecie.reduce((sum, e) => sum + e.cajasDevolucion, 0);
    worksheet.getCell(especieTotalRow, 4).value = reportData.totalCajas;
    worksheet.getCell(especieTotalRow, 5).value = reportData.totalKilos;
    worksheet.getCell(especieTotalRow, 6).value = reportData.porEspecie.reduce((sum, e) => sum + e.entregas, 0);
    
    // Estilo Total Especie
    for (let i = 1; i <= 6; i++) {
      const cell = worksheet.getCell(especieTotalRow, i);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      cell.font = { bold: true };
    }
    currentRow++;
    currentRow++; // Espacio pequeño

    // ============ SECCIÓN 2: POR SKU ============
    worksheet.getCell(`A${currentRow}`).value = `2- Recepción por SKU día: ${dia} ${mes} ${anio}`;
    currentRow++;

    // Headers SKU
    ['SKU', 'Cajas Recepcion', 'Cajas devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas'].forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    currentRow++;

    // Datos SKU
    reportData.porSKU.forEach(item => {
      worksheet.getCell(currentRow, 1).value = item.nombre;
      worksheet.getCell(currentRow, 2).value = item.cajasRecepcion;
      worksheet.getCell(currentRow, 3).value = item.cajasDevolucion;
      worksheet.getCell(currentRow, 4).value = item.cajasFinales;
      worksheet.getCell(currentRow, 5).value = item.kilosFinales;
      worksheet.getCell(currentRow, 6).value = item.entregas;
      currentRow++;
    });

    // Total SKU
    const skuTotalRow = currentRow;
    worksheet.getCell(skuTotalRow, 1).value = 'Total general';
    worksheet.getCell(skuTotalRow, 2).value = reportData.totalCajas;
    worksheet.getCell(skuTotalRow, 3).value = reportData.porSKU.reduce((sum, s) => sum + s.cajasDevolucion, 0);
    worksheet.getCell(skuTotalRow, 4).value = reportData.totalCajas;
    worksheet.getCell(skuTotalRow, 5).value = reportData.totalKilos;
    worksheet.getCell(skuTotalRow, 6).value = reportData.porSKU.reduce((sum, s) => sum + s.entregas, 0);
    
    // Estilo Total SKU
    for (let i = 1; i <= 6; i++) {
      const cell = worksheet.getCell(skuTotalRow, i);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      cell.font = { bold: true };
    }
    currentRow++;
    currentRow++; // Espacio pequeño

    // ============ SECCIÓN 3: PRODUCTORES (Al lado derecho desde arriba) ============
    const productoresStartRow = 1;
    worksheet.getCell(productoresStartRow, 8).value = `3- Recepción por productor día: ${dia} ${mes} ${anio}`;

    // Headers Productores
    const prodHeaders = ['Productor', 'Cajas Recepcion', 'Cajas devolución', 'Cajas Finales', 'Kilos Finales', 'Entregas'];
    prodHeaders.forEach((header, i) => {
      const cell = worksheet.getCell(productoresStartRow + 1, i + 8);
      cell.value = header;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Datos Productores
    let prodRow = productoresStartRow + 2;
    reportData.porProductor.forEach(prod => {
      worksheet.getCell(prodRow, 8).value = prod.nombre;
      worksheet.getCell(prodRow, 9).value = prod.cajasRecepcion;
      worksheet.getCell(prodRow, 10).value = prod.cajasDevolucion;
      worksheet.getCell(prodRow, 11).value = prod.cajasFinales;
      worksheet.getCell(prodRow, 12).value = prod.kilosFinales;
      worksheet.getCell(prodRow, 13).value = prod.entregas;
      prodRow++;
    });

    // Anchos de columna
    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 2; // Separador pequeño
    worksheet.getColumn(8).width = 35;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 12;
    worksheet.getColumn(12).width = 12;
    worksheet.getColumn(13).width = 10;
  }
}