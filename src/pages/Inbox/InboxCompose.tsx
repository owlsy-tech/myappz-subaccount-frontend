/**
 * Inbox Compose Page Component
 * Form for composing and sending new messages
 */

/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { usePerformanceMonitor, useMemoryLeakDetector } from '../../hooks';

const InboxCompose = () => {
  // Performance monitoring
  usePerformanceMonitor({
    componentName: 'InboxCompose',
    logSlowRenders: true,
    slowRenderThreshold: 16,
  });

  // Memory leak detection
  useMemoryLeakDetector({
    componentName: 'InboxCompose',
    enabled: import.meta.env.MODE === 'development',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent! (This is a placeholder)');
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

      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a202c',
            marginBottom: '0.5rem',
          }}
        >
          Compose Message
        </h1>
        <p style={{ fontSize: '1rem', color: '#718096' }}>Create and send a new message</p>
      </header>

      {/* Compose form */}
      <section
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        aria-labelledby="compose-heading"
      >
        <form onSubmit={handleSubmit}>
          {/* To field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              To
            </label>
            <input
              type="email"
              id="to"
              placeholder="recipient@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4299e1';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* CC field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              CC <span style={{ color: '#a0aec0', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              type="email"
              id="cc"
              placeholder="cc@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4299e1';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* Subject field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="Enter subject"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4299e1';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* Message body */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Message
            </label>
            <textarea
              id="message"
              placeholder="Type your message here..."
              required
              rows={10}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#4299e1';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* Priority selector */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
              }}
            >
              Priority
            </label>
            <select
              id="priority"
              style={{
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
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
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2c5282';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3182ce';
              }}
            >
              Send Message
            </button>
            <button
              type="button"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'white',
                color: '#2d3748',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Save Draft
            </button>
            <a
              href="/inbox"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: 'white',
                color: '#718096',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </section>

      {/* Help text */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: '#0c4a6e', margin: 0 }}>
          <strong>Tip:</strong> Use Ctrl+Enter (Cmd+Enter on Mac) to send the message quickly.
        </p>
      </div>
    </div>
  );
};

export default InboxCompose;
