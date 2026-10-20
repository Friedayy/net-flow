import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getTopicExplanation, TOPIC_EXPLANATIONS } from '../../engine/topicExplainer.js';

export const HoverTooltip = ({
  topicId,
  children,
  fallbackTitle,
  fallbackBrief,
  onClick,
  position = 'auto'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    showBelow: true,
    arrowLeft: 140
  });

  const timeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const topic = getTopicExplanation(topicId) || TOPIC_EXPLANATIONS[topicId];
  const title = topic?.title || fallbackTitle || topicId;
  const brief = topic?.brief || fallbackBrief || 'Network element in simulation.';

  // Accurate positioning calculation that guarantees tooltip fits within the viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Default or measured tooltip dimensions
    const tooltipEl = tooltipRef.current;
    const tooltipWidth = tooltipEl ? tooltipEl.offsetWidth : Math.min(290, window.innerWidth - 24);
    const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 120;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const MARGIN = 12;
    const HEADER_CLEARANCE = 58; // Ensure it clears the sticky NetFlow top header

    // Horizontal placement: Center on trigger, strictly clamped inside screen
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenterX - tooltipWidth / 2;
    if (left < MARGIN) {
      left = MARGIN;
    } else if (left + tooltipWidth > viewportW - MARGIN) {
      left = viewportW - tooltipWidth - MARGIN;
    }

    // Relative arrow position on the tooltip
    const arrowLeft = Math.max(16, Math.min(tooltipWidth - 16, triggerCenterX - left));

    // Vertical placement logic
    const spaceBelow = viewportH - triggerRect.bottom - MARGIN;
    const spaceAbove = triggerRect.top - HEADER_CLEARANCE - MARGIN;

    let showBelow = true;
    if (position === 'bottom') {
      showBelow = true;
    } else if (position === 'top') {
      showBelow = spaceAbove >= tooltipHeight || spaceAbove >= spaceBelow;
    } else {
      // 'auto': Prefer below whenever trigger is in top half or fits below
      if (triggerRect.top < 220) {
        showBelow = true;
      } else if (spaceBelow < tooltipHeight && spaceAbove >= tooltipHeight) {
        showBelow = false;
      } else {
        showBelow = spaceBelow >= spaceAbove;
      }
    }

    let top = showBelow ? triggerRect.bottom + 8 : triggerRect.top - tooltipHeight - 8;

    // Viewport bounds clamping: NEVER allow tooltip to be cut off
    const minTop = Math.max(MARGIN, HEADER_CLEARANCE + 4);
    const maxTop = viewportH - tooltipHeight - MARGIN;

    if (top < minTop) {
      top = minTop;
    }
    if (top > maxTop) {
      top = Math.max(minTop, maxTop);
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      showBelow,
      arrowLeft: Math.round(arrowLeft)
    });
  }, [position]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 60);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  // Re-measure and clamp immediately after portal renders to ensure 100% pixel-perfect fit
  useLayoutEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, updatePosition]);

  // Recalculate on scroll or window resize while visible
  useEffect(() => {
    if (!isVisible) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isVisible, updatePosition]);

  return (
    <div
      ref={triggerRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        position: 'relative'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}

      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: 'fixed',
              zIndex: 99999,
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: '290px',
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              backgroundColor: 'rgba(9, 13, 22, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(45, 212, 191, 0.5)',
              borderRadius: 'var(--radius-md)',
              padding: '11px 14px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.92), 0 0 16px rgba(45, 212, 191, 0.2)',
              pointerEvents: 'none',
              animation: 'fadeIn 100ms ease-out',
              textAlign: 'left'
            }}
          >
            {/* Triangular Direction Pointer Arrow */}
            <div
              style={{
                position: 'absolute',
                left: `${coords.arrowLeft}px`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                ...(coords.showBelow
                  ? { top: '-6px', borderBottom: '6px solid rgba(45, 212, 191, 0.8)' }
                  : { bottom: '-6px', borderTop: '6px solid rgba(45, 212, 191, 0.8)' })
              }}
            />

            {/* Header: Title & Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.825rem', color: 'var(--cyan-bright)' }}>
                {title}
              </strong>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Brief
              </span>
            </div>

            {/* Explanation Content */}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {brief}
            </p>

            {/* Action Hint */}
            <div
              style={{
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.65rem',
                color: 'var(--blue-ice)',
                fontWeight: 600
              }}
            >
              Click card to inspect RFC explanation & mental model
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
