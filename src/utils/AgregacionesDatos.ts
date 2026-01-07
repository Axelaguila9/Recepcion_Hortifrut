import type { ItemAgrupado, RecepcionRow } from '../types/reporte.tipos';

/**
 * Agrupa datos por una propiedad específica
 * @param data - Array de filas de recepción
 * @param propertyKey - Clave de la propiedad a agrupar
 * @param defaultName - Nombre por defecto si la propiedad es undefined
 * @returns Array de items agrupados y ordenados
 */
const agruparPorPropiedad = (
  data: RecepcionRow[],
  propertyKey: keyof RecepcionRow,
  defaultName: string
): ItemAgrupado[] => {
  const agrupado: Record<string, Omit<ItemAgrupado, 'nombre'>> = {};

  data.forEach(row => {
    const nombre = (row[propertyKey] as string) || defaultName;
    
    if (!agrupado[nombre]) {
      agrupado[nombre] = {
        cajasRecepcion: 0,
        cajasDevolucion: 0,
        cajasFinales: 0,
        kilosFinales: 0,
        entregas: 0
      };
    }

    agrupado[nombre].cajasRecepcion += row['Cajas Recepcion'] || 0;
    agrupado[nombre].cajasDevolucion += row['Cajas Recepcion Dev.'] || 0;
    agrupado[nombre].cajasFinales += row['Cajas Recepcion Final'] || 0;
    agrupado[nombre].kilosFinales += row['Kilos Recepcion Final'] || 0;
    agrupado[nombre].entregas += 1;
  });

  // Convertir a array y ordenar por cajas de recepción (descendente)
  return Object.entries(agrupado)
    .map(([nombre, datos]) => ({ nombre, ...datos }))
    .sort((a, b) => b.cajasRecepcion - a.cajasRecepcion);
};

/**
 * Agrupa datos por especie
 */
export const agruparPorEspecie = (data: RecepcionRow[]): ItemAgrupado[] => {
  return agruparPorPropiedad(data, 'Den. Especie', 'Sin clasificar');
};

/**
 * Agrupa datos por SKU
 */
export const agruparPorSKU = (data: RecepcionRow[]): ItemAgrupado[] => {
  return agruparPorPropiedad(data, 'Material', 'Sin SKU');
};

/**
 * Agrupa datos por productor
 */
export const agruparPorProductor = (data: RecepcionRow[]): ItemAgrupado[] => {
  return agruparPorPropiedad(data, 'Nombre Productor', 'Sin nombre');
};

/**
 * Calcula totales generales de cajas y kilos
 */
export const calcularTotales = (data: RecepcionRow[]) => {
  return {
    totalCajas: data.reduce((sum, row) => sum + (row['Cajas Recepcion Final'] || 0), 0),
    totalKilos: data.reduce((sum, row) => sum + (row['Kilos Recepcion Final'] || 0), 0)
  };
};