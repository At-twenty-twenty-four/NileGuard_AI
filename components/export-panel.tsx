'use client';

import { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportManager, ExportFormat } from '@/lib/export';

interface ExportPanelProps {
  data: any[];
  title: string;
  formats?: ExportFormat[];
}

export function ExportPanel({ data, title, formats = ['csv', 'json'] }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      if (format === 'csv') {
        exportManager.exportToCSV(data, `${title}-${new Date().toISOString().split('T')[0]}.csv`);
      } else if (format === 'json') {
        exportManager.exportToJSON(data, `${title}-${new Date().toISOString().split('T')[0]}.json`);
      } else if (format === 'pdf') {
        exportManager.exportToPDF(data, title, `${title}-${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsOpen(false);
    } catch (error) {
      console.error('[v0] Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <FileText className="w-4 h-4" />;
      case 'json':
        return <FileJson className="w-4 h-4" />;
      case 'pdf':
        return <Download className="w-4 h-4" />;
    }
  };

  const getFormatLabel = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return 'CSV (Spreadsheet)';
      case 'json':
        return 'JSON (Data)';
      case 'pdf':
        return 'PDF (Report)';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        disabled={data.length === 0}
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-popover border border-border rounded-lg shadow-xl p-3 z-50">
          <h3 className="font-semibold text-sm mb-3">Export Format</h3>
          <div className="space-y-2">
            {formats.map((format) => (
              <Button
                key={format}
                onClick={() => handleExport(format)}
                disabled={isExporting}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="mr-2">{getFormatIcon(format)}</span>
                {getFormatLabel(format)}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 p-2 bg-muted rounded">
            Exporting {data.length} record{data.length !== 1 ? 's' : ''}...
          </p>
        </div>
      )}
    </div>
  );
}
