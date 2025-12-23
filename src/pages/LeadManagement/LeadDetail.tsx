/**
 * Lead Detail Page Component
 * Displays detailed information about a single lead
 */

/* eslint-disable react/button-has-type */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const LeadDetail = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'LeadDetail',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'LeadDetail',
    enabled: import.meta.env.MODE === 'development',
  });

  // Mock lead data - replace with actual data fetching
  const lead = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    position: 'VP of Sales',
    status: 'hot',
    value: '$50,000',
    source: 'Website',
    assignedTo: 'John Smith',
    createdAt: 'Jan 15, 2024',
    lastContact: '2 hours ago',
    notes: 'Very interested in our enterprise solution. Follow up next week for demo.',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return { bg: '#fed7d7', color: '#c53030', label: 'Hot' };
      case 'warm':
        return { bg: '#feebc8', color: '#c05621', label: 'Warm' };
      case 'cold':
        return { bg: '#bee3f8', color: '#2c5282', label: 'Cold' };
      default:
        return { bg: '#e2e8f0', color: '#4a5568', label: status };
    }
  };

  const statusStyle = getStatusColor(lead.status);

  return (
    <div
      style={{
        maxWidth: '1000px',
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

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1a202c',
              marginBottom: '0.5rem',
            }}
          >
            {lead.name}
          </h1>
          <p style={{ fontSize: '1rem', color: '#718096' }}>
            {lead.position} at {lead.company}
          </p>
        </div>
        <a
          href={`/lead-management/${lead.id}/edit`}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3182ce',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Edit Lead
        </a>
      </div>

      {/* Lead Details Card */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1.5rem',
          }}
        >
          Lead Information
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Email
            </div>
            <a
              href={`mailto:${lead.email}`}
              style={{
                fontSize: '0.875rem',
                color: '#3182ce',
                textDecoration: 'none',
              }}
            >
              {lead.email}
            </a>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Phone
            </div>
            <a
              href={`tel:${lead.phone}`}
              style={{
                fontSize: '0.875rem',
                color: '#3182ce',
                textDecoration: 'none',
              }}
            >
              {lead.phone}
            </a>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Status
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                borderRadius: '12px',
              }}
            >
              {statusStyle.label}
            </span>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Estimated Value
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
              }}
            >
              {lead.value}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Source
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#2d3748',
              }}
            >
              {lead.source}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Assigned To
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#2d3748',
              }}
            >
              {lead.assignedTo}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Created
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#2d3748',
              }}
            >
              {lead.createdAt}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#718096',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Last Contact
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#2d3748',
              }}
            >
              {lead.lastContact}
            </div>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem',
          }}
        >
          Notes
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: '#4a5568',
          }}
        >
          {lead.notes}
        </p>
      </section>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="button"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Convert to Customer
        </button>
        <button
          type="button"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#2d3748',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Add Activity
        </button>
        <button
          type="button"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#e53e3e',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          Delete Lead
        </button>
      </div>
    </div>
  );
};

export default LeadDetail;
