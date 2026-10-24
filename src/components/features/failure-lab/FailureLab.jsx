import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Play,
  Terminal,
  ShieldAlert,
  Wrench,
  Radio,
  Flame,
  AlertOctagon,
  FileQuestion,
  ServerOff,
  Clock,
  Server,
  RefreshCw
} from 'lucide-react';
import { FAILURE_SCENARIOS } from '../../../engine/failures.js';

export const FailureLab = ({ onRunFailureScenario }) => {
  const [selectedFailure, setSelectedFailure] = useState('DNS_FAILURE');
  const [liveResponse, setLiveResponse] = useState(null);
  const [isProbing, setIsProbing] = useState(false);
  const [probeError, setProbeError] = useState(null);

  const targetProbePath = selectedFailure === 'HTTP_500'
    ? '/api/simulate/error-500'
    : selectedFailure === 'DB_UNAVAILABLE'
    ? '/api/simulate/db-down'
    : selectedFailure === 'HTTP_404'
    ? '/api/products/999'
    : selectedFailure === 'CONNECTION_REFUSED'
    ? '/api/simulate/db-down'
    : '/api/simulate/error-500';

  const handleExecuteLiveProbe = async () => {
    setIsProbing(true);
    setProbeError(null);
    setLiveResponse(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/trace-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetProbePath })
      });
      const data = await res.json();
      const wallClockMs = performance.now() - startTime;
      setLiveResponse({
        ...data,
        clientObservedDurationMs: parseFloat(wallClockMs.toFixed(2))
      });
    } catch (err) {
      setProbeError(`Live probe error: ${err.message}. Verify backend is active on :3001.`);
    } finally {
      setIsProbing(false);
    }
  };

  const failureKeys = Object.keys(FAILURE_SCENARIOS).filter(
    (k) => k !== 'NONE'
  );

  const activeScenario = FAILURE_SCENARIOS[selectedFailure] || FAILURE_SCENARIOS.DNS_FAILURE;

  // Automatically execute live backend probe whenever scenario changes so real wire data is always showing
  useEffect(() => {
    handleExecuteLiveProbe();
  }, [selectedFailure]);

  const getScenarioIcon = (type) => {
    switch (type) {
      case 'DNS_FAILURE':
        return <Radio size={16} color="var(--violet-bright)" />;
      case 'CONNECTION_REFUSED':
        return <AlertOctagon size={16} color="var(--coral-error)" />;
      case 'PACKET_LOSS':
        return <Flame size={16} color="var(--amber-warning)" />;
      case 'BROKEN_LINK':
        return <ShieldAlert size={16} color="var(--coral-error)" />;
      case 'HTTP_404':
        return <FileQuestion size={16} color="var(--blue-ice)" />;
      case 'HTTP_500':
        return <AlertTriangle size={16} color="var(--coral-error)" />;
      case 'DB_UNAVAILABLE':
        return <ServerOff size={16} color="var(--amber-warning)" />;
      case 'TIMEOUT':
        return <Clock size={16} color="var(--text-muted)" />;
      default:
        return <AlertTriangle size={16} />;
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
          borderLeft: '4px solid var(--coral-error)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--coral-error)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              The Failure Laboratory
            </h2>
            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                color: 'var(--coral-error)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}
            >
              FAULT INJECTION
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Inject controlled anomalies into network links, sockets, and applications to observe real-time failure isolation and recovery.
          </p>
        </div>

        <button
          onClick={() => onRunFailureScenario(selectedFailure)}
          className="btn-primary"
          style={{
            padding: '8px 18px',
            backgroundColor: 'var(--coral-error)',
            borderColor: 'var(--coral-error)',
            boxShadow: '0 0 16px rgba(244, 63, 94, 0.35)',
            fontSize: '0.85rem'
          }}
        >
          <Play size={15} fill="currentColor" />
          <span>Inject & Trace Scenario</span>
        </button>
      </div>

      {/* Main Grid: Selector List vs Diagnostic Workbench */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(440px, 2.2fr)',
          gap: '14px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Failure Scenarios Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Failure Condition ({failureKeys.length} Scenarios)
          </h4>

          {failureKeys.map((key) => {
            const scenario = FAILURE_SCENARIOS[key];
            const isSelected = selectedFailure === key;

            return (
              <div
                key={key}
                onClick={() => setSelectedFailure(key)}
                className="panel-glass"
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--coral-error)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(244, 63, 94, 0.08)' : 'var(--bg-surface-glass)',
                  transition: 'all 120ms'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getScenarioIcon(key)}
                    <strong style={{ fontSize: '0.825rem', color: isSelected ? 'var(--coral-error)' : 'var(--text-primary)' }}>
                      {scenario.title}
                    </strong>
                  </div>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {scenario.layer}
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                  {scenario.shortDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Diagnostic Workbench for Selected Failure */}
        <div className="panel-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getScenarioIcon(activeScenario.id)}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeScenario.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <span className="badge-protocol badge-error">
                  {activeScenario.expectedErrorCode}
                </span>
                <span className="badge-protocol badge-tcp">
                  {activeScenario.layer} Layer
                </span>
                <span className="badge-protocol badge-dns">
                  Protocol: {activeScenario.protocol}
                </span>
              </div>
            </div>

            <button
              onClick={() => onRunFailureScenario(activeScenario.id)}
              className="btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '6px 14px',
                backgroundColor: 'var(--coral-error)',
                borderColor: 'var(--coral-error)'
              }}
            >
              <Play size={13} fill="currentColor" />
              <span>Simulate Now</span>
            </button>
          </div>

          {/* Root Cause Section */}
          <div className="panel-elevated" style={{ padding: '12px 14px', borderLeft: '3px solid var(--coral-error)' }}>
            <h5 style={{ fontSize: '0.725rem', color: 'var(--coral-error)', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
              Root Cause & Networking Behavior
            </h5>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-primary)', margin: 0 }}>
              {activeScenario.technicalDescription}
            </p>
          </div>

          {/* Real Backend vs Simulation Comparison Panel */}
          <div
            className="panel-elevated"
            style={{
              padding: '12px 14px',
              borderLeft: '3px solid var(--cyan-bright)',
              backgroundColor: 'rgba(0, 245, 212, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={15} color="var(--cyan-bright)" />
                <h5 style={{ fontSize: '0.775rem', color: 'var(--cyan-bright)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                  Live Backend Verification: Real Request vs Simulation
                </h5>
                <span
                  style={{
                    fontSize: '0.625rem',
                    padding: '1px 5px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--emerald-success)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  PORT 3001 LIVE
                </span>
              </div>

              <button
                onClick={handleExecuteLiveProbe}
                disabled={isProbing}
                className="btn-primary"
                style={{
                  fontSize: '0.725rem',
                  padding: '4px 10px',
                  backgroundColor: 'rgba(0, 245, 212, 0.15)',
                  color: 'var(--cyan-bright)',
                  borderColor: 'rgba(0, 245, 212, 0.4)',
                  boxShadow: 'none'
                }}
              >
                {isProbing ? (
                  <>
                    <RefreshCw size={11} style={{ animation: 'radarSweep 1s linear infinite' }} />
                    <span>Probing Backend...</span>
                  </>
                ) : (
                  <>
                    <Play size={11} fill="currentColor" />
                    <span>Execute Real Wire Probe</span>
                  </>
                )}
              </button>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.35' }}>
              Compare NetFlow's simulated packet breakdown against actual socket execution on the local Node.js/Express backend ({targetProbePath}).
            </p>

            {probeError && (
              <div style={{ padding: '6px 10px', borderRadius: 'var(--radius-xs)', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--coral-error)', fontSize: '0.72rem' }}>
                {probeError}
              </div>
            )}

            {liveResponse && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '8px', marginTop: '2px' }}>
                {/* Real Wire Observation */}
                <div style={{ padding: '8px 10px', backgroundColor: '#030508', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.7rem', color: 'var(--emerald-success)' }}>
                      Actual Wire Response
                    </strong>
                    <span className="badge-protocol badge-error" style={{ fontSize: '0.6rem' }}>
                      {liveResponse.status} {liveResponse.statusText}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    RTT: <span style={{ color: 'var(--emerald-success)' }}>{liveResponse.wallClockDurationMs}ms</span> • Target: {liveResponse.targetUrl}
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.65rem', color: 'var(--cyan-bright)', maxHeight: '90px', overflowY: 'auto' }}>
                    {JSON.stringify(liveResponse.body, null, 2)}
                  </pre>
                </div>

                {/* Simulation Model Comparison */}
                <div style={{ padding: '8px 10px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <strong style={{ fontSize: '0.7rem', color: 'var(--cyan-bright)', display: 'block', marginBottom: '4px' }}>
                    NetFlow Engine Diagnostic Isolation
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.675rem' }}>
                    <div>
                      <span style={{ color: 'var(--coral-error)', fontWeight: 700 }}>Fault Layer:</span> {activeScenario.layer} ({activeScenario.protocol})
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Kernel State:</span> Socket terminated with {activeScenario.expectedErrorCode}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.3' }}>
                      Wire frame encapsulated with zero application payload delivery; error isolated before TLS handshake completion.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Symptoms List */}
          <div className="panel-elevated" style={{ padding: '12px 14px' }}>
            <h5 style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>
              Observed Symptoms
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeScenario.symptoms?.map((symptom, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.775rem', color: 'var(--text-primary)' }}>
                  <AlertTriangle size={13} color="var(--amber-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Commands (Terminal Style) */}
          <div className="panel-elevated" style={{ padding: '12px 14px', backgroundColor: '#030508' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Terminal size={14} color="var(--cyan-bright)" />
              <h5 style={{ fontSize: '0.725rem', color: 'var(--cyan-bright)', fontWeight: 700, textTransform: 'uppercase' }}>
                How Engineers Diagnose This Failure
              </h5>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeScenario.diagnosticTools?.map((cmd, i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--blue-ice)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>$</span>
                  <span>{cmd}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Remediation Plan */}
          <div className="panel-elevated" style={{ padding: '12px 14px', borderLeft: '3px solid var(--emerald-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Wrench size={14} color="var(--emerald-success)" />
              <h5 style={{ fontSize: '0.725rem', color: 'var(--emerald-success)', fontWeight: 700, textTransform: 'uppercase' }}>
                Remediation & Recovery Action Plan
              </h5>
            </div>
            <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.775rem', color: 'var(--text-primary)', lineHeight: '1.45', margin: 0 }}>
              {activeScenario.recoverySteps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
