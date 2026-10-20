import React from 'react';
import { Settings, X } from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="panel-glass"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '22px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-medium)',
          backgroundColor: '#0a0e19'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} color="var(--cyan-bright)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Simulation & Network Settings</h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Options Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* IP Version */}
          <div className="panel-elevated" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.825rem' }}>IP Protocol Version</strong>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
                  IPv4 (32-bit addresses, TTL) vs IPv6 (128-bit addresses, Hop Limit).
                </p>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['IPv4', 'IPv6'].map((ver) => (
                  <button
                    key={ver}
                    onClick={() => onUpdateConfig({ ipVersion: ver })}
                    className="btn-ghost"
                    style={{
                      fontSize: '0.75rem',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: config.ipVersion === ver ? 'rgba(0, 245, 212, 0.14)' : 'transparent',
                      color: config.ipVersion === ver ? 'var(--cyan-bright)' : 'var(--text-muted)',
                      border: config.ipVersion === ver ? '1px solid var(--cyan-bright)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {ver}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* HTTP Protocol Version */}
          <div className="panel-elevated" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.825rem' }}>HTTP Protocol Version</strong>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
                  HTTP/1.1 (standard) vs HTTP/2 (multiplexed) vs HTTP/3 (QUIC over UDP).
                </p>
              </div>
              <select
                value={config.httpVersion}
                onChange={(e) => onUpdateConfig({ httpVersion: e.target.value })}
                style={{
                  backgroundColor: 'var(--bg-darkest)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '5px 8px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <option value="HTTP/1.1">HTTP/1.1</option>
                <option value="HTTP/2">HTTP/2</option>
                <option value="HTTP/3 (QUIC)">HTTP/3 (QUIC)</option>
              </select>
            </div>
          </div>

          {/* DNS Resolver Cache */}
          <div className="panel-elevated" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.825rem' }}>Pre-warm DNS Cache</strong>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
                  Simulates a warm local OS DNS cache to skip external UDP queries.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.dnsCacheEnabled}
                onChange={(e) => onUpdateConfig({ dnsCacheEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--cyan-bright)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Latency Multiplier */}
          <div className="panel-elevated" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.825rem' }}>Simulated Latency Multiplier</strong>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
                  Artificially scale propagation delays across fiber links.
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-bright)' }}>
                {config.latencyMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.5"
              value={config.latencyMultiplier}
              onChange={(e) => onUpdateConfig({ latencyMultiplier: parseFloat(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--cyan-bright)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '7px 18px', fontSize: '0.825rem' }}>
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
