/**
 * Lead Import Page Component
 * Interface for importing leads from files (CSV, Excel, etc.)
 */

/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const LeadImport = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'LeadImport',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'LeadImport',
    enabled: import.meta.env.MODE === 'development',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Import started! (This is a placeholder)');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
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
          Import Leads
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>
          Upload a file to import multiple leads at once
        </p>
      </header>

      {/* Import form */}
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
          {/* File upload */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="file"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Upload File *
            </label>
            <input
              type="file"
              id="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '2px dashed #cbd5e0',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer',
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.5rem' }}>
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>

          {/* Import options */}
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
              Import Options
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
                Skip duplicate leads (based on email)
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
                Update existing leads with new data
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
                Send notification email after import
              </label>
            </div>
          </div>

          {/* Default values */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="defaultStatus"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Default Status for New Leads
            </label>
            <select
              id="defaultStatus"
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
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
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
              Import Leads
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

      {/* Template download section */}
      <section
        style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#0c4a6e',
            marginBottom: '0.75rem',
          }}
        >
          Need a template?
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '1rem' }}>
          Download our CSV template to ensure your data is formatted correctly.
        </p>
        <button
          type="button"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          onClick={() => alert('Template download (placeholder)')}
        >
          Download CSV Template
        </button>
      </section>

      {/* Instructions */}
      <section
        style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem',
          }}
        >
          Import Instructions
        </h3>
        <ol
          style={{
            fontSize: '0.875rem',
            color: '#4a5568',
            lineHeight: '1.6',
            paddingLeft: '1.5rem',
          }}
        >
          <li style={{ marginBottom: '0.5rem' }}>
            Prepare your file with the following columns: Name, Email, Phone, Company, Position,
            Status, Value, Source
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            Ensure email addresses are unique to avoid duplicates
          </li>
          <li style={{ marginBottom: '0.5rem' }}>Status values should be: hot, warm, or cold</li>
          <li style={{ marginBottom: '0.5rem' }}>Upload your file and configure import options</li>
          Click &quot;Import Leads&quot; to start the import process
        </ol>
      </section>
    </div>
  );
};

export default LeadImport;
