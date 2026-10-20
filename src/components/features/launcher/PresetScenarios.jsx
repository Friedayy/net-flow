import React from 'react';
import {
  Globe,
  Database,
  Zap,
  AlertOctagon,
  Flame,
  Radio,
  FileQuestion,
  ServerOff
} from 'lucide-react';
import { HoverTooltip } from '../../common/HoverTooltip.jsx';

export const PRESETS = [
  {
    id: 'preset_webpage',
    label: 'Standard HTTPS Webpage',
    url: 'https://example.com/products',
    method: 'GET',
    failureType: 'NONE',
    dnsCacheEnabled: false,
    description: 'Full baseline journey: DNS query, TCP handshake, TLS 1.3, route dispatch, DB query, 200 OK.',
    icon: <Globe size={13} color="var(--cyan-bright)" />,
    tag: 'Baseline'
  },
  {
    id: 'preset_dns_cache',
    label: 'DNS Cache Hit',
    url: 'https://example.com/products',
    method: 'GET',
    failureType: 'NONE',
    dnsCacheEnabled: true,
    description: 'Bypasses external DNS query by utilizing OS resolver cache (sub-millisecond resolution).',
    icon: <Zap size={13} color="var(--violet-bright)" />,
    tag: 'Optimized'
  },
  {
    id: 'preset_packet_loss',
    label: 'Packet Loss & Retransmission',
    url: 'https://example.com/products',
    method: 'GET',
    failureType: 'PACKET_LOSS',
    dnsCacheEnabled: true,
    description: 'SYN packet dropped in transit. Recovers after TCP Retransmission Timeout (RTO 1000ms).',
    icon: <Flame size={13} color="var(--amber-warning)" />,
    tag: 'Loss & RTO'
  },
  {
    id: 'preset_conn_refused',
    label: 'Connection Refused (Port Closed)',
    url: 'https://example.com/products',
    method: 'GET',
    failureType: 'CONNECTION_REFUSED',
    dnsCacheEnabled: true,
    description: 'Destination IP reached, but host daemon is down. Kernel responds with TCP RST flag.',
    icon: <AlertOctagon size={13} color="var(--coral-error)" />,
    tag: 'TCP RST'
  },
  {
    id: 'preset_dns_failure',
    label: 'DNS Failure (NXDOMAIN)',
    url: 'https://nonexistent-domain-xyz.invalid/products',
    method: 'GET',
    failureType: 'DNS_FAILURE',
    dnsCacheEnabled: false,
    description: 'Domain does not exist. Resolver returns NXDOMAIN. TCP handshake is never initiated.',
    icon: <Radio size={13} color="var(--coral-error)" />,
    tag: 'NXDOMAIN'
  },
  {
    id: 'preset_http_404',
    label: 'HTTP 404 Route Mismatch',
    url: 'https://example.com/non-existent-api',
    method: 'GET',
    failureType: 'HTTP_404',
    dnsCacheEnabled: true,
    description: 'Network trip succeeds 100%. Express router returns 404 Not Found application response.',
    icon: <FileQuestion size={13} color="var(--amber-warning)" />,
    tag: 'HTTP 404'
  },
  {
    id: 'preset_db_down',
    label: 'Database Cluster Outage',
    url: 'https://example.com/products',
    method: 'GET',
    failureType: 'DB_UNAVAILABLE',
    dnsCacheEnabled: true,
    description: 'Web server route matches, but internal PostgreSQL socket (port 5432) is unreachable.',
    icon: <ServerOff size={13} color="var(--coral-error)" />,
    tag: 'DB Down'
  },
  {
    id: 'preset_local_api',
    label: 'Real Local Demo API',
    url: 'http://localhost:3001/api/products',
    method: 'GET',
    failureType: 'NONE',
    dnsCacheEnabled: true,
    description: 'Targets our live Express demonstration backend with deterministic product catalog.',
    icon: <Database size={13} color="var(--emerald-success)" />,
    tag: 'Live Port 3001'
  }
];

export const PRIMARY_PRESET_IDS = [
  'preset_webpage',
  'preset_dns_cache',
  'preset_packet_loss',
  'preset_conn_refused'
];

export const PresetScenarios = ({
  onSelectPreset,
  selectedPresetId,
  onOpenTopic
}) => {
  const primaryPresets = PRESETS.filter(p => PRIMARY_PRESET_IDS.includes(p.id));
  const morePresets = PRESETS.filter(p => !PRIMARY_PRESET_IDS.includes(p.id));
  const isMoreSelected = morePresets.some(p => p.id === selectedPresetId);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}
    >
      <span
        style={{
          fontSize: '0.725rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        Try:
      </span>

      {/* 4 Primary Curated Quick-Pills */}
      {primaryPresets.map((preset) => {
        const isSelected = selectedPresetId === preset.id;
        return (
          <HoverTooltip
            key={preset.id}
            topicId={preset.id}
            fallbackTitle={preset.label}
            fallbackBrief={preset.description}
          >
            <button
              onClick={() => {
                onSelectPreset(preset);
                if (onOpenTopic) onOpenTopic(preset.id);
              }}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected
                  ? 'rgba(45, 212, 191, 0.15)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${
                  isSelected ? 'var(--cyan-bright)' : 'var(--border-subtle)'
                }`,
                color: isSelected ? 'var(--cyan-bright)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: isSelected ? 600 : 500,
                transition: 'all var(--transition-fast)'
              }}
            >
              {preset.icon}
              <span>{preset.label}</span>
            </button>
          </HoverTooltip>
        );
      })}

      {/* Clean "More Scenarios" Dropdown */}
      <div style={{ position: 'relative' }}>
        <select
          value={isMoreSelected ? selectedPresetId : ''}
          onChange={(e) => {
            const found = morePresets.find((p) => p.id === e.target.value);
            if (found) {
              onSelectPreset(found);
              if (onOpenTopic) onOpenTopic(found.id);
            }
          }}
          style={{
            padding: '5px 10px',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isMoreSelected
              ? 'rgba(45, 212, 191, 0.15)'
              : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${
              isMoreSelected ? 'var(--cyan-bright)' : 'var(--border-subtle)'
            }`,
            color: isMoreSelected ? 'var(--cyan-bright)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: isMoreSelected ? 600 : 500,
            outline: 'none'
          }}
        >
          <option value="" disabled>
            + More Scenarios ▾
          </option>
          {morePresets.map((preset) => (
            <option key={preset.id} value={preset.id} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
