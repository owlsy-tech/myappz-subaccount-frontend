/**
 * Inbox List Page Component
 * Displays list of messages/conversations in the inbox
 */

/* eslint-disable react/no-unescaped-entities */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const InboxList = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'InboxList',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'InboxList',
    enabled: import.meta.env.MODE === 'development',
  });

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
          Inbox
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>View and manage your messages</p>
      </header>

      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        aria-labelledby="inbox-heading"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            id="inbox-heading"
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#2d3748',
            }}
          >
            Messages
          </h2>
          <a
            href="/inbox/compose"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3182ce',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            + Compose
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Sample message items */}
          {[
            {
              id: 1,
              sender: 'John Doe',
              subject: 'Meeting follow-up',
              preview: 'Thanks for the great meeting today...',
              time: '2 hours ago',
              unread: true,
            },
            {
              id: 2,
              sender: 'Jane Smith',
              subject: 'Project Update',
              preview: 'Here are the latest updates on the project...',
              time: '5 hours ago',
              unread: true,
            },
            {
              id: 3,
              sender: 'Mike Johnson',
              subject: 'RE: Budget Review',
              preview: 'I have reviewed the budget and have some feedback...',
              time: '1 day ago',
              unread: false,
            },
          ].map((message) => (
            <a
              key={message.id}
              href={`/inbox/${message.id}`}
              style={{
                display: 'block',
                padding: '1rem',
                backgroundColor: message.unread ? '#edf2f7' : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6fffa';
                e.currentTarget.style.borderColor = '#4299e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = message.unread ? '#edf2f7' : 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontWeight: message.unread ? '600' : '400',
                      color: '#2d3748',
                      fontSize: '0.9rem',
                    }}
                  >
                    {message.sender}
                  </span>
                  {message.unread && (
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#3182ce',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#a0aec0',
                  }}
                >
                  {message.time}
                </span>
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: message.unread ? '600' : '500',
                  color: '#2d3748',
                  marginBottom: '0.25rem',
                }}
              >
                {message.subject}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#718096',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {message.preview}
              </div>
            </a>
          ))}
        </div>

        {/* Empty state if no messages */}
        {false && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#718096',
            }}
          >
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No messages yet</p>
            <p style={{ fontSize: '0.875rem' }}>
              When you receive messages, they&apos;ll appear here
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default InboxList;
