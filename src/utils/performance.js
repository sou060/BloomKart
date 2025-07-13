// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  // Track page load performance
  trackPageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      this.metrics.pageLoad = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      };

      console.log('Page Load Performance:', this.metrics.pageLoad);
    }
  }

  // Track component render performance
  trackComponentRender(componentName, startTime) {
    const renderTime = performance.now() - startTime;
    
    if (!this.metrics.components) {
      this.metrics.components = {};
    }
    
    if (!this.metrics.components[componentName]) {
      this.metrics.components[componentName] = [];
    }
    
    this.metrics.components[componentName].push(renderTime);
    
    // Keep only last 10 measurements
    if (this.metrics.components[componentName].length > 10) {
      this.metrics.components[componentName].shift();
    }
    
    console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms');
  }

  // Track API call performance
  trackApiCall(url, startTime, endTime) {
    const duration = endTime - startTime;
    
    if (!this.metrics.apiCalls) {
      this.metrics.apiCalls = {};
    }
    
    if (!this.metrics.apiCalls[url]) {
      this.metrics.apiCalls[url] = [];
    }
    
    this.metrics.apiCalls[url].push(duration);
    
    // Keep only last 10 measurements
    if (this.metrics.apiCalls[url].length > 10) {
      this.metrics.apiCalls[url].shift();
    }
    
    console.log(`API call to ${url}:`, duration.toFixed(2), 'ms');
  }

  // Track memory usage
  trackMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = performance.memory;
      this.metrics.memory = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
      
      console.log('Memory Usage:', this.metrics.memory);
    }
  }

  // Get performance report
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
    };
  }

  // Export metrics
  exportMetrics() {
    const report = this.getReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Monitor long tasks
  startLongTaskMonitoring() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceMonitor.trackPageLoad();
    performanceMonitor.startLongTaskMonitoring();
    
    // Track memory usage periodically
    setInterval(() => {
      performanceMonitor.trackMemoryUsage();
    }, 30000); // Every 30 seconds
  });
}

export default performanceMonitor;