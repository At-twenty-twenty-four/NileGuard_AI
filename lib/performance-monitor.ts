export interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, any>;
}

export interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface PagePerformance {
  url: string;
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  interactionToNextPaint: number;
  timeToInteractive: number;
  timestamp: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private pagePerformanceData: PagePerformance[] = [];

  /**
   * Mark the start of a performance measurement
   */
  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  /**
   * Measure performance between two marks
   */
  measure(name: string, metadata?: Record<string, any>): PerformanceMetric | null {
    if (typeof performance === 'undefined') return null;

    try {
      performance.measure(name, `${name}-start`);
      const measure = performance.getEntriesByName(name)[0];

      const metric: PerformanceMetric = {
        name,
        duration: measure.duration,
        startTime: measure.startTime,
        endTime: measure.startTime + measure.duration,
        metadata,
      };

      this.metrics.push(metric);
      return metric;
    } catch (error) {
      console.error('[v0] Performance measurement error:', error);
      return null;
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics summary
   */
  getSummary(): {
    totalMetrics: number;
    averageDuration: number;
    slowestMetric: PerformanceMetric | null;
    fastestMetric: PerformanceMetric | null;
  } {
    if (this.metrics.length === 0) {
      return {
        totalMetrics: 0,
        averageDuration: 0,
        slowestMetric: null,
        fastestMetric: null,
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;
    const slowestMetric = this.metrics.reduce((prev, current) =>
      prev.duration > current.duration ? prev : current
    );
    const fastestMetric = this.metrics.reduce((prev, current) =>
      prev.duration < current.duration ? prev : current
    );

    return {
      totalMetrics: this.metrics.length,
      averageDuration,
      slowestMetric,
      fastestMetric,
    };
  }

  /**
   * Collect Web Vitals
   */
  collectWebVitals(): WebVital[] {
    if (typeof performance === 'undefined') return [];

    const vitals: WebVital[] = [];

    // First Contentful Paint (FCP)
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
    if (fcp) {
      vitals.push({
        name: 'FCP',
        value: fcp.startTime,
        rating: fcp.startTime < 1800 ? 'good' : fcp.startTime < 3000 ? 'needs-improvement' : 'poor',
      });
    }

    // Largest Contentful Paint (LCP)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lcp = lcpEntries[lcpEntries.length - 1].startTime;
      vitals.push({
        name: 'LCP',
        value: lcp,
        rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor',
      });
    }

    // Cumulative Layout Shift (CLS)
    const clsEntries = performance.getEntriesByType('layout-shift') as any[];
    let cls = 0;
    if (clsEntries.length > 0) {
      cls = clsEntries.reduce((sum, entry) => sum + (entry.hadRecentInput ? 0 : entry.value), 0);
      vitals.push({
        name: 'CLS',
        value: cls,
        rating: cls < 0.1 ? 'good' : cls < 0.25 ? 'needs-improvement' : 'poor',
      });
    }

    // Time to Interactive (TTI) - approximated
    if (performance.timing) {
      const tti = performance.timing.domInteractive - performance.timing.navigationStart;
      vitals.push({
        name: 'TTI',
        value: tti,
        rating: tti < 3800 ? 'good' : tti < 7300 ? 'needs-improvement' : 'poor',
      });
    }

    return vitals;
  }

  /**
   * Get page load performance data
   */
  getPagePerformance(): PagePerformance | null {
    if (typeof performance === 'undefined' || !performance.timing) return null;

    const timing = performance.timing;
    const navigation = performance.navigation;

    const pagePerf: PagePerformance = {
      url: window.location.href,
      loadTime: timing.loadEventEnd - timing.navigationStart,
      firstPaint: timing.responseStart - timing.navigationStart,
      firstContentfulPaint: 0, // Would need PerformanceObserver
      largestContentfulPaint: 0, // Would need PerformanceObserver
      cumulativeLayoutShift: 0, // Would need PerformanceObserver
      interactionToNextPaint: 0, // Would need PerformanceObserver
      timeToInteractive: timing.domInteractive - timing.navigationStart,
      timestamp: new Date().toISOString(),
    };

    this.pagePerformanceData.push(pagePerf);
    return pagePerf;
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    metrics: PerformanceMetric[];
    summary: ReturnType<PerformanceMonitor['getSummary']>;
    webVitals: WebVital[];
    pagePerformance: PagePerformance | null;
  } {
    return {
      metrics: this.getMetrics(),
      summary: this.getSummary(),
      webVitals: this.collectWebVitals(),
      pagePerformance: this.getPagePerformance(),
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.pagePerformanceData = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
