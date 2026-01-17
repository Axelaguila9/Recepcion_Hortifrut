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
      const htmlContainer = this.createReportHTML(reportData);
      document.body.appendChild(htmlContainer);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(htmlContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      await this.copyImageToClipboard(canvas);
      document.body.removeChild(htmlContainer);
      this.openEmailClient();
      
      alert('✅ Imagen copiada al portapapeles!\n\n📧 Se abrirá tu correo.\n📋 Haz Ctrl+V para pegar la imagen.');
      
    } catch (error) {
      console.error('Error al generar correo:', error);
      throw new Error('No se pudo generar el reporte para correo');
    }
  }

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
          resolve();
        }
      });
    });
  }

  private static openEmailClient(): void {
    const asunto = 'Reporte de Recepción la Cascada MX30';
    
    const destinatariosPara = ['btacambaro2@hortifrut.com'].join(',');
    
    const destinatariosCC = [
      'msaucedo@hortifrut.com', 'layala@hortifrut.com', 'mariagaitanr@gmail.com',
      'vsosa@hortifrut.com', 'hmeza@hortifrut.com', 'imondragon@hortifrut.com',
      'jvargas@hortifrut.com', 'aatzimba@hortifrut.com', 'amiranda@hortifrut.com',
      'fgamino@hortifrut.com', 'jrosas@hortifrut.com', 'asereno@hortifrut.com',
      'jpenaloza@hortifrut.com', 'lramirez@hortifrut.com', 'lramirezm@hortifrut.com',
      'lceja@hortifrut.com'
    ].join(',');
    
    const mailtoLink = `mailto:${destinatariosPara}?subject=${encodeURIComponent(asunto)}&cc=${encodeURIComponent(destinatariosCC)}`;
    window.location.href = mailtoLink;
  }

  private static createReportHTML(reportData: ReportData): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = 'white';
    container.style.padding = '40px';
    container.style.width = '1200px';
    container.style.fontFamily = 'Arial, sans-serif';
    
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${this.createHeaderHTML()}
        ${this.createSummaryHTML(reportData)}
        ${this.createTiempoOperativoHTML(reportData)}
        ${this.createEspecieHTML(reportData)}
        ${this.createSKUHTML(reportData)}
        ${this.createProductorHTML(reportData)}
      </div>
    `;
    
    return container;
  }

  private static createHeaderHTML(): string {
    return `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin: 0;">
          📊 Reporte de Recepción - Zarzamora
        </h2>
      </div>
    `;
  }

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

  private static createTiempoOperativoHTML(reportData: ReportData): string {
    return `
      <h3 style="color: #374151; margin-top: 30px; margin-bottom: 15px;">⏱️ 0- Tiempo operativo día (minutos):</h3>
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

    // Calcular totales
    const totalRecepcion = reportData.porEspecie.reduce((sum, item) => sum + item.cajasRecepcion, 0);
    const totalDevolucion = reportData.porEspecie.reduce((sum, item) => sum + item.cajasDevolucion, 0);
    const totalFinales = reportData.porEspecie.reduce((sum, item) => sum + item.cajasFinales, 0);
    const totalKilos = reportData.porEspecie.reduce((sum, item) => sum + item.kilosFinales, 0);
    const totalEntregas = reportData.porEspecie.reduce((sum, item) => sum + item.entregas, 0);

    return `
      <h3 style="color: #374151; margin-top: 30px; margin-bottom: 15px;">🫐 1- Recepción por especie día:</h3>
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
        <tbody>
          ${rows}
          <tr style="background-color: #1f2937; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #ddd; color: white;"><strong>Total general</strong></td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalRecepcion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalDevolucion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalFinales.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalKilos.toLocaleString()}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: white;">${totalEntregas}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

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

    // Calcular totales
    const totalRecepcion = reportData.porSKU.reduce((sum, item) => sum + item.cajasRecepcion, 0);
    const totalDevolucion = reportData.porSKU.reduce((sum, item) => sum + item.cajasDevolucion, 0);
    const totalFinales = reportData.porSKU.reduce((sum, item) => sum + item.cajasFinales, 0);
    const totalKilos = reportData.porSKU.reduce((sum, item) => sum + item.kilosFinales, 0);
    const totalEntregas = reportData.porSKU.reduce((sum, item) => sum + item.entregas, 0);

    return `
      <h3 style="color: #374151; margin-top: 30px; margin-bottom: 15px;">📦 2- Recepción por SKU día:</h3>
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
        <tbody>
          ${rows}
          <tr style="background-color: #1f2937; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #ddd; color: white;"><strong>Total general</strong></td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalRecepcion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalDevolucion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalFinales.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalKilos.toLocaleString()}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: white;">${totalEntregas}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

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

    // Calcular totales
    const totalRecepcion = reportData.porProductor.reduce((sum, item) => sum + item.cajasRecepcion, 0);
    const totalDevolucion = reportData.porProductor.reduce((sum, item) => sum + item.cajasDevolucion, 0);
    const totalFinales = reportData.porProductor.reduce((sum, item) => sum + item.cajasFinales, 0);
    const totalKilos = reportData.porProductor.reduce((sum, item) => sum + item.kilosFinales, 0);
    const totalEntregas = reportData.porProductor.reduce((sum, item) => sum + item.entregas, 0);

    return `
      <h3 style="color: #374151; margin-top: 30px; margin-bottom: 15px;">👨‍🌾 3- Recepción por productor día:</h3>
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
        <tbody>
          ${rows}
          <tr style="background-color: #1f2937; font-weight: bold;">
            <td style="padding: 10px; border: 1px solid #ddd; color: white;"><strong>Total general</strong></td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalRecepcion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalDevolucion.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalFinales.toLocaleString()}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; color: white;">${totalKilos.toLocaleString()}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd; color: white;">${totalEntregas}</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}