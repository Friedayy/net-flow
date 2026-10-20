import { describe, it, expect } from 'vitest';
import {
  assembleEncapsulatedPacket,
  createEthernetHeader,
  createIpv4Header,
  createTcpHeader
} from '../engine/encapsulation';

describe('Packet Encapsulation Engine', () => {
  it('constructs compliant Ethernet II frame headers', () => {
    const eth = createEthernetHeader('02:42:c0:a8:01:69', '00:1c:73:9a:11:01', '0x0800');
    expect(eth.sourceMac).toBe('02:42:c0:a8:01:69');
    expect(eth.destinationMac).toBe('00:1c:73:9a:11:01');
    expect(eth.etherType).toBe('0x0800');
    expect(eth.fcsChecksum).toMatch(/^0x[0-9a-f]{8}$/);
  });

  it('calculates IPv4 header fields and TTL properly', () => {
    const ip = createIpv4Header('192.168.1.105', '104.21.58.77', 'TCP', 64, 40);
    expect(ip.version).toBe(4);
    expect(ip.ihl).toBe(5);
    expect(ip.ttl).toBe(64);
    expect(ip.protocol).toBe(6);
    expect(ip.protocolName).toBe('TCP');
    expect(ip.flags.dontFragment).toBe(true);
  });

  it('assembles TCP segment with proper SYN flag and window size', () => {
    const tcp = createTcpHeader(54321, 443, 1000, 0, { syn: true }, 64240);
    expect(tcp.sourcePort).toBe(54321);
    expect(tcp.destinationPort).toBe(443);
    expect(tcp.sequenceNumber).toBe(1000);
    expect(tcp.flags.syn).toBe(true);
    expect(tcp.flags.ack).toBe(false);
    expect(tcp.windowSizeBytes).toBe(64240);
  });

  it('builds complete 4-layer encapsulated stack', () => {
    const packet = assembleEncapsulatedPacket({
      id: 'test_pkt_01',
      name: 'Test Packet',
      sourceMac: '02:42:c0:a8:01:69',
      destMac: '00:1c:73:9a:11:01',
      sourceIp: '192.168.1.105',
      destIp: '104.21.58.77',
      transport: { type: 'TCP', srcPort: 54321, dstPort: 443, flags: { syn: true } }
    });

    expect(packet.encapsulationStack.length).toBeGreaterThanOrEqual(3);
    expect(packet.encapsulationStack[0].layer).toBe('LINK');
    expect(packet.encapsulationStack[1].layer).toBe('NETWORK');
    expect(packet.encapsulationStack[2].layer).toBe('TRANSPORT');
    expect(packet.rawHexPreview).toContain('   ');
  });
});
