import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Globe,
  Radio,
  Layers,
  Server
} from 'lucide-react';

const TOUR_STEPS = [
  {
    title: 'Welcome to NetFlow',
    tagline: 'The Internet, Unfolded. One Request at a Time.',
    description: 'Every time you type a URL or click a link in your browser, a breathtaking cascade of global engineering occurs in milliseconds. NetFlow makes this invisible process visible, interactive, and understandable.',
    keyTakeaway: 'You will trace real networking protocols from the browser to the fiber backbone, through reverse proxies, application servers, and databases.',
    icon: <Sparkles size={22} color="var(--cyan-bright)" />
  },
  {
    title: 'Phase 1: URL Parsing & DNS Resolution',
    tagline: 'Translating human names to numerical IP addresses',
    description: 'Computers do not natively understand "example.com". The browser extracts the hostname, checks its local DNS cache, and queries a recursive DNS resolver over UDP port 53 to discover the numerical IP address (104.21.58.77).',
    keyTakeaway: 'Without DNS, no TCP connection can ever be initiated.',
    icon: <Globe size={22} color="var(--violet-bright)" />
  },
  {
    title: 'Phase 2: Local Network & NAT Gateway',
    tagline: 'From private home LAN to public fiber WAN',
    description: 'Your computer has a private IP (192.168.1.105) that cannot be routed across the public internet. The local switch forwards frames based on MAC addresses, and your router performs Network Address Translation (NAT) to remap the request to a public IP.',
    keyTakeaway: 'MAC addresses change hop-by-hop at Layer 2; IP addresses stay constant end-to-end at Layer 3.',
    icon: <Radio size={22} color="var(--blue-ice)" />
  },
  {
    title: 'Phase 3: Routing Across the Fiber Backbone',
    tagline: 'Carrier-class routers and BGP forwarding',
    description: 'Packets leave your gateway and travel across ISP core routers and Tier-1 transit backbones (NTT, Lumen). Each router inspects the IP destination header, decrements the TTL counter, and uses BGP routing tables to forward the packet along the fastest optical path.',
    keyTakeaway: 'TTL prevents infinite packet loops. If TTL hits 0, the packet is safely dropped.',
    icon: <Layers size={22} color="var(--amber-warning)" />
  },
  {
    title: 'Phase 4: The TCP 3-Way Handshake & TLS 1.3',
    tagline: 'Reliability and encryption established in 2 round-trips',
    description: 'Before sending application data, TCP synchronizes sequence numbers using SYN, SYN-ACK, and ACK. Then, modern TLS 1.3 performs an ECDH key exchange (X25519) to establish symmetric AES-256 session keys for end-to-end encryption.',
    keyTakeaway: 'HTTPS protects privacy by rendering application traffic completely unreadable to eavesdroppers.',
    icon: <Sparkles size={22} color="var(--emerald-success)" />
  },
  {
    title: 'Phase 5: Server Processing & Database Query',
    tagline: 'Origin application logic and dynamic data retrieval',
    description: 'The edge reverse proxy terminates TLS and relays the HTTP request over internal VPC networks to the origin Node/Express server. The server executes route middleware, queries the PostgreSQL database via an index scan, and serializes the JSON response.',
    keyTakeaway: 'Application processing and database queries represent the dynamic backend portion of the round trip.',
    icon: <Server size={22} color="var(--cyan-bright)" />
  },
  {
    title: 'Phase 6: Response Delivery & Browser Render',
    tagline: 'The response completes the journey home',
    description: 'The HTTP 200 OK response travels backward across the transit routers and NAT gateway to your browser socket. The browser decrypts the TLS record, parses the JSON payload, and paints the finished interface on your screen.',
    keyTakeaway: 'The full round-trip journey is complete. Explore the packet inspector or test failures in the Failure Lab!',
    icon: <CheckCircle size={22} color="var(--emerald-success)" />
  }
];

export const GuidedTour = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="panel-glass"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-active)',
          backgroundColor: '#0a0e19'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step Indicator Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {step.icon}
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-bright)', fontWeight: 700, letterSpacing: '0.04em' }}>
              GUIDED TOUR — STEP {currentStep + 1} OF {TOUR_STEPS.length}
            </span>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>
            {step.title}
          </h2>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--blue-ice)', fontWeight: 600, marginBottom: '10px' }}>
            {step.tagline}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55', marginBottom: '14px' }}>
            {step.description}
          </p>

          <div
            className="panel-elevated"
            style={{
              padding: '10px 14px',
              borderLeft: '3px solid var(--emerald-success)',
              backgroundColor: 'rgba(16, 185, 129, 0.04)'
            }}
          >
            <strong style={{ fontSize: '0.775rem', color: 'var(--emerald-success)' }}>Key Networking Insight: </strong>
            <span style={{ fontSize: '0.775rem', color: 'var(--text-primary)' }}>{step.keyTakeaway}</span>
          </div>
        </div>

        {/* Navigation & Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  width: i === currentStep ? '20px' : '6px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: i === currentStep ? 'var(--cyan-bright)' : 'var(--border-medium)',
                  cursor: 'pointer',
                  transition: 'all 150ms'
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className="btn-secondary"
              disabled={currentStep === 0}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            {currentStep < TOUR_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <span>Finish</span>
                <CheckCircle size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
