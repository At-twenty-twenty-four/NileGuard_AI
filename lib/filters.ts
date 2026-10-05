export interface FilterCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between';
  value: any;
}

export interface CVEFilter {
  cvssScoreMin?: number;
  cvssScoreMax?: number;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  isExploited?: boolean;
  isZeroDay?: boolean;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  keyword?: string;
  status?: 'open' | 'patched' | 'mitigated';
  affectedSystems?: string[];
  sortBy?: 'cvss' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface ThreatFilter {
  actorName?: string;
  threatLevel?: 'critical' | 'high' | 'medium' | 'low';
  country?: string;
  knownTTPs?: string[];
  recentActivityDays?: number;
  targetIndustry?: string;
  sortBy?: 'activityDate' | 'threatLevel' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface IncidentFilter {
  status?: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  dateRangeStart?: string;
  dateRangeEnd?: string;
  assignedTo?: string;
  affectedAssets?: string[];
  incidentType?: string;
  sortBy?: 'createdDate' | 'severity' | 'status';
  sortOrder?: 'asc' | 'desc';
}

class FilterEngine {
  /**
   * Apply CVE filters to CVE data
   */
  applyCVEFilter(cves: any[], filter: CVEFilter): any[] {
    let filtered = [...cves];

    // CVSS Score filtering
    if (filter.cvssScoreMin !== undefined) {
      filtered = filtered.filter((cve) => cve.cvss >= filter.cvssScoreMin!);
    }
    if (filter.cvssScoreMax !== undefined) {
      filtered = filtered.filter((cve) => cve.cvss <= filter.cvssScoreMax!);
    }

    // Severity filtering
    if (filter.severity) {
      const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      const minSeverityScore = severityMap[filter.severity];
      filtered = filtered.filter((cve) => {
        const cveSeverityScore = severityMap[cve.severity as keyof typeof severityMap] || 0;
        return cveSeverityScore >= minSeverityScore;
      });
    }

    // Exploited filter
    if (filter.isExploited) {
      filtered = filtered.filter((cve) => cve.isExploited === true);
    }

    // Zero-day filter
    if (filter.isZeroDay) {
      filtered = filtered.filter((cve) => cve.isZeroDay === true);
    }

    // Date range filtering
    if (filter.dateRangeStart) {
      const startDate = new Date(filter.dateRangeStart);
      filtered = filtered.filter((cve) => new Date(cve.publishedDate) >= startDate);
    }
    if (filter.dateRangeEnd) {
      const endDate = new Date(filter.dateRangeEnd);
      filtered = filtered.filter((cve) => new Date(cve.publishedDate) <= endDate);
    }

    // Keyword search
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      filtered = filtered.filter((cve) => {
        return (
          cve.id.toLowerCase().includes(keyword) ||
          cve.title.toLowerCase().includes(keyword) ||
          cve.description.toLowerCase().includes(keyword)
        );
      });
    }

    // Status filtering
    if (filter.status) {
      filtered = filtered.filter((cve) => cve.status === filter.status);
    }

    // Affected systems filtering
    if (filter.affectedSystems && filter.affectedSystems.length > 0) {
      filtered = filtered.filter((cve) =>
        filter.affectedSystems!.some((sys) =>
          cve.affectedProducts?.some((prod: string) => prod.includes(sys))
        )
      );
    }

    // Sorting
    if (filter.sortBy) {
      const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        let aVal, bVal;

        switch (filter.sortBy) {
          case 'cvss':
            aVal = a.cvss;
            bVal = b.cvss;
            break;
          case 'date':
            aVal = new Date(a.publishedDate).getTime();
            bVal = new Date(b.publishedDate).getTime();
            break;
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
          default:
            return 0;
        }

        if (typeof aVal === 'string') aVal = aVal.localeCompare(bVal);
        else aVal = aVal - bVal;

        return aVal * sortOrder;
      });
    }

    return filtered;
  }

  /**
   * Apply threat filters to threat data
   */
  applyThreatFilter(threats: any[], filter: ThreatFilter): any[] {
    let filtered = [...threats];

    // Actor name filtering
    if (filter.actorName) {
      const keyword = filter.actorName.toLowerCase();
      filtered = filtered.filter((threat) => threat.name.toLowerCase().includes(keyword));
    }

    // Threat level filtering
    if (filter.threatLevel) {
      const levelMap = { critical: 4, high: 3, medium: 2, low: 1 };
      const minLevel = levelMap[filter.threatLevel];
      filtered = filtered.filter((threat) => {
        const threatLevel = levelMap[threat.threatLevel as keyof typeof levelMap] || 0;
        return threatLevel >= minLevel;
      });
    }

    // Country filtering
    if (filter.country) {
      filtered = filtered.filter((threat) => threat.country === filter.country);
    }

    // Known TTPs filtering
    if (filter.knownTTPs && filter.knownTTPs.length > 0) {
      filtered = filtered.filter((threat) =>
        filter.knownTTPs!.some((ttp) =>
          threat.knownTTPs?.some((t: string) => t.toLowerCase().includes(ttp.toLowerCase()))
        )
      );
    }

    // Recent activity filtering
    if (filter.recentActivityDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filter.recentActivityDays);
      filtered = filtered.filter(
        (threat) => new Date(threat.lastSeen) >= cutoffDate
      );
    }

    // Target industry filtering
    if (filter.targetIndustry) {
      filtered = filtered.filter((threat) => threat.targetIndustry === filter.targetIndustry);
    }

    // Sorting
    if (filter.sortBy) {
      const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        let aVal, bVal;

        switch (filter.sortBy) {
          case 'activityDate':
            aVal = new Date(a.lastSeen).getTime();
            bVal = new Date(b.lastSeen).getTime();
            break;
          case 'threatLevel':
            aVal = a.threatLevel;
            bVal = b.threatLevel;
            break;
          case 'name':
            aVal = a.name.localeCompare(b.name);
            bVal = 0;
            break;
          default:
            return 0;
        }

        return (aVal - bVal) * sortOrder;
      });
    }

    return filtered;
  }

  /**
   * Apply incident filters
   */
  applyIncidentFilter(incidents: any[], filter: IncidentFilter): any[] {
    let filtered = [...incidents];

    // Status filtering
    if (filter.status) {
      filtered = filtered.filter((incident) => incident.status === filter.status);
    }

    // Severity filtering
    if (filter.severity) {
      const severityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      const minSeverity = severityMap[filter.severity];
      filtered = filtered.filter((incident) => {
        const incidentSeverity = severityMap[incident.severity as keyof typeof severityMap] || 0;
        return incidentSeverity >= minSeverity;
      });
    }

    // Date range filtering
    if (filter.dateRangeStart) {
      const startDate = new Date(filter.dateRangeStart);
      filtered = filtered.filter((incident) => new Date(incident.createdDate) >= startDate);
    }
    if (filter.dateRangeEnd) {
      const endDate = new Date(filter.dateRangeEnd);
      filtered = filtered.filter((incident) => new Date(incident.createdDate) <= endDate);
    }

    // Assigned to filtering
    if (filter.assignedTo) {
      filtered = filtered.filter((incident) => incident.assignedTo === filter.assignedTo);
    }

    // Affected assets filtering
    if (filter.affectedAssets && filter.affectedAssets.length > 0) {
      filtered = filtered.filter((incident) =>
        filter.affectedAssets!.some((asset) =>
          incident.affectedAssets?.some((a: string) => a.includes(asset))
        )
      );
    }

    // Incident type filtering
    if (filter.incidentType) {
      filtered = filtered.filter((incident) => incident.type === filter.incidentType);
    }

    // Sorting
    if (filter.sortBy) {
      const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        let aVal, bVal;

        switch (filter.sortBy) {
          case 'createdDate':
            aVal = new Date(a.createdDate).getTime();
            bVal = new Date(b.createdDate).getTime();
            break;
          case 'severity':
            aVal = a.severity;
            bVal = b.severity;
            break;
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
          default:
            return 0;
        }

        if (typeof aVal === 'string') aVal = aVal.localeCompare(bVal);
        else aVal = aVal - bVal;

        return aVal * sortOrder;
      });
    }

    return filtered;
  }

  /**
   * Build filter query string
   */
  buildQueryString(filter: CVEFilter | ThreatFilter | IncidentFilter): string {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return params.toString();
  }
}

export const filterEngine = new FilterEngine();
