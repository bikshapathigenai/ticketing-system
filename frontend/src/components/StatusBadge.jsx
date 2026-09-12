import React from 'react';

/**
 * StatusBadge Component
 * Renders color-coded glassmorphism pill badges for ticket status.
 */
export function StatusBadge({ status }) {
  const normalizedStatus = (status || 'OPEN').toUpperCase();

  const statusMap = {
    OPEN: { label: 'Open', class: 'badge-open' },
    IN_PROGRESS: { label: 'In Progress', class: 'badge-in_progress' },
    CLOSED: { label: 'Closed', class: 'badge-closed' },
  };

  const current = statusMap[normalizedStatus] || statusMap.OPEN;

  return (
    <span className={`badge ${current.class}`}>
      <span className="badge-dot" style={{ backgroundColor: 'currentColor' }}></span>
      {current.label}
    </span>
  );
}
