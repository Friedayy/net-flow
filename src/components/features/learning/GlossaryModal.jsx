import React, { useState } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
export const GLOSSARY_TERMS = [
    {
        term: 'DNS (Domain Name System)',
        category: 'Layer 7 / Application',
        shortDefinition: 'The internet phonebook mapping human-readable hostnames to numerical IP addresses.',
        deepDive: 'Operates primarily over UDP port 53. Resolves names recursively by traversing Root servers (.), TLD servers (.com), and Authoritative nameservers.',
        rfc: 'RFC 1034 / 1035'
    },
    {
        term: 'ARP (Address Resolution Protocol)',
        category: 'Layer 2 / Link',
        shortDefinition: 'Discovers the link-layer MAC address associated with an IPv4 address on a local network segment.',
        deepDive: 'Broadcasts an Ethernet frame (FF:FF:FF:FF:FF:FF) asking "Who has 192.168.1.1?". The device owning that IP unicasts its MAC back. Results are stored in the host ARP cache.',
        rfc: 'RFC 826'
    },
    {
        term: 'TCP 3-Way Handshake',
        category: 'Layer 4 / Transport',
        shortDefinition: 'The connection establishment process using SYN, SYN-ACK, and ACK segments.',
        deepDive: 'Synchronizes initial sequence numbers (ISNs) and flow-control window sizes between two endpoints before transferring application payload.',
        rfc: 'RFC 793 / 9293'
    },
    {
        term: 'TLS 1.3 (Transport Layer Security)',
        category: 'Security',
        shortDefinition: 'Cryptographic protocol providing authentication, confidentiality, and integrity for internet communications.',
        deepDive: 'Establishes encrypted communication in just 1 round-trip time (1-RTT) using ephemeral Diffie-Hellman key exchanges (X25519) and authenticated encryption (AES-256-GCM).',
        rfc: 'RFC 8446'
    },
    {
        term: 'NAT (Network Address Translation)',
        category: 'Layer 3 / Network',
        shortDefinition: 'Remaps private IP address spaces into a single public routable IP address.',
        deepDive: 'NAPT (Port Address Translation) tracks outbound connections by assigning distinct high-order ephemeral ports (e.g. 61001) on the public WAN interface and rewriting packet headers.',
        rfc: 'RFC 3022'
    },
    {
        term: 'TTL (Time to Live) / Hop Limit',
        category: 'Layer 3 / Network',
        shortDefinition: 'An 8-bit counter in the IP header that prevents packets from looping infinitely across routers.',
        deepDive: 'Every router decrements the TTL counter by 1 before forwarding. If TTL reaches 0, the packet is discarded and an ICMP Time Exceeded (Type 11) message is returned to the source.',
        rfc: 'RFC 791 (IPv4) / RFC 8200 (IPv6)'
    },
    {
        term: 'MTU (Maximum Transmission Unit)',
        category: 'Layer 2 / Link',
        shortDefinition: 'The largest packet or frame size (in octets) that can be sent without fragmentation.',
        deepDive: 'Standard Ethernet MTU is 1500 bytes. Subtracting 20 bytes for IPv4 and 20 bytes for TCP leaves a Maximum Segment Size (MSS) of 1460 bytes for application data.',
        rfc: 'RFC 894 / RFC 1191'
    },
    {
        term: 'BGP (Border Gateway Protocol)',
        category: 'Layer 3 / Network',
        shortDefinition: 'The routing protocol that controls how packets navigate between Autonomous Systems (AS) across the global internet.',
        deepDive: 'Path-vector protocol running over TCP port 179. Exchanges network reachability information between ISP backbones and cloud networks.',
        rfc: 'RFC 4271'
    },
    {
        term: 'HTTP/2 & Multiplexing',
        category: 'Layer 7 / Application',
        shortDefinition: 'Major revision to HTTP introducing binary framing and concurrent multiplexed streams over a single TCP connection.',
        deepDive: 'Eliminates HTTP/1.1 head-of-line blocking at the application layer by interleaving binary frames for different requests across one persistent connection.',
        rfc: 'RFC 7540 / 9113'
    },
    {
        term: 'HTTP/3 & QUIC',
        category: 'Layer 7 / Application',
        shortDefinition: 'Next-generation HTTP transport running over UDP rather than TCP.',
        deepDive: 'Replaces TCP and TLS with QUIC (RFC 9000). Resolves TCP head-of-line blocking across lossy wireless links and provides zero-round-trip (0-RTT) connection resumption.',
        rfc: 'RFC 9114'
    },
    {
        term: 'CAM / MAC Learning Table',
        category: 'Layer 2 / Link',
        shortDefinition: 'Switch memory table mapping Ethernet MAC addresses to physical switch ports.',
        deepDive: 'Switches inspect the Source MAC of incoming frames and record which port it arrived on. Subsequent frames destined for that MAC are unicast out that specific port rather than flooded.',
        rfc: 'IEEE 802.1D'
    },
    {
        term: 'FIB (Forwarding Information Base)',
        category: 'Layer 3 / Network',
        shortDefinition: 'The hardware lookup table in a router optimized for high-speed packet forwarding.',
        deepDive: 'Derived from the control plane routing table (RIB). Uses Longest Prefix Match (LPM) algorithms implemented in TCAM hardware to decide next hops at wire speed.',
        rfc: 'RFC 1812'
    }
];
export const GlossaryModal = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    if (!isOpen)
        return null;
    const categories = ['ALL', 'Layer 2 / Link', 'Layer 3 / Network', 'Layer 4 / Transport', 'Layer 7 / Application', 'Security'];
    const filtered = GLOSSARY_TERMS.filter((item) => {
        const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) ||
            item.shortDefinition.toLowerCase().includes(search.toLowerCase()) ||
            item.deepDive.toLowerCase().includes(search.toLowerCase());
        const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
        return matchesSearch && matchesCat;
    });
    return (<div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 12, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }} onClick={onClose}>
      <div className="panel-glass" style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
        }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--cyan-bright)"/>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Computer Networks Glossary</h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={18}/>
          </button>
        </div>

        {/* Search & Categories */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }}/>
            <input type="text" placeholder="Search concepts, RFCs, protocols, terms..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            backgroundColor: 'var(--bg-darkest)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem'
        }}/>
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className="btn-ghost" style={{
                fontSize: '0.725rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedCategory === cat ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                color: selectedCategory === cat ? 'var(--cyan-bright)' : 'var(--text-muted)',
                border: selectedCategory === cat ? '1px solid var(--cyan-bright)' : '1px solid transparent',
                whiteSpace: 'nowrap'
            }}>
                {cat}
              </button>))}
          </div>
        </div>

        {/* Term List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (<div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No matching glossary terms found.
            </div>) : (filtered.map((item, i) => (<div key={i} className="panel-elevated" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan-bright)' }}>
                    {item.term}
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="badge-protocol badge-tcp" style={{ fontSize: '0.65rem' }}>
                      {item.category}
                    </span>
                    {item.rfc && (<span className="badge-protocol badge-dns" style={{ fontSize: '0.65rem' }}>
                        {item.rfc}
                      </span>)}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 500 }}>
                  {item.shortDefinition}
                </p>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  {item.deepDive}
                </p>
              </div>)))}
        </div>
      </div>
    </div>);
};
