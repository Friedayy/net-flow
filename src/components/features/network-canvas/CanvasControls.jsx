import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Grid,
  Crosshair
} from 'lucide-react';

export const CanvasControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitView,
  showGrid,
  onToggleGrid,
  onFocusNode
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '5px 8px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10
      }}
    >
      <button
        onClick={onZoomIn}
        className="btn-ghost"
        style={{ padding: '5px' }}
        title="Zoom In (or Scroll Wheel Up)"
      >
        <ZoomIn size={14} />
      </button>

      <span
        style={{
          fontSize: '0.725rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--cyan-bright)',
          minWidth: '38px',
          textAlign: 'center'
        }}
      >
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onZoomOut}
        className="btn-ghost"
        style={{ padding: '5px' }}
        title="Zoom Out (or Scroll Wheel Down)"
      >
        <ZoomOut size={14} />
      </button>

      <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />

      <button
        onClick={onResetView}
        className="btn-ghost"
        style={{ padding: '5px' }}
        title="Reset Zoom & Pan"
      >
        <RotateCcw size={14} />
      </button>

      <button
        onClick={onFitView}
        className="btn-ghost"
        style={{ padding: '5px' }}
        title="Fit Topology to Screen"
      >
        <Maximize2 size={14} />
      </button>

      <button
        onClick={onToggleGrid}
        className="btn-ghost"
        style={{
          padding: '5px',
          color: showGrid ? 'var(--cyan-bright)' : 'var(--text-muted)'
        }}
        title="Toggle Background Grid"
      >
        <Grid size={14} />
      </button>

      <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Camera Presets with Friendly Names */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <button
          onClick={() => onFocusNode('client')}
          className="btn-ghost"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
          title="Center on Your Computer"
        >
          <Crosshair size={11} />
          <span>Your Computer</span>
        </button>
        <button
          onClick={() => onFocusNode('isp_router')}
          className="btn-ghost"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
          title="Center on The Internet"
        >
          <Crosshair size={11} />
          <span>Internet</span>
        </button>
        <button
          onClick={() => onFocusNode('web_server')}
          className="btn-ghost"
          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
          title="Center on Website Server"
        >
          <Crosshair size={11} />
          <span>Website Server</span>
        </button>
      </div>
    </div>
  );
};
