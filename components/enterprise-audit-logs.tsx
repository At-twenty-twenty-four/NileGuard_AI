'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Download, Filter, Search, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  resource: string;
  status: 'success' | 'failure';
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

interface EnterpriseAuditLogsProps {
  title?: string;
}

export function EnterpriseAuditLogs({ title = 'Enterprise Audit Logs' }: EnterpriseAuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;

  useEffect(() => {
    // Generate mock audit logs
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        action: 'user.login',
        actor: 'admin@company.com',
        resource: 'Authentication System',
        status: 'success',
        details: 'User successfully authenticated via MFA',
        ipAddress: '192.168.1.100',
        severity: 'info',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        action: 'threat.created',
        actor: 'analyst@company.com',
        resource: 'Threat Database',
        status: 'success',
        details: 'New threat entry CVE-2024-001 created',
        ipAddress: '192.168.1.101',
        severity: 'warning',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 23 * 60 * 1000),
        action: 'incident.escalated',
        actor: 'responder@company.com',
        resource: 'Incident Management',
        status: 'success',
        details: 'Incident INC-001 escalated to critical',
        ipAddress: '192.168.1.102',
        severity: 'critical',
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        action: 'user.failed_login',
        actor: 'unknown@external.com',
        resource: 'Authentication System',
        status: 'failure',
        details: 'Multiple failed login attempts detected',
        ipAddress: '203.0.113.50',
        severity: 'critical',
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        action: 'data.exported',
        actor: 'compliance@company.com',
        resource: 'Data Export',
        status: 'success',
        details: 'Compliance report exported as PDF',
        ipAddress: '192.168.1.105',
        severity: 'info',
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'policy.updated',
        actor: 'admin@company.com',
        resource: 'Security Policies',
        status: 'success',
        details: 'RBAC policy updated for analyst role',
        ipAddress: '192.168.1.100',
        severity: 'warning',
      },
      {
        id: '7',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        action: 'audit.accessed',
        actor: 'auditor@external.com',
        resource: 'Audit Logs',
        status: 'success',
        details: 'External auditor accessed audit logs',
        ipAddress: '198.51.100.20',
        severity: 'info',
      },
      {
        id: '8',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        action: 'compliance.checked',
        actor: 'system',
        resource: 'Compliance Engine',
        status: 'success',
        details: 'Automated compliance check completed',
        ipAddress: '127.0.0.1',
        severity: 'info',
      },
    ];

    setLogs(mockLogs);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.actor.includes(searchTerm) ||
          log.action.includes(searchTerm) ||
          log.details.includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((log) => log.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchTerm, severityFilter, statusFilter]);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'success'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Actor', 'Resource', 'Status', 'Details', 'IP Address', 'Severity'],
      ...filteredLogs.map((log) => [
        log.timestamp.toISOString(),
        log.action,
        log.actor,
        log.resource,
        log.status,
        log.details,
        log.ipAddress,
        log.severity,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Complete audit trail of all system actions for compliance and security monitoring
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="border border-border rounded-lg p-4 bg-card space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by actor, action, IP, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Export Button */}
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-1 border border-border rounded bg-background text-sm focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1 border border-border rounded bg-background text-sm focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold">{filteredLogs.length}</p>
          <p className="text-xs text-muted-foreground">Total Logs</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-green-600">
            {filteredLogs.filter((l) => l.status === 'success').length}
          </p>
          <p className="text-xs text-muted-foreground">Successful</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-red-600">
            {filteredLogs.filter((l) => l.status === 'failure').length}
          </p>
          <p className="text-xs text-muted-foreground">Failed</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-2xl font-bold text-orange-600">
            {filteredLogs.filter((l) => l.severity === 'critical').length}
          </p>
          <p className="text-xs text-muted-foreground">Critical Events</p>
        </div>
      </div>

      {/* Audit Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Actor</th>
                <th className="px-4 py-3 text-left font-semibold">Resource</th>
                <th className="px-4 py-3 text-left font-semibold">Details</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/50 transition">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-xs">{log.actor}</td>
                  <td className="px-4 py-3 text-xs">{log.resource}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs capitalize ${getStatusBadgeClass(log.status)}`}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs capitalize ${getSeverityBadgeClass(log.severity)}`}>
                      {log.severity}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
            {filteredLogs.length} logs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted border border-border'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
