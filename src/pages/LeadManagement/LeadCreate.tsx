/**
 * Lead Create Page Component
 * Form for creating a new lead
 */

/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const LeadCreate = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'LeadCreate',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'LeadCreate',
    enabled: import.meta.env.MODE === 'development',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Lead created! (This is a placeholder)');
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
          Create New Lead
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>Add a new lead to your pipeline</p>
      </header>

      {/* Create form */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter lead name"
                required
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

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                required
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

            {/* Phone field */}
            <div>
              <label
                htmlFor="phone"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="+1 (555) 123-4567"
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

            {/* Company field */}
            <div>
              <label
                htmlFor="company"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Company *
              </label>
              <input
                type="text"
                id="company"
                placeholder="Company name"
                required
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

            {/* Position field */}
            <div>
              <label
                htmlFor="position"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Position
              </label>
              <input
                type="text"
                id="position"
                placeholder="Job title"
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

            {/* Status field */}
            <div>
              <label
                htmlFor="status"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Status *
              </label>
              <select
                id="status"
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
                <option value="">Select status</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>

            {/* Value field */}
            <div>
              <label
                htmlFor="value"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Estimated Value
              </label>
              <input
                type="text"
                id="value"
                placeholder="$50,000"
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

            {/* Source field */}
            <div>
              <label
                htmlFor="source"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Lead Source
              </label>
              <select
                id="source"
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
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social">Social Media</option>
                <option value="email">Email Campaign</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes field */}
            <div>
              <label
                htmlFor="notes"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                }}
              >
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Additional notes about this lead..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
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
              Create Lead
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
    </div>
  );
};

export default LeadCreate;
