import React from 'react';
import {
  Clock,
  Zap,
  ShieldCheck,
  Server,
  Database,
  Layers,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const MetricsOverview = ({ metrics, hasError }) => {
  if (!metrics) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '8px',
        width: '100%',
        padding: '10px 14px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      {/* Metric 1: DNS Duration */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--violet-bright)' }}>
          <Zap size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>DNS Lookup</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.dnsTimeMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>UDP Port 53</div>
      </div>

      {/* Metric 2: TCP Handshake */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--blue-ice)' }}>
          <ArrowRightLeft size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>TCP Connect</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.tcpHandshakeMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>1-RTT Handshake</div>
      </div>

      {/* Metric 3: TLS 1.3 Handshake */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#a5b4fc' }}>
          <ShieldCheck size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>TLS 1.3</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.tlsHandshakeMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>AES-256-GCM / X25519</div>
      </div>

      {/* Metric 4: Server Route & Logic */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--cyan-bright)' }}>
          <Server size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>App Server</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.serverProcessingMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Route Dispatch</div>
      </div>

      {/* Metric 5: Database Query */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--amber-warning)' }}>
          <Database size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>DB Query</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.databaseTimeMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>PostgreSQL Index Scan</div>
      </div>

      {/* Metric 6: Total Simulated Latency */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: hasError ? 'var(--coral-error)' : 'var(--emerald-success)' }}>
          <Clock size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Elapsed</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.totalSimulatedMs.toFixed(1)} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ms</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Total Round Trip</div>
      </div>

      {/* Metric 7: Packets & Hops */}
      <div className="panel-elevated" style={{ padding: '6px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <Layers size={13} />
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>Hops & Pkts</span>
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
          {metrics.hopCount} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>hops / {metrics.packetsTransmitted} pkts</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: metrics.packetsDropped > 0 ? 'var(--coral-error)' : 'var(--text-muted)' }}>
          {metrics.packetsDropped > 0 ? `${metrics.packetsDropped} dropped` : '100% Delivery'}
        </div>
      </div>

      {/* Metric 8: Status Code */}
      <div
        className="panel-elevated"
        style={{
          padding: '6px 10px',
          borderColor: metrics.httpStatusCode === 200
            ? 'rgba(16, 185, 129, 0.4)'
            : metrics.httpStatusCode
              ? 'rgba(244, 63, 94, 0.4)'
              : 'var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {metrics.httpStatusCode === 200 ? (
            <CheckCircle size={13} color="var(--emerald-success)" />
          ) : (
            <AlertCircle size={13} color={metrics.httpStatusCode ? 'var(--coral-error)' : 'var(--text-muted)'} />
          )}
          <span style={{ fontSize: '0.675rem', fontWeight: 600, textTransform: 'uppercase' }}>HTTP Status</span>
        </div>
        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: metrics.httpStatusCode === 200 ? 'var(--emerald-success)' : metrics.httpStatusCode ? 'var(--coral-error)' : 'var(--text-muted)',
            marginTop: '2px'
          }}
        >
          {metrics.httpStatusCode ? `${metrics.httpStatusCode}` : 'Pending'}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          {metrics.responseSizeBytes ? `${metrics.responseSizeBytes} bytes payload` : 'In flight'}
        </div>
      </div>
    </div>
  );
};
