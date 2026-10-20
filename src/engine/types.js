// NetFlow Simulation Constants & Defaults (Plain JavaScript)

export const FAILURE_TYPES = {
  NONE: 'NONE',
  DNS_FAILURE: 'DNS_FAILURE',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  PACKET_LOSS: 'PACKET_LOSS',
  BROKEN_LINK: 'BROKEN_LINK',
  HTTP_404: 'HTTP_404',
  HTTP_500: 'HTTP_500',
  DB_UNAVAILABLE: 'DB_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT'
};

export const DEFAULT_CONFIG = {
  targetUrl: 'https://example.com/products',
  httpMethod: 'GET',
  ipVersion: 'IPv4',
  httpVersion: 'HTTP/1.1',
  dnsCacheEnabled: false,
  tcpConnectionReused: false,
  failureType: 'NONE',
  packetLossRate: 0,
  latencyMultiplier: 1.0
};
