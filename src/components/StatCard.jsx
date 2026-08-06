import React from 'react';

const StatCard = ({ value, label, unit, color = 'var(--color-orange)' }) => {
  return (
    <div style={{
      backgroundColor: 'var(--color-navy)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '6px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: '800',
        fontSize: '48px',
        color: color,
        lineHeight: 1,
        display: 'flex',
        alignItems: 'baseline',
        gap: '4px'
      }}>
        {value}
        {unit && (
          <span style={{
            fontSize: '24px',
            color: 'var(--color-muted-blue)'
          }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontWeight: '600',
        fontSize: '11px',
        color: 'var(--color-earth)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
