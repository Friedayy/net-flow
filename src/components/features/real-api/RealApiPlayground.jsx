import React, { useState } from 'react';
import {
  Server,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw
} from 'lucide-react';

export const RealApiPlayground = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/products');
  const [isLoading, setIsLoading] = useState(false);
  const [realResponse, setRealResponse] = useState(null);
  const [error, setError] = useState(null);

  const endpoints = [
    { path: '/api/products', label: 'GET /api/products (Product Catalog)', desc: 'Fetches deterministic 5-product sample dataset with prices and inventory.' },
    { path: '/api/health', label: 'GET /api/health (Service Health)', desc: 'Returns backend server uptime, timestamp, and version status.' },
    { path: '/api/products/1', label: 'GET /api/products/1 (Single Record)', desc: 'Queries specific product by integer ID from the in-memory database.' },
    { path: '/api/products/999', label: 'GET /api/products/999 (Real 404)', desc: 'Requests non-existent product ID, returning real HTTP 404 response.' },
    { path: '/api/simulate/error-500', label: 'GET /api/simulate/error-500 (Real 500)', desc: 'Triggers simulated unhandled exception in backend controller.' },
    { path: '/api/simulate/db-down', label: 'GET /api/simulate/db-down (Real 503)', desc: 'Simulates PostgreSQL connection timeout and returns 503 Service Unavailable.' }
  ];

  const handleExecuteRealRequest = async () => {
    setIsLoading(true);
    setError(null);
    setRealResponse(null);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/trace-real', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: selectedEndpoint })
      });

      const data = await res.json();
      const wallClockMs = performance.now() - startTime;

      setRealResponse({
        ...data,
        clientObservedDurationMs: parseFloat(wallClockMs.toFixed(2))
      });
    } catch (err) {
      setError(`Failed to connect to backend server: ${err.message}. Ensure the local demo server is running on port 3001.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Banner */}
      <div
        className="panel-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderLeft: '4px solid var(--emerald-success)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="var(--emerald-success)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Real Demonstration API Probe
            </h2>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--emerald-success)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}
            >
              EXPRESS BACKEND
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Execute real HTTP fetch calls against our Node.js/Express backend on port 3001. Compare real-world browser observations against NetFlow's simulated packet breakdown.
          </p>
        </div>

        <button
          onClick={handleExecuteRealRequest}
          className="btn-primary"
          disabled={isLoading}
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={14} style={{ animation: 'radarSweep 1s linear infinite' }} />
              <span>Executing Request...</span>
            </>
          ) : (
            <>
              <Play size={14} fill="currentColor" />
              <span>Execute Real HTTP Request</span>
            </>
          )}
        </button>
      </div>

      {/* Critical Notice */}
      <div
        className="panel-elevated"
        style={{
          padding: '12px 16px',
          borderLeft: '3px solid var(--amber-warning)',
          backgroundColor: 'rgba(251, 191, 36, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'var(--amber-warning)', marginBottom: '4px' }}>
          <Info size={15} />
          <strong style={{ fontSize: '0.8rem' }}>Architectural Boundary: What Real Browsers Can & Cannot See</strong>
        </div>
        <p style={{ fontSize: '0.775rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
          When an application executes a real HTTP <code>fetch()</code>, the browser receives only Layer 7 HTTP metadata (status, headers, body). Browsers do <strong>not</strong> have OS kernel privileges to inspect Layer 2 Ethernet frames or intermediate router hops. NetFlow bridges this gap by modeling the entire journey!
        </p>
      </div>

      {/* Endpoint Selector Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Demonstration Endpoint:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '8px' }}>
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint === ep.path;
            return (
              <div
                key={ep.path}
                onClick={() => setSelectedEndpoint(ep.path)}
                className="panel-glass"
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--emerald-success)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-glass)',
                  transition: 'all 120ms'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: isSelected ? 'var(--emerald-success)' : 'var(--text-primary)' }}>
                    {ep.label}
                  </strong>
                  {isSelected && <CheckCircle size={13} color="var(--emerald-success)" />}
                </div>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>{ep.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results View */}
      {error && (
        <div
          className="panel-glass"
          style={{
            padding: '14px',
            border: '1px solid var(--coral-error)',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--coral-error)'
          }}
        >
          <AlertCircle size={18} />
          <div>
            <strong style={{ fontSize: '0.85rem' }}>Backend Communication Error</strong>
            <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{error}</div>
          </div>
        </div>
      )}

      {realResponse && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
          {/* Real Wire Observation */}
          <div className="panel-glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--emerald-success)' }}>
                Real HTTP Wire Observation
              </h4>
              <span
                className={`badge-protocol ${realResponse.status === 200 ? 'badge-http' : 'badge-error'}`}
              >
                {realResponse.status} {realResponse.statusText}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
              <div className="panel-elevated" style={{ padding: '8px 10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target URL:</span>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-bright)', marginTop: '2px' }}>
                  {realResponse.targetUrl}
                </div>
              </div>
              <div className="panel-elevated" style={{ padding: '8px 10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Wall-Clock Duration:</span>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-success)', fontWeight: 700, marginTop: '2px' }}>
                  {realResponse.wallClockDurationMs} ms
                </div>
              </div>
            </div>

            {/* Real Headers */}
            <div className="panel-elevated" style={{ padding: '10px' }}>
              <h5 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                Actual Response Headers
              </h5>
              <div style={{ maxHeight: '140px', overflowY: 'auto', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {Object.entries(realResponse.headers || {}).map(([k, v]) => (
                  <div key={k}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}:</span>{' '}
                    <span style={{ color: 'var(--text-primary)' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real JSON Payload */}
            <div className="panel-elevated" style={{ padding: '10px', backgroundColor: '#030508' }}>
              <h5 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                Actual Wire JSON Payload
              </h5>
              <pre
                style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--cyan-bright)',
                  margin: 0
                }}
              >
                {JSON.stringify(realResponse.body, null, 2)}
              </pre>
            </div>
          </div>

          {/* Simulated Journey Comparison */}
          <div className="panel-glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
              How NetFlow Simulated Engine Models This
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
              While the real runtime receives the final JSON response, behind the scenes the packet traversed:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { layer: 'Layer 7', name: 'HTTP & REST Dispatch', detail: `Matched route handler ${selectedEndpoint} in Express logic.` },
                { layer: 'Layer 7', name: 'PostgreSQL Query Planner', detail: 'Executed query across products table in 1.15ms.' },
                { layer: 'Layer 4', name: 'TCP Socket Serialization', detail: 'Packed HTTP response into TCP segment (Seq 5500, Ack 1800).' },
                { layer: 'Layer 3', name: 'IP Routing & NAT Remap', detail: 'Translated destination IP back to client private host (192.168.1.105).' },
                { layer: 'Layer 2', name: 'Ethernet Frame Forwarding', detail: 'Switch CAM table forwarded frame directly out Port 1.' }
              ].map((step, i) => (
                <div key={i} className="panel-elevated" style={{ padding: '8px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '0.775rem', color: 'var(--text-primary)' }}>{step.name}</strong>
                    <span className="badge-protocol badge-tcp" style={{ fontSize: '0.625rem' }}>{step.layer}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
