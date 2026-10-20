// NetFlow Deterministic Simulation Engine
// Generates an immutable, step-by-step sequence of events for any given URL and configuration
import { assembleEncapsulatedPacket } from './encapsulation.js';
export function parseSimulationUrl(urlInput) {
    let clean = urlInput.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = 'https://' + clean;
    }
    try {
        const parsed = new URL(clean);
        const isHttps = parsed.protocol === 'https:';
        const port = parsed.port ? parseInt(parsed.port, 10) : (isHttps ? 443 : 80);
        return {
            protocol: isHttps ? 'https:' : 'http:',
            hostname: parsed.hostname || 'example.com',
            port,
            pathname: parsed.pathname || '/',
            search: parsed.search || '',
            isHttps
        };
    }
    catch {
        return {
            protocol: 'https:',
            hostname: 'example.com',
            port: 443,
            pathname: '/products',
            search: '',
            isHttps: true
        };
    }
}
export function generateSimulationEvents(config) {
    const events = [];
    const parsed = parseSimulationUrl(config.targetUrl);
    const failure = config.failureType;
    const isIpv6 = config.ipVersion === 'IPv6';
    const latencyMult = config.latencyMultiplier || 1.0;
    // Addressing models
    const clientMac = '02:42:c0:a8:01:69';
    const switchMac1 = '00:1c:73:44:aa:01';
    const switchMac2 = '00:1c:73:44:aa:02';
    const gatewayMacLan = '00:1c:73:9a:11:01';
    const gatewayMacWan = '00:1c:73:9a:11:02';
    const ispRouterMac = '00:50:56:b8:10:01';
    const transitRouterMac = '3c:8a:b0:77:01:01';
    const edgeServerMac = '06:12:44:89:fe:01';
    const webServerMac = '0a:58:0a:00:01:32';
    const databaseMac = '0a:58:0a:00:02:0a';
    const clientIp = isIpv6 ? '2001:db8:85a3::8a2e:370:7334' : '192.168.1.105';
    const gatewayPrivateIp = isIpv6 ? 'fe80::1' : '192.168.1.1';
    const gatewayPublicIp = isIpv6 ? '2001:db8:100::42' : '198.51.100.42';
    const dnsServerIp = isIpv6 ? '2606:4700:4700::1111' : '1.1.1.1';
    const destinationIp = isIpv6 ? '2606:4700:3038::6815:3a4d' : '104.21.58.77';
    const webServerInternalIp = isIpv6 ? 'fd00::50' : '10.0.1.50';
    const dbInternalIp = isIpv6 ? 'fd00:db::10' : '10.0.2.10';
    const clientPort = 54321;
    const serverPort = parsed.port;
    let currentTimeMs = 0;
    let currentStepIndex = 0;
    let hopCounter = 0;
    let packetsSent = 0;
    let packetsDropped = 0;
    // Track metrics accumulator
    const metrics = {
        dnsTimeMs: 0,
        tcpHandshakeMs: 0,
        tlsHandshakeMs: 0,
        networkLatencyMs: 0,
        serverProcessingMs: 0,
        databaseTimeMs: 0,
        totalSimulatedMs: 0,
        hopCount: 0,
        packetsTransmitted: 0,
        packetsDropped: 0,
        responseSizeBytes: 0
    };
    const createNodeStates = (activeId, status = 'active') => {
        const states = {
            client: 'idle',
            switch: 'idle',
            gateway: 'idle',
            dns: 'idle',
            isp_router: 'idle',
            transit_router: 'idle',
            edge_server: 'idle',
            web_server: 'idle',
            database: 'idle'
        };
        if (activeId && states[activeId] !== undefined) {
            states[activeId] = status;
        }
        return states;
    };
    const pushEvent = (eventPartial, durationMs) => {
        currentTimeMs += Math.round(durationMs * latencyMult);
        currentStepIndex++;
        packetsSent++;
        metrics.totalSimulatedMs = currentTimeMs;
        metrics.hopCount = hopCounter;
        metrics.packetsTransmitted = packetsSent;
        metrics.packetsDropped = packetsDropped;
        const event = {
            id: `evt_${currentStepIndex}`,
            stepIndex: currentStepIndex,
            simulatedTimeMs: currentTimeMs,
            metrics: { ...metrics },
            ...eventPartial
        };
        events.push(event);
        return event;
    };
    // ==========================================
    // PHASE 1: URL Parsing & Browser Cache Check
    // ==========================================
    const urlPacket = assembleEncapsulatedPacket({
        id: 'pkt_url_01',
        name: 'Browser URL Command',
        sourceMac: clientMac,
        destMac: clientMac,
        sourceIp: clientIp,
        destIp: clientIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: clientPort, dstPort: serverPort, flags: {} },
        application: {
            type: 'HTTP',
            data: {
                type: 'REQUEST',
                httpVersion: config.httpVersion === 'HTTP/3 (QUIC)' ? 'HTTP/3' : 'HTTP/1.1',
                method: config.httpMethod,
                url: config.targetUrl,
                path: parsed.pathname + parsed.search,
                headers: {
                    'Host': parsed.hostname,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) NetFlow/1.0',
                    'Accept': 'application/json, text/html, */*'
                },
                contentLengthBytes: 0
            }
        }
    });
    pushEvent({
        phase: 'URL_PARSING',
        protocol: 'HTTP/1.1',
        sourceNodeId: 'client',
        destNodeId: 'client',
        title: 'URL Parsing & Protocol Validation',
        summarySimple: `Your browser decomposes "${config.targetUrl}" into protocol (${parsed.protocol}), hostname (${parsed.hostname}), port (${serverPort}), and path (${parsed.pathname}).`,
        summaryTechnical: `Client URI parser (RFC 3986) evaluates scheme (${parsed.protocol}//), authority (${parsed.hostname}:${serverPort}), and path component. Initiates DNS cache lookup for "${parsed.hostname}".`,
        whyItHappens: 'Computers do not understand textual URLs natively. The browser must break down the user input to find which machine to contact and which protocol rules to obey.',
        whatHappensNext: config.dnsCacheEnabled ? 'Browser checks its internal DNS cache for an existing A/AAAA record.' : 'Browser queries the configured recursive DNS resolver.',
        packet: urlPacket,
        direction: 'internal',
        nodeStates: createNodeStates('client', 'processing')
    }, 2.0);
    // ==========================================
    // PHASE 2: DNS Resolution
    // ==========================================
    const dnsStartMs = currentTimeMs;
    if (config.dnsCacheEnabled && failure !== 'DNS_FAILURE') {
        // DNS Cache Hit
        const dnsCachedPacket = assembleEncapsulatedPacket({
            id: 'pkt_dns_cached',
            name: 'DNS Local Cache Hit',
            sourceMac: clientMac,
            destMac: clientMac,
            sourceIp: clientIp,
            destIp: clientIp,
            isIpv6,
            application: {
                type: 'DNS',
                data: {
                    transactionId: '0x0000',
                    flags: {
                        isResponse: true,
                        opcode: 'Standard query',
                        authoritative: false,
                        truncated: false,
                        recursionDesired: true,
                        recursionAvailable: true,
                        responseCode: 'NOERROR'
                    },
                    questions: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', class: 'IN' }],
                    answers: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', ttl: 240, data: destinationIp }]
                }
            }
        });
        pushEvent({
            phase: 'DNS',
            protocol: 'DNS',
            sourceNodeId: 'client',
            destNodeId: 'client',
            title: 'DNS Cache Hit (In-Memory Resolution)',
            summarySimple: `The browser found "${parsed.hostname}" in its local memory cache (${destinationIp}). No network query needed!`,
            summaryTechnical: `OS getaddrinfo() resolver cache hit. Valid TTL remaining (240s). Hostname mapped to IP ${destinationIp} with 0.1ms latency.`,
            whyItHappens: 'Operating systems and browsers cache recently resolved DNS entries to avoid redundant round-trips over the WAN.',
            whatHappensNext: 'Client selects destination IP and prepares the TCP connection handshake.',
            packet: dnsCachedPacket,
            direction: 'internal',
            nodeStates: createNodeStates('client', 'success')
        }, 1.0);
        metrics.dnsTimeMs = 1.0;
    }
    else {
        // DNS Query Outbound (UDP 53)
        const dnsReqPacket = assembleEncapsulatedPacket({
            id: 'pkt_dns_req',
            name: 'DNS Query (A Record)',
            sourceMac: clientMac,
            destMac: gatewayMacLan,
            sourceIp: clientIp,
            destIp: dnsServerIp,
            isIpv6,
            transport: { type: 'UDP', srcPort: 53210, dstPort: 53 },
            application: {
                type: 'DNS',
                data: {
                    transactionId: '0x7b4a',
                    flags: {
                        isResponse: false,
                        opcode: 'Standard query',
                        authoritative: false,
                        truncated: false,
                        recursionDesired: true,
                        recursionAvailable: false,
                        responseCode: 'NOERROR'
                    },
                    questions: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', class: 'IN' }],
                    answers: []
                }
            }
        });
        pushEvent({
            phase: 'DNS',
            protocol: 'DNS',
            sourceNodeId: 'client',
            destNodeId: 'dns',
            title: 'DNS Recursive Query Dispatched',
            summarySimple: `Client asks DNS resolver 1.1.1.1: "What is the numerical IP address for ${parsed.hostname}?"`,
            summaryTechnical: `UDP datagram sent to ${dnsServerIp}:53 with Recursion Desired (RD=1) flag. Querying IN class, Type ${isIpv6 ? 'AAAA' : 'A'}.`,
            whyItHappens: 'The browser cannot transmit IP packets without knowing the numerical IP address of the target destination.',
            whatHappensNext: 'The DNS resolver searches its cache or queries root/TLD authorative servers.',
            packet: dnsReqPacket,
            direction: 'request',
            activeLinkIds: ['link_client_switch', 'link_switch_gateway', 'link_gateway_dns'],
            nodeStates: createNodeStates('dns', 'processing')
        }, 12.0);
        if (failure === 'DNS_FAILURE') {
            // DNS Failure scenario
            packetsDropped++;
            const dnsFailurePacket = assembleEncapsulatedPacket({
                id: 'pkt_dns_err',
                name: 'DNS Error (NXDOMAIN)',
                sourceMac: gatewayMacWan,
                destMac: clientMac,
                sourceIp: dnsServerIp,
                destIp: clientIp,
                isIpv6,
                transport: { type: 'UDP', srcPort: 53, dstPort: 53210 },
                application: {
                    type: 'DNS',
                    data: {
                        transactionId: '0x7b4a',
                        flags: {
                            isResponse: true,
                            opcode: 'Standard query',
                            authoritative: true,
                            truncated: false,
                            recursionDesired: true,
                            recursionAvailable: true,
                            responseCode: 'NXDOMAIN'
                        },
                        questions: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', class: 'IN' }],
                        answers: []
                    }
                }
            });
            pushEvent({
                phase: 'FAILURE',
                protocol: 'DNS',
                sourceNodeId: 'dns',
                destNodeId: 'client',
                title: 'DNS Resolution Failed (NXDOMAIN)',
                summarySimple: `The DNS resolver returned "NXDOMAIN" — Non-Existent Domain. The domain "${parsed.hostname}" does not exist.`,
                summaryTechnical: `Resolver returned RCODE 3 (NXDOMAIN). Hostname has no registered A or AAAA records in authoritative zone file. Socket creation terminated with ERR_NAME_NOT_RESOLVED.`,
                whyItHappens: 'The domain name is unregistered, misspelled, or has expired DNS nameserver delegations.',
                whatHappensNext: 'The browser halts the connection pipeline and displays an error screen to the user.',
                packet: dnsFailurePacket,
                direction: 'dropped',
                isErrorEvent: true,
                nodeStates: createNodeStates('client', 'error')
            }, 8.0);
            metrics.dnsTimeMs = currentTimeMs - dnsStartMs;
            return events; // HALT SIMULATION
        }
        // DNS Query Response
        const dnsResPacket = assembleEncapsulatedPacket({
            id: 'pkt_dns_res',
            name: 'DNS Response (A Record)',
            sourceMac: gatewayMacWan,
            destMac: clientMac,
            sourceIp: dnsServerIp,
            destIp: clientIp,
            isIpv6,
            transport: { type: 'UDP', srcPort: 53, dstPort: 53210 },
            application: {
                type: 'DNS',
                data: {
                    transactionId: '0x7b4a',
                    flags: {
                        isResponse: true,
                        opcode: 'Standard query',
                        authoritative: true,
                        truncated: false,
                        recursionDesired: true,
                        recursionAvailable: true,
                        responseCode: 'NOERROR'
                    },
                    questions: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', class: 'IN' }],
                    answers: [{ name: parsed.hostname, type: isIpv6 ? 'AAAA' : 'A', ttl: 300, data: destinationIp }]
                }
            }
        });
        pushEvent({
            phase: 'DNS',
            protocol: 'DNS',
            sourceNodeId: 'dns',
            destNodeId: 'client',
            title: 'DNS Answer Received (IP Resolved)',
            summarySimple: `DNS resolver replies: "${parsed.hostname}" is located at IP address ${destinationIp}.`,
            summaryTechnical: `Authoritative DNS response decoded. Answer Section contains Type A record ${destinationIp} with TTL=300 seconds. Added to local resolver table.`,
            whyItHappens: 'The DNS resolver successfully consulted its hierarchical authority chain and returned the destination IP.',
            whatHappensNext: 'Client checks routing table and initiates the Layer 4 TCP connection.',
            packet: dnsResPacket,
            direction: 'response',
            activeLinkIds: ['link_gateway_dns', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('client', 'success')
        }, 11.0);
        metrics.dnsTimeMs = currentTimeMs - dnsStartMs;
    }
    // ==========================================
    // PHASE 3: ARP & Next Hop Resolution
    // ==========================================
    const arpPacket = assembleEncapsulatedPacket({
        id: 'pkt_arp_01',
        name: 'ARP Table Check (Gateway MAC)',
        sourceMac: clientMac,
        destMac: gatewayMacLan,
        sourceIp: clientIp,
        destIp: gatewayPrivateIp,
        isIpv6,
        application: {
            type: 'ARP',
            data: {
                hardwareType: 'Ethernet (1)',
                protocolType: 'IPv4 (0x0800)',
                hardwareSize: 6,
                protocolSize: 4,
                opcode: 'REPLY (2)',
                senderMac: gatewayMacLan,
                senderIp: gatewayPrivateIp,
                targetMac: clientMac,
                targetIp: clientIp
            }
        }
    });
    pushEvent({
        phase: 'ARP',
        protocol: 'ARP',
        sourceNodeId: 'client',
        destNodeId: 'switch',
        title: 'ARP Next-Hop Lookup (Gateway MAC Resolution)',
        summarySimple: `Client checks its local ARP cache for the default gateway IP (${gatewayPrivateIp}). It finds MAC address ${gatewayMacLan}.`,
        summaryTechnical: `Host routing table lookup matches default route 0.0.0.0/0 via gateway ${gatewayPrivateIp}. Kernel ARP cache maps IP to Next-Hop Ethernet MAC ${gatewayMacLan}.`,
        whyItHappens: 'Ethernet frames require physical MAC addresses to be delivered over local switches and Wi-Fi networks.',
        whatHappensNext: 'The client encapsulates the TCP SYN packet inside an Ethernet frame addressed to the gateway.',
        packet: arpPacket,
        direction: 'internal',
        activeLinkIds: ['link_client_switch'],
        nodeStates: createNodeStates('switch', 'processing')
    }, 1.5);
    // ==========================================
    // PHASE 4: TCP 3-Way Handshake
    // ==========================================
    const tcpStartMs = currentTimeMs;
    // Packet Loss Scenario (SYN dropped)
    if (failure === 'PACKET_LOSS') {
        packetsDropped++;
        const synDropPacket = assembleEncapsulatedPacket({
            id: 'pkt_tcp_syn_drop',
            name: 'TCP SYN (Dropped at Router 1)',
            sourceMac: gatewayMacWan,
            destMac: ispRouterMac,
            sourceIp: gatewayPublicIp,
            destIp: destinationIp,
            isIpv6,
            ttl: 63,
            transport: {
                type: 'TCP',
                srcPort: clientPort,
                dstPort: serverPort,
                seq: 1000,
                ack: 0,
                flags: { syn: true }
            }
        });
        pushEvent({
            phase: 'FAILURE',
            protocol: 'TCP',
            sourceNodeId: 'isp_router',
            destNodeId: 'transit_router',
            title: 'Packet Loss Detected (TCP SYN Dropped)',
            summarySimple: 'Congestion on the router interface causes the TCP SYN packet to be dropped into the bit bucket.',
            summaryTechnical: 'ISP Router tail-drop queue overflow. Buffer full. Packet discarded without ICMP notification. Client TCP stack initiates Retransmission Timeout (RTO) timer (1000ms).',
            whyItHappens: 'Network buffers overflow during peak traffic bursts or fiber micro-flaps.',
            whatHappensNext: 'Client retransmits the SYN segment after RTO expiration, recovering the connection.',
            packet: synDropPacket,
            direction: 'dropped',
            isErrorEvent: true,
            activeLinkIds: ['link_isp_transit'],
            nodeStates: createNodeStates('isp_router', 'warning')
        }, 1000.0); // Retransmission delay!
    }
    // Broken Link Scenario
    if (failure === 'BROKEN_LINK') {
        packetsDropped++;
        const brokenLinkPacket = assembleEncapsulatedPacket({
            id: 'pkt_icmp_unreach',
            name: 'ICMP Destination Host Unreachable',
            sourceMac: ispRouterMac,
            destMac: gatewayMacWan,
            sourceIp: '198.51.100.33',
            destIp: clientIp,
            isIpv6,
            transport: { type: 'UDP', srcPort: 0, dstPort: 0 },
            application: undefined
        });
        pushEvent({
            phase: 'FAILURE',
            protocol: 'ICMP',
            sourceNodeId: 'isp_router',
            destNodeId: 'client',
            title: 'Network Link Down (ICMP Host Unreachable)',
            summarySimple: 'Fiber link between Router 1 and Router 2 is severed. Router returns ICMP Host Unreachable.',
            summaryTechnical: 'Optical transceiver loss of signal (LOS). BGP adjacency drops. Router transmits ICMP Type 3, Code 1 (Host Unreachable) back to source. TCP handshake aborted.',
            whyItHappens: 'Physical fiber cut, power failure at optical amplifier, or routing table convergence failure.',
            whatHappensNext: 'Client socket closes with EHOSTUNREACH error.',
            packet: brokenLinkPacket,
            direction: 'dropped',
            isErrorEvent: true,
            activeLinkIds: ['link_isp_transit'],
            nodeStates: createNodeStates('isp_router', 'error')
        }, 15.0);
        metrics.tcpHandshakeMs = currentTimeMs - tcpStartMs;
        return events; // HALT SIMULATION
    }
    // Step 4.1: TCP SYN (Client -> Gateway -> Routers -> Edge Server)
    hopCounter += 4;
    const synPacket = assembleEncapsulatedPacket({
        id: 'pkt_tcp_syn',
        name: 'TCP SYN (Connection Request)',
        sourceMac: clientMac,
        destMac: gatewayMacLan,
        sourceIp: clientIp,
        destIp: destinationIp,
        isIpv6,
        ttl: 64,
        transport: {
            type: 'TCP',
            srcPort: clientPort,
            dstPort: serverPort,
            seq: 1000,
            ack: 0,
            flags: { syn: true }
        }
    });
    pushEvent({
        phase: 'TCP_HANDSHAKE',
        protocol: 'TCP',
        sourceNodeId: 'client',
        destNodeId: 'edge_server',
        title: 'TCP Handshake Step 1: SYN (Synchronize)',
        summarySimple: `Client sends a SYN packet to ${destinationIp}:${serverPort} requesting to open a reliable connection. Initial Sequence Number (ISN) = 1000.`,
        summaryTechnical: `TCP segment [SYN] transmitted. Port 54321 -> ${serverPort}. Seq=1000, Win=64240. Client enters SYN_SENT state. NAT gateway rewrites source IP to ${gatewayPublicIp}.`,
        whyItHappens: 'TCP is a connection-oriented protocol. Both parties must synchronize sequence numbers and flow control parameters before transferring application data.',
        whatHappensNext: 'The server verifies the port is listening and replies with SYN-ACK.',
        packet: synPacket,
        direction: 'request',
        activeLinkIds: ['link_client_switch', 'link_switch_gateway', 'link_gateway_isp', 'link_isp_transit', 'link_transit_edge'],
        nodeStates: createNodeStates('edge_server', 'processing')
    }, 18.0);
    // Connection Refused Scenario
    if (failure === 'CONNECTION_REFUSED') {
        packetsDropped++;
        const rstPacket = assembleEncapsulatedPacket({
            id: 'pkt_tcp_rst',
            name: 'TCP RST-ACK (Connection Refused)',
            sourceMac: edgeServerMac,
            destMac: transitRouterMac,
            sourceIp: destinationIp,
            destIp: clientIp,
            isIpv6,
            ttl: 58,
            transport: {
                type: 'TCP',
                srcPort: serverPort,
                dstPort: clientPort,
                seq: 0,
                ack: 1001,
                flags: { rst: true, ack: true }
            }
        });
        pushEvent({
            phase: 'FAILURE',
            protocol: 'TCP',
            sourceNodeId: 'edge_server',
            destNodeId: 'client',
            title: 'Connection Refused (TCP RST Received)',
            summarySimple: `Destination server ${destinationIp} is reachable, but nothing is listening on port ${serverPort}. It returns TCP RST (Reset).`,
            summaryTechnical: 'Destination host TCP stack received SYN on unallocated socket. Kernel sends immediate [RST, ACK] with Seq=0, Ack=1001. Client socket closes with ECONNREFUSED.',
            whyItHappens: 'The web server daemon (Nginx, Express) is stopped, crashed, or bound to a different network port.',
            whatHappensNext: 'Browser displays "ERR_CONNECTION_REFUSED". Zero data transmitted.',
            packet: rstPacket,
            direction: 'dropped',
            isErrorEvent: true,
            activeLinkIds: ['link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('edge_server', 'error')
        }, 18.0);
        metrics.tcpHandshakeMs = currentTimeMs - tcpStartMs;
        return events; // HALT SIMULATION
    }
    // Step 4.2: TCP SYN-ACK (Edge Server -> Client)
    hopCounter += 4;
    const synAckPacket = assembleEncapsulatedPacket({
        id: 'pkt_tcp_syn_ack',
        name: 'TCP SYN-ACK (Handshake Acknowledgment)',
        sourceMac: edgeServerMac,
        destMac: transitRouterMac,
        sourceIp: destinationIp,
        destIp: clientIp,
        isIpv6,
        ttl: 58,
        transport: {
            type: 'TCP',
            srcPort: serverPort,
            dstPort: clientPort,
            seq: 5000,
            ack: 1001,
            flags: { syn: true, ack: true }
        }
    });
    pushEvent({
        phase: 'TCP_HANDSHAKE',
        protocol: 'TCP',
        sourceNodeId: 'edge_server',
        destNodeId: 'client',
        title: 'TCP Handshake Step 2: SYN-ACK',
        summarySimple: `Server responds with SYN-ACK: "I received your SYN (Ack=1001), and here is my sequence number (Seq=5000). Let's connect!"`,
        summaryTechnical: `Server enters SYN_RCVD state. Emits TCP [SYN, ACK] segment with Seq=5000, Ack=1001, Win=65535. Traversing backwards across NAT gateway.`,
        whyItHappens: 'The server accepts the connection request and confirms bidirectional sequence synchronization.',
        whatHappensNext: 'Client confirms receipt with a final ACK packet.',
        packet: synAckPacket,
        direction: 'response',
        activeLinkIds: ['link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
        nodeStates: createNodeStates('client', 'processing')
    }, 18.0);
    // Step 4.3: TCP ACK (Client -> Edge Server)
    hopCounter += 4;
    const ackPacket = assembleEncapsulatedPacket({
        id: 'pkt_tcp_ack',
        name: 'TCP ACK (Connection Established)',
        sourceMac: clientMac,
        destMac: gatewayMacLan,
        sourceIp: clientIp,
        destIp: destinationIp,
        isIpv6,
        ttl: 64,
        transport: {
            type: 'TCP',
            srcPort: clientPort,
            dstPort: serverPort,
            seq: 1001,
            ack: 5001,
            flags: { ack: true }
        }
    });
    pushEvent({
        phase: 'TCP_HANDSHAKE',
        protocol: 'TCP',
        sourceNodeId: 'client',
        destNodeId: 'edge_server',
        title: 'TCP Handshake Step 3: ACK (Connection ESTABLISHED)',
        summarySimple: 'Client acknowledges server sequence number (Ack=5001). The TCP socket is now fully ESTABLISHED!',
        summaryTechnical: 'Final ACK [ACK] delivered. Both endpoints transition to ESTABLISHED state. Sockets ready for application payload transfer.',
        whyItHappens: 'Completes the formal 3-way handshake required by RFC 793 to guarantee reliable two-way transmission.',
        whatHappensNext: parsed.isHttps ? 'Client initiates TLS 1.3 cryptographic handshake.' : 'Client sends HTTP request.',
        packet: ackPacket,
        direction: 'request',
        activeLinkIds: ['link_client_switch', 'link_switch_gateway', 'link_gateway_isp', 'link_isp_transit', 'link_transit_edge'],
        nodeStates: createNodeStates('client', 'success')
    }, 18.0);
    metrics.tcpHandshakeMs = currentTimeMs - tcpStartMs;
    // ==========================================
    // PHASE 5: TLS 1.3 Handshake (HTTPS)
    // ==========================================
    if (parsed.isHttps) {
        const tlsStartMs = currentTimeMs;
        // TLS Client Hello
        const tlsClientHello = assembleEncapsulatedPacket({
            id: 'pkt_tls_client_hello',
            name: 'TLS 1.3 Client Hello',
            sourceMac: clientMac,
            destMac: gatewayMacLan,
            sourceIp: clientIp,
            destIp: destinationIp,
            isIpv6,
            transport: { type: 'TCP', srcPort: clientPort, dstPort: serverPort, seq: 1001, ack: 5001, flags: { psh: true, ack: true } },
            application: {
                type: 'TLS',
                data: {
                    recordType: 'Handshake',
                    version: 'TLS 1.3 (0x0303)',
                    handshakeType: 'ClientHello',
                    cipherSuite: 'TLS_AES_256_GCM_SHA384',
                    keyExchangeGroup: 'x25519',
                    serverNameIndication: parsed.hostname,
                    isEncrypted: false
                }
            }
        });
        pushEvent({
            phase: 'TLS_HANDSHAKE',
            protocol: 'TLS 1.3',
            sourceNodeId: 'client',
            destNodeId: 'edge_server',
            title: 'TLS 1.3 Handshake: Client Hello',
            summarySimple: `Client proposes encryption ciphers (AES-256-GCM), key agreement curve (X25519), and Server Name Indication (${parsed.hostname}).`,
            summaryTechnical: `TLS 1.3 ClientHello (RFC 8446). Includes ephemeral Diffie-Hellman KeyShare parameter and SNI extension for virtual host matching.`,
            whyItHappens: 'HTTPS requires authenticating the server and generating symmetric encryption keys before transmitting sensitive data.',
            whatHappensNext: 'Server responds with Server Hello, its key share, and digital certificate.',
            packet: tlsClientHello,
            direction: 'request',
            activeLinkIds: ['link_client_switch', 'link_switch_gateway', 'link_gateway_isp', 'link_isp_transit', 'link_transit_edge'],
            nodeStates: createNodeStates('edge_server', 'processing')
        }, 18.0);
        // TLS Server Hello + Certificate + Finished
        const tlsServerHello = assembleEncapsulatedPacket({
            id: 'pkt_tls_server_hello',
            name: 'TLS 1.3 Server Hello & Certificate',
            sourceMac: edgeServerMac,
            destMac: transitRouterMac,
            sourceIp: destinationIp,
            destIp: clientIp,
            isIpv6,
            transport: { type: 'TCP', srcPort: serverPort, dstPort: clientPort, seq: 5001, ack: 1350, flags: { psh: true, ack: true } },
            application: {
                type: 'TLS',
                data: {
                    recordType: 'Handshake',
                    version: 'TLS 1.3 (0x0303)',
                    handshakeType: 'ServerHello',
                    cipherSuite: 'TLS_AES_256_GCM_SHA384',
                    keyExchangeGroup: 'x25519',
                    isEncrypted: true
                }
            }
        });
        pushEvent({
            phase: 'TLS_HANDSHAKE',
            protocol: 'TLS 1.3',
            sourceNodeId: 'edge_server',
            destNodeId: 'client',
            title: 'TLS 1.3 Handshake: Server Hello & Certificate',
            summarySimple: 'Server sends its key share and digital certificate. Both sides derive the same symmetric session key. Encryption is now active!',
            summaryTechnical: 'ServerHello + EncryptedExtensions + Certificate + CertificateVerify + Finished. Shared secret established in 1 round trip (1-RTT).',
            whyItHappens: 'Validates the server identity against trusted Certificate Authorities (CAs) and guards against eavesdropping.',
            whatHappensNext: 'The client sends the encrypted HTTP request.',
            packet: tlsServerHello,
            direction: 'response',
            activeLinkIds: ['link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('client', 'success')
        }, 18.0);
        metrics.tlsHandshakeMs = currentTimeMs - tlsStartMs;
    }
    // ==========================================
    // PHASE 6: HTTP Request Transmission
    // ==========================================
    const httpReqPacket = assembleEncapsulatedPacket({
        id: 'pkt_http_req',
        name: 'Encrypted HTTP Request',
        sourceMac: clientMac,
        destMac: gatewayMacLan,
        sourceIp: clientIp,
        destIp: destinationIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: clientPort, dstPort: serverPort, seq: 1350, ack: 5500, flags: { psh: true, ack: true } },
        application: {
            type: 'HTTP',
            data: {
                type: 'REQUEST',
                httpVersion: config.httpVersion === 'HTTP/3 (QUIC)' ? 'HTTP/3' : 'HTTP/1.1',
                method: config.httpMethod,
                path: parsed.pathname + parsed.search,
                headers: {
                    'Host': parsed.hostname,
                    'User-Agent': 'Mozilla/5.0 NetFlow-Inspector/1.0',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                },
                contentLengthBytes: 0
            }
        }
    });
    pushEvent({
        phase: 'HTTP_REQUEST',
        protocol: config.httpVersion === 'HTTP/3 (QUIC)' ? 'HTTP/3 (QUIC)' : 'HTTP/1.1',
        sourceNodeId: 'client',
        destNodeId: 'edge_server',
        title: `HTTP Request Transmitted: ${config.httpMethod} ${parsed.pathname}`,
        summarySimple: `Client sends encrypted HTTP request: "${config.httpMethod} ${parsed.pathname}". Network observers see only encrypted bytes.`,
        summaryTechnical: `TLS Application Data Record transmitted. Layer 7 ciphertext containing HTTP/1.1 GET request line, host header, and accept parameters.`,
        whyItHappens: 'The client requests the specific resource path from the web server over the established secure tunnel.',
        whatHappensNext: 'The edge reverse proxy terminates TLS and forwards the request to the origin web server.',
        packet: httpReqPacket,
        direction: 'request',
        activeLinkIds: ['link_client_switch', 'link_switch_gateway', 'link_gateway_isp', 'link_isp_transit', 'link_transit_edge'],
        nodeStates: createNodeStates('edge_server', 'processing')
    }, 18.0);
    // ==========================================
    // PHASE 7: Edge Proxy -> Origin Web Server
    // ==========================================
    const edgeToOriginPacket = assembleEncapsulatedPacket({
        id: 'pkt_edge_to_origin',
        name: 'VPC Internal HTTP Proxying',
        sourceMac: edgeServerMac,
        destMac: webServerMac,
        sourceIp: '10.0.1.1',
        destIp: webServerInternalIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: 48920, dstPort: 3001, seq: 200, ack: 100, flags: { psh: true, ack: true } },
        application: {
            type: 'HTTP',
            data: {
                type: 'REQUEST',
                httpVersion: 'HTTP/1.1',
                method: config.httpMethod,
                path: parsed.pathname + parsed.search,
                headers: {
                    'Host': parsed.hostname,
                    'X-Forwarded-For': clientIp,
                    'X-Forwarded-Proto': 'https',
                    'Accept': 'application/json'
                },
                contentLengthBytes: 0
            }
        }
    });
    pushEvent({
        phase: 'ROUTING',
        protocol: 'HTTP/1.1',
        sourceNodeId: 'edge_server',
        destNodeId: 'web_server',
        title: 'Edge Reverse Proxy Ingress (VPC Forwarding)',
        summarySimple: 'Edge CDN proxy validates WAF security rules, terminates TLS, and forwards the request to the backend application server.',
        summaryTechnical: 'Reverse proxy strips outer TLS layer, appends X-Forwarded-For and X-Forwarded-Proto headers, and relays request over internal 10G VPC link to 10.0.1.50:3001.',
        whyItHappens: 'Separating edge caching and DDoS filtering from backend application logic improves performance, scalability, and security.',
        whatHappensNext: 'The Express application router processes the incoming request.',
        packet: edgeToOriginPacket,
        direction: 'request',
        activeLinkIds: ['link_edge_server'],
        nodeStates: createNodeStates('web_server', 'processing')
    }, 2.0);
    // ==========================================
    // PHASE 8: Web Server Processing & Route Matching
    // ==========================================
    const serverStartMs = currentTimeMs;
    // Timeout Scenario
    if (failure === 'TIMEOUT') {
        packetsDropped++;
        const timeoutPacket = assembleEncapsulatedPacket({
            id: 'pkt_http_504',
            name: 'HTTP 504 Gateway Timeout',
            sourceMac: edgeServerMac,
            destMac: clientMac,
            sourceIp: destinationIp,
            destIp: clientIp,
            isIpv6,
            transport: { type: 'TCP', srcPort: serverPort, dstPort: clientPort, flags: { psh: true, ack: true } },
            application: {
                type: 'HTTP',
                data: {
                    type: 'RESPONSE',
                    httpVersion: 'HTTP/1.1',
                    statusCode: 504,
                    statusText: 'Gateway Timeout',
                    headers: { 'Content-Type': 'application/json' },
                    bodyJson: { error: 'Gateway Timeout', message: 'The upstream application server failed to respond within 5000ms' },
                    contentLengthBytes: 110
                }
            }
        });
        pushEvent({
            phase: 'FAILURE',
            protocol: 'HTTP/1.1',
            sourceNodeId: 'edge_server',
            destNodeId: 'client',
            title: 'Request Gateway Timeout (HTTP 504)',
            summarySimple: 'The backend server took too long to process. The edge proxy gave up and returned HTTP 504 Gateway Timeout.',
            summaryTechnical: 'Upstream read timeout expired (5000ms exceeded). Edge proxy emitted HTTP/1.1 504 Gateway Timeout and severed origin socket.',
            whyItHappens: 'Database table locks, unindexed queries, or deadlocks in the backend thread pool.',
            whatHappensNext: 'Client renders a timeout error notification.',
            packet: timeoutPacket,
            direction: 'dropped',
            isErrorEvent: true,
            activeLinkIds: ['link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('edge_server', 'error')
        }, 50.0);
        metrics.serverProcessingMs = currentTimeMs - serverStartMs;
        return events; // HALT SIMULATION
    }
    // HTTP 404 Scenario
    if (failure === 'HTTP_404') {
        const notFoundPacket = assembleEncapsulatedPacket({
            id: 'pkt_http_404',
            name: 'HTTP 404 Not Found',
            sourceMac: webServerMac,
            destMac: edgeServerMac,
            sourceIp: webServerInternalIp,
            destIp: '10.0.1.1',
            isIpv6,
            transport: { type: 'TCP', srcPort: 3001, dstPort: 48920, flags: { psh: true, ack: true } },
            application: {
                type: 'HTTP',
                data: {
                    type: 'RESPONSE',
                    httpVersion: 'HTTP/1.1',
                    statusCode: 404,
                    statusText: 'Not Found',
                    headers: { 'Content-Type': 'application/json', 'Content-Length': '88' },
                    bodyJson: { error: 'Not Found', message: `No route matching path ${parsed.pathname}` },
                    contentLengthBytes: 88
                }
            }
        });
        metrics.serverProcessingMs = currentTimeMs - serverStartMs;
        metrics.httpStatusCode = 404;
        pushEvent({
            phase: 'HTTP_RESPONSE',
            protocol: 'HTTP/1.1',
            sourceNodeId: 'web_server',
            destNodeId: 'client',
            title: 'HTTP 404 Not Found (Route Mismatch)',
            summarySimple: `Network connection succeeded completely! However, the web server has no resource matching "${parsed.pathname}". It returns 404 Not Found.`,
            summaryTechnical: `Express router fallback route triggered. Path "${parsed.pathname}" has no registered controller. Returns HTTP/1.1 404 Not Found. (Important: This is an application response, NOT a network failure!)`,
            whyItHappens: 'The URL path points to a deleted, moved, or misspelled resource endpoint.',
            whatHappensNext: 'The client receives the 404 status code and renders the application 404 screen.',
            packet: notFoundPacket,
            direction: 'response',
            isErrorEvent: true,
            activeLinkIds: ['link_edge_server', 'link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('web_server', 'warning')
        }, 20.0);
        return events;
    }
    // HTTP 500 Scenario
    if (failure === 'HTTP_500') {
        const error500Packet = assembleEncapsulatedPacket({
            id: 'pkt_http_500',
            name: 'HTTP 500 Internal Server Error',
            sourceMac: webServerMac,
            destMac: edgeServerMac,
            sourceIp: webServerInternalIp,
            destIp: '10.0.1.1',
            isIpv6,
            transport: { type: 'TCP', srcPort: 3001, dstPort: 48920, flags: { psh: true, ack: true } },
            application: {
                type: 'HTTP',
                data: {
                    type: 'RESPONSE',
                    httpVersion: 'HTTP/1.1',
                    statusCode: 500,
                    statusText: 'Internal Server Error',
                    headers: { 'Content-Type': 'application/json', 'Content-Length': '124' },
                    bodyJson: { error: 'Internal Server Error', message: 'Unhandled exception in route controller' },
                    contentLengthBytes: 124
                }
            }
        });
        metrics.serverProcessingMs = currentTimeMs - serverStartMs;
        metrics.httpStatusCode = 500;
        pushEvent({
            phase: 'HTTP_RESPONSE',
            protocol: 'HTTP/1.1',
            sourceNodeId: 'web_server',
            destNodeId: 'client',
            title: 'HTTP 500 Internal Server Error (Application Crash)',
            summarySimple: 'The server encountered an unexpected error while executing its application code. It returns HTTP 500.',
            summaryTechnical: 'Express exception handler caught unhandled rejection in business logic. Serialized HTTP 500 response with JSON error envelope.',
            whyItHappens: 'Software bug, missing configuration parameter, or corrupted application memory state.',
            whatHappensNext: 'Client displays a server error notice and logs the failure.',
            packet: error500Packet,
            direction: 'response',
            isErrorEvent: true,
            activeLinkIds: ['link_edge_server', 'link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
            nodeStates: createNodeStates('web_server', 'error')
        }, 20.0);
        return events;
    }
    // Database Outage Scenario
    if (failure === 'DB_UNAVAILABLE') {
        const dbFailPacket = assembleEncapsulatedPacket({
            id: 'pkt_db_fail',
            name: 'SQL Connection Error (Port 5432 Down)',
            sourceMac: webServerMac,
            destMac: databaseMac,
            sourceIp: webServerInternalIp,
            destIp: dbInternalIp,
            isIpv6,
            transport: { type: 'TCP', srcPort: 51200, dstPort: 5432, flags: { rst: true } },
            application: {
                type: 'SQL',
                data: {
                    query: 'SELECT * FROM products;',
                    table: 'products',
                    executionTimeMs: 0,
                    rowsAffected: 0,
                    resultSummary: 'FATAL: connection to database server at 10.0.2.10:5432 refused'
                }
            }
        });
        pushEvent({
            phase: 'FAILURE',
            protocol: 'SQL',
            sourceNodeId: 'web_server',
            destNodeId: 'database',
            title: 'Database Outage (Connection Refused)',
            summarySimple: 'Web server tries to connect to PostgreSQL database (10.0.2.10:5432), but the database cluster is down!',
            summaryTechnical: 'Connection pool timeout / ECONNREFUSED on internal database port 5432. Web server catches database exception and returns 503 Service Unavailable.',
            whyItHappens: 'Database daemon crashed, ran out of connections, or primary node failed over.',
            whatHappensNext: 'Web server returns 503 Service Unavailable to client.',
            packet: dbFailPacket,
            direction: 'dropped',
            isErrorEvent: true,
            activeLinkIds: ['link_server_database'],
            nodeStates: createNodeStates('database', 'error')
        }, 15.0);
        metrics.serverProcessingMs = currentTimeMs - serverStartMs;
        return events; // HALT SIMULATION
    }
    // ==========================================
    // PHASE 9: Database Query Execution (Baseline Journey)
    // ==========================================
    const dbStartMs = currentTimeMs;
    const sqlQueryPacket = assembleEncapsulatedPacket({
        id: 'pkt_sql_query',
        name: 'PostgreSQL Query: SELECT products',
        sourceMac: webServerMac,
        destMac: databaseMac,
        sourceIp: webServerInternalIp,
        destIp: dbInternalIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: 51200, dstPort: 5432, seq: 10, ack: 10, flags: { psh: true, ack: true } },
        application: {
            type: 'SQL',
            data: {
                query: 'SELECT id, name, category, price, stock, description FROM products ORDER BY id ASC LIMIT 50;',
                table: 'products',
                executionTimeMs: 1.15,
                rowsAffected: 5,
                resultSummary: '5 tuples retrieved via Index Scan using products_pkey'
            }
        }
    });
    pushEvent({
        phase: 'DATABASE',
        protocol: 'SQL',
        sourceNodeId: 'web_server',
        destNodeId: 'database',
        title: 'Database Query Executed (PostgreSQL)',
        summarySimple: 'Application sends SQL query to PostgreSQL database: "SELECT * FROM products". Database finds 5 matching rows in 1.15ms.',
        summaryTechnical: 'PostgreSQL protocol query packet over private VPC socket. Planner executes B-Tree Index Scan across products_pkey. Retrieves 5 tuples in 1.15ms.',
        whyItHappens: 'The endpoint requires dynamic product catalog data stored inside the relational database.',
        whatHappensNext: 'The database returns the rows to the application server.',
        packet: sqlQueryPacket,
        direction: 'request',
        activeLinkIds: ['link_server_database'],
        nodeStates: createNodeStates('database', 'processing')
    }, 2.5);
    metrics.databaseTimeMs = currentTimeMs - dbStartMs;
    metrics.serverProcessingMs = currentTimeMs - serverStartMs;
    // ==========================================
    // PHASE 10: HTTP 200 OK Response Generation & Egress
    // ==========================================
    const sampleProducts = [
        { id: 1, name: 'Mechanical Keyboard', category: 'Peripherals', price: 149.99, stock: 42 },
        { id: 2, name: 'Precision Wireless Mouse', category: 'Peripherals', price: 79.99, stock: 85 },
        { id: 3, name: '4K Ultra-Wide Monitor', category: 'Displays', price: 899.99, stock: 14 },
        { id: 4, name: 'Managed Gigabit Switch', category: 'Networking', price: 199.99, stock: 29 },
        { id: 5, name: 'Wi-Fi 6E Mesh Router', category: 'Networking', price: 249.99, stock: 37 }
    ];
    const httpResPacket = assembleEncapsulatedPacket({
        id: 'pkt_http_res',
        name: 'HTTP 200 OK Response',
        sourceMac: edgeServerMac,
        destMac: transitRouterMac,
        sourceIp: destinationIp,
        destIp: clientIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: serverPort, dstPort: clientPort, seq: 5500, ack: 1800, flags: { psh: true, ack: true } },
        application: {
            type: 'HTTP',
            data: {
                type: 'RESPONSE',
                httpVersion: config.httpVersion === 'HTTP/3 (QUIC)' ? 'HTTP/3' : 'HTTP/1.1',
                statusCode: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': '428',
                    'Cache-Control': 'public, max-age=3600',
                    'ETag': 'W/"1ac-49b8"',
                    'Server': 'cloudflare',
                    'Date': new Date().toUTCString()
                },
                bodyJson: {
                    count: sampleProducts.length,
                    data: sampleProducts,
                    queryTimeMs: 1.15
                },
                contentLengthBytes: 428
            }
        }
    });
    pushEvent({
        phase: 'HTTP_RESPONSE',
        protocol: config.httpVersion === 'HTTP/3 (QUIC)' ? 'HTTP/3 (QUIC)' : 'HTTP/1.1',
        sourceNodeId: 'web_server',
        destNodeId: 'client',
        title: 'HTTP 200 OK Response Transmitted',
        summarySimple: 'Server sends back HTTP 200 OK with the product catalog JSON. The response travels back across routers, gateway, and switch to your browser.',
        summaryTechnical: 'HTTP/1.1 200 OK serialized with Content-Type: application/json. Encrypted in TLS 1.3 record. Traverses WAN -> NAT gateway (translates to 192.168.1.105:54321) -> Client socket.',
        whyItHappens: 'The server successfully fulfilled the request and returns the requested payload to the client.',
        whatHappensNext: 'Browser receives the TCP segment, decrypts TLS, and parses the JSON response.',
        packet: httpResPacket,
        direction: 'response',
        activeLinkIds: ['link_edge_server', 'link_transit_edge', 'link_isp_transit', 'link_gateway_isp', 'link_switch_gateway', 'link_client_switch'],
        nodeStates: createNodeStates('client', 'processing')
    }, 22.0);
    // ==========================================
    // PHASE 11: Browser Rendering & Completion
    // ==========================================
    const renderPacket = assembleEncapsulatedPacket({
        id: 'pkt_client_render',
        name: 'Browser DOM Render',
        sourceMac: clientMac,
        destMac: clientMac,
        sourceIp: clientIp,
        destIp: clientIp,
        isIpv6,
        transport: { type: 'TCP', srcPort: clientPort, dstPort: serverPort, flags: { ack: true } },
        application: {
            type: 'HTTP',
            data: {
                type: 'RESPONSE',
                httpVersion: 'HTTP/1.1',
                statusCode: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' },
                bodyJson: { count: 5, status: 'rendered' },
                contentLengthBytes: 428
            }
        }
    });
    metrics.httpStatusCode = 200;
    metrics.responseSizeBytes = 428;
    pushEvent({
        phase: 'BROWSER_RENDER',
        protocol: 'HTTP/1.1',
        sourceNodeId: 'client',
        destNodeId: 'client',
        title: 'Browser Decryption & UI Render Complete',
        summarySimple: 'Browser decrypts TLS payload, parses JSON data, and updates the user interface on screen. Journey complete!',
        summaryTechnical: 'TLS AEAD decryption verified. HTTP response stream parsed into JavaScript object. React render cycle executed. TCP connection placed into Keep-Alive pool for reuse.',
        whyItHappens: 'The browser finishes the request lifecycle by presenting the requested data to the user.',
        whatHappensNext: 'Simulation finished. Explore packets in the inspector or test failure scenarios in the Failure Lab.',
        packet: renderPacket,
        direction: 'internal',
        nodeStates: createNodeStates('client', 'success')
    }, 3.0);
    return events;
}
