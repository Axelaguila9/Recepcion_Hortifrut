import html2canvas from 'html2canvas';
import type { ReportData } from '../types/reporte.tipos';

/**
 * Clase para generar y enviar reportes por correo
 */
export class ServicioEmail {
  
  /**
   * Genera imagen del reporte y prepara correo
   */
  static async sendReportByEmail(reportData: ReportData): Promise<void> {
    try {
      // 1. Crear contenedor HTML con el reporte
      const htmlContainer = this.createReportHTML(reportData);
      
      // 2. Agregar al DOM temporalmente
      document.body.appendChild(htmlContainer);
      
      // 3. Convertir a imagen usando html2canvas
      const canvas = await html2canvas(htmlContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      // 4. Copiar imagen al portapapeles
      await this.copyImageToClipboard(canvas);
      
      // 5. Abrir cliente de correo
      this.openEmailClient();
      
      // 6. Limpiar DOM
      document.body.removeChild(htmlContainer);
      
      // 7. Notificar al usuario
      alert('✅ Imagen copiada al portapapeles!\n\n📧 Se abrirá tu correo.\n📋 Haz Ctrl+V para pegar la imagen.');
      
    } catch (error) {
      console.error('Error al generar correo:', error);
      throw new Error('No se pudo generar el reporte para correo');
    }
  }

  /**
   * Copia la imagen del canvas al portapapeles
   */
  private static async copyImageToClipboard(canvas: HTMLCanvasElement): Promise<void> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('No se pudo generar la imagen'));
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve();
        } catch (err) {
          console.warn('No se pudo copiar al portapapeles:', err);
          resolve(); // No fallar si el clipboard no funciona
        }
      });
    });
  }

  /**
   * Abre el cliente de correo con asunto simple
   */
  private static openEmailClient(): void {
    const asunto = 'Reporte de Recepción la Cascada MX30';
    const mailtoLink = `mailto:?subject=${encodeURIComponent(asunto)}`;
    window.location.href = mailtoLink;
  }

  /**
   * Crea el HTML del reporte con estilos profesionales
   */
  private static createReportHTML(reportData: ReportData): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.background = 'white';
    container.style.padding = '40px';
    container.style.width = '1200px';
    
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${this.createHeaderHTML(reportData)}
        ${this.createSummaryHTML(reportData)}
        ${this.createTiempoOperativoHTML(reportData)}
        ${this.createEspecieHTML(reportData)}
        ${this.createSKUHTML(reportData)}
        ${this.createProductorHTML(reportData)}
      </div>
    `;
    
    return container;
  }

  /**
   * Genera HTML del encabezado
   */
  private static createHeaderHTML(reportData: ReportData): string {
    return `
      <h2 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">
        📊 Reporte de Recepción - Zarzamora
      </h2>

    `;
  }

  /**
   * Genera HTML del resumen
   */
  private static createSummaryHTML(reportData: ReportData): string {
    return `
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">📈 RESUMEN</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div><strong>Total Cajas:</strong> ${reportData.totalCajas.toLocaleString()}</div>
          <div><strong>Total Kilos:</strong> ${reportData.totalKilos.toLocaleString()}</div>
          <div><strong>Especies:</strong> ${reportData.porEspecie.length}</div>
          <div><strong>Productores:</strong> ${reportData.porProductor.length}</div>
        </div>
      </div>
    `;
  }

  /**
   * Genera HTML de la tabla de Tiempo Operativo
   */
  private static createTiempoOperativoHTML(reportData: ReportData): string {
    return `
      <h3 style="color: #374151; margin-top: 30px;">⏱️ 0- Tiempo operativo día (minutos):</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <thead style="background-color: #1f2937; color: white;">
          <tr>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Traslado</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Descarga</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Inspección</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Paletizado</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Prefrio</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Salvataje</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.traslado}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.descarga}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.inspeccion}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.paletizado}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.prefrio}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${reportData.tiempoOperativo.salvataje}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  /**
   * Genera HTML de la tabla por Especie
   */
  private static createEspecieHTML(reportData: ReportData): string {
    const rows = reportData.porEspecie.map((item, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${item.nombre}</strong></td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasRecepcion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasDevolucion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.kilosFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.entregas}</td>
      </tr>
    `).join('');

    return `
      <h3 style="color: #374151; margin-top: 30px;">🫐 1- Recepción por especie día:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <thead style="background-color: #1f2937; color: white;">
          <tr>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Especie</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Recepción</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Devolución</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Finales</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Kilos Finales</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Entregas</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  /**
   * Genera HTML de la tabla por SKU
   */
  private static createSKUHTML(reportData: ReportData): string {
    const rows = reportData.porSKU.map((item, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${item.nombre}</strong></td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasRecepcion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasDevolucion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.kilosFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.entregas}</td>
      </tr>
    `).join('');

    return `
      <h3 style="color: #374151; margin-top: 30px;">📦 2- Recepción por SKU día:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <thead style="background-color: #1f2937; color: white;">
          <tr>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">SKU</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Recepción</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Devolución</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Finales</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Kilos Finales</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Entregas</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  /**
   * Genera HTML de la tabla por Productor
   */
  private static createProductorHTML(reportData: ReportData): string {
    const rows = reportData.porProductor.map((item, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${item.nombre}</strong></td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasRecepcion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasDevolucion.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.cajasFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${item.kilosFinales.toLocaleString()}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.entregas}</td>
      </tr>
    `).join('');

    return `
      <h3 style="color: #374151; margin-top: 30px;">👨‍🌾 3- Recepción por productor día:</h3>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <thead style="background-color: #1f2937; color: white;">
          <tr>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Productor</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Recepción</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Devolución</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Cajas Finales</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Kilos Finales</th>
            <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Entregas</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
}