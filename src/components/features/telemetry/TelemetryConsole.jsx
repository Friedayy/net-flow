import React, { useState } from 'react';
import {
  Layers,
  Terminal,
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Clock,
  Zap,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { HoverTooltip } from '../../common/HoverTooltip.jsx';

export const TelemetryConsole = ({
  currentEvent,
  metrics,
  hasError,
  onOpenTopic,
  nodes = []
}) => {
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false);
  const [showHexDump, setShowHexDump] = useState(false);

  const m = metrics || {
    dnsTimeMs: 0,
    tcpHandshakeMs: 0,
    tlsHandshakeMs: 0,
    networkLatencyMs: 0,
    serverProcessingMs: 0,
    databaseTimeMs: 0,
    totalSimulatedMs: 0,
    hopCount: 0,
    packetsTransmitted: 0,
    packetsDropped: 0,
    responseSizeBytes: 0,
    httpStatusCode: 200
  };

  const srcNode = nodes.find((n) => n.id === currentEvent?.sourceNodeId);
  const dstNode = nodes.find((n) => n.id === currentEvent?.destNodeId);
  const packet = currentEvent?.packet;

  const protocolId = currentEvent?.protocol?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'tcp';

  return (
    <div
      className="panel-glass"
      style={{
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* SECTION 1: WELCOMING NARRATIVE STORY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Step Context & Pathway Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {currentEvent?.protocol && (
              <span className={`badge-protocol badge-${protocolId}`}>
                {currentEvent.protocol}
              </span>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {srcNode?.label || currentEvent?.sourceNodeId || 'Client'}
              </span>
              <ArrowRight size={13} color="var(--cyan-bright)" />
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {dstNode?.label || currentEvent?.destNodeId || 'Server'}
              </span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
                ({(currentEvent?.simulatedTimeMs || 0).toFixed(1)} ms)
              </span>
            </div>
          </div>

          {/* Deep Dive Action Link */}
          <button
            onClick={() => onOpenTopic(protocolId)}
            className="btn-ghost"
            style={{
              fontSize: '0.725rem',
              color: 'var(--cyan-bright)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <span>Learn why this happens ➔</span>
          </button>
        </div>

        {/* Narrative Title */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}
        >
          {currentEvent?.title || 'Ready to trace web request'}
        </h3>

        {/* Plain-English Explanation */}
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.55',
            margin: 0
          }}
        >
          {currentEvent?.summarySimple ||
            'Enter any web address above and click Trace Request to watch how your browser establishes handshakes, encrypts communication, and retrieves content across the internet.'}
        </p>

        {/* Friendly Mental Model Callout (if available) */}
        {currentEvent?.whyItHappens && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(45, 212, 191, 0.06)',
              border: '1px solid rgba(45, 212, 191, 0.18)',
              marginTop: '4px'
            }}
          >
            <Lightbulb size={16} color="var(--cyan-bright)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.775rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
              {currentEvent.whyItHappens}
            </span>
          </div>
        )}
      </div>

      {/* SECTION 2: 4 ESSENTIAL GLANCEABLE STATS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
          paddingTop: '6px',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        {/* Stat 1: Elapsed Time */}
        <div
          className="panel-elevated"
          style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Elapsed Time</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>
            {(currentEvent?.simulatedTimeMs || m.totalSimulatedMs || 0).toFixed(1)} ms
          </span>
        </div>

        {/* Stat 2: Active Protocol */}
        <div
          className="panel-elevated"
          style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Active Protocol</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--blue-ice)', fontFamily: 'var(--font-mono)' }}>
            {currentEvent?.protocol || 'HTTP/1.1'}
          </span>
        </div>

        {/* Stat 3: Status Result */}
        <div
          className="panel-elevated"
          style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            backgroundColor: hasError ? 'rgba(251, 113, 133, 0.08)' : undefined,
            borderColor: hasError ? 'rgba(251, 113, 133, 0.3)' : undefined
          }}
        >
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Status</span>
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: hasError ? 'var(--coral-error)' : 'var(--emerald-success)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {hasError ? 'Failure / Drop' : `${m.httpStatusCode || 200} OK`}
          </span>
        </div>

        {/* Stat 4: Total Packets */}
        <div
          className="panel-elevated"
          style={{
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Packets on Wire</span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {m.packetsTransmitted || 1} pkts ({packet?.totalSizeBytes || 74} B)
          </span>
        </div>
      </div>

      {/* SECTION 3: PROGRESSIVE DISCLOSURE - WIRE INSPECTOR TOGGLE */}
      <div style={{ paddingTop: '2px' }}>
        <button
          onClick={() => setIsInspectorExpanded(!isInspectorExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.775rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--cyan-bright)" />
            <span style={{ fontWeight: 600 }}>
              {isInspectorExpanded ? 'Hide Deep Wire Details' : 'Inspect Wire Details (Encapsulation Layers & Latencies)'}
            </span>
          </div>
          {isInspectorExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Collapsed/Expanded Deep Details Panel */}
        {isInspectorExpanded && (
          <div
            style={{
              marginTop: '10px',
              padding: '12px 14px',
              backgroundColor: 'rgba(5, 8, 14, 0.65)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              animation: 'fadeIn var(--transition-fast)'
            }}
          >
            {/* 4-Layer Wire Encapsulation Chips */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  4-Layer Encapsulated Stack
                </span>
                <button
                  onClick={() => setShowHexDump(!showHexDump)}
                  className="btn-ghost"
                  style={{ fontSize: '0.675rem', color: 'var(--cyan-bright)', padding: '2px 6px' }}
                >
                  <Terminal size={11} />
                  <span>{showHexDump ? 'Hide Hex' : 'Wireshark Hex'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
                {/* L7 Application */}
                <div
                  onClick={() => onOpenTopic('layer_application')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    cursor: 'pointer',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title="Click to learn about Layer 7"
                >
                  <div style={{ color: 'var(--emerald-success)', fontWeight: 700, fontSize: '0.65rem' }}>L7 APPLICATION</div>
                  <div style={{ color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {packet?.applicationLayer
                      ? packet.applicationLayer.type === 'HTTP'
                        ? `HTTP ${packet.applicationLayer.data.method || 'GET'} ${packet.applicationLayer.data.path || '/'}`
                        : packet.applicationLayer.type === 'DNS'
                        ? `DNS Query ${packet.applicationLayer.data.questions?.[0]?.name || ''}`
                        : packet.applicationLayer.type === 'TLS'
                        ? `TLS 1.3 ${packet.applicationLayer.data.handshakeType || 'Record'}`
                        : packet.applicationLayer.type === 'SQL'
                        ? `SQL ${(packet.applicationLayer.data.query || '').slice(0, 16)}...`
                        : 'ARP Address Query'
                      : 'HTTP/1.1 GET /products'}
                  </div>
                </div>

                {/* L4 Transport */}
                <div
                  onClick={() => onOpenTopic('layer_transport')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    cursor: 'pointer',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title="Click to learn about Layer 4"
                >
                  <div style={{ color: 'var(--blue-ice)', fontWeight: 700, fontSize: '0.65rem' }}>L4 TRANSPORT</div>
                  <div style={{ color: '#ffffff' }}>
                    {packet?.transportLayer
                      ? `${'flags' in packet.transportLayer ? 'TCP' : 'UDP'} :${packet.transportLayer.sourcePort} → :${packet.transportLayer.destinationPort}`
                      : 'TCP :54321 → :443'}
                  </div>
                </div>

                {/* L3 Network */}
                <div
                  onClick={() => onOpenTopic('layer_network')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(167, 139, 250, 0.08)',
                    border: '1px solid rgba(167, 139, 250, 0.25)',
                    cursor: 'pointer',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title="Click to learn about Layer 3"
                >
                  <div style={{ color: 'var(--violet-bright)', fontWeight: 700, fontSize: '0.65rem' }}>L3 NETWORK</div>
                  <div style={{ color: '#ffffff' }}>
                    {packet?.networkLayer?.sourceIp || '192.168.1.105'} → {packet?.networkLayer?.destinationIp || '104.21.58.77'}
                  </div>
                </div>

                {/* L2 Data Link */}
                <div
                  onClick={() => onOpenTopic('layer_datalink')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                  title="Click to learn about Layer 2"
                >
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.65rem' }}>L2 DATA LINK</div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    Ethernet II (MAC: {packet?.linkLayer?.destinationMac?.slice(0, 8) || '00:1c:73'})
                  </div>
                </div>
              </div>
            </div>

            {/* Wireshark Hex Dump (if toggled) */}
            {showHexDump && (
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#030508',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                  Raw Wire Frame ({packet?.totalSizeBytes || 74} Bytes):
                </div>
                <pre
                  style={{
                    margin: 0,
                    fontSize: '0.65rem',
                    color: 'var(--cyan-bright)',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.3'
                  }}
                >
                  {packet?.rawHexPreview || '0000  00 1c 73 9a 11 01 52 54 00 12 34 56 08 00 45 00...'}
                </pre>
              </div>
            )}

            {/* Detailed Stage Latencies */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Cumulative Stage Breakdown
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  DNS: <span style={{ color: 'var(--violet-bright)', fontWeight: 600 }}>{m.dnsTimeMs.toFixed(1)} ms</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  TCP: <span style={{ color: 'var(--blue-ice)', fontWeight: 600 }}>{m.tcpHandshakeMs.toFixed(1)} ms</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  TLS: <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{m.tlsHandshakeMs.toFixed(1)} ms</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Server: <span style={{ color: 'var(--amber-warning)', fontWeight: 600 }}>{m.serverProcessingMs.toFixed(1)} ms</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  DB: <span style={{ color: 'var(--emerald-success)', fontWeight: 600 }}>{m.databaseTimeMs.toFixed(1)} ms</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
