'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CVEFilter, ThreatFilter, IncidentFilter } from '@/lib/filters';

interface AdvancedFilterPanelProps {
  filterType: 'cve' | 'threat' | 'incident';
  onApplyFilter: (filter: CVEFilter | ThreatFilter | IncidentFilter) => void;
  onClearFilter: () => void;
}

export function AdvancedFilterPanel({ filterType, onApplyFilter, onClearFilter }: AdvancedFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilter();
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  ).length;

  const renderCVEFilters = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">CVSS Score Range</label>
        <div className="flex gap-2 mt-1">
          <Input
            type="number"
            placeholder="Min"
            value={filters.cvssScoreMin || ''}
            onChange={(e) => handleFilterChange('cvssScoreMin', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.cvssScoreMax || ''}
            onChange={(e) => handleFilterChange('cvssScoreMax', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-24"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Severity</label>
        <select
          value={filters.severity || ''}
          onChange={(e) => handleFilterChange('severity', e.target.value || undefined)}
          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="flex gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.isExploited || false}
            onChange={(e) => handleFilterChange('isExploited', e.target.checked || undefined)}
          />
          Exploited Only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.isZeroDay || false}
            onChange={(e) => handleFilterChange('isZeroDay', e.target.checked || undefined)}
          />
          Zero-Day Only
        </label>
      </div>

      <div>
        <label className="text-sm font-medium">Date Range</label>
        <div className="flex gap-2 mt-1">
          <Input
            type="date"
            value={filters.dateRangeStart || ''}
            onChange={(e) => handleFilterChange('dateRangeStart', e.target.value || undefined)}
            className="flex-1"
          />
          <Input
            type="date"
            value={filters.dateRangeEnd || ''}
            onChange={(e) => handleFilterChange('dateRangeEnd', e.target.value || undefined)}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Keyword Search</label>
        <Input
          type="text"
          placeholder="Search CVE ID, title, description..."
          value={filters.keyword || ''}
          onChange={(e) => handleFilterChange('keyword', e.target.value || undefined)}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderThreatFilters = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Actor Name</label>
        <Input
          type="text"
          placeholder="Search threat actor..."
          value={filters.actorName || ''}
          onChange={(e) => handleFilterChange('actorName', e.target.value || undefined)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Threat Level</label>
        <select
          value={filters.threatLevel || ''}
          onChange={(e) => handleFilterChange('threatLevel', e.target.value || undefined)}
          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Country</label>
        <Input
          type="text"
          placeholder="e.g., Russia, China, Iran..."
          value={filters.country || ''}
          onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Recent Activity (Days)</label>
        <Input
          type="number"
          placeholder="30"
          value={filters.recentActivityDays || ''}
          onChange={(e) => handleFilterChange('recentActivityDays', e.target.value ? parseInt(e.target.value) : undefined)}
          className="mt-1"
        />
      </div>
    </div>
  );

  const renderIncidentFilters = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="contained">Contained</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Severity</label>
        <select
          value={filters.severity || ''}
          onChange={(e) => handleFilterChange('severity', e.target.value || undefined)}
          className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="">All</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Date Range</label>
        <div className="flex gap-2 mt-1">
          <Input
            type="date"
            value={filters.dateRangeStart || ''}
            onChange={(e) => handleFilterChange('dateRangeStart', e.target.value || undefined)}
            className="flex-1"
          />
          <Input
            type="date"
            value={filters.dateRangeEnd || ''}
            onChange={(e) => handleFilterChange('dateRangeEnd', e.target.value || undefined)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Advanced Filters
        {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount}</Badge>}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-popover border border-border rounded-lg shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Advanced Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filterType === 'cve' && renderCVEFilters()}
            {filterType === 'threat' && renderThreatFilters()}
            {filterType === 'incident' && renderIncidentFilters()}
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button onClick={handleApply} className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">
              Apply Filters
            </Button>
            <Button onClick={handleClear} variant="outline" className="flex-1">
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
