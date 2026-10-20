import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Filter
} from 'lucide-react';

export const Timeline = ({
  events = [],
  currentStepIndex = 0,
  isPlaying = false,
  playbackSpeed = 1,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onReset,
  onChangeSpeed
}) => {
  const [protocolFilter, setProtocolFilter] = useState('ALL');

  const filteredEvents = events.filter((e) => {
    if (protocolFilter === 'ALL') return true;
    return e.protocol?.toLowerCase().includes(protocolFilter.toLowerCase());
  });

  const speeds = [0.5, 1, 2];
  const progressPercent = events.length > 0 ? ((currentStepIndex + 1) / events.length) * 100 : 0;

  const getProtocolBadgeClass = (proto) => {
    switch (proto) {
      case 'DNS':
        return 'badge-dns';
      case 'TCP':
        return 'badge-tcp';
      case 'TLS 1.3':
        return 'badge-tls';
      case 'HTTP/1.1':
      case 'HTTP/2':
      case 'HTTP/3 (QUIC)':
        return 'badge-http';
      case 'SQL':
        return 'badge-sql';
      case 'ARP':
        return 'badge-arp';
      default:
        return 'badge-tcp';
    }
  };

  return (
    <div
      className="panel-glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '340px',
        overflow: 'hidden'
      }}
    >
      {/* Playback Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        {/* Playback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            onClick={onReset}
            className="btn-ghost"
            style={{ padding: '5px 8px' }}
            title="Reset Simulation to Beginning"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={onStepBackward}
            className="btn-ghost"
            style={{ padding: '5px 8px' }}
            disabled={currentStepIndex <= 0}
            title="Step Backward (Previous Event)"
          >
            <SkipBack size={14} />
          </button>

          {isPlaying ? (
            <button
              onClick={onPause}
              className="btn-primary"
              style={{ padding: '6px 14px', backgroundColor: 'var(--amber-warning)', borderColor: 'var(--amber-warning)', fontSize: '0.75rem' }}
              title="Pause Simulation"
            >
              <Pause size={14} fill="currentColor" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
              disabled={currentStepIndex >= events.length - 1}
              title="Play / Resume Simulation"
            >
              <Play size={14} fill="currentColor" />
              <span>{currentStepIndex >= events.length - 1 ? 'Replay' : 'Play'}</span>
            </button>
          )}

          <button
            onClick={onStepForward}
            className="btn-ghost"
            style={{ padding: '5px 8px' }}
            disabled={currentStepIndex >= events.length - 1}
            title="Step Forward (Next Event)"
          >
            <SkipForward size={14} />
          </button>

          {/* Speed Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '6px' }}>
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className="btn-ghost"
                style={{
                  padding: '3px 6px',
                  fontSize: '0.675rem',
                  fontFamily: 'var(--font-mono)',
                  color: playbackSpeed === s ? 'var(--cyan-bright)' : 'var(--text-muted)',
                  fontWeight: playbackSpeed === s ? 700 : 400,
                  backgroundColor: playbackSpeed === s ? 'rgba(0, 245, 212, 0.12)' : 'transparent'
                }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Progress Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Step <strong style={{ color: 'var(--cyan-bright)' }}>{currentStepIndex + 1}</strong> of {events.length}
          </div>

          {/* Protocol Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={13} color="var(--text-muted)" />
            <select
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '3px 6px',
                fontSize: '0.725rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Protocols</option>
              <option value="DNS">DNS</option>
              <option value="TCP">TCP</option>
              <option value="TLS">TLS 1.3</option>
              <option value="HTTP">HTTP</option>
              <option value="SQL">SQL</option>
              <option value="ARP">ARP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrubbable Progress Line */}
      <div
        style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          position: 'relative',
          cursor: 'pointer'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = clickX / rect.width;
          const targetIndex = Math.min(events.length - 1, Math.max(0, Math.floor(ratio * events.length)));
          onJumpToStep(targetIndex);
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #0284c7, #00f5d4)',
            transition: 'width 120ms ease-out'
          }}
        />
      </div>

      {/* Scrollable Event List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '6px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        {filteredEvents.map((evt) => {
          const isCurrent = evt.stepIndex - 1 === currentStepIndex;
          const isPast = evt.stepIndex - 1 < currentStepIndex;

          return (
            <div
              key={evt.id}
              onClick={() => onJumpToStep(evt.stepIndex - 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isCurrent
                  ? 'rgba(0, 245, 212, 0.1)'
                  : isPast
                    ? 'rgba(255, 255, 255, 0.015)'
                    : 'transparent',
                border: isCurrent
                  ? '1px solid var(--border-active)'
                  : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 120ms'
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                {/* Step Index & Status Icon */}
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: evt.isErrorEvent
                      ? 'rgba(244, 63, 94, 0.2)'
                      : isCurrent
                        ? 'var(--cyan-bright)'
                        : 'var(--bg-surface-elevated)',
                    color: evt.isErrorEvent
                      ? 'var(--coral-error)'
                      : isCurrent
                        ? '#06080d'
                        : 'var(--text-muted)',
                    border: evt.isErrorEvent ? '1px solid var(--coral-error)' : 'none'
                  }}
                >
                  {evt.isErrorEvent ? '!' : evt.stepIndex}
                </div>

                {/* Protocol Badge */}
                <span className={`badge-protocol ${getProtocolBadgeClass(evt.protocol)}`}>
                  {evt.protocol}
                </span>

                {/* Event Title & Summary */}
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--cyan-bright)' : 'var(--text-primary)'
                    }}
                  >
                    {evt.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.675rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {evt.summarySimple}
                  </div>
                </div>
              </div>

              {/* Right Side: Timestamp & Hop Info */}
              <div style={{ textAlign: 'right', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  +{evt.simulatedTimeMs.toFixed(1)}ms
                </span>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                  {evt.sourceNodeId} → {evt.destNodeId}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
