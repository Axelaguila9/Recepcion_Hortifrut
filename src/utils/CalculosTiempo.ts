/**
 * Convierte tiempos de Excel a minutos
 * @param time1 - Tiempo inicial (string "HH:MM:SS" o número decimal de Excel)
 * @param time2 - Tiempo final (string "HH:MM:SS" o número decimal de Excel)
 * @returns Diferencia en minutos
 */
export const convertExcelTimeToMinutes = (time1: any, time2: any): number => {
  if (!time1 || !time2) return 0;
  
  // Función auxiliar para convertir string de hora a minutos desde medianoche
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 60 + minutes + (seconds / 60);
  };
  
  // Si son strings en formato "HH:MM:SS"
  if (typeof time1 === 'string' && typeof time2 === 'string') {
    const min1 = timeToMinutes(time1);
    const min2 = timeToMinutes(time2);
    return min2 - min1;
  }
  
  // Si son números de Excel (fracción de día: 0.5 = 12:00 PM)
  const diff = (time2 - time1) * 24 * 60;
  return diff;
};

/**
 * Calcula el promedio de un array de números, filtrando valores inválidos
 * @param valores - Array de valores numéricos
 * @returns Promedio redondeado a 1 decimal
 */
export const calcularPromedio = (valores: number[]): string => {
  // ✅ Quitamos el filtro v > 0 para aceptar negativos
  const validos = valores.filter(v => v !== null && !isNaN(v));
  
  if (validos.length === 0) return '0.0';
  
  const promedio = validos.reduce((sum, val) => sum + val, 0) / validos.length;
  return promedio.toFixed(7);
};

/**
 * Valida que un valor de tiempo esté dentro de rangos razonables
 * @param minutos - Valor en minutos
 * @param max - Máximo permitido (por defecto 24 horas)
 * @returns true si es válido
 */
export const esValorTiempoValido = (minutos: number, max: number = 1440): boolean => {
  return minutos > 0 && minutos < max;
};

/**
 * Ajusta tiempos negativos sumando 24 horas (para cruces de medianoche)
 * @param minutos - Valor en minutos (puede ser negativo)
 * @returns Minutos ajustados
 */
export const ajustarTiempoNegativo = (minutos: number): number => {
  return minutos < 0 ? minutos + (24 * 60) : minutos;
};