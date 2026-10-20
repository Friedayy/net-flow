import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TOPIC_EXPLANATIONS } from '../../../engine/topicExplainer.js';
import { NodeSvgIcon } from './NodeSvgIcons.jsx';
import { CanvasControls } from './CanvasControls.jsx';

export const NetworkCanvas = ({
  nodes,
  links,
  currentEvent,
  selectedNodeId,
  selectedLinkId,
  onSelectNode,
  onSelectLink,
  onOpenTopic,
  nodeStates = {}
}) => {
  const containerRef = useRef(null);

  // Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // Hover states for instant brief explanations
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [screenPointer, setScreenPointer] = useState({ x: 0, y: 0 });

  // Packet animation coordinate interpolation
  const [packetPos, setPacketPos] = useState(null);

  // Track cursor position inside the canvas
  const handleCanvasMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPointerPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setScreenPointer({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Helper to dynamically position hover cards via Portal with strict viewport clamping
  const getHoverCardStyle = (cardWidth = 280, approxHeight = 140) => {
    const MARGIN = 12;
    const HEADER_CLEARANCE = 58;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Horizontal placement centered on cursor, clamped to viewport edges
    let left = screenPointer.x - cardWidth / 2;
    if (left < MARGIN) {
      left = MARGIN;
    } else if (left + cardWidth > viewportW - MARGIN) {
      left = viewportW - cardWidth - MARGIN;
    }

    // Vertical placement: prefer above cursor unless near top of window
    const spaceBelow = viewportH - screenPointer.y - MARGIN;
    const spaceAbove = screenPointer.y - HEADER_CLEARANCE - MARGIN;

    const showBelow = screenPointer.y < 200 || (spaceBelow >= approxHeight && spaceBelow > spaceAbove);
    let top = showBelow ? screenPointer.y + 18 : screenPointer.y - approxHeight - 14;

    // Strict clamping: NEVER overflow the top header or bottom viewport
    if (top < HEADER_CLEARANCE + 4) {
      top = HEADER_CLEARANCE + 4;
    } else if (top + approxHeight > viewportH - MARGIN) {
      top = Math.max(HEADER_CLEARANCE + 4, viewportH - approxHeight - MARGIN);
    }

    return {
      position: 'fixed',
      zIndex: 99999,
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      width: `${cardWidth}px`,
      maxWidth: 'calc(100vw - 24px)',
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
      pointerEvents: 'none',
      animation: 'fadeIn 100ms ease-out'
    };
  };


  // Handle Pan Drag
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'svg' || e.target.id === 'canvas-bg' || e.target.id === 'grid-rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle Native Non-Passive Wheel & Trackpad Pinch Zoom (strictly prevents browser-level page zoom)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Trackpad pinch-to-zoom passes ctrlKey: true
      if (e.ctrlKey) {
        const factor = Math.exp(-e.deltaY * 0.012);
        setZoom((prev) => Math.min(2.8, Math.max(0.65, prev * factor)));
      } else {
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        setZoom((prev) => Math.min(2.8, Math.max(0.65, prev * factor)));
      }
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(2.8, prev * 1.15));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.65, prev / 1.15));
  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };
  const handleFitView = () => {
    setZoom(0.98);
    setPan({ x: 0, y: 0 });
  };

  const handleFocusNode = (nodeId) => {
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode || !containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    setZoom(1.2);
    setPan({
      x: containerW / 2 - targetNode.x * 1.2,
      y: containerH / 2 - targetNode.y * 1.2
    });
    onSelectNode(nodeId);
    onOpenTopic(nodeId);
  };

  // Interpolate packet position between source and destination nodes
  useEffect(() => {
    if (!currentEvent) {
      setPacketPos(null);
      return;
    }

    const srcNode = nodes.find((n) => n.id === currentEvent.sourceNodeId);
    const dstNode = nodes.find((n) => n.id === currentEvent.destNodeId);

    if (!srcNode || !dstNode) {
      setPacketPos(null);
      return;
    }

    if (srcNode.id === dstNode.id) {
      setPacketPos({ x: srcNode.x, y: srcNode.y - 45 });
      return;
    }

    const midX = (srcNode.x + dstNode.x) / 2;
    const midY = (srcNode.y + dstNode.y) / 2;
    setPacketPos({ x: midX, y: midY });
  }, [currentEvent, nodes]);

  // Determine active link class
  const getLinkClass = (link) => {
    if (!currentEvent || !currentEvent.activeLinkIds?.includes(link.id)) {
      return '';
    }
    if (currentEvent.direction === 'dropped') {
      return 'active-link-dropped';
    }
    if (currentEvent.direction === 'response') {
      return 'active-link-reverse';
    }
    return 'active-link-forward';
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={() => {
        setHoveredNode(null);
        setHoveredLink(null);
        setIsDragging(false);
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '580px',
        backgroundColor: '#05070c',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.9)'
      }}
    >
      <svg
        id="canvas-bg"
        width="100%"
        height="100%"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 180ms ease-out'
        }}
      >
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255, 255, 255, 0.05)" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
          </pattern>

          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="coral-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid */}
        {showGrid && <rect id="grid-rect" width="100%" height="100%" fill="url(#grid-pattern)" />}

        {/* Subnet Boundaries with Friendly Labels */}
        <g opacity="0.38">
          {/* LAN Zone */}
          <rect x="40" y="40" width="370" height="440" rx="14" fill="rgba(56, 189, 248, 0.03)" stroke="rgba(56, 189, 248, 0.2)" strokeDasharray="5 5" />
          <text x="56" y="70" fill="var(--blue-ice)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.06em">
            1. YOUR HOME NETWORK (192.168.1.0/24)
          </text>

          {/* WAN Transit Zone */}
          <rect x="470" y="160" width="310" height="200" rx="14" fill="rgba(192, 132, 252, 0.03)" stroke="rgba(192, 132, 252, 0.2)" strokeDasharray="5 5" />
          <text x="490" y="190" fill="var(--violet-bright)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.06em">
            2. THE PUBLIC INTERNET (GLOBAL FIBER)
          </text>

          {/* VPC Origin Zone */}
          <rect x="830" y="40" width="330" height="440" rx="14" fill="rgba(16, 185, 129, 0.03)" stroke="rgba(16, 185, 129, 0.2)" strokeDasharray="5 5" />
          <text x="850" y="70" fill="var(--emerald-success)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.06em">
            3. WEBSITE CLOUD SERVER (DESTINATION VPC)
          </text>
        </g>

        {/* Network Physical Links */}
        <g id="network-links">
          {links.map((link) => {
            const isSelected = selectedLinkId === link.id;
            const activeClass = getLinkClass(link);

            return (
              <g
                key={link.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLink(link.id);
                  onOpenTopic(link.id);
                }}
                onMouseEnter={(e) => {
                  setScreenPointer({ x: e.clientX, y: e.clientY });
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setPointerPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                  setHoveredLink({
                    id: link.id,
                    label: link.label,
                    medium: link.medium,
                    bandwidth: link.bandwidth,
                    latency: link.baseLatencyMs
                  });
                }}
                onMouseMove={(e) => {
                  setScreenPointer({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={link.pathD}
                  fill="none"
                  stroke={isSelected ? 'var(--cyan-bright)' : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isSelected ? 3.5 : 2}
                  strokeLinecap="round"
                />

                {activeClass && (
                  <path
                    d={link.pathD}
                    fill="none"
                    className={activeClass}
                    strokeLinecap="round"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Animated In-Flight Packet Marker */}
        {packetPos && currentEvent && (
          <g transform={`translate(${packetPos.x}, ${packetPos.y})`} style={{ pointerEvents: 'none' }}>
            <circle
              r="17"
              fill="none"
              stroke={
                currentEvent.direction === 'dropped'
                  ? 'var(--coral-error)'
                  : currentEvent.direction === 'response'
                    ? 'var(--emerald-success)'
                    : 'var(--cyan-bright)'
              }
              strokeWidth="2"
              opacity="0.8"
              style={{ animation: 'pulseGlow 1s ease-in-out infinite' }}
            />

            <circle
              r="6.5"
              fill={
                currentEvent.direction === 'dropped'
                  ? 'var(--coral-error)'
                  : currentEvent.direction === 'response'
                    ? 'var(--emerald-success)'
                    : 'var(--cyan-bright)'
              }
              filter={
                currentEvent.direction === 'dropped'
                  ? 'url(#coral-glow)'
                  : currentEvent.direction === 'response'
                    ? 'url(#emerald-glow)'
                    : 'url(#cyan-glow)'
              }
            />

            {/* Floating Protocol Capsule Tag */}
            <g transform="translate(0, -25)">
              <rect
                x="-34"
                y="-10"
                width="68"
                height="19"
                rx="9.5"
                fill="var(--bg-surface-elevated)"
                stroke={
                  currentEvent.direction === 'dropped'
                    ? 'var(--coral-error)'
                    : currentEvent.direction === 'response'
                      ? 'var(--emerald-success)'
                      : 'var(--cyan-bright)'
                }
                strokeWidth="1.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="9.5"
                fontWeight="700"
                fontFamily="var(--font-mono)"
              >
                {currentEvent.protocol}
              </text>
            </g>
          </g>
        )}

        {/* Network Device Nodes */}
        <g id="network-nodes">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const currentStatus = nodeStates[node.id] || node.status;
            const isNodeActive = currentStatus === 'active' || currentStatus === 'processing';
            const isNodeError = currentStatus === 'error' || currentStatus === 'dropped';
            const isNodeSuccess = currentStatus === 'success';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.id);
                  onOpenTopic(node.id);
                }}
                onMouseEnter={(e) => {
                  setScreenPointer({ x: e.clientX, y: e.clientY });
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setPointerPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                  setHoveredNode({
                    id: node.id,
                    label: node.name,
                    brief: TOPIC_EXPLANATIONS[node.id]?.brief || node.explanationSimple
                  });
                }}
                onMouseMove={(e) => {
                  setScreenPointer({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection Ring */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="44"
                    fill="none"
                    stroke="var(--cyan-bright)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    style={{ animation: 'radarSweep 8s linear infinite' }}
                  />
                )}

                {/* State Glow Aura */}
                {isNodeActive && (
                  <circle
                    cx="0"
                    cy="0"
                    r="38"
                    fill="rgba(0, 245, 212, 0.14)"
                    stroke="var(--cyan-bright)"
                    strokeWidth="2"
                    filter="url(#cyan-glow)"
                    className="node-active-pulse"
                  />
                )}
                {isNodeError && (
                  <circle
                    cx="0"
                    cy="0"
                    r="38"
                    fill="rgba(244, 63, 94, 0.16)"
                    stroke="var(--coral-error)"
                    strokeWidth="2.2"
                    filter="url(#coral-glow)"
                    className="node-error-pulse"
                  />
                )}
                {isNodeSuccess && (
                  <circle
                    cx="0"
                    cy="0"
                    r="38"
                    fill="rgba(16, 185, 129, 0.14)"
                    stroke="var(--emerald-success)"
                    strokeWidth="2"
                    filter="url(#emerald-glow)"
                  />
                )}

                {/* Node Base Plate */}
                <circle
                  cx="0"
                  cy="0"
                  r="32"
                  fill="var(--bg-surface)"
                  stroke={
                    isSelected
                      ? 'var(--cyan-bright)'
                      : isNodeError
                        ? 'var(--coral-error)'
                        : isNodeActive
                          ? 'var(--cyan-bright)'
                          : 'var(--border-medium)'
                  }
                  strokeWidth={isSelected || isNodeActive ? 2 : 1.2}
                  filter="drop-shadow(0 6px 12px rgba(0,0,0,0.6))"
                />

                {/* Device Icon */}
                <g transform="translate(-25, -25)">
                  <NodeSvgIcon role={node.role} status={currentStatus} size={50} />
                </g>

                {/* Status Indicator Dot */}
                {isNodeActive && (
                  <circle cx="22" cy="-22" r="5" fill="var(--cyan-bright)" filter="url(#cyan-glow)" />
                )}
                {isNodeError && (
                  <circle cx="22" cy="-22" r="5" fill="var(--coral-error)" filter="url(#coral-glow)" />
                )}

                {/* Device Primary Label */}
                <text
                  x="0"
                  y="49"
                  textAnchor="middle"
                  fill={isSelected ? 'var(--cyan-bright)' : 'var(--text-primary)'}
                  fontSize="12.5"
                  fontWeight="700"
                  letterSpacing="-0.01em"
                >
                  {node.label}
                </text>

                {/* Device Sublabel / IP Address */}
                <text
                  x="0"
                  y="65"
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card for Device Nodes (Positioned Right at Cursor via Portal) */}
      {hoveredNode &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              ...getHoverCardStyle(280, 150),
              padding: '12px 14px',
              backgroundColor: 'rgba(9, 13, 22, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(45, 212, 191, 0.5)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.92), 0 0 16px rgba(45, 212, 191, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--cyan-bright)' }}>
                {hoveredNode.label}
              </strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Node
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
              {hoveredNode.brief}
            </p>
            <div style={{ marginTop: '6px', fontSize: '0.65rem', color: 'var(--blue-ice)', fontWeight: 600 }}>
              Click device for complete deep dive & specs
            </div>
          </div>,
          document.body
        )}

      {/* Floating Hover Card for Links (Positioned Right at Cursor via Portal) */}
      {hoveredLink &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              ...getHoverCardStyle(260, 120),
              padding: '10px 14px',
              backgroundColor: 'rgba(9, 13, 22, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.92), 0 0 16px rgba(56, 189, 248, 0.2)'
            }}
          >
            <strong style={{ fontSize: '0.85rem', color: 'var(--blue-ice)' }}>
              {hoveredLink.label}
            </strong>
            <div style={{ marginTop: '5px', fontSize: '0.725rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Medium:</span> {hoveredLink.medium}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Bandwidth:</span> {hoveredLink.bandwidth}</div>
              <div><span style={{ color: 'var(--text-muted)' }}>Base Latency:</span> {hoveredLink.latency} ms</div>
            </div>
          </div>,
          document.body
        )}

      {/* Floating Canvas Controls */}
      <CanvasControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onFitView={handleFitView}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onFocusNode={handleFocusNode}
      />
    </div>
  );
};
