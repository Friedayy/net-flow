import React from 'react';
import { Cpu, Network } from 'lucide-react';
import { NodeSvgIcon } from '../network-canvas/NodeSvgIcons';
export const ComponentInspector = ({ node, currentEvent, mode, onToggleMode }) => {
    if (!node) {
        return (<div className="panel-glass" style={{
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
        <Network size={36} color="var(--border-medium)" style={{ marginBottom: '12px' }}/>
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>No Device Selected</h4>
        <p style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
          Click any device or router on the network map to inspect its internals, routing tables, and ports.
        </p>
      </div>);
    }
    return (<div className="panel-glass" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
      {/* Header with Device Title & Mode Toggle */}
      <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <NodeSvgIcon role={node.role} status={node.status} size={30}/>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {node.name}
            </h3>
            <span style={{
            fontSize: '0.75rem',
            color: 'var(--cyan-bright)',
            fontFamily: 'var(--font-mono)'
        }}>
              {node.sublabel}
            </span>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <button onClick={onToggleMode} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
          {mode === 'simple' ? 'Switch to Engineer' : 'Switch to Simple'}
        </button>
      </div>

      {/* Content Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {mode === 'simple' ? (
        /* ========================================= */
        /* SIMPLE MODE VIEW (Beginner Friendly)      */
        /* ========================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="panel-elevated" style={{ padding: '14px', borderLeft: '3px solid var(--cyan-bright)' }}>
              <h5 style={{ fontSize: '0.8rem', color: 'var(--cyan-bright)', marginBottom: '6px', fontWeight: 700 }}>
                WHAT IS THIS DEVICE?
              </h5>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                {node.explanationSimple}
              </p>
            </div>

            {/* Current Simulation Role */}
            {currentEvent && (<div className="panel-elevated" style={{ padding: '14px', borderLeft: '3px solid var(--emerald-success)' }}>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--emerald-success)', marginBottom: '6px', fontWeight: 700 }}>
                  CURRENT ACTIVE ACTION
                </h5>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                  {currentEvent.summarySimple}
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <strong>Next step:</strong> {currentEvent.whatHappensNext}
                </div>
              </div>)}

            {/* Fast Facts Card */}
            <div className="panel-elevated" style={{ padding: '14px' }}>
              <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 700 }}>
                DEVICE SUMMARY
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Role: </span>
                  <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{node.role}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>OS: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{node.hardwareDetails.os}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Hostname: </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{node.hardwareDetails.hostname}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Interfaces: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{node.interfaces.length} port(s)</strong>
                </div>
              </div>
            </div>
          </div>) : (
        /* ========================================= */
        /* ENGINEER MODE VIEW (Deep Dive Specs)      */
        /* ========================================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Technical Explanation */}
            <div className="panel-elevated" style={{ padding: '12px', borderLeft: '3px solid var(--violet-bright)' }}>
              <h5 style={{ fontSize: '0.75rem', color: 'var(--violet-bright)', marginBottom: '4px', fontWeight: 700 }}>
                RFC & ARCHITECTURE SPECIFICATION
              </h5>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                {node.explanationEngineer}
              </p>
            </div>

            {/* Hardware & ASIC Profile */}
            <div className="panel-elevated" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Cpu size={14} color="var(--cyan-bright)"/>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  HARDWARE & KERNEL PROFILE
                </h5>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Host:</span> {node.hardwareDetails.hostname}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Chipset:</span> {node.hardwareDetails.chipset}</div>
                {node.hardwareDetails.asNumber && (<div><span style={{ color: 'var(--text-muted)' }}>BGP AS:</span> AS{node.hardwareDetails.asNumber}</div>)}
                {node.portsOpen && (<div><span style={{ color: 'var(--text-muted)' }}>Listening Ports:</span> {node.portsOpen.join(', ')}</div>)}
              </div>
            </div>

            {/* Network Interfaces */}
            <div className="panel-elevated" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Network size={14} color="var(--blue-ice)"/>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  NETWORK INTERFACES & MAC/IP
                </h5>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {node.interfaces.map((iface, i) => (<div key={i} style={{
                    padding: '6px 8px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.725rem',
                    fontFamily: 'var(--font-mono)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cyan-bright)', fontWeight: 600 }}>
                      <span>{iface.name}</span>
                      <span style={{ color: 'var(--emerald-success)' }}>{iface.status.toUpperCase()}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      IP: <strong>{iface.ip}</strong> | Netmask: {iface.netmask}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      MAC: <strong>{iface.mac}</strong> | MTU: {iface.mtu} octets
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Routing Table (if present) */}
            {node.routingTable && node.routingTable.length > 0 && (<div className="panel-elevated" style={{ padding: '12px' }}>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 700 }}>
                  IP ROUTING TABLE (FIB)
                </h5>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: '4px' }}>Destination</th>
                        <th style={{ padding: '4px' }}>Gateway</th>
                        <th style={{ padding: '4px' }}>Iface</th>
                        <th style={{ padding: '4px' }}>Flags</th>
                      </tr>
                    </thead>
                    <tbody>
                      {node.routingTable.map((rt, i) => (<tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '4px', color: 'var(--text-primary)' }}>{rt.destination}</td>
                          <td style={{ padding: '4px', color: 'var(--blue-ice)' }}>{rt.gateway}</td>
                          <td style={{ padding: '4px', color: 'var(--text-muted)' }}>{rt.interface}</td>
                          <td style={{ padding: '4px', color: 'var(--emerald-success)' }}>{rt.flags}</td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}

            {/* NAT Translation Table (for Gateway) */}
            {node.natTable && node.natTable.length > 0 && (<div className="panel-elevated" style={{ padding: '12px' }}>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 700 }}>
                  ACTIVE NAPT / PAT TRANSLATION TABLE
                </h5>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: '4px' }}>Proto</th>
                        <th style={{ padding: '4px' }}>Private IP:Port</th>
                        <th style={{ padding: '4px' }}>Public NAT IP:Port</th>
                        <th style={{ padding: '4px' }}>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {node.natTable.map((nat, i) => (<tr key={i}>
                          <td style={{ padding: '4px', color: 'var(--cyan-bright)' }}>{nat.protocol}</td>
                          <td style={{ padding: '4px' }}>{nat.privateIp}:{nat.privatePort}</td>
                          <td style={{ padding: '4px', color: 'var(--emerald-success)' }}>{nat.publicIp}:{nat.publicPort}</td>
                          <td style={{ padding: '4px', color: 'var(--text-muted)' }}>{nat.state}</td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}

            {/* Switch MAC Learning Table */}
            {node.macTable && node.macTable.length > 0 && (<div className="panel-elevated" style={{ padding: '12px' }}>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 700 }}>
                  SWITCH FORWARDING TABLE (CAM)
                </h5>
                <table style={{ width: '100%', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '4px' }}>Port</th>
                      <th style={{ padding: '4px' }}>MAC Address</th>
                      <th style={{ padding: '4px' }}>VLAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {node.macTable.map((cam, i) => (<tr key={i}>
                        <td style={{ padding: '4px', color: 'var(--cyan-bright)' }}>Port {cam.port}</td>
                        <td style={{ padding: '4px' }}>{cam.mac}</td>
                        <td style={{ padding: '4px', color: 'var(--text-muted)' }}>{cam.vlan}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </div>)}
      </div>
    </div>);
};
