export function imprimirEtiqueta(imagenBarcode: string, titulo?: string) {
  if (!imagenBarcode) return;

  const ventana = window.open('', '_blank', 'width=800,height=600');

  if (ventana) {
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Imprimir Etiqueta</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .etiqueta {
            text-align: center;
            padding: 5mm;
          }
          .titulo {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #000;
          }
          img {
            max-width: 95%;
            height: auto;
          }
          @media print {
            @page {
              size: 100mm 52mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .etiqueta {
              width: 100mm;
              height: 52mm;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 3mm;
            }
            .titulo {
              font-size: 30px;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            img {
              max-width: 95mm;
              max-height: 40mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="etiqueta">
          ${titulo ? `<div class="titulo">${titulo}</div>` : ''}
          <img src="${imagenBarcode}" alt="Código de barras">
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    ventana.document.close();
  }
}