/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export {
  usePerformanceMonitor,
  useAsyncPerformance,
  useLifecycleTiming,
  useRenderProfiler,
  usePerformanceMetrics,
} from './usePerformanceMonitor';

export type { IPerformanceData, IUsePerformanceMonitorOptions } from './usePerformanceMonitor';

export {
  useMemoryLeakDetector,
  useTrackedTimeout,
  useTrackedInterval,
  useTrackedEventListener,
  useDetachedDOMDetector,
} from './useMemoryLeakDetector';

export type { IMemoryLeakWarning, IMemoryLeakDetectorOptions } from './useMemoryLeakDetector';
