import React from 'react';
import {
  Activity,
  BookOpen,
  Settings,
  Sparkles,
  Wifi,
  Layers,
  ShieldCheck,
  Terminal,
  Server
} from 'lucide-react';
import { HoverTooltip } from '../common/HoverTooltip.jsx';

export const Header = ({
  onOpenSettings,
  onStartTour,
  onOpenTopicsList,
  isBackendAlive = true,
  currentStepIndex = 0,
  totalSteps = 0,
  currentRttMs = 0,
  activeView = 'topology',
  onChangeView
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        backgroundColor: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onChangeView?.('topology')}>
          {/* Minimalist Glowing Logo Icon */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #00f5d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 245, 212, 0.35)'
            }}
          >
            <Activity size={18} color="#06080d" strokeWidth={2.6} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(to right, #ffffff, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                NetFlow
              </span>

              <span
                style={{
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(45, 212, 191, 0.12)',
                  color: 'var(--cyan-bright)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                EXPLORER
              </span>
            </div>

            <p
              style={{
                fontSize: '0.725rem',
                color: 'var(--text-muted)',
                fontWeight: 400,
                margin: 0
              }}
            >
              Interactive journey of an internet request
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        {onChangeView && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-full)',
              padding: '3px',
              border: '1px solid var(--border-subtle)',
              marginLeft: '12px'
            }}
          >
            {[
              { id: 'topology', label: 'Journey Map', icon: <Layers size={13} /> },
              { id: 'inspector', label: 'Packet Dissector', icon: <Terminal size={13} /> },
              { id: 'failures', label: 'Failure Lab', icon: <ShieldCheck size={13} /> },
              { id: 'realapi', label: 'Live Demo API', icon: <Server size={13} /> }
            ].map(tab => {
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeView(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'rgba(45, 212, 191, 0.15)' : 'transparent',
                    color: isActive ? 'var(--cyan-bright)' : 'var(--text-muted)',
                    border: `1px solid ${isActive ? 'rgba(45, 212, 191, 0.35)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Global Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Concepts Knowledge Base Trigger */}
        <HoverTooltip
          topicId="url_parsing"
          fallbackTitle="Network Topics & RFC Guide"
          fallbackBrief="Explore friendly explanations, mental models, raw Wireshark frames, and terminal commands for every networking concept."
        >
          <button
            onClick={onOpenTopicsList}
            className="btn-secondary"
            style={{
              fontSize: '0.775rem',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-full)',
              borderColor: 'rgba(45, 212, 191, 0.3)'
            }}
          >
            <BookOpen size={14} color="var(--cyan-bright)" />
            <span style={{ color: 'var(--cyan-bright)', fontWeight: 600 }}>Concept Guide</span>
          </button>
        </HoverTooltip>

        {/* Guided Walkthrough Tour */}
        <button
          onClick={onStartTour}
          className="btn-ghost"
          style={{
            padding: '6px 12px',
            fontSize: '0.775rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: 'var(--radius-full)'
          }}
          title="Interactive walkthrough of NetFlow"
        >
          <Sparkles size={14} color="var(--blue-ice)" />
          <span>Tour</span>
        </button>

        {/* Settings Modal Trigger */}
        <button
          onClick={onOpenSettings}
          className="btn-ghost"
          style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
          title="Simulation Settings & Network Config"
        >
          <Settings size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Backend Connectivity Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.675rem',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isBackendAlive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 113, 133, 0.1)',
            border: `1px solid ${isBackendAlive ? 'rgba(52, 211, 153, 0.3)' : 'rgba(251, 113, 133, 0.3)'}`,
            color: isBackendAlive ? 'var(--emerald-success)' : 'var(--coral-error)',
            fontFamily: 'var(--font-mono)'
          }}
          title={isBackendAlive ? 'Local Demo Express API Server Live on port 3001' : 'Backend Server Offline'}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isBackendAlive ? 'var(--emerald-success)' : 'var(--coral-error)',
              boxShadow: isBackendAlive ? '0 0 6px var(--emerald-success)' : 'none'
            }}
          />
          <Wifi size={11} />
          <span>{isBackendAlive ? 'API READY' : 'OFFLINE'}</span>
        </div>
      </div>
    </header>
  );
};
