import { useState, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export function useCodigoBarras() {
  const [imagenBarcode, setImagenBarcode] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generarCodigoBarras = (codigo: string) => {
    if (!codigo || !canvasRef.current) return false;

    try {
      JsBarcode(canvasRef.current, codigo, {
        format: 'CODE128',
        width: 4,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 5
      });

      const imagenUrl = canvasRef.current.toDataURL('image/png');
      setImagenBarcode(imagenUrl);
      return true;
    } catch (error) {
      console.error('Error generando código de barras:', error);
      return false;
    }
  };

  return {
    imagenBarcode,
    canvasRef,
    generarCodigoBarras
  };
}