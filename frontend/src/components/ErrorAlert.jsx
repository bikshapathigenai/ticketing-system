import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorAlert Component
 * Displays clear feedback UI for 400, 404, 500, or network connection errors.
 */
export function ErrorAlert({ error, onRetry }) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';
  const status = typeof error === 'object' ? error.status : null;

  return (
    <div className="alert alert-danger fade-in" style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#f43f5e' }} />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem', color: '#fecdd3' }}>
            {status ? `Error (HTTP ${status})` : 'Connection Request Failed'}
          </h4>
          <p style={{ margin: 0, color: '#fda4af', lineHeight: '1.4' }}>{errorMessage}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm btn-secondary"
          style={{ flexShrink: 0, marginTop: '2px' }}
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
