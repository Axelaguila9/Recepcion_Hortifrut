export interface FileState {
  huella: File | null;
  recepcion: File | null;
  pallets: File | null;
}

export interface TiempoOperativo {
  traslado: string;
  descarga: string;
  inspeccion: string;
  paletizado: string;
  prefrio: string;
  salvataje: string;
}

export interface ItemAgrupado {
  nombre: string;
  cajasRecepcion: number;
  cajasDevolucion: number;
  cajasFinales: number;
  kilosFinales: number;
  entregas: number;
}

export interface ReportData {
  fecha: string;
  tiempoOperativo: TiempoOperativo;
  porEspecie: ItemAgrupado[];
  porSKU: ItemAgrupado[];
  porProductor: ItemAgrupado[];
  totalCajas: number;
  totalKilos: number;
  huellaDataCruda?: HuellaRow[];
  recepcionDataCruda?: RecepcionRow[];
}

// Tipos para datos crudos de Excel

export interface HuellaRow {
  'Lote'?: string;
  'Fecha de Cosecha'?: any;
  'Fecha Fin Prefrio'?: any;
  'Hora Huerto'?: any;
  'Hora Inicio Cosecha'?: any;
  'Hora Recepción en Co'?: any;
  'Hora Inicio de Inspe'?: any;
  'Hora Fin Rev. Calida'?: any;
  'Hora Inicio PreFrio'?: any;
  'Hora Fin PreFrio'?: any;
  'Hora Fin Reembalado'?: any;
  'Hora Inicio Reembala'?: any;
  'Lote Reembalado'?: string;
  // Permitir cualquier otra propiedad
  [key: string]: any;
}

export interface RecepcionRow {
  'Productor'?: string;
  'Nombre Productor'?: string;
  'Fecha Contabilizacion'?: any;
  'Centro'?: string;
  'Den. centro'?: string;
  'Material'?: string;
  'Denominacion Material'?: string;
  'Lote'?: string;
  'Cajas Recepcion'?: number;
  'Kilos Recepcion'?: number;
  'Cajas Recepcion Dev.'?: number;
  'Kilos Recepcion Dev.'?: number;
  'Cajas Recepcion Final'?: number;
  'Kilos Recepcion Final'?: number;
  'Codigo Variedad'?: string;
  'Variedad'?: string;
  'Fecha Embalaje'?: any;
  'Den. Especie'?: string;
  'Den. Manejo'?: string;
  'Tipo Caja'?: string;
  'Tipo Etiqueta'?: string;
  'Tipo Tecnología'?: string;
  'Den. Tipo Formato'?: string;
  'HUERTO'?: string;
  'SECTOR'?: string;
  // Permitir cualquier otra propiedad
  [key: string]: any;
}