import React, { useState } from 'react';
import { Play, AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { PresetScenarios, PRESETS } from './PresetScenarios.jsx';

export const UrlLauncher = ({
  initialUrl,
  initialMethod,
  onStartSimulation,
  isRunning,
  onOpenTopic
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [method, setMethod] = useState(initialMethod);
  const [selectedPreset, setSelectedPreset] = useState('preset_webpage');
  const [validationError, setValidationError] = useState(null);

  const handleTrace = (e) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError('Please enter a destination URL or domain name.');
      return;
    }

    try {
      let testUrl = trimmed;
      if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
        testUrl = 'https://' + testUrl;
      }
      new URL(testUrl);
      const activePreset = PRESETS.find(p => p.id === selectedPreset);
      onStartSimulation(testUrl, method, activePreset);
    } catch {
      setValidationError('Invalid URL format. Example: https://example.com/products');
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setUrl(preset.url);
    setMethod(preset.method);
    setValidationError(null);
    onStartSimulation(preset.url, preset.method, preset);
  };

  return (
    <div
      className="panel-glass"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Friendly Welcoming Prompt */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Explore Any Web Request
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Watch what happens behind the scenes from DNS resolution to database query.
          </p>
        </div>
      </div>

      {/* Primary Input Omnibar */}
      <form
        onSubmit={handleTrace}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%'
        }}
      >
        {/* Method Selector */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            padding: '9px 14px',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: method === 'GET' ? 'var(--cyan-bright)' : 'var(--amber-warning)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.825rem',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer'
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>

        {/* URL Input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setValidationError(null);
            }}
            placeholder="Enter web address, e.g. https://example.com/products"
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: 'rgba(7, 10, 18, 0.75)',
              color: 'var(--text-primary)',
              border: `1px solid ${validationError ? 'var(--coral-error)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-mono)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
              transition: 'border-color var(--transition-fast)'
            }}
          />
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          className="btn-primary"
          style={{
            padding: '10px 22px',
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            borderRadius: 'var(--radius-md)'
          }}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <RefreshCw size={15} style={{ animation: 'radarSweep 1s linear infinite' }} />
              <span>Tracing...</span>
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              <span>Trace Request</span>
            </>
          )}
        </button>
      </form>

      {/* Validation Message */}
      {validationError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--coral-error)',
            fontSize: '0.75rem',
            fontWeight: 500
          }}
        >
          <AlertCircle size={13} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Preset Scenarios Strip */}
      <PresetScenarios
        onSelectPreset={handleSelectPreset}
        selectedPresetId={selectedPreset}
        onOpenTopic={onOpenTopic}
      />
    </div>
  );
};
