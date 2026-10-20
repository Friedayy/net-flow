import React, { useState } from 'react';
import {
  Layers,
  FileCode,
  ArrowRight
} from 'lucide-react';

export const PacketInspector = ({ packet }) => {
  const [selectedLayer, setSelectedLayer] = useState('ALL');
  const [showHexDump, setShowHexDump] = useState(false);

  if (!packet) {
    return (
      <div
        className="panel-glass"
        style={{
          padding: '30px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}
      >
        <Layers size={36} color="var(--border-medium)" style={{ marginBottom: '12px' }} />
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>No Active Packet</h4>
        <p style={{ fontSize: '0.8rem', maxWidth: '280px' }}>
          Step through the timeline or run a trace simulation to dissect wire packets and encapsulated headers.
        </p>
      </div>
    );
  }

  return (
    <div
      className="panel-glass"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Header with Packet Name & Size */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={17} color="var(--cyan-bright)" />
          <div>
            <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {packet.name}
            </h3>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {packet.totalSizeBytes} bytes on wire ({packet.encapsulationStack?.length || 4} layers encapsulated)
            </span>
          </div>
        </div>

        {/* Hex Dump Toggle */}
        <button
          onClick={() => setShowHexDump(!showHexDump)}
          className="btn-secondary"
          style={{
            fontSize: '0.725rem',
            padding: '4px 10px',
            color: showHexDump ? 'var(--cyan-bright)' : 'var(--text-secondary)'
          }}
        >
          <FileCode size={13} />
          <span>{showHexDump ? 'Structured View' : 'Wireshark Hex'}</span>
        </button>
      </div>

      {/* Layer Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '6px 14px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}
      >
        {['ALL', 'APPLICATION', 'TRANSPORT', 'NETWORK', 'LINK'].map((layer) => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className="btn-ghost"
            style={{
              fontSize: '0.675rem',
              padding: '3px 8px',
              fontFamily: 'var(--font-mono)',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: selectedLayer === layer ? 'rgba(0, 245, 212, 0.14)' : 'transparent',
              color: selectedLayer === layer ? 'var(--cyan-bright)' : 'var(--text-muted)',
              border: selectedLayer === layer ? '1px solid rgba(0, 245, 212, 0.3)' : '1px solid transparent'
            }}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Main Inspection Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {showHexDump ? (
          /* HEX DUMP VIEW (Wireshark Style) */
          <div
            className="panel-elevated"
            style={{
              padding: '12px',
              backgroundColor: '#030508',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--cyan-bright)',
              lineHeight: '1.6'
            }}
          >
            <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.675rem' }}>
              Offset   00 01 02 03 04 05 06 07   08 09 0a 0b 0c 0d 0e 0f
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {packet.rawHexPreview}
            </pre>
          </div>
        ) : (
          /* STRUCTURED MULTI-LAYER VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Visual Encapsulation Stack */}
            <div
              className="panel-elevated"
              style={{ padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                PROTOCOL ENCAPSULATION HIERARCHY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                {packet.encapsulationStack?.map((item, i) => (
                  <React.Fragment key={i}>
                    <span
                      style={{
                        padding: '2px 7px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.675rem',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: i === packet.encapsulationStack.length - 1
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(56, 189, 248, 0.1)',
                        border: `1px solid ${i === packet.encapsulationStack.length - 1 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.2)'}`,
                        color: i === packet.encapsulationStack.length - 1 ? 'var(--emerald-success)' : 'var(--blue-ice)'
                      }}
                    >
                      {item.layer} ({item.headerSizeBytes}B)
                    </span>
                    {i < packet.encapsulationStack.length - 1 && (
                      <ArrowRight size={11} color="var(--text-muted)" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* LAYER 7: APPLICATION */}
            {(selectedLayer === 'ALL' || selectedLayer === 'APPLICATION') && packet.applicationLayer && (
              <div
                className="panel-elevated"
                style={{ padding: '12px', borderLeft: '3px solid var(--emerald-success)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--emerald-success)', fontWeight: 700 }}>
                    LAYER 7 — APPLICATION ({packet.applicationLayer.type})
                  </h5>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Payload Protocol
                  </span>
                </div>

                {packet.applicationLayer.type === 'HTTP' && (
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {packet.applicationLayer.data.type === 'REQUEST' ? (
                      <>
                        <div style={{ color: 'var(--cyan-bright)', fontWeight: 700 }}>
                          {packet.applicationLayer.data.method} {packet.applicationLayer.data.path} {packet.applicationLayer.data.httpVersion}
                        </div>
                        {Object.entries(packet.applicationLayer.data.headers || {}).map(([k, v]) => (
                          <div key={k} style={{ color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{k}:</span> {String(v)}
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div style={{ color: packet.applicationLayer.data.statusCode === 200 ? 'var(--emerald-success)' : 'var(--coral-error)', fontWeight: 700 }}>
                          {packet.applicationLayer.data.httpVersion} {packet.applicationLayer.data.statusCode} {packet.applicationLayer.data.statusText}
                        </div>
                        {Object.entries(packet.applicationLayer.data.headers || {}).map(([k, v]) => (
                          <div key={k} style={{ color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{k}:</span> {String(v)}
                          </div>
                        ))}
                        {packet.applicationLayer.data.bodyJson && (
                          <div style={{ marginTop: '6px', padding: '6px 8px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: '2px', fontSize: '0.65rem' }}>Response Body Payload:</div>
                            <pre style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.7rem' }}>
                              {JSON.stringify(packet.applicationLayer.data.bodyJson, null, 2)}
                            </pre>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {packet.applicationLayer.type === 'DNS' && (
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Tx ID:</span> {packet.applicationLayer.data.transactionId}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> {packet.applicationLayer.data.flags?.isResponse ? 'Response' : 'Query'} ({packet.applicationLayer.data.flags?.responseCode})</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Questions:</span> {packet.applicationLayer.data.questions?.map((q) => `${q.name} (type ${q.type})`).join(', ')}</div>
                    {packet.applicationLayer.data.answers?.length > 0 && (
                      <div><span style={{ color: 'var(--cyan-bright)' }}>Answers:</span> {packet.applicationLayer.data.answers?.map((a) => `${a.name} -> ${a.data} (TTL ${a.ttl}s)`).join(', ')}</div>
                    )}
                  </div>
                )}

                {packet.applicationLayer.type === 'TLS' && (
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Record:</span> {packet.applicationLayer.data.recordType} ({packet.applicationLayer.data.version})</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Handshake:</span> {packet.applicationLayer.data.handshakeType}</div>
                    {packet.applicationLayer.data.cipherSuite && (
                      <div><span style={{ color: 'var(--violet-bright)' }}>Cipher:</span> {packet.applicationLayer.data.cipherSuite}</div>
                    )}
                    {packet.applicationLayer.data.keyExchangeGroup && (
                      <div><span style={{ color: 'var(--text-muted)' }}>Curve:</span> {packet.applicationLayer.data.keyExchangeGroup}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* LAYER 4: TRANSPORT */}
            {(selectedLayer === 'ALL' || selectedLayer === 'TRANSPORT') && packet.transportLayer && (
              <div
                className="panel-elevated"
                style={{ padding: '12px', borderLeft: '3px solid var(--blue-ice)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--blue-ice)', fontWeight: 700 }}>
                    LAYER 4 — TRANSPORT ({'sequenceNumber' in packet.transportLayer ? 'TCP' : 'UDP'})
                  </h5>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    End-to-End Segment
                  </span>
                </div>

                {'sequenceNumber' in packet.transportLayer ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Source Port:</span> {packet.transportLayer.sourcePort}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Dest Port:</span> {packet.transportLayer.destinationPort}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Seq Num:</span> {packet.transportLayer.sequenceNumber}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Ack Num:</span> {packet.transportLayer.acknowledgmentNumber}</div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Flags: </span>
                      {Object.entries(packet.transportLayer.flags || {})
                        .filter(([_, v]) => v)
                        .map(([k]) => k.toUpperCase())
                        .join(', ') || 'None'}
                    </div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Window Size:</span> {packet.transportLayer.windowSizeBytes} B</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Source Port:</span> {packet.transportLayer.sourcePort}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Dest Port:</span> {packet.transportLayer.destinationPort}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Length:</span> {packet.transportLayer.lengthBytes} octets</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Checksum:</span> {packet.transportLayer.checksum}</div>
                  </div>
                )}
              </div>
            )}

            {/* LAYER 3: NETWORK */}
            {(selectedLayer === 'ALL' || selectedLayer === 'NETWORK') && packet.networkLayer && (
              <div
                className="panel-elevated"
                style={{ padding: '12px', borderLeft: '3px solid var(--violet-bright)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '0.8rem', color: 'var(--violet-bright)', fontWeight: 700 }}>
                    LAYER 3 — NETWORK ({packet.networkLayer.version === 6 ? 'IPv6' : 'IPv4'})
                  </h5>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Host-to-Host Datagram
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Source IP:</span> {packet.networkLayer.sourceIp}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Dest IP:</span> {packet.networkLayer.destinationIp}</div>
                  {'ttl' in packet.networkLayer && (
                    <>
                      <div><span style={{ color: 'var(--cyan-bright)' }}>TTL:</span> {packet.networkLayer.ttl} hops remaining</div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Protocol:</span> {packet.networkLayer.protocolName} ({packet.networkLayer.protocol})</div>
                    </>
                  )}
                  {'hopLimit' in packet.networkLayer && (
                    <>
                      <div><span style={{ color: 'var(--cyan-bright)' }}>Hop Limit:</span> {packet.networkLayer.hopLimit}</div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Next Header:</span> {packet.networkLayer.nextHeaderName}</div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* LAYER 2: LINK */}
            {(selectedLayer === 'ALL' || selectedLayer === 'LINK') && packet.linkLayer && (
              <div
                className="panel-elevated"
                style={{ padding: '12px', borderLeft: '3px solid #64748b' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    LAYER 2 — DATA LINK (Ethernet II Frame)
                  </h5>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Physical Hop Frame
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Source MAC:</span> {packet.linkLayer.sourceMac}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Dest MAC:</span> {packet.linkLayer.destinationMac}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>EtherType:</span> {packet.linkLayer.etherType}</div>
                  <div><span style={{ color: 'var(--text-muted)' }}>FCS CRC:</span> {packet.linkLayer.fcsChecksum}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
