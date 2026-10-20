import React from 'react';

export const NodeSvgIcon = ({ role, status, size = 44 }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
      case 'processing':
        return 'var(--cyan-bright)';
      case 'success':
        return 'var(--emerald-success)';
      case 'warning':
        return 'var(--amber-warning)';
      case 'error':
      case 'dropped':
        return 'var(--coral-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const color = getStatusColor();

  switch (role) {
    case 'client':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Laptop Body */}
          <rect x="8" y="10" width="32" height="22" rx="3" fill="#0b101c" stroke={color} strokeWidth="2" />
          {/* Screen Content */}
          <rect x="12" y="14" width="24" height="14" rx="1.5" fill="#131b2e" />
          <line x1="15" y1="18" x2="27" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="22" x2="31" y2="22" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="25" x2="23" y2="25" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" />
          {/* Laptop Base */}
          <path d="M4 35C4 33.8954 4.89543 33 6 33H42C43.1046 33 44 33.8954 44 35L42 38H6L4 35Z" fill="#131b2e" stroke={color} strokeWidth="1.5" />
          {/* Trackpad */}
          <rect x="20" y="34" width="8" height="2" rx="1" fill={color} />
        </svg>
      );

    case 'switch':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Switch Box */}
          <rect x="4" y="14" width="40" height="20" rx="3" fill="#0b101c" stroke={color} strokeWidth="2" />
          {/* RJ-45 Port Array */}
          {[10, 16, 22, 28, 34].map((x, i) => (
            <g key={i}>
              <rect x={x} y="20" width="4" height="6" rx="1" fill="#131b2e" stroke="var(--border-medium)" strokeWidth="0.5" />
              <circle cx={x + 2} cy="17" r="1.2" fill={i < 3 ? 'var(--emerald-success)' : 'var(--text-muted)'} />
            </g>
          ))}
          <rect x="38" y="20" width="4" height="6" rx="1" fill="#1f293d" stroke={color} strokeWidth="1" />
          <circle cx="40" cy="17" r="1.2" fill={color} />
        </svg>
      );

    case 'gateway':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Antennas */}
          <line x1="14" y1="16" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="6" r="2" fill={color} />
          <line x1="34" y1="16" x2="40" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="6" r="2" fill={color} />
          {/* Router Body */}
          <rect x="6" y="16" width="36" height="22" rx="4" fill="#0b101c" stroke={color} strokeWidth="2" />
          <path d="M19 23C20.5 21.5 27.5 21.5 29 23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M21 27C22.2 26 25.8 26 27 27" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="30" r="1.5" fill={color} />
          <circle cx="12" cy="33" r="1.5" fill="var(--emerald-success)" />
          <circle cx="16" cy="33" r="1.5" fill={color} />
        </svg>
      );

    case 'dns':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* DNS Server Tower */}
          <rect x="10" y="8" width="28" height="32" rx="3" fill="#0b101c" stroke={color} strokeWidth="2" />
          <line x1="10" y1="18" x2="38" y2="18" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="10" y1="28" x2="38" y2="28" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <rect x="14" y="12" width="14" height="2.5" rx="1" fill="#131b2e" />
          <circle cx="33" cy="13" r="1.5" fill="var(--violet-bright)" />
          <rect x="14" y="22" width="14" height="2.5" rx="1" fill="#131b2e" />
          <circle cx="33" cy="23" r="1.5" fill={color} />
          <rect x="14" y="32" width="14" height="2.5" rx="1" fill="#131b2e" />
          <circle cx="33" cy="33" r="1.5" fill="var(--emerald-success)" />
        </svg>
      );

    case 'router':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Core Router Circle */}
          <circle cx="24" cy="24" r="18" fill="#0b101c" stroke={color} strokeWidth="2" />
          <path d="M14 24H34M34 24L30 20M34 24L30 28" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 24H14M14 24L18 20M14 24L18 28" stroke="var(--blue-ice)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="3" fill={color} />
        </svg>
      );

    case 'edge':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Cloud Shield Outline */}
          <path
            d="M24 6L38 12V24C38 33 24 40 24 40C24 40 10 33 10 24V12L24 6Z"
            fill="#0b101c"
            stroke={color}
            strokeWidth="2"
          />
          <path
            d="M18 25C17 25 16 24 16 23C16 21.9 16.9 21 18 21C18.2 21 18.5 21 18.7 21.1C19.3 19.3 21 18 23 18C25.5 18 27.5 19.8 27.9 22.2C28.3 22.1 28.6 22 29 22C30.7 22 32 23.3 32 25H18Z"
            fill={color}
            opacity="0.8"
          />
          <path d="M22 27V25C22 23.9 22.9 23 24 23C25.1 23 26 23.9 26 25V27" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="20" y="27" width="8" height="6" rx="1.5" fill="#ffffff" />
        </svg>
      );

    case 'server':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Rack Server 1 */}
          <rect x="8" y="10" width="32" height="11" rx="2" fill="#0b101c" stroke={color} strokeWidth="1.8" />
          <circle cx="13" cy="15.5" r="1.5" fill="var(--emerald-success)" />
          <line x1="18" y1="15.5" x2="34" y2="15.5" stroke="var(--border-medium)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rack Server 2 */}
          <rect x="8" y="25" width="32" height="11" rx="2" fill="#0b101c" stroke={color} strokeWidth="1.8" />
          <circle cx="13" cy="30.5" r="1.5" fill={color} />
          <line x1="18" y1="30.5" x2="34" y2="30.5" stroke="var(--border-medium)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'database':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Database Cylinder Top */}
          <ellipse cx="24" cy="12" rx="14" ry="5" fill="#131b2e" stroke={color} strokeWidth="2" />
          <path d="M10 12V24C10 26.8 16.3 29 24 29C31.7 29 38 26.8 38 24V12" fill="#0b101c" stroke={color} strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="14" ry="5" fill="none" stroke="var(--border-medium)" strokeWidth="1.5" />
          <path d="M10 24V36C10 38.8 16.3 41 24 41C31.7 41 38 38.8 38 36V24" fill="#0b101c" stroke={color} strokeWidth="2" />
          <circle cx="24" cy="35" r="2" fill={color} />
        </svg>
      );

    default:
      return null;
  }
};
