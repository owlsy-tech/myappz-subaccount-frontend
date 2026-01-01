/**
 * Performance Utility Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  performanceMonitor,
  PerformanceMonitor,
  measureExecutionTime,
  markPerformance,
  measurePerformance,
  logPerformance,
  detectPerformanceIssues,
} from '../performance';

// Unmock performance for its own tests
vi.unmock('../performance');

describe('Performance Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('PerformanceMonitor', () => {
    it('should create a new PerformanceMonitor instance', () => {
      const monitor = new PerformanceMonitor();
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it('should create with custom thresholds', () => {
      const customThresholds = {
        fcp: 2000,
        lcp: 3000,
        fid: 150,
        cls: 0.15,
      };
      const monitor = new PerformanceMonitor(customThresholds);
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it('should record custom metrics', () => {
      const monitor = new PerformanceMonitor();
      const metric = {
        name: 'test-metric',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
      };

      monitor.recordMetric(metric);
      const metrics = monitor.getMetrics();

      expect(metrics.length).toBeGreaterThan(0);
      expect(metrics[0]).toMatchObject(metric);
    });

    it('should get metrics by name', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordMetric({
        name: 'test-metric',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
      });
      monitor.recordMetric({
        name: 'other-metric',
        value: 200,
        unit: 'ms',
        timestamp: Date.now(),
      });

      const testMetrics = monitor.getMetricsByName('test-metric');
      expect(testMetrics.length).toBe(1);
      expect(testMetrics[0].name).toBe('test-metric');
    });

    it('should clear all metrics', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordMetric({
        name: 'test-metric',
        value: 100,
        unit: 'ms',
        timestamp: Date.now(),
      });

      expect(monitor.getMetrics().length).toBeGreaterThan(0);

      monitor.clearMetrics();
      expect(monitor.getMetrics().length).toBe(0);
    });

    it('should get memory usage', () => {
      const mockMemory = {
        usedJSHeapSize: 10000000,
        totalJSHeapSize: 20000000,
        jsHeapSizeLimit: 100000000,
      };

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true,
      });

      const monitor = new PerformanceMonitor();
      const memory = monitor.getMemoryUsage();

      expect(memory).toBeDefined();
      expect(memory?.usedJSHeapSize).toBe(mockMemory.usedJSHeapSize);
      expect(memory?.percentage).toBeGreaterThan(0);
    });

    it('should return null when memory API is not available', () => {
      Object.defineProperty(performance, 'memory', {
        value: undefined,
        configurable: true,
      });

      const monitor = new PerformanceMonitor();
      const memory = monitor.getMemoryUsage();

      expect(memory).toBeNull();
    });

    it('should get navigation timing', () => {
      const mockNavigationTiming = {
        name: 'navigation',
        entryType: 'navigation',
        startTime: 0,
        duration: 1000,
        responseStart: 100,
        requestStart: 50,
      };

      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockNavigationTiming as any]);

      const monitor = new PerformanceMonitor();
      const navigation = monitor.getNavigationTiming();

      expect(navigation).toBeDefined();
    });

    it('should return null when navigation timing is not available', () => {
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);

      const monitor = new PerformanceMonitor();
      const navigation = monitor.getNavigationTiming();

      expect(navigation).toBeNull();
    });

    it('should get resource timings', () => {
      const mockResourceTiming = {
        name: 'https://example.com/script.js',
        entryType: 'resource',
        startTime: 100,
        duration: 50,
        transferSize: 5000,
        initiatorType: 'script',
      };

      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockResourceTiming as any]);

      const monitor = new PerformanceMonitor();
      const resources = monitor.getResourceTimings();

      expect(resources.length).toBeGreaterThan(0);
      expect(resources[0].name).toBe(mockResourceTiming.name);
      expect(resources[0].type).toBe(mockResourceTiming.initiatorType);
    });

    it('should calculate TTFB', () => {
      const mockNavigationTiming = {
        responseStart: 150,
        requestStart: 100,
      };

      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockNavigationTiming as any]);

      const monitor = new PerformanceMonitor();
      const ttfb = monitor.getTTFB();

      expect(ttfb).toBe(50);
    });

    it('should return null TTFB when navigation timing is not available', () => {
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);

      const monitor = new PerformanceMonitor();
      const ttfb = monitor.getTTFB();

      expect(ttfb).toBeNull();
    });

    it('should return null TTFB in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const monitor = new PerformanceMonitor();
      const ttfb = monitor.getTTFB();

      expect(ttfb).toBeNull();

      global.window = originalWindow;
    });

    it('should return null FCP in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const monitor = new PerformanceMonitor();
      const fcp = monitor.getFCP();

      expect(fcp).toBeNull();

      global.window = originalWindow;
    });

    it('should return empty array for resource timings in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const monitor = new PerformanceMonitor();
      const resources = monitor.getResourceTimings();

      expect(resources).toEqual([]);

      global.window = originalWindow;
    });

    it('should return null for navigation timing in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const monitor = new PerformanceMonitor();
      const navigation = monitor.getNavigationTiming();

      expect(navigation).toBeNull();

      global.window = originalWindow;
    });

    it('should return null for memory usage in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const monitor = new PerformanceMonitor();
      const memory = monitor.getMemoryUsage();

      expect(memory).toBeNull();

      global.window = originalWindow;
    });

    it('should get FCP', () => {
      const mockPaintEntry = {
        name: 'first-contentful-paint',
        entryType: 'paint',
        startTime: 1500,
      };

      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockPaintEntry as any]);

      const monitor = new PerformanceMonitor();
      const fcp = monitor.getFCP();

      expect(fcp).toBe(1500);
    });

    it('should return null FCP when paint timing is not available', () => {
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);

      const monitor = new PerformanceMonitor();
      const fcp = monitor.getFCP();

      expect(fcp).toBeNull();
    });

    it('should generate performance report', () => {
      const monitor = new PerformanceMonitor();
      const report = monitor.generateReport();

      expect(report).toHaveProperty('webVitals');
      expect(report).toHaveProperty('memory');
      expect(report).toHaveProperty('navigation');
      expect(report).toHaveProperty('resources');
      expect(report).toHaveProperty('customMetrics');
    });

    it('should disconnect observers', () => {
      const monitor = new PerformanceMonitor();
      expect(() => monitor.disconnect()).not.toThrow();
    });

    it('should handle missing PerformanceObserver gracefully', () => {
      const originalPerformanceObserver = (global as any).PerformanceObserver;
      (global as any).PerformanceObserver = undefined;

      expect(() => new PerformanceMonitor()).not.toThrow();

      (global as any).PerformanceObserver = originalPerformanceObserver;
    });
  });

  describe('measureExecutionTime', () => {
    it('should measure sync function execution time', async () => {
      const syncFn = () => 'result';
      const { result, duration } = await measureExecutionTime('test-fn', syncFn);

      expect(result).toBe('result');
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should measure async function execution time', async () => {
      const asyncFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'async result';
      };

      const { result, duration } = await measureExecutionTime('test-async-fn', asyncFn);

      expect(result).toBe('async result');
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle function errors', async () => {
      const errorFn = () => {
        throw new Error('Test error');
      };

      await expect(measureExecutionTime('error-fn', errorFn)).rejects.toThrow('Test error');
    });
  });

  describe('markPerformance', () => {
    it('should mark performance timing', () => {
      const markSpy = vi.spyOn(performance, 'mark');
      markPerformance('test-mark');

      expect(markSpy).toHaveBeenCalledWith('test-mark');
    });

    it('should handle missing performance API', () => {
      const originalPerformance = global.performance;
      // @ts-ignore
      delete global.performance;

      expect(() => markPerformance('test-mark')).not.toThrow();

      global.performance = originalPerformance;
    });
  });

  describe('measurePerformance', () => {
    it('should measure between two marks', () => {
      const mockMeasure = {
        name: 'test-measure',
        duration: 100,
        entryType: 'measure',
        startTime: 0,
      };

      vi.spyOn(performance, 'measure').mockImplementation(() => {});
      vi.spyOn(performance, 'getEntriesByName').mockReturnValue([mockMeasure as any]);

      const duration = measurePerformance('test-measure', 'start-mark', 'end-mark');

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should return null when measurement fails', () => {
      vi.spyOn(performance, 'measure').mockImplementation(() => {
        throw new Error('Measurement failed');
      });

      const duration = measurePerformance('test-measure', 'invalid-start', 'invalid-end');

      expect(duration).toBeNull();
    });

    it('should return null when measure entry is not found', () => {
      vi.spyOn(performance, 'measure').mockImplementation(() => {});
      vi.spyOn(performance, 'getEntriesByName').mockReturnValue([]);

      const duration = measurePerformance('test-measure', 'start-mark', 'end-mark');

      expect(duration).toBeNull();
    });

    it('should handle missing performance API', () => {
      const originalPerformance = global.performance;
      // @ts-ignore
      delete global.performance;

      const duration = measurePerformance('test-measure', 'start', 'end');

      expect(duration).toBeNull();

      global.performance = originalPerformance;
    });

    it('should return duration when measure succeeds', () => {
      const mockMeasure = {
        name: 'test-measure',
        duration: 250.5,
        entryType: 'measure',
        startTime: 0,
      };

      vi.spyOn(performance, 'measure').mockImplementation(() => {});
      vi.spyOn(performance, 'getEntriesByName').mockReturnValue([mockMeasure as any]);

      const duration = measurePerformance('test-measure', 'start-mark', 'end-mark');

      expect(duration).toBe(250.5);
    });
  });

  describe('logPerformance', () => {
    it('should call logPerformance without errors', () => {
      const monitor = new PerformanceMonitor();
      expect(() => logPerformance(monitor)).not.toThrow();
    });
  });

  describe('detectPerformanceIssues', () => {
    it('should detect performance issues', () => {
      const monitor = new PerformanceMonitor();
      const issues = detectPerformanceIssues(monitor);

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should accept custom thresholds', () => {
      const monitor = new PerformanceMonitor();
      const customThresholds = {
        fcp: 3000,
      };

      const issues = detectPerformanceIssues(monitor, customThresholds);

      expect(Array.isArray(issues)).toBe(true);
    });

    it('should detect slow FCP', () => {
      const monitor = new PerformanceMonitor();
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { name: 'first-contentful-paint', startTime: 2000 } as any,
      ]);

      const issues = detectPerformanceIssues(monitor);
      const fcpIssue = issues.find((issue) => issue.includes('FCP'));

      expect(fcpIssue).toBeDefined();
    });

    it('should detect slow LCP', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordMetric({
        name: 'LCP',
        value: 3000,
        unit: 'ms',
        timestamp: Date.now(),
      });

      const issues = detectPerformanceIssues(monitor);
      const lcpIssue = issues.find((issue) => issue.includes('LCP'));

      expect(lcpIssue).toBeDefined();
    });

    it('should detect high FID', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordMetric({
        name: 'FID',
        value: 150,
        unit: 'ms',
        timestamp: Date.now(),
      });

      const issues = detectPerformanceIssues(monitor);
      const fidIssue = issues.find((issue) => issue.includes('FID'));

      expect(fidIssue).toBeDefined();
    });

    it('should detect high CLS', () => {
      const monitor = new PerformanceMonitor();
      monitor.recordMetric({
        name: 'CLS',
        value: 0.2,
        unit: 'score',
        timestamp: Date.now(),
      });

      const issues = detectPerformanceIssues(monitor);
      const clsIssue = issues.find((issue) => issue.includes('CLS'));

      expect(clsIssue).toBeDefined();
    });

    it('should detect slow TTFB', () => {
      const monitor = new PerformanceMonitor();
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { responseStart: 1000, requestStart: 100 } as any,
      ]);

      const issues = detectPerformanceIssues(monitor);
      const ttfbIssue = issues.find((issue) => issue.includes('TTFB'));

      expect(ttfbIssue).toBeDefined();
    });

    it('should detect high memory usage', () => {
      const monitor = new PerformanceMonitor();
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 85000000,
          totalJSHeapSize: 90000000,
          jsHeapSizeLimit: 100000000,
        },
        configurable: true,
      });

      const issues = detectPerformanceIssues(monitor);
      const memoryIssue = issues.find((issue) => issue.includes('memory'));

      expect(memoryIssue).toBeDefined();
    });

    it('should detect too many long tasks', () => {
      const monitor = new PerformanceMonitor();
      for (let i = 0; i < 15; i++) {
        monitor.recordMetric({
          name: 'LongTask',
          value: 100,
          unit: 'ms',
          timestamp: Date.now(),
        });
      }

      const issues = detectPerformanceIssues(monitor);
      const longTaskIssue = issues.find((issue) => issue.includes('long tasks'));

      expect(longTaskIssue).toBeDefined();
    });

    it('should not detect issues when metrics are within thresholds', () => {
      const monitor = new PerformanceMonitor();

      // Mock getEntriesByType to return empty arrays so FCP/TTFB won't be detected
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);

      // Mock memory to be low
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 50000000,
          totalJSHeapSize: 90000000,
          jsHeapSizeLimit: 100000000,
        },
        configurable: true,
      });

      monitor.recordMetric({
        name: 'LCP',
        value: 1000,
        unit: 'ms',
        timestamp: Date.now(),
      });
      monitor.recordMetric({
        name: 'FID',
        value: 50,
        unit: 'ms',
        timestamp: Date.now(),
      });
      monitor.recordMetric({
        name: 'CLS',
        value: 0.05,
        unit: 'score',
        timestamp: Date.now(),
      });

      const issues = detectPerformanceIssues(monitor);

      expect(issues.length).toBe(0);
    });

    it('should handle all issues at once', () => {
      const monitor = new PerformanceMonitor();

      // Add slow FCP
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        { name: 'first-contentful-paint', startTime: 2000 } as any,
        { responseStart: 1000, requestStart: 100 } as any,
      ]);

      // Add slow metrics
      monitor.recordMetric({
        name: 'LCP',
        value: 3000,
        unit: 'ms',
        timestamp: Date.now(),
      });
      monitor.recordMetric({
        name: 'FID',
        value: 150,
        unit: 'ms',
        timestamp: Date.now(),
      });
      monitor.recordMetric({
        name: 'CLS',
        value: 0.2,
        unit: 'score',
        timestamp: Date.now(),
      });

      // Add long tasks
      for (let i = 0; i < 15; i++) {
        monitor.recordMetric({
          name: 'LongTask',
          value: 100,
          unit: 'ms',
          timestamp: Date.now(),
        });
      }

      // Add high memory
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 85000000,
          totalJSHeapSize: 90000000,
          jsHeapSizeLimit: 100000000,
        },
        configurable: true,
      });

      const issues = detectPerformanceIssues(monitor);

      expect(issues.length).toBeGreaterThan(5);
    });
  });

  describe('Singleton performanceMonitor', () => {
    it('should export singleton instance', () => {
      expect(performanceMonitor).toBeDefined();
      expect(typeof performanceMonitor.recordMetric).toBe('function');
    });

    it('should be able to use singleton methods', () => {
      expect(() => {
        performanceMonitor.recordMetric({
          name: 'test',
          value: 100,
          unit: 'ms',
          timestamp: Date.now(),
        });
      }).not.toThrow();
    });
  });
});
