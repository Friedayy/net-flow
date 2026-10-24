import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from '../components/layout/Header.jsx';
import { MobileNotice } from '../components/layout/MobileNotice.jsx';
import { UrlLauncher } from '../components/features/launcher/UrlLauncher.jsx';
import { PRESETS } from '../components/features/launcher/PresetScenarios.jsx';
import { NetworkCanvas } from '../components/features/network-canvas/NetworkCanvas.jsx';
import { JourneyStepper } from '../components/features/stepper/JourneyStepper.jsx';
import { TelemetryConsole } from '../components/features/telemetry/TelemetryConsole.jsx';
import { PacketInspector } from '../components/features/packet-inspector/PacketInspector.jsx';
import { FailureLab } from '../components/features/failure-lab/FailureLab.jsx';
import { RealApiPlayground } from '../components/features/real-api/RealApiPlayground.jsx';
import { TopicDetailDrawer } from '../components/features/topic-modal/TopicDetailDrawer.jsx';
import { GuidedTour } from '../components/features/learning/GuidedTour.jsx';
import { SettingsModal } from '../components/features/settings/SettingsModal.jsx';

import { INITIAL_NODES, INITIAL_LINKS } from '../engine/topology.js';
import { generateSimulationEvents } from '../engine/simulator.js';
import { deriveSimulationState, calculatePlaybackIntervalMs } from '../engine/event-scheduler.js';

export const App = () => {
  // Modal & Drawer State
  const [activeTopicDrawerId, setActiveTopicDrawerId] = useState(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackendAlive, setIsBackendAlive] = useState(true);

  // Active Workspace View: 'topology' | 'inspector' | 'failures' | 'realapi'
  const [activeView, setActiveView] = useState('topology');

  // Simulation Configuration
  const [config, setConfig] = useState({
    targetUrl: 'https://example.com/products',
    httpMethod: 'GET',
    ipVersion: 'IPv4',
    httpVersion: 'HTTP/1.1',
    dnsCacheEnabled: false,
    tcpConnectionReused: false,
    failureType: 'NONE',
    packetLossRate: 0,
    latencyMultiplier: 1.0
  });

  // Simulation Engine & Playback State
  const [events, setEvents] = useState(() => generateSimulationEvents(config));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Selection State
  const [selectedNodeId, setSelectedNodeId] = useState('client');
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  // Check Backend Live Status on Mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ok') {
          setIsBackendAlive(true);
        }
      })
      .catch(() => {
        setIsBackendAlive(false);
      });
  }, []);

  // Derived Simulation State
  const derived = useMemo(
    () => deriveSimulationState(events, currentStepIndex),
    [events, currentStepIndex]
  );

  // Handle Starting a New Simulation from URL Launcher
  const handleStartSimulation = useCallback((targetUrl, method, preset) => {
    const newConfig = {
      ...config,
      targetUrl,
      httpMethod: method,
      failureType: preset ? preset.failureType : 'NONE',
      dnsCacheEnabled: preset ? preset.dnsCacheEnabled : config.dnsCacheEnabled
    };

    setConfig(newConfig);
    const newEvents = generateSimulationEvents(newConfig);
    setEvents(newEvents);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setSelectedLinkId(null);
  }, [config]);

  // Handle Running a Scenario from Failure Lab
  const handleRunFailureScenario = useCallback((failureType) => {
    const matchingPreset = PRESETS.find(p => p.failureType === failureType);
    const targetUrl = matchingPreset ? matchingPreset.url : config.targetUrl;
    const newConfig = {
      ...config,
      failureType,
      targetUrl
    };
    setConfig(newConfig);
    const newEvents = generateSimulationEvents(newConfig);
    setEvents(newEvents);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    setActiveView('topology');
  }, [config]);

  // Step Forward
  const handleStepForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(events.length - 1, prev + 1));
  }, [events.length]);

  // Step Backward
  const handleStepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Jump to specific step
  const handleJumpToStep = useCallback((index) => {
    setCurrentStepIndex(Math.max(0, Math.min(events.length - 1, index)));
    setIsPlaying(false);
  }, [events.length]);

  // Reset
  const handleReset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Playback Timer
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= events.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = calculatePlaybackIntervalMs(1300, playbackSpeed);
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= events.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, events.length, playbackSpeed]);

  // Universal Topic Opener (for click-to-explain)
  const handleOpenTopic = useCallback((topicId) => {
    setActiveTopicDrawerId(topicId);
  }, []);

  // Keyboard Shortcuts (Space to play/pause, Arrow keys to step)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      } else if (e.code === 'Escape') {
        setActiveTopicDrawerId(null);
        setIsTourOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStepForward, handleStepBackward, handleReset]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-darkest)' }}>
      {/* Mobile Notice Bar & Modal */}
      <MobileNotice />

      {/* Global Application Command Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartTour={() => setIsTourOpen(true)}
        onOpenTopicsList={() => handleOpenTopic('url_parsing')}
        isBackendAlive={isBackendAlive}
        currentStepIndex={currentStepIndex}
        totalSteps={events.length}
        currentRttMs={derived.metrics?.totalSimulatedMs || 0}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Unified Welcoming Workspace */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px 24px 32px 24px',
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {/* Request Launcher Omnibar & Curated Quick Scenarios */}
        <UrlLauncher
          initialUrl={config.targetUrl}
          initialMethod={config.httpMethod}
          onStartSimulation={handleStartSimulation}
          isRunning={isPlaying}
          onOpenTopic={handleOpenTopic}
        />

        {/* Workspace Active View Rendering */}
        {activeView === 'topology' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Interactive Network Topology Canvas (Visual Focal Point) */}
            <NetworkCanvas
              nodes={INITIAL_NODES}
              links={INITIAL_LINKS}
              currentEvent={derived.currentEvent}
              selectedNodeId={selectedNodeId}
              selectedLinkId={selectedLinkId}
              onSelectNode={(nodeId) => {
                setSelectedNodeId(nodeId);
                setSelectedLinkId(null);
                handleOpenTopic(nodeId);
              }}
              onSelectLink={(linkId) => {
                setSelectedLinkId(linkId);
                setSelectedNodeId(null);
                handleOpenTopic(linkId);
              }}
              onOpenTopic={handleOpenTopic}
              nodeStates={derived.nodeStates}
            />

            {/* Sleek Interactive Progress Scrubber & Media Controls */}
            <JourneyStepper
              events={events}
              currentStepIndex={currentStepIndex}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onPlay={() => {
                if (currentStepIndex >= events.length - 1) {
                  setCurrentStepIndex(0);
                }
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onJumpToStep={handleJumpToStep}
              onReset={handleReset}
              onChangeSpeed={setPlaybackSpeed}
              onOpenTopic={handleOpenTopic}
            />

            {/* Welcoming Journey Narrative Story & Wire Inspector */}
            <TelemetryConsole
              currentEvent={derived.currentEvent}
              metrics={derived.metrics}
              hasError={derived.hasEncounteredError}
              onOpenTopic={handleOpenTopic}
              nodes={INITIAL_NODES}
            />
          </div>
        )}

        {activeView === 'inspector' && (
          <div style={{ minHeight: '680px', display: 'flex', flexDirection: 'column' }}>
            <PacketInspector packet={derived.currentEvent?.packet || events.find(e => e.packet)?.packet || null} />
          </div>
        )}

        {activeView === 'failures' && (
          <FailureLab onRunFailureScenario={handleRunFailureScenario} />
        )}

        {activeView === 'realapi' && (
          <RealApiPlayground />
        )}
      </main>

      {/* Universal Slide-over Topic Detail Drawer */}
      <TopicDetailDrawer
        topicId={activeTopicDrawerId}
        onClose={() => setActiveTopicDrawerId(null)}
        onSelectTopic={(id) => setActiveTopicDrawerId(id)}
        currentEvent={derived.currentEvent}
      />

      {/* Interactive Guided Tour Overlay */}
      <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Simulation Configuration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={(updated) => {
          const newConfig = { ...config, ...updated };
          setConfig(newConfig);
          const newEvents = generateSimulationEvents(newConfig);
          setEvents(newEvents);
          setCurrentStepIndex(0);
        }}
      />
    </div>
  );
};

export default App;
