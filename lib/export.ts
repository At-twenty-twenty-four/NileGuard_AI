export type ExportFormat = 'csv' | 'json' | 'pdf';

export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  includeHeaders?: boolean;
  dateFormat?: 'ISO' | 'US' | 'EU';
}

class ExportManager {
  /**
   * Export data to CSV format
   */
  exportToCSV(
    data: any[],
    filename: string = 'export.csv',
    includeHeaders: boolean = true
  ): void {
    if (data.length === 0) {
      console.warn('[v0] No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    let csv = '';

    // Add headers if requested
    if (includeHeaders) {
      csv += headers.join(',') + '\n';
    }

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        let value = row[header];

        // Handle different data types
        if (value === null || value === undefined) {
          return '';
        }

        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }

        // Escape quotes and wrap in quotes if contains comma
        if (String(value).includes(',') || String(value).includes('"')) {
          value = `"${String(value).replace(/"/g, '""')}"`;
        }

        return value;
      });

      csv += values.join(',') + '\n';
    });

    // Download file
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Export data to JSON format
   */
  exportToJSON(data: any, filename: string = 'export.json'): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json;charset=utf-8;');
  }

  /**
   * Export table data to CSV
   */
  exportTableToCSV(
    tableElement: HTMLTableElement,
    filename: string = 'table.csv'
  ): void {
    let csv = '';
    const rows = tableElement.querySelectorAll('tr');

    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      const values = Array.from(cells)
        .map((cell) => {
          let text = cell.textContent?.trim() || '';
          // Escape quotes
          if (text.includes(',') || text.includes('"')) {
            text = `"${text.replace(/"/g, '""')}"`;
          }
          return text;
        });

      csv += values.join(',') + '\n';
    });

    this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Export to PDF (requires external library in production)
   * For MVP, generates downloadable text representation
   */
  exportToPDF(
    data: any,
    title: string = 'Report',
    filename: string = 'export.pdf'
  ): void {
    // For MVP, create a text file that can be printed as PDF
    let content = `${title}\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += '='.repeat(80) + '\n\n';

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        content += `Record ${index + 1}:\n`;
        Object.entries(item).forEach(([key, value]) => {
          content += `  ${key}: ${JSON.stringify(value)}\n`;
        });
        content += '\n';
      });
    } else {
      content += JSON.stringify(data, null, 2);
    }

    // In production, use jsPDF library
    if (this.isJsPDFAvailable()) {
      this.generatePDFWithJsPDF(data, title, filename);
    } else {
      // Fallback: download as text
      this.downloadFile(content, filename.replace('.pdf', '.txt'), 'text/plain;charset=utf-8;');
    }
  }

  /**
   * Generate PDF using jsPDF library (requires npm install jspdf)
   */
  private generatePDFWithJsPDF(data: any, title: string, filename: string): void {
    // This requires jsPDF to be installed
    console.warn(
      '[v0] jsPDF not available. Install with: npm install jspdf'
    );
    // Fallback to text export
    let content = `${title}\n${JSON.stringify(data, null, 2)}`;
    this.downloadFile(content, filename.replace('.pdf', '.txt'), 'text/plain;charset=utf-8;');
  }

  /**
   * Check if jsPDF is available
   */
  private isJsPDFAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof (window as any).jsPDF !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * Download file to user's device
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    if (typeof window === 'undefined') return;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:${mimeType}base64,${btoa(unescape(encodeURIComponent(content)))}`
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /**
   * Generate comprehensive report
   */
  generateReport(
    data: any[],
    reportTitle: string,
    options: {
      format: ExportFormat;
      includeStats?: boolean;
      includeSummary?: boolean;
      dateRange?: { start: string; end: string };
    }
  ): void {
    let reportData = data;

    if (options.includeStats) {
      const stats = this.calculateStats(data);
      reportData = [{ ...stats, '_report_type': 'statistics' }, ...data];
    }

    const filename = `${reportTitle}-${new Date().toISOString().split('T')[0]}.${options.format}`;

    switch (options.format) {
      case 'csv':
        this.exportToCSV(reportData, filename);
        break;
      case 'json':
        this.exportToJSON(
          {
            title: reportTitle,
            generatedAt: new Date().toISOString(),
            dateRange: options.dateRange,
            data: reportData,
          },
          filename
        );
        break;
      case 'pdf':
        this.exportToPDF(reportData, reportTitle, filename);
        break;
    }
  }

  /**
   * Calculate statistics from data
   */
  private calculateStats(data: any[]): Record<string, any> {
    if (data.length === 0) return {};

    const stats: Record<string, any> = {
      totalRecords: data.length,
      exportedAt: new Date().toISOString(),
    };

    // Analyze first item for numeric fields
    const firstItem = data[0];
    Object.keys(firstItem).forEach((key) => {
      const values = data
        .map((item) => item[key])
        .filter((val) => typeof val === 'number');

      if (values.length > 0) {
        stats[`${key}_min`] = Math.min(...values);
        stats[`${key}_max`] = Math.max(...values);
        stats[`${key}_avg`] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
      }
    });

    return stats;
  }

  /**
   * Export filtered results
   */
  exportFiltered(
    filteredData: any[],
    title: string,
    format: ExportFormat = 'csv'
  ): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${title}-${timestamp}.${format}`;

    this.generateReport(filteredData, title, {
      format,
      includeStats: true,
      includeSummary: true,
    });
  }
}

export const exportManager = new ExportManager();
