/**
 * Performance & Caching Optimization Layer
 * - In-memory caching with TTL
 * - Database query optimization
 * - API response caching
 * - Compression support
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
  hits: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  avgResponseTime: number;
}

/**
 * In-Memory Cache with TTL
 * Optimized for high-frequency access patterns
 */
export class CacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    totalResponseTime: 0,
    requestCount: 0,
  };

  set(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      hits: 0,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    entry.hits++;
    this.stats.hits++;
    return entry.data;
  }

  invalidate(pattern?: string): number {
    if (!pattern) {
      const size = this.cache.size;
      this.cache.clear();
      return size;
    }

    let removed = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        removed++;
      }
    }
    return removed;
  }

  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      totalEntries: this.cache.size,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      avgResponseTime: this.stats.requestCount > 0 ? this.stats.totalResponseTime / this.stats.requestCount : 0,
    };
  }

  recordMetric(responseTime: number): void {
    this.stats.totalResponseTime += responseTime;
    this.stats.requestCount++;
  }
}

/**
 * Query Result Caching
 * Caches database query results
 */
export class QueryCache {
  private cache: CacheManager;

  constructor() {
    this.cache = new CacheManager();
  }

  async withCache<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const startTime = performance.now();

    // Try to get from cache
    const cached = this.cache.get(key);
    if (cached !== null) {
      return cached as T;
    }

    // Execute query
    const result = await queryFn();

    // Cache the result
    this.cache.set(key, result, ttlSeconds);

    const responseTime = performance.now() - startTime;
    this.cache.recordMetric(responseTime);

    return result;
  }

  invalidate(pattern?: string): number {
    return this.cache.invalidate(pattern);
  }

  getStats() {
    return this.cache.getStats();
  }
}

/**
 * Response Compression
 */
export class CompressionOptimizer {
  static shouldCompress(size: number): boolean {
    return size > 1024; // Compress if > 1KB
  }

  static getOptimalChunkSize(dataSize: number): number {
    if (dataSize < 10 * 1024) return 4 * 1024; // 4KB chunks for small data
    if (dataSize < 100 * 1024) return 16 * 1024; // 16KB chunks for medium
    return 64 * 1024; // 64KB chunks for large
  }
}

/**
 * Database Query Optimization
 */
export class QueryOptimizer {
  static buildOptimizedQuery(baseQuery: string, filters: Record<string, any>): {
    query: string;
    params: any[];
  } {
    const params: any[] = [];
    let whereClause = '';

    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) continue;

      if (whereClause) whereClause += ' AND ';

      if (Array.isArray(value)) {
        whereClause += `${key} IN (${value.map(() => '?').join(',')})`;
        params.push(...value);
      } else if (typeof value === 'string' && value.includes('%')) {
        whereClause += `${key} LIKE ?`;
        params.push(value);
      } else {
        whereClause += `${key} = ?`;
        params.push(value);
      }
    }

    const query = whereClause ? `${baseQuery} WHERE ${whereClause}` : baseQuery;

    return { query, params };
  }

  static addIndexHints(table: string, columns: string[]): string {
    return `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_${table}_${columns.join('_')} ON ${table}(${columns.join(',')})`;
  }
}

/**
 * API Response Optimization
 */
export class ResponseOptimizer {
  static selectFields<T extends Record<string, any>>(
    data: T,
    fields: string[]
  ): Partial<T> {
    const result: Partial<T> = {};
    for (const field of fields) {
      if (field in data) {
        result[field as keyof T] = data[field];
      }
    }
    return result;
  }

  static paginateResults<T>(data: T[], page: number, limit: number): {
    data: T[];
    pagination: { page: number; limit: number; total: number; pages: number };
  } {
    const total = data.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: data.slice(start, end),
      pagination: { page, limit, total, pages },
    };
  }

  static compactResponse<T extends Record<string, any>>(data: T): any {
    const compact: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Skip null/undefined/empty values
      if (value === null || value === undefined) continue;
      if (typeof value === 'string' && value.length === 0) continue;
      if (Array.isArray(value) && value.length === 0) continue;

      compact[key] = value;
    }

    return compact;
  }
}

/**
 * Connection Pooling Configuration
 */
export interface PoolConfig {
  min: number;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

export const defaultPoolConfig: PoolConfig = {
  min: 5,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

/**
 * Performance Monitoring
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Keep only last 1000 measurements
    const data = this.metrics.get(name)!;
    if (data.length > 1000) {
      data.shift();
    }
  }

  getMetricStats(name: string): {
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
  } | null {
    const data = this.metrics.get(name);
    if (!data || data.length === 0) return null;

    const sorted = [...data].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = sorted.reduce((a, b) => a + b) / sorted.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return { min, max, avg, p95, p99 };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetricStats(name);
    }
    return result;
  }
}

// Export singletons
export const queryCache = new QueryCache();
export const performanceMonitor = new PerformanceMonitor();
