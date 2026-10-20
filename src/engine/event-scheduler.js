// Event Scheduler & Playback State Manager (Plain JavaScript)
// Provides pure and reactive functions for stepping, jumping, rewinding, and derived state

export function deriveSimulationState(events, stepIndex) {
  if (!events || events.length === 0) {
    return {
      currentEvent: null,
      activeNodeId: null,
      activeLinkIds: [],
      nodeStates: {},
      metrics: null,
      progressPercent: 0,
      isFirstStep: true,
      isLastStep: true,
      hasEncounteredError: false
    };
  }

  const safeIndex = Math.max(0, Math.min(stepIndex, events.length - 1));
  const currentEvent = events[safeIndex];

  // Active node is generally destination or source depending on direction
  const activeNodeId = currentEvent.direction === 'response' 
    ? currentEvent.destNodeId 
    : currentEvent.sourceNodeId;

  const hasEncounteredError = events.slice(0, safeIndex + 1).some(e => e.isErrorEvent);

  return {
    currentEvent,
    activeNodeId,
    activeLinkIds: currentEvent.activeLinkIds || [],
    nodeStates: currentEvent.nodeStates,
    metrics: currentEvent.metrics,
    progressPercent: Math.round(((safeIndex + 1) / events.length) * 100),
    isFirstStep: safeIndex === 0,
    isLastStep: safeIndex === events.length - 1,
    hasEncounteredError
  };
}

export function calculatePlaybackIntervalMs(baseMs, speedMultiplier) {
  return Math.max(100, Math.round(baseMs / speedMultiplier));
}
