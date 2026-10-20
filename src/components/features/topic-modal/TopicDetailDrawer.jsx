import React from 'react';
import {
  X,
  Terminal,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';
import { getTopicExplanation } from '../../../engine/topicExplainer.js';

export const TopicDetailDrawer = ({
  topicId,
  onClose,
  onSelectTopic,
  currentEvent
}) => {
  if (!topicId) return null;

  const topic = getTopicExplanation(topicId);

  const title = topic?.title || currentEvent?.title || topicId;
  const brief = topic?.brief || currentEvent?.summarySimple || 'Network simulation element.';
  const mentalModel = topic?.mentalModel || currentEvent?.whyItHappens || 'A key stage in the lifecycle of an internet request.';
  const technicalDetails = topic?.technicalDetails || [
    currentEvent?.summaryTechnical || 'Executes protocol logic defined in networking RFC standards.',
    `Direction: ${currentEvent?.direction || 'Internal processing'}`,
    `Protocol: ${currentEvent?.protocol || 'TCP/IP'}`
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 90,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'all 180ms ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="panel-glass"
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-active)',
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0a0e19'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'rgba(0, 245, 212, 0.15)',
                  color: 'var(--cyan-bright)',
                  border: '1px solid rgba(0, 245, 212, 0.3)',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {topic?.category || 'Deep Dive'}
              </span>
              {topic?.rfc && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(192, 132, 252, 0.15)',
                    color: 'var(--violet-bright)',
                    border: '1px solid rgba(192, 132, 252, 0.3)',
                    fontWeight: 600
                  }}
                >
                  {topic.rfc}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {title}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--blue-ice)', marginTop: '4px' }}>
              {brief}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
            title="Close (or press Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body Scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Section 1: Intuitive Mental Model */}
          <div
            className="panel-elevated"
            style={{
              padding: '14px 16px',
              borderLeft: '4px solid var(--cyan-bright)',
              backgroundColor: 'rgba(0, 245, 212, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', color: 'var(--cyan-bright)' }}>
              <HelpCircle size={15} />
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                How to Think About This (Intuitive Mental Model)
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.55', color: 'var(--text-primary)', margin: 0 }}>
              {mentalModel}
            </p>
          </div>

          {/* Section 2: Technical Specifications & Mechanics */}
          <div className="panel-elevated" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px', color: 'var(--blue-ice)' }}>
              <Cpu size={15} />
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                How It Works Under the Hood
              </h4>
            </div>
            <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {technicalDetails.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Active Packet Inspection */}
          {currentEvent?.packet && (
            <div className="panel-elevated" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px', color: 'var(--emerald-success)' }}>
                <Layers size={15} />
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live Packet at This Step
                </h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.725rem', fontFamily: 'var(--font-mono)' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Source:</span> {currentEvent.packet.networkLayer?.sourceIp}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Dest:</span> {currentEvent.packet.networkLayer?.destinationIp}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Protocol:</span> {currentEvent.protocol}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Size:</span> {currentEvent.packet.totalSizeBytes} Bytes</div>
              </div>

              {/* Hex Preview Snippet */}
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#030508', borderRadius: 'var(--radius-xs)', fontSize: '0.675rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-bright)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '3px', fontSize: '0.625rem' }}>Hex wire dump:</div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {currentEvent.packet.rawHexPreview?.slice(0, 240)}
                </pre>
              </div>
            </div>
          )}

          {/* Section 4: Real-World Terminal Command */}
          {topic?.troubleshootingCmd && (
            <div className="panel-elevated" style={{ padding: '14px 16px', backgroundColor: '#030508', border: '1px solid rgba(0, 245, 212, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', color: 'var(--cyan-bright)' }}>
                <Terminal size={15} />
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  How to inspect this on your real computer:
                </h4>
              </div>
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--cyan-bright)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>$</span>
                <span>{topic.troubleshootingCmd}</span>
              </div>
            </div>
          )}

          {/* Section 5: Explore Related Topics */}
          {onSelectTopic && (
            <div style={{ marginTop: '6px' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Related Concepts:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {[
                  { id: 'client', label: 'Client Browser' },
                  { id: 'dns', label: 'DNS Resolver' },
                  { id: 'gateway', label: 'NAT Gateway' },
                  { id: 'tcp_handshake', label: 'TCP 3-Way' },
                  { id: 'tls_handshake', label: 'TLS 1.3' },
                  { id: 'http_req', label: 'HTTP / GET' },
                  { id: 'web_server', label: 'App Server' },
                  { id: 'database', label: 'PostgreSQL' },
                  { id: 'layer_application', label: 'Layer 7' },
                  { id: 'layer_transport', label: 'Layer 4' },
                  { id: 'rtt_metric', label: 'RTT Latency' }
                ].filter(item => item.id !== topicId).slice(0, 6).map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelectTopic(item.id)}
                    className="btn-ghost"
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 9px',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--cyan-bright)'
                    }}
                  >
                    <span>{item.label} →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button onClick={onClose} className="btn-primary" style={{ padding: '6px 18px', fontSize: '0.825rem' }}>
            <span>Got it, close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
