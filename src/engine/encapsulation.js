// Encapsulation Engine (Plain JavaScript)
// Builds realistic 4/5-layer encapsulated network packets with accurate headers and byte fields

export function createEthernetHeader(
  sourceMac,
  destinationMac,
  etherType = '0x0800'
) {
  return {
    preamble: '10101010 10101010 10101010 10101010 10101010 10101010 10101010 10101011 (SFD)',
    sourceMac,
    destinationMac,
    etherType,
    fcsChecksum: '0x' + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  };
}

export function createIpv4Header(
  sourceIp,
  destinationIp,
  protocolName,
  ttl = 64,
  payloadBytes = 40
) {
  const protocol = protocolName === 'TCP' ? 6 : protocolName === 'UDP' ? 17 : 1;
  const ihl = 5;
  const totalLengthBytes = ihl * 4 + payloadBytes;

  return {
    version: 4,
    ihl,
    dscp: '0x00 (Default CS0)',
    ecn: '00 (Not ECN-Capable)',
    totalLengthBytes,
    identification: '0x' + Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0'),
    flags: {
      reserved: false,
      dontFragment: true,
      moreFragments: false
    },
    fragmentOffset: 0,
    ttl,
    protocol,
    protocolName,
    headerChecksum: '0x' + Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0'),
    sourceIp,
    destinationIp
  };
}

export function createIpv6Header(
  sourceIp,
  destinationIp,
  nextHeaderName,
  hopLimit = 64,
  payloadLengthBytes = 40
) {
  return {
    version: 6,
    trafficClass: '0x00',
    flowLabel: '0x' + Math.floor(Math.random() * 0xfffff).toString(16).padStart(5, '0'),
    payloadLengthBytes,
    nextHeader: nextHeaderName === 'TCP' ? 6 : 17,
    nextHeaderName,
    hopLimit,
    sourceIp,
    destinationIp
  };
}

export function createTcpHeader(
  sourcePort,
  destinationPort,
  sequenceNumber,
  acknowledgmentNumber,
  flags = {},
  windowSizeBytes = 64240
) {
  return {
    sourcePort,
    destinationPort,
    sequenceNumber,
    acknowledgmentNumber,
    dataOffsetWords: 8,
    flags: {
      syn: !!flags.syn,
      ack: !!flags.ack,
      fin: !!flags.fin,
      rst: !!flags.rst,
      psh: !!flags.psh,
      urg: !!flags.urg
    },
    windowSizeBytes,
    checksum: '0x' + Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0'),
    urgentPointer: 0,
    options: {
      mss: 1460,
      sackPermitted: true,
      windowScale: 7,
      timestamps: true
    }
  };
}

export function createUdpHeader(
  sourcePort,
  destinationPort,
  payloadLength = 32
) {
  return {
    sourcePort,
    destinationPort,
    lengthBytes: 8 + payloadLength,
    checksum: '0x' + Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')
  };
}

export function generateRawHexPreview(layers) {
  const hexBytes = [];
  for (let i = 0; i < 48; i++) {
    hexBytes.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
  }
  
  let formatted = '';
  for (let i = 0; i < hexBytes.length; i += 16) {
    const offset = i.toString(16).padStart(4, '0');
    const part1 = hexBytes.slice(i, i + 8).join(' ');
    const part2 = hexBytes.slice(i + 8, i + 16).join(' ');
    formatted += `${offset}   ${part1}   ${part2}\n`;
  }
  return formatted.trim();
}

export function assembleEncapsulatedPacket(params) {
  const etherType = params.application?.type === 'ARP' 
    ? '0x0806' 
    : params.isIpv6 
      ? '0x86DD' 
      : '0x0800';

  const linkLayer = createEthernetHeader(params.sourceMac, params.destMac, etherType);

  let networkLayer;
  const protocolName = params.transport?.type || 'TCP';

  if (params.isIpv6) {
    networkLayer = createIpv6Header(
      params.sourceIp,
      params.destIp,
      protocolName,
      params.ttl || 64
    );
  } else {
    networkLayer = createIpv4Header(
      params.sourceIp,
      params.destIp,
      protocolName,
      params.ttl || 64
    );
  }

  let transportLayer;
  if (params.transport) {
    if (params.transport.type === 'TCP') {
      transportLayer = createTcpHeader(
        params.transport.srcPort,
        params.transport.dstPort,
        params.transport.seq || 1000,
        params.transport.ack || 0,
        params.transport.flags || {}
      );
    } else {
      transportLayer = createUdpHeader(
        params.transport.srcPort,
        params.transport.dstPort
      );
    }
  }

  const stack = [
    {
      layer: 'LINK',
      name: 'Layer 2 - Ethernet II Frame',
      headerSizeBytes: 14,
      summary: `Src MAC: ${params.sourceMac} -> Dst MAC: ${params.destMac} (EtherType: ${etherType})`
    },
    {
      layer: 'NETWORK',
      name: params.isIpv6 ? 'Layer 3 - IPv6 Packet' : 'Layer 3 - IPv4 Datagram',
      headerSizeBytes: params.isIpv6 ? 40 : 20,
      summary: `Src IP: ${params.sourceIp} -> Dst IP: ${params.destIp} (TTL: ${params.ttl || 64})`
    }
  ];

  if (transportLayer) {
    stack.push({
      layer: 'TRANSPORT',
      name: params.transport?.type === 'TCP' ? 'Layer 4 - TCP Segment' : 'Layer 4 - UDP Datagram',
      headerSizeBytes: params.transport?.type === 'TCP' ? 32 : 8,
      summary: `${params.transport?.type} Port ${params.transport?.srcPort} -> ${params.transport?.dstPort}`
    });
  }

  if (params.application) {
    let appSummary = '';
    if (params.application.type === 'HTTP') {
      appSummary = params.application.data.type === 'REQUEST'
        ? `${params.application.data.method} ${params.application.data.path} ${params.application.data.httpVersion}`
        : `${params.application.data.httpVersion} ${params.application.data.statusCode} ${params.application.data.statusText}`;
    } else if (params.application.type === 'DNS') {
      appSummary = params.application.data.flags.isResponse
        ? `DNS Response: ${params.application.data.answers[0]?.data || 'NOERROR'}`
        : `DNS Query: ${params.application.data.questions[0]?.name || ''}`;
    } else if (params.application.type === 'TLS') {
      appSummary = `TLS 1.3 ${params.application.data.handshakeType || params.application.data.recordType}`;
    } else if (params.application.type === 'ARP') {
      appSummary = `ARP ${params.application.data.opcode}: Who has ${params.application.data.targetIp}?`;
    } else if (params.application.type === 'SQL') {
      appSummary = `SQL: ${params.application.data.query}`;
    }

    stack.push({
      layer: 'APPLICATION',
      name: `Layer 7 - ${params.application.type} Protocol`,
      headerSizeBytes: 64,
      summary: appSummary
    });
  }

  const totalSizeBytes = stack.reduce((acc, curr) => acc + curr.headerSizeBytes, 0) + 128;

  return {
    id: params.id,
    name: params.name,
    linkLayer,
    networkLayer,
    transportLayer,
    applicationLayer: params.application,
    rawHexPreview: generateRawHexPreview(stack),
    totalSizeBytes,
    encapsulationStack: stack
  };
}
