/**
 * Lead List Page Component
 * Displays list of leads with filtering and search capabilities
 */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const LeadList = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'LeadList',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'LeadList',
    enabled: import.meta.env.MODE === 'development',
  });

  // Mock lead data
  const leads = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      company: 'Tech Corp',
      status: 'hot',
      value: '$50,000',
      lastContact: '2 hours ago',
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'mbrown@business.com',
      company: 'Business Inc',
      status: 'warm',
      value: '$35,000',
      lastContact: '1 day ago',
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.d@startup.io',
      company: 'Startup IO',
      status: 'cold',
      value: '$15,000',
      lastContact: '1 week ago',
    },
  ];

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

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem',
          }}
        >
          Lead Management
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>View and manage your leads</p>
      </header>

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <a
          href="/lead-management/create"
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
          + Create Lead
        </a>
        <a
          href="/lead-management/import"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#2d3748',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Import
        </a>
        <a
          href="/lead-management/export"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#2d3748',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          Export
        </a>
      </div>

      {/* Leads table */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Company
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Value
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Last Contact
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#718096',
                    textTransform: 'uppercase',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const statusStyle = getStatusColor(lead.status);
                return (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#2d3748',
                          }}
                        >
                          {lead.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#718096',
                          }}
                        >
                          {lead.email}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#2d3748',
                      }}
                    >
                      {lead.company}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
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
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#2d3748',
                      }}
                    >
                      {lead.value}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        fontSize: '0.875rem',
                        color: '#718096',
                      }}
                    >
                      {lead.lastContact}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <a
                          href={`/lead-management/${lead.id}`}
                          style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem',
                            color: '#3182ce',
                            textDecoration: 'none',
                            fontWeight: '600',
                          }}
                        >
                          View
                        </a>
                        <a
                          href={`/lead-management/${lead.id}/edit`}
                          style={{
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem',
                            color: '#38a169',
                            textDecoration: 'none',
                            fontWeight: '600',
                          }}
                        >
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LeadList;
