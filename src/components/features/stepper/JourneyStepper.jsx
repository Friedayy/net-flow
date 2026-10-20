import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HoverTooltip } from '../../common/HoverTooltip.jsx';

function getStepTopicId(event) {
  if (!event) return 'url_parsing';
  if (event.id.includes('url')) return 'url_parsing';
  if (event.protocol === 'DNS' || event.id.includes('dns')) return 'dns_lookup';
  if (event.protocol === 'ARP' || event.id.includes('arp')) return 'arp';
  if (event.protocol === 'TCP' || event.id.includes('tcp') || event.id.includes('syn')) return 'tcp_handshake';
  if (event.protocol?.includes('TLS') || event.id.includes('tls')) return 'tls_handshake';
  if (event.protocol === 'SQL' || event.id.includes('db') || event.id.includes('sql')) return 'db_query';
  if (event.id.includes('render') || event.id.includes('dom')) return 'browser_render';
  if (event.id.includes('res') || event.id.includes('200') || event.id.includes('404')) return 'http_res';
  if (event.protocol?.includes('HTTP')) return 'http_req';
  return 'url_parsing';
}

export const JourneyStepper = ({
  events,
  currentStepIndex,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onReset,
  onChangeSpeed,
  onOpenTopic
}) => {
  if (!events || events.length === 0) return null;

  const currentEvent = events[currentStepIndex];

  return (
    <div
      className="panel-glass"
      style={{
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* Top Header of Stepper: Controls & Active Step Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        {/* Step Indicator & Active Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'rgba(0, 245, 212, 0.12)',
              border: '1px solid rgba(0, 245, 212, 0.3)',
              color: 'var(--cyan-bright)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700
            }}
          >
            STEP {currentStepIndex + 1} / {events.length}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
              }}
            >
              {currentEvent?.title || 'Starting Request...'}
            </span>
            {currentEvent?.protocol && (
              <span
                className={`badge-protocol badge-${currentEvent.protocol.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                style={{ fontSize: '0.625rem' }}
              >
                {currentEvent.protocol}
              </span>
            )}
          </div>
        </div>

        {/* Playback Controls & Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Step Back */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            className="btn-ghost"
            style={{
              padding: '5px 8px',
              opacity: currentStepIndex === 0 ? 0.35 : 1,
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
            }}
            title="Step backward (Left Arrow)"
          >
            <SkipBack size={14} />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="btn-primary"
            style={{
              padding: '5px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-full)'
            }}
            title="Play / Pause simulation (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause size={13} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={13} fill="currentColor" />
                <span>{currentStepIndex >= events.length - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= events.length - 1}
            className="btn-ghost"
            style={{
              padding: '5px 8px',
              opacity: currentStepIndex >= events.length - 1 ? 0.35 : 1,
              cursor: currentStepIndex >= events.length - 1 ? 'not-allowed' : 'pointer'
            }}
            title="Step forward (Right Arrow)"
          >
            <SkipForward size={14} />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="btn-ghost"
            style={{ padding: '5px 7px' }}
            title="Reset to beginning (R key)"
          >
            <RotateCcw size={14} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

          {/* Speed Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                style={{
                  fontSize: '0.675rem',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: playbackSpeed === spd ? 'rgba(0, 245, 212, 0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${playbackSpeed === spd ? 'var(--cyan-bright)' : 'var(--border-subtle)'}`,
                  color: playbackSpeed === spd ? 'var(--cyan-bright)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Interactive Progress Scrubber Track */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
          padding: '8px 2px 2px 2px'
        }}
      >
        {events.map((evt, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          const isError = Boolean(evt.isErrorEvent || evt.direction === 'dropped');
          const stepTopicId = getStepTopicId(evt);

          return (
            <HoverTooltip
              key={evt.id || idx}
              topicId={stepTopicId}
              fallbackTitle={`Step ${idx + 1}: ${evt.title}`}
              fallbackBrief={evt.summarySimple}
            >
              <button
                onClick={() => {
                  onJumpToStep(idx);
                  onOpenTopic(stepTopicId);
                }}
                style={{
                  flex: 1,
                  height: isActive ? '10px' : '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isError && (isActive || isCompleted)
                    ? 'var(--coral-error)'
                    : isActive
                    ? 'var(--cyan-bright)'
                    : isCompleted
                    ? 'var(--cyan-muted)'
                    : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive
                    ? '0 0 10px rgba(45, 212, 191, 0.5)'
                    : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all var(--transition-fast)',
                  position: 'relative'
                }}
                title={`Step ${idx + 1}: ${evt.title}`}
              />
            </HoverTooltip>
          );
        })}
      </div>

      {/* Gentle Keyboard Shortcut Hint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.675rem',
          color: 'var(--text-muted)',
          paddingTop: '2px'
        }}
      >
        <span>
          Jump to any step above to inspect the packet at that moment
        </span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          Space: Play/Pause • Arrows: Step
        </span>
      </div>
    </div>
  );
};
