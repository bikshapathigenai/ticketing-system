import React from 'react';

/**
 * PriorityBadge Component
 * Displays priority level (High, Medium, Low) with custom indicators.
 */
export function PriorityBadge({ priority }) {
  const normalizedPriority = (priority || 'MEDIUM').toUpperCase();

  const priorityMap = {
    HIGH: { label: 'High', class: 'priority-high' },
    MEDIUM: { label: 'Medium', class: 'priority-medium' },
    LOW: { label: 'Low', class: 'priority-low' },
  };

  const current = priorityMap[normalizedPriority] || priorityMap.MEDIUM;

  return (
    <span className={`badge ${current.class}`}>
      <span className="badge-dot"></span>
      {current.label}
    </span>
  );
}
