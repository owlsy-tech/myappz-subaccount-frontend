/**
 * Performance Monitor Component
 * Visual display of performance metrics and memory usage during development
 */

import { memo, useState, useEffect } from 'react';

import { usePerformanceMetrics } from '../../hooks';
import { detectPerformanceIssues, performanceMonitor } from '../../utils/performance';

interface IPerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}

interface IMetricRowProps {
  label: string;
  value: number | null;
  unit: string;
  status: { color: string; text: string };
  decimals?: number;
}

const MetricRow = memo(({ label, value, unit, status, decimals = 2 }: IMetricRowProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>{label}:</span>
    <span>
      <span style={{ color: status.color, fontWeight: 'bold' }}>
        {value !== null ? value.toFixed(decimals) : 'N/A'}
      </span>
      {value !== null && unit && <span style={{ opacity: 0.6 }}> {unit}</span>}
      <span style={{ marginLeft: '0.5rem', fontSize: '10px', opacity: 0.6 }}>({status.text})</span>
    </span>
  </div>
));

MetricRow.displayName = 'MetricRow';

const PerformanceMonitor = ({
  position = 'bottom-right',
  minimized: initialMinimized = false,
}: IPerformanceMonitorProps) => {
  const { metrics, memory, report } = usePerformanceMetrics();
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const detectedIssues = detectPerformanceIssues(performanceMonitor);
    setIssues(detectedIssues);
  }, [metrics]);

  // Only show in development
  if (import.meta.env.VITE_ENV !== 'development') {
    return null;
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '1rem', left: '1rem' },
    'top-right': { top: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#fff',
    padding: isMinimized ? '0.5rem 1rem' : '1rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
    fontSize: '12px',
    fontFamily: 'monospace',
    maxWidth: isMinimized ? 'auto' : '320px',
    minWidth: isMinimized ? 'auto' : '280px',
    transition: 'all 0.3s ease',
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (isMinimized) {
    return (
      <div style={containerStyle}>
        <button
          onClick={toggleMinimize}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 0,
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
          type="button"
          aria-label="Expand performance monitor"
        >
          📊 Performance Monitor
        </button>
      </div>
    );
  }

  const getMemoryStatus = (): { color: string; text: string } | string => {
    if (!memory) return 'N/A';
    const { percentage } = memory;
    if (percentage > 85) return { color: '#f56565', text: 'High' };
    if (percentage > 60) return { color: '#ed8936', text: 'Medium' };
    return { color: '#48bb78', text: 'Normal' };
  };

  const getMetricStatus = (
    value: number | null,
    threshold: number
  ): { color: string; text: string } => {
    if (value === null) return { color: '#a0aec0', text: 'N/A' };
    if (value <= threshold) return { color: '#48bb78', text: 'Good' };
    if (value <= threshold * 1.5) return { color: '#ed8936', text: 'Fair' };
    return { color: '#f56565', text: 'Poor' };
  };

  const memoryStatusResult = getMemoryStatus();
  const memoryStatus =
    typeof memoryStatusResult === 'string'
      ? { color: '#a0aec0', text: memoryStatusResult }
      : memoryStatusResult;
  const fcpStatus = getMetricStatus(report.webVitals['fcp'] ?? null, 1800);
  const lcpStatus = getMetricStatus(report.webVitals['lcp'] ?? null, 2500);
  const fidStatus = getMetricStatus(report.webVitals['fid'] ?? null, 100);

  return (
    <div style={containerStyle} role="complementary" aria-label="Performance metrics">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '0.5rem',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>📊 Performance Monitor</h3>
        <button
          onClick={toggleMinimize}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '0.25rem',
            fontSize: '16px',
          }}
          type="button"
          aria-label="Minimize performance monitor"
        >
          ─
        </button>
      </div>

      {/* Web Vitals */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', opacity: 0.8 }}>Web Vitals</h4>
        <div style={{ display: 'grid', gap: '0.25rem' }}>
          <MetricRow
            label="FCP"
            value={report.webVitals['fcp'] ?? null}
            unit="ms"
            status={fcpStatus}
          />
          <MetricRow
            label="LCP"
            value={report.webVitals['lcp'] ?? null}
            unit="ms"
            status={lcpStatus}
          />
          <MetricRow
            label="FID"
            value={report.webVitals['fid'] ?? null}
            unit="ms"
            status={fidStatus}
          />
          <MetricRow
            label="CLS"
            value={report.webVitals['cls'] ?? null}
            unit=""
            status={getMetricStatus(report.webVitals['cls'] ?? null, 0.1)}
            decimals={3}
          />
        </div>
      </div>

      {/* Memory Usage */}
      {memory && (
        <div style={{ marginBottom: '0.75rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', opacity: 0.8 }}>Memory Usage</h4>
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Used:</span>
              <span>{(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total:</span>
              <span>{(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Status:</span>
              <span style={{ color: memoryStatus.color, fontWeight: 'bold' }}>
                {memoryStatus.text} ({memory.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${memory.percentage}%`,
                backgroundColor: memoryStatus.color,
                transition: 'width 0.3s ease',
              }}
              role="progressbar"
              aria-valuenow={Number(memory.percentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Memory usage percentage"
            />
          </div>
        </div>
      )}

      {/* Performance Issues */}
      {issues.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '12px',
              opacity: 0.8,
              color: '#f56565',
            }}
          >
            ⚠️ Issues Detected
          </h4>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 1rem',
              fontSize: '11px',
              color: '#fbb6ce',
            }}
          >
            {issues.slice(0, 3).map((issue) => (
              <li key={issue} style={{ marginBottom: '0.25rem' }}>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(PerformanceMonitor);
