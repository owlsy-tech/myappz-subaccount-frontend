/**
 * Inbox Detail Page Component
 * Displays detailed view of a single message/conversation
 */

/* eslint-disable react/button-has-type */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const InboxDetail = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'InboxDetail',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'InboxDetail',
    enabled: import.meta.env.MODE === 'development',
  });

  // Mock message data - replace with actual data fetching
  const message = {
    id: 1,
    sender: 'John Doe',
    senderEmail: 'john.doe@example.com',
    subject: 'Meeting follow-up',
    date: 'Today at 2:30 PM',
    content: `Hi there,

Thanks for the great meeting today. I wanted to follow up on a few action items we discussed:

1. Review the project timeline and provide feedback by end of week
2. Schedule a follow-up meeting for next Tuesday
3. Share the updated documentation with the team

Please let me know if you have any questions or need clarification on any of these points.

Looking forward to your response.

Best regards,
John`,
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
          href="/inbox"
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
          ← Back to Inbox
        </a>
      </div>

      {/* Message container */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        aria-labelledby="message-subject"
      >
        {/* Message header */}
        <header
          style={{
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <h1
            id="message-subject"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1a202c',
              marginBottom: '1rem',
            }}
          >
            {message.subject}
          </h1>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#4299e1',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              {message.sender
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#2d3748',
                }}
              >
                {message.sender}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#718096',
                }}
              >
                {message.senderEmail}
              </div>
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: '#718096',
              }}
            >
              {message.date}
            </div>
          </div>
        </header>

        {/* Message content */}
        <div
          style={{
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: '#2d3748',
            whiteSpace: 'pre-wrap',
            marginBottom: '2rem',
          }}
        >
          {message.content}
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
            type="button"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2c5282';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3182ce';
            }}
          >
            Reply
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'white',
              color: '#2d3748',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Forward
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'white',
              color: '#e53e3e',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Delete
          </button>
          <button
            type="button"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'white',
              color: '#2d3748',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Archive
          </button>
        </div>
      </section>
    </div>
  );
};

export default InboxDetail;
