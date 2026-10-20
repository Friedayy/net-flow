import React, { useState, useEffect } from 'react';
import { Monitor, X, Laptop } from 'lucide-react';

export const MobileNotice = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isSmall = window.innerWidth <= 768;
      const ua = navigator.userAgent || '';
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      setIsMobile(isSmall || isMobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      {/* 1. Welcoming Modal Card on Initial Load on Mobile */}
      {!isDismissed && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(5, 8, 14, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 200ms ease-out'
          }}
        >
          <div
            className="panel-glass"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '24px 20px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '14px',
              backgroundColor: '#0d131f'
            }}
          >
            {/* Glowing Desktop Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(45, 212, 191, 0.12)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)'
              }}
            >
              <Monitor size={28} color="var(--cyan-bright)" />
            </div>

            {/* Core Message */}
            <div>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em'
                }}
              >
                For better experience use desktop
              </h3>

              <p
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0
                }}
              >
                NetFlow is an interactive network simulator with animated packet topology maps, protocol dissectors, and wire analyzers designed for larger screens.
              </p>
            </div>

            {/* Dismiss / Continue Action */}
            <button
              onClick={() => setIsDismissed(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-md)',
                marginTop: '4px'
              }}
            >
              <Laptop size={15} />
              <span>Continue on Mobile</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Slim Persistent Top Banner for Mobile */}
      <aside
        aria-label="Desktop recommendation"
        style={{
          width: '100%',
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          borderBottom: '1px solid rgba(45, 212, 191, 0.25)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--cyan-bright)',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        <Monitor size={14} style={{ flexShrink: 0 }} />
        <span>For better experience use desktop</span>
      </aside>
    </>
  );
};
