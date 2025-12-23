/**
 * Lead Export Page Component
 * Interface for exporting leads to various file formats
 */

/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const LeadExport = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'LeadExport',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'LeadExport',
    enabled: import.meta.env.MODE === 'development',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Export started! (This is a placeholder)');
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <a
          href="/lead-management"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3182ce',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          ← Back to Leads
        </a>
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem',
          }}
        >
          Export Leads
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>
          Export your leads to a file for backup or external use
        </p>
      </header>

      {/* Export form */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* File format selection */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="format"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Export Format *
            </label>
            <select
              id="format"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white',
              }}
            >
              <option value="csv">CSV (Comma-separated values)</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF Report</option>
            </select>
          </div>

          {/* Filter by status */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '1rem',
              }}
            >
              Filter by Status
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Hot Leads
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Warm Leads
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Cold Leads
              </label>
            </div>
          </div>

          {/* Date range filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '1rem',
              }}
            >
              Date Range (Optional)
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="startDate"
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: '#718096',
                    marginBottom: '0.5rem',
                  }}
                >
                  From
                </label>
                <input
                  type="date"
                  id="startDate"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    color: '#718096',
                    marginBottom: '0.5rem',
                  }}
                >
                  To
                </label>
                <input
                  type="date"
                  id="endDate"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Export options */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '1rem',
              }}
            >
              Export Options
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Include contact information
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Include company details
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Include notes and activities
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                Include timestamps (created/modified dates)
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Export Leads
            </button>
            <a
              href="/lead-management"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'white',
                color: '#718096',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </section>

      {/* Export summary */}
      <section
        style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#14532d',
            marginBottom: '0.75rem',
          }}
        >
          Export Summary
        </h3>
        <div style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Total leads matching criteria:</strong> 125
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Estimated file size:</strong> ~150 KB
          </p>
          <p>The export file will be downloaded to your device when ready.</p>
        </div>
      </section>
    </div>
  );
};

export default LeadExport;
