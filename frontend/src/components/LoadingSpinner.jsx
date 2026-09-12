import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component
 * Reusable animated loading state indicator.
 */
export function LoadingSpinner({ message = 'Loading tickets...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
      color: 'var(--text-secondary)'
    }} className="fade-in">
      <Loader2 className="animate-spin" size={36} color="var(--accent-primary)" />
      <p style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message}</p>
    </div>
  );
}
