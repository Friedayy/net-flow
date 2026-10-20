import { describe, it, expect } from 'vitest';
import { generateSimulationEvents } from '../engine/simulator';
import { FAILURE_SCENARIOS } from '../engine/failures';
import { FailureType, SimulationConfig } from '../engine/types';

describe('Failure Laboratory Scenarios', () => {
  const baseConfig: SimulationConfig = {
    targetUrl: 'https://example.com/products',
    httpMethod: 'GET',
    ipVersion: 'IPv4',
    httpVersion: 'HTTP/1.1',
    dnsCacheEnabled: false,
    tcpConnectionReused: false,
    failureType: 'NONE',
    packetLossRate: 0,
    latencyMultiplier: 1.0
  };

  it('verifies all failure definitions have symptoms and recovery steps', () => {
    const keys = Object.keys(FAILURE_SCENARIOS) as FailureType[];
    expect(keys.length).toBeGreaterThanOrEqual(9);

    for (const key of keys) {
      const scenario = FAILURE_SCENARIOS[key];
      expect(scenario.title).toBeTruthy();
      expect(scenario.shortDescription).toBeTruthy();
      expect(scenario.symptoms.length).toBeGreaterThan(0);
      expect(scenario.diagnosticTools.length).toBeGreaterThan(0);
      expect(scenario.recoverySteps.length).toBeGreaterThan(0);
    }
  });

  it('executes PACKET_LOSS with Retransmission delay and recovery', () => {
    const events = generateSimulationEvents({
      ...baseConfig,
      failureType: 'PACKET_LOSS'
    });

    const dropEvent = events.find(e => e.title.includes('Packet Loss Detected'));
    expect(dropEvent).toBeDefined();
    expect(dropEvent?.isErrorEvent).toBe(true);

    // After drop, connection recovers and completes!
    const lastEvent = events[events.length - 1];
    expect(lastEvent.phase).toBe('BROWSER_RENDER');
    expect(lastEvent.metrics.packetsDropped).toBe(1);
    expect(lastEvent.metrics.totalSimulatedMs).toBeGreaterThan(1000); // 1000ms RTO penalty
  });

  it('executes BROKEN_LINK and terminates with ICMP Host Unreachable', () => {
    const events = generateSimulationEvents({
      ...baseConfig,
      failureType: 'BROKEN_LINK'
    });

    const lastEvent = events[events.length - 1];
    expect(lastEvent.phase).toBe('FAILURE');
    expect(lastEvent.protocol).toBe('ICMP');
    expect(lastEvent.title).toContain('Network Link Down');
  });

  it('executes HTTP_500 Internal Server Error', () => {
    const events = generateSimulationEvents({
      ...baseConfig,
      failureType: 'HTTP_500'
    });

    const lastEvent = events[events.length - 1];
    expect(lastEvent.metrics.httpStatusCode).toBe(500);
    expect(lastEvent.title).toContain('500');
  });

  it('executes DB_UNAVAILABLE and terminates before 200 OK', () => {
    const events = generateSimulationEvents({
      ...baseConfig,
      failureType: 'DB_UNAVAILABLE'
    });

    const lastEvent = events[events.length - 1];
    expect(lastEvent.phase).toBe('FAILURE');
    expect(lastEvent.protocol).toBe('SQL');
    expect(lastEvent.title).toContain('Database Outage');
  });

  it('executes TIMEOUT and yields 504 Gateway Timeout', () => {
    const events = generateSimulationEvents({
      ...baseConfig,
      failureType: 'TIMEOUT'
    });

    const lastEvent = events[events.length - 1];
    expect(lastEvent.title).toContain('504');
    expect(lastEvent.isErrorEvent).toBe(true);
  });
});
