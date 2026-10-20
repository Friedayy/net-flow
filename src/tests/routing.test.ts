import { describe, it, expect } from 'vitest';
import { INITIAL_NODES } from '../engine/topology';
import { RoutingTableEntry } from '../engine/types';

function matchRoute(routingTable: RoutingTableEntry[], destIp: string): RoutingTableEntry | null {
  // Simple deterministic longest prefix match test
  // If destination is in local subnet 192.168.1.x
  if (destIp.startsWith('192.168.1.')) {
    return routingTable.find(r => r.destination === '192.168.1.0/24') || null;
  }
  // Otherwise default route 0.0.0.0/0
  return routingTable.find(r => r.destination === '0.0.0.0/0') || null;
}

describe('Routing Table & Forwarding Logic', () => {
  it('correctly maps client default route to gateway next-hop', () => {
    const clientNode = INITIAL_NODES.find(n => n.id === 'client')!;
    expect(clientNode).toBeDefined();
    expect(clientNode.routingTable).toBeDefined();

    const route = matchRoute(clientNode.routingTable!, '104.21.58.77');
    expect(route).toBeDefined();
    expect(route?.gateway).toBe('192.168.1.1');
    expect(route?.interface).toBe('en0');
  });

  it('correctly selects direct delivery for local subnet IP', () => {
    const clientNode = INITIAL_NODES.find(n => n.id === 'client')!;
    const localRoute = matchRoute(clientNode.routingTable!, '192.168.1.45');
    expect(localRoute).toBeDefined();
    expect(localRoute?.gateway).toBe('0.0.0.0'); // Direct delivery
  });

  it('verifies ISP router contains BGP backbone route', () => {
    const ispNode = INITIAL_NODES.find(n => n.id === 'isp_router')!;
    expect(ispNode).toBeDefined();
    expect(ispNode.routingTable).toBeDefined();

    const transitRoute = ispNode.routingTable?.find(r => r.destination === '104.16.0.0/12');
    expect(transitRoute).toBeDefined();
    expect(transitRoute?.gateway).toBe('203.0.113.2');
  });
});
