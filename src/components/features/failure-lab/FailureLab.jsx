import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { FAILURE_SCENARIOS } from '../../../engine/failures.js';

export const FailureLab = ({ onRunFailureScenario }) => {
  const [selectedFailure, setSelectedFailure] = useState('DNS_FAILURE');

  const failureKeys = Object.keys(FAILURE_SCENARIOS).filter(
    (k) => k !== 'NONE'
  );

  const activeScenario = FAILURE_SCENARIOS[selectedFailure] || FAILURE_SCENARIOS.DNS_FAILURE;

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
