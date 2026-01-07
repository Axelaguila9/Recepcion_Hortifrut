import { useState } from 'react';
import Header from '../components/Header';
import { useCodigoBarras } from '../utils/CodigoBarras';
import { imprimirEtiqueta } from '../utils/imprimirEtiqueta';

function Sku() {
  const [nombreFruto, setNombreFruto] = useState('');
  const [codigoSku, setCodigoSku] = useState('');
  const { imagenBarcode, canvasRef, generarCodigoBarras } = useCodigoBarras();

  const handleImprimir = () => {
    if (!codigoSku.trim()) {
      alert('Por favor ingrese un código SKU');
      return;
    }

    const exito = generarCodigoBarras(codigoSku);
    
    if (exito) {
      // Esperar un momento para que se genere la imagen
      setTimeout(() => {
        imprimirEtiqueta(imagenBarcode, nombreFruto);
      }, 100);
    } else {
      alert('Error al generar el código de barras');
    }
  };

  return (
    <>
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl shadow-black/50">
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">GENERAR CÓDIGO</h1>
          </div>

          <div className="mb-6">
            <input type="text"
              value={nombreFruto}
              onChange={(e) => setNombreFruto(e.target.value)}
              placeholder="Nombre del fruto..."
              className="w-full px-4 py-3 border-2 border-blue-400 rounded bg-white text-black font-bold placeholder-gray-400"
            />
          </div>

          <div className="mb-8">
            <input type="text"
              value={codigoSku}
              onChange={(e) => setCodigoSku(e.target.value.toUpperCase())}
              placeholder="Codigo SKU"
              className="w-full px-4 py-3 border-2 border-blue-400 rounded bg-white text-black font-bold placeholder-gray-400"
            />
          </div>

          <button 
            onClick={handleImprimir}
            className="w-full bg-emerald-400 hover:bg-emerald-700 text-black hover:text-white font-bold py-3 rounded transition-colors"
          >
            IMPRIMIR
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </>
  );
}

export default Sku;
