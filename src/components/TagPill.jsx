import React from 'react';

const TagPill = ({ text, color = 'teal' }) => {
  let styles = {};
  
  if (color === 'teal') {
    styles = {
      border: '1.5px solid var(--color-teal)',
      color: 'var(--color-teal)',
      backgroundColor: 'rgba(0, 194, 168, 0.06)'
    };
  } else if (color === 'orange') {
    styles = {
      border: '1.5px solid var(--color-orange)',
      color: 'var(--color-orange)',
      backgroundColor: 'rgba(244, 98, 31, 0.06)'
    };
  } else if (color === 'earth') {
    styles = {
      border: '1.5px solid rgba(212, 197, 160, 0.4)',
      color: 'rgba(212, 197, 160, 0.4)',
      backgroundColor: 'rgba(212, 197, 160, 0.05)'
    };
  }

  return (
    <div style={{
      ...styles,
      borderRadius: '4px',
      fontFamily: 'var(--font-body)',
      fontWeight: '600',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      padding: '4px 8px',
      display: 'inline-block'
    }}>
      {text}
    </div>
  );
};

export default TagPill;
