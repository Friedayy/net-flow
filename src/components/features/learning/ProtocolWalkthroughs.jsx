import React, { useState } from 'react';
import { Globe, Radio, ArrowRightLeft, ShieldCheck, Zap, Layers, Info } from 'lucide-react';
export const ProtocolWalkthroughs = () => {
    const [activeTab, setActiveTab] = useState('TCP');
    return (<div className="panel-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Walkthrough Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
            { id: 'TCP', label: 'TCP 3-Way Handshake', icon: <ArrowRightLeft size={16}/> },
            { id: 'DNS', label: 'DNS Resolution Tree', icon: <Globe size={16}/> },
            { id: 'TLS', label: 'TLS 1.3 Cryptography', icon: <ShieldCheck size={16}/> },
            { id: 'HTTP', label: 'HTTP/1 vs HTTP/2 vs HTTP/3', icon: <Zap size={16}/> },
            { id: 'ARP', label: 'ARP & MAC Discovery', icon: <Radio size={16}/> },
            { id: 'ENCAP', label: 'Packet Encapsulation', icon: <Layers size={16}/> }
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'btn-primary' : 'btn-ghost'} style={{ fontSize: '0.8rem', padding: '8px 14px', whiteSpace: 'nowrap' }}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>))}
      </div>

      {/* Tab 1: TCP 3-Way Handshake Deep Dive */}
      {activeTab === 'TCP' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cyan-bright)' }}>
              The TCP 3-Way Handshake (RFC 793 / 9293)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Why are exactly three packets required before transferring application data?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Packet 1 */}
            <div className="panel-elevated" style={{ padding: '16px', borderTop: '3px solid var(--cyan-bright)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-protocol badge-tcp">Packet 1: SYN</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Client → Server</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                "Can you hear me? Here is my ISN."
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                Client generates random Initial Sequence Number (e.g. Seq = 1000) and sets the SYN flag. Enters <strong>SYN_SENT</strong> state.
              </p>
            </div>

            {/* Packet 2 */}
            <div className="panel-elevated" style={{ padding: '16px', borderTop: '3px solid var(--emerald-success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-protocol badge-http">Packet 2: SYN-ACK</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Server → Client</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                "Yes, I hear you! Here is my ISN."
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                Server acknowledges client sequence (Ack = 1001), generates its own sequence number (Seq = 5000), and sets SYN and ACK. Enters <strong>SYN_RCVD</strong>.
              </p>
            </div>

            {/* Packet 3 */}
            <div className="panel-elevated" style={{ padding: '16px', borderTop: '3px solid var(--blue-ice)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-protocol badge-tcp">Packet 3: ACK</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Client → Server</span>
              </div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                "I hear you too. We are ready!"
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                Client acknowledges server sequence (Ack = 5001). Both endpoints transition to <strong>ESTABLISHED</strong>. Data transfer can now commence.
              </p>
            </div>
          </div>

          <div className="panel-elevated" style={{ padding: '14px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-bright)', marginBottom: '4px' }}>
              <Info size={16}/>
              <strong style={{ fontSize: '0.8rem' }}>The Two Generals Paradox</strong>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Why not 2 packets? If only 2 packets were used, the server would have no proof that the client received its SYN-ACK. If the SYN-ACK were lost, the server would believe the connection was open while the client would be in an error state. 3 packets is the minimum required for bidirectional synchronization across an unreliable medium.
            </p>
          </div>
        </div>)}

      {/* Tab 2: DNS Tree */}
      {activeTab === 'DNS' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--violet-bright)' }}>
              How DNS Works: The Hierarchical Tree
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Translating human domain names into numerical IP addresses across global authority zones.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
                { step: '1', title: 'Browser / OS Cache', desc: 'Checks internal memory cache. If found, resolution takes 0.1ms without touching the network.', ttl: 'Sub-millisecond' },
                { step: '2', title: 'Recursive Resolver (1.1.1.1 / 8.8.8.8)', desc: 'If cache misses, queries the configured ISP or public recursive resolver.', ttl: '5-15ms' },
                { step: '3', title: 'Root Nameservers (.)', desc: '13 root server IP clusters direct the query to the Top-Level Domain (TLD) servers for .com, .org, .net.', ttl: 'Anycast' },
                { step: '4', title: 'TLD Nameservers (.com)', desc: 'Operated by registries (e.g. Verisign). Returns the Authoritative Nameservers for example.com (e.g. ns1.cloudflare.com).', ttl: '24-48 Hours' },
                { step: '5', title: 'Authoritative Nameservers', desc: 'The definitive source holding the zone file. Returns the actual A (IPv4) or AAAA (IPv6) record with TTL.', ttl: 'Configurable (300s)' }
            ].map((node, i) => (<div key={i} className="panel-elevated" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: 'var(--violet-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    {node.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{node.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{node.desc}</p>
                  </div>
                </div>
                <span className="badge-protocol badge-dns" style={{ fontSize: '0.65rem' }}>{node.ttl}</span>
              </div>))}
          </div>
        </div>)}

      {/* Tab 3: TLS 1.3 */}
      {activeTab === 'TLS' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8' }}>
              TLS 1.3 Cryptography (RFC 8446)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              How modern HTTPS achieves forward secrecy and zero-overhead encryption in 1 round trip.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="panel-elevated" style={{ padding: '16px', borderTop: '3px solid var(--violet-bright)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Legacy TLS 1.2 (2 Round Trips)
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Required 2 full round trips before application data could be sent. Supported outdated and vulnerable cipher suites (RSA key exchange, CBC ciphers, SHA-1).
              </p>
            </div>

            <div className="panel-elevated" style={{ padding: '16px', borderTop: '3px solid var(--emerald-success)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Modern TLS 1.3 (1 Round Trip)
              </h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Client sends Diffie-Hellman KeyShare directly in the ClientHello. Server responds with its KeyShare, certificate, and finished MAC. Symmetric session keys are derived immediately!
              </p>
            </div>
          </div>
        </div>)}

      {/* Tab 4: HTTP Evolution */}
      {activeTab === 'HTTP' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-success)' }}>
              HTTP Evolution: HTTP/1.1 vs HTTP/2 vs HTTP/3
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              The evolution of the web protocol from plain text to binary multiplexing and UDP transport.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div className="panel-elevated" style={{ padding: '16px' }}>
              <span className="badge-protocol badge-tcp" style={{ marginBottom: '8px' }}>HTTP/1.1 (1997)</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Plain Text & Pipelining</h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                Human-readable text headers. Suffer from Head-of-Line (HoL) blocking: one slow request blocks all subsequent requests on the socket.
              </p>
            </div>

            <div className="panel-elevated" style={{ padding: '16px' }}>
              <span className="badge-protocol badge-dns" style={{ marginBottom: '8px' }}>HTTP/2 (2015)</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>Binary Multiplexing</h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                Splits requests into binary frames over a single TCP connection. Interleaves concurrent streams without blocking at the HTTP layer.
              </p>
            </div>

            <div className="panel-elevated" style={{ padding: '16px' }}>
              <span className="badge-protocol badge-http" style={{ marginBottom: '8px' }}>HTTP/3 (2022)</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px' }}>QUIC over UDP</h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                Eliminates TCP transport-layer Head-of-Line blocking. Encrypts all transport metadata and enables instant connection migration across Wi-Fi/Cellular.
              </p>
            </div>
          </div>
        </div>)}

      {/* Tab 5: ARP */}
      {activeTab === 'ARP' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#cbd5e1' }}>
            ARP: Finding MAC Address from IP (Layer 2 ↔ Layer 3)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Why does a device need ARP when it already knows the IP address?
          </p>
          <div className="panel-elevated" style={{ padding: '16px', lineHeight: '1.5', fontSize: '0.85rem' }}>
            <p style={{ marginBottom: '10px' }}>
              IP addresses exist purely at <strong>Layer 3 (Network)</strong> for logical end-to-end routing across the global internet. However, physical network hardware (Ethernet cards, Wi-Fi antennas, and local switches) operate strictly at <strong>Layer 2 (Data Link)</strong> using 48-bit MAC addresses.
            </p>
            <p style={{ color: 'var(--cyan-bright)' }}>
              1. Host checks ARP cache for 192.168.1.1.<br />
              2. If absent, broadcasts an ARP Request frame: <code>Who has 192.168.1.1? Tell 192.168.1.105</code><br />
              3. The gateway responds with a Unicast ARP Reply: <code>192.168.1.1 is at 00:1c:73:9a:11:01</code><br />
              4. The frame is transmitted and cached for future requests.
            </p>
          </div>
        </div>)}

      {/* Tab 6: Encapsulation */}
      {activeTab === 'ENCAP' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--cyan-bright)' }}>
            Packet Encapsulation: The Russian Doll Model
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            How user data is progressively wrapped into transport segments, network datagrams, and link-layer frames.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)' }}>
              <strong>Layer 7: HTTP Payload</strong> (e.g. <code>GET /products</code> + JSON)
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-md)', marginLeft: '12px' }}>
              <strong>Layer 4: + TCP Header</strong> (Ports 54321 → 443, Seq, Ack, Flags)
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: 'var(--radius-md)', marginLeft: '24px' }}>
              <strong>Layer 3: + IPv4 Header</strong> (Source IP, Dest IP, TTL, Checksum)
            </div>
            <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', marginLeft: '36px' }}>
              <strong>Layer 2: + Ethernet Header & CRC</strong> (Source MAC, Dest MAC, FCS)
            </div>
          </div>
        </div>)}
    </div>);
};
