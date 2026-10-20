import { describe, it, expect } from 'vitest';
import { generateSimulationEvents, parseSimulationUrl } from '../engine/simulator';
import { deriveSimulationState } from '../engine/event-scheduler';
import { SimulationConfig } from '../engine/types';

describe('NetFlow Simulation Engine', () => {
  const defaultConfig: SimulationConfig = {
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

  it('parses URL into protocol, hostname, port, and path', () => {
    const parsed = parseSimulationUrl('https://example.com:8443/api/products?sort=asc');
    expect(parsed.protocol).toBe('https:');
    expect(parsed.hostname).toBe('example.com');
    expect(parsed.port).toBe(8443);
    expect(parsed.pathname).toBe('/api/products');
    expect(parsed.search).toBe('?sort=asc');
    expect(parsed.isHttps).toBe(true);
  });

  it('generates a full coherent HTTPS baseline event sequence', () => {
    const events = generateSimulationEvents(defaultConfig);
    expect(events.length).toBeGreaterThan(8);

    // Verify chronological order
    for (let i = 1; i < events.length; i++) {
      expect(events[i].simulatedTimeMs).toBeGreaterThanOrEqual(events[i - 1].simulatedTimeMs);
      expect(events[i].stepIndex).toBe(i + 1);
    }

    // Verify presence of all key phases
    const phases = events.map(e => e.phase);
    expect(phases).toContain('URL_PARSING');
    expect(phases).toContain('DNS');
    expect(phases).toContain('ARP');
    expect(phases).toContain('TCP_HANDSHAKE');
    expect(phases).toContain('TLS_HANDSHAKE');
    expect(phases).toContain('HTTP_REQUEST');
    expect(phases).toContain('DATABASE');
    expect(phases).toContain('HTTP_RESPONSE');
    expect(phases).toContain('BROWSER_RENDER');

    // Final event should indicate HTTP 200 OK
    const finalEvent = events[events.length - 1];
    expect(finalEvent.metrics.httpStatusCode).toBe(200);
  });

  it('handles DNS cache hit when prewarmed', () => {
    const configWithCache: SimulationConfig = {
      ...defaultConfig,
      dnsCacheEnabled: true
    };
    const events = generateSimulationEvents(configWithCache);
    const dnsEvents = events.filter(e => e.phase === 'DNS');
    expect(dnsEvents.length).toBe(1);
    expect(dnsEvents[0].title).toContain('Cache Hit');
    expect(events[0].metrics.dnsTimeMs).toBeLessThanOrEqual(1.5);
  });

  it('halts connection when DNS resolution fails', () => {
    const dnsFailConfig: SimulationConfig = {
      ...defaultConfig,
      failureType: 'DNS_FAILURE'
    };
    const events = generateSimulationEvents(dnsFailConfig);
    const phases = events.map(e => e.phase);

    expect(phases).toContain('DNS');
    expect(phases).toContain('FAILURE');
    // Crucial rule: Never proceed to TCP/TLS if DNS fails!
    expect(phases).not.toContain('TCP_HANDSHAKE');
    expect(phases).not.toContain('TLS_HANDSHAKE');
    expect(phases).not.toContain('HTTP_REQUEST');

    const lastEvent = events[events.length - 1];
    expect(lastEvent.isErrorEvent).toBe(true);
    expect(lastEvent.title).toContain('DNS Resolution Failed');
  });

  it('handles Connection Refused (TCP RST) at the destination', () => {
    const connRefusedConfig: SimulationConfig = {
      ...defaultConfig,
      failureType: 'CONNECTION_REFUSED'
    };
    const events = generateSimulationEvents(connRefusedConfig);
    const phases = events.map(e => e.phase);

    expect(phases).toContain('TCP_HANDSHAKE');
    expect(phases).toContain('FAILURE');
    // Halts before TLS or HTTP
    expect(phases).not.toContain('TLS_HANDSHAKE');
    expect(phases).not.toContain('HTTP_REQUEST');

    const lastEvent = events[events.length - 1];
    expect(lastEvent.isErrorEvent).toBe(true);
    expect(lastEvent.title).toContain('Connection Refused');
  });

  it('distinguishes HTTP 404 as a valid HTTP response, not a network failure', () => {
    const notFoundConfig: SimulationConfig = {
      ...defaultConfig,
      failureType: 'HTTP_404'
    };
    const events = generateSimulationEvents(notFoundConfig);
    const phases = events.map(e => e.phase);

    // Network & TLS succeed completely!
    expect(phases).toContain('TCP_HANDSHAKE');
    expect(phases).toContain('TLS_HANDSHAKE');
    expect(phases).toContain('HTTP_REQUEST');
    expect(phases).toContain('HTTP_RESPONSE');

    const lastEvent = events[events.length - 1];
    expect(lastEvent.metrics.httpStatusCode).toBe(404);
  });

  it('produces deterministic output on repeated runs', () => {
    const run1 = generateSimulationEvents(defaultConfig);
    const run2 = generateSimulationEvents(defaultConfig);

    expect(run1.length).toBe(run2.length);
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].title).toBe(run2[i].title);
      expect(run1[i].simulatedTimeMs).toBe(run2[i].simulatedTimeMs);
      expect(run1[i].phase).toBe(run2[i].phase);
    }
  });

  it('derives correct state from event scheduler', () => {
    const events = generateSimulationEvents(defaultConfig);
    const stateAtStart = deriveSimulationState(events, 0);
    expect(stateAtStart.isFirstStep).toBe(true);
    expect(stateAtStart.progressPercent).toBeGreaterThan(0);

    const stateAtEnd = deriveSimulationState(events, events.length - 1);
    expect(stateAtEnd.isLastStep).toBe(true);
    expect(stateAtEnd.progressPercent).toBe(100);
  });
});
