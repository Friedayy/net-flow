// NetFlow Topology Definition (Plain JavaScript)
// Graph model containing nodes, interfaces, routing tables, NAT tables, and physical/logical links

export const INITIAL_NODES = [
  {
    id: 'client',
    name: 'Your Computer',
    role: 'client',
    label: 'Your Computer',
    sublabel: 'Browser (192.168.1.105)',
    x: 80,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'en0 (Wi-Fi/Ethernet)',
        ip: '192.168.1.105',
        ipv6: '2001:db8:85a3::8a2e:370:7334',
        mac: '02:42:c0:a8:01:69',
        netmask: '255.255.255.0',
        mtu: 1500,
        status: 'up'
      }
    ],
    routingTable: [
      { destination: '192.168.1.0/24', gateway: '0.0.0.0', interface: 'en0', metric: 1, flags: 'U' },
      { destination: '0.0.0.0/0', gateway: '192.168.1.1', interface: 'en0', metric: 10, flags: 'UG' }
    ],
    arpTable: [
      { ip: '192.168.1.1', mac: '00:1c:73:9a:11:01', interface: 'en0', type: 'dynamic', ttlSeconds: 1200 }
    ],
    dnsCache: [],
    portsOpen: [54321, 54322],
    hardwareDetails: {
      hostname: 'user-workstation.local',
      os: 'macOS / Linux (Unix Kernel 6.1)',
      chipset: 'Apple Silicon / Intel x86_64 Core NIC',
      bufferSizeKb: 128
    },
    explanationSimple: 'Your computer or mobile phone where the browser parses your URL, manages HTTP caches, opens sockets, and renders the finished HTML and CSS.',
    explanationEngineer: 'Client operating system host network stack (RFC 1122). Operates socket API, ephemeral port allocation (54321), local DNS resolver stub, TCP congestion control engine, and TLS 1.3 cryptographic state.'
  },
  {
    id: 'switch',
    name: 'Local Wi-Fi Switch',
    role: 'switch',
    label: 'Local Switch',
    sublabel: 'Home Network',
    x: 220,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'Port 1 (Client)',
        ip: '0.0.0.0',
        ipv6: '::',
        mac: '00:1c:73:44:aa:01',
        netmask: '0.0.0.0',
        mtu: 1518,
        status: 'up'
      },
      {
        name: 'Port 2 (Gateway)',
        ip: '0.0.0.0',
        ipv6: '::',
        mac: '00:1c:73:44:aa:02',
        netmask: '0.0.0.0',
        mtu: 1518,
        status: 'up'
      }
    ],
    macTable: [
      { mac: '02:42:c0:a8:01:69', port: 1, vlan: 1, ageSeconds: 14 },
      { mac: '00:1c:73:9a:11:01', port: 2, vlan: 1, ageSeconds: 4 }
    ],
    hardwareDetails: {
      hostname: 'sw-lan-core-01',
      os: 'Layer 2 ASIC Microcode',
      chipset: 'Broadcom StrataConnect Gigabit Fabric',
      bufferSizeKb: 512
    },
    explanationSimple: 'The local network switch or Wi-Fi access point in your home or office. It looks only at MAC addresses to forward data frames between local devices.',
    explanationEngineer: 'IEEE 802.1D transparent bridging device. Operates MAC learning and forwarding table (CAM table). Performs wire-speed frame switching without inspecting IP headers or altering packet payloads.'
  },
  {
    id: 'gateway',
    name: 'Home Wi-Fi Router',
    role: 'gateway',
    label: 'Wi-Fi Router',
    sublabel: 'Home Gateway (192.168.1.1)',
    x: 370,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'LAN br0',
        ip: '192.168.1.1',
        ipv6: 'fe80::1',
        mac: '00:1c:73:9a:11:01',
        netmask: '255.255.255.0',
        mtu: 1500,
        status: 'up'
      },
      {
        name: 'WAN eth0',
        ip: '198.51.100.42',
        ipv6: '2001:db8:100::42',
        mac: '00:1c:73:9a:11:02',
        netmask: '255.255.255.240',
        mtu: 1500,
        status: 'up'
      }
    ],
    routingTable: [
      { destination: '192.168.1.0/24', gateway: '0.0.0.0', interface: 'br0', metric: 1, flags: 'U' },
      { destination: '198.51.100.32/28', gateway: '0.0.0.0', interface: 'eth0', metric: 1, flags: 'U' },
      { destination: '0.0.0.0/0', gateway: '198.51.100.33', interface: 'eth0', metric: 5, flags: 'UG' }
    ],
    natTable: [
      {
        protocol: 'TCP',
        privateIp: '192.168.1.105',
        privatePort: 54321,
        publicIp: '198.51.100.42',
        publicPort: 61001,
        destIp: '104.21.58.77',
        destPort: 443,
        state: 'ESTABLISHED'
      }
    ],
    hardwareDetails: {
      hostname: 'gw-edge.lan',
      os: 'OpenWrt Linux 23.05',
      chipset: 'MediaTek MT7986A Quad-Core ARM',
      bufferSizeKb: 1024
    },
    explanationSimple: 'The boundary router dividing your private home network from the public internet. It translates your private IP (192.168.1.105) into a public routable IP so replies can find their way back.',
    explanationEngineer: 'Network Address and Port Translation (NAPT / PAT, RFC 3022) with stateful firewall inspection. Rewrites IPv4 source address and Layer 4 checksums while preserving end-to-end TCP payload integrity.'
  },
  {
    id: 'dns',
    name: 'DNS Directory',
    role: 'dns',
    label: 'DNS Phonebook',
    sublabel: 'Finds Domain IPs (1.1.1.1)',
    x: 370,
    y: 105,
    status: 'idle',
    interfaces: [
      {
        name: 'anycast0',
        ip: '1.1.1.1',
        ipv6: '2606:4700:4700::1111',
        mac: '52:54:00:12:34:56',
        netmask: '255.255.255.255',
        mtu: 1500,
        status: 'up'
      }
    ],
    dnsCache: [
      { name: 'example.com', type: 'A', value: '104.21.58.77', ttlSeconds: 300 },
      { name: 'example.com', type: 'AAAA', value: '2606:4700:3038::6815:3a4d', ttlSeconds: 300 },
      { name: 'api.netflow.internal', type: 'A', value: '10.0.1.50', ttlSeconds: 60 }
    ],
    portsOpen: [53, 853],
    hardwareDetails: {
      hostname: 'dns-recursor-anycast-iad',
      os: 'Linux Core / Unbound DNS Engine',
      chipset: 'AMD EPYC Cloud Edge Node',
      asNumber: 13335
    },
    explanationSimple: 'The internet address book. It translates human-friendly domain names like "example.com" into machine-routable numerical IP addresses like 104.21.58.77.',
    explanationEngineer: 'Recursive DNS resolver operating under RFC 1034/1035 with DNSSEC validation. Queries Root DNS (.) -> TLD (.com) -> Authoritative Nameserver when caching TTL expires.'
  },
  {
    id: 'isp_router',
    name: 'Internet Provider',
    role: 'router',
    label: 'Internet Provider',
    sublabel: 'Your ISP Fiber Node',
    x: 540,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'Gi0/0 (Access)',
        ip: '198.51.100.33',
        ipv6: '2001:db8:100::1',
        mac: '00:50:56:b8:10:01',
        netmask: '255.255.255.240',
        mtu: 1500,
        status: 'up'
      },
      {
        name: 'Te0/1 (Transit)',
        ip: '203.0.113.1',
        ipv6: '2001:db8:200::1',
        mac: '00:50:56:b8:10:02',
        netmask: '255.255.255.252',
        mtu: 9000,
        status: 'up'
      }
    ],
    routingTable: [
      { destination: '198.51.100.0/24', gateway: '0.0.0.0', interface: 'Gi0/0', metric: 1, flags: 'U' },
      { destination: '104.16.0.0/12', gateway: '203.0.113.2', interface: 'Te0/1', metric: 10, flags: 'UG' },
      { destination: '0.0.0.0/0', gateway: '203.0.113.2', interface: 'Te0/1', metric: 100, flags: 'UG' }
    ],
    hardwareDetails: {
      hostname: 'cr01.iad01.isp-backbone.net',
      os: 'Cisco IOS-XR 7.9',
      chipset: 'Cisco Silicon One 19.2 Tbps ASIC',
      asNumber: 13335
    },
    explanationSimple: 'A massive industrial router at your Internet Service Provider. It receives your packet, checks its destination address against a routing table, decrements its TTL, and forwards it onto the global fiber backbone.',
    explanationEngineer: 'Carrier-class BGP edge router. Inspects IPv4 destination against Forwarding Information Base (FIB), decrements TTL by 1 (recalculating IPv4 header checksum), and transmits frame across 100G optical DWDM.'
  },
  {
    id: 'transit_router',
    name: 'Global Internet Highway',
    role: 'router',
    label: 'Internet Highway',
    sublabel: 'Global Fiber Backbone',
    x: 710,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'Hu0/0/0 (Peer)',
        ip: '203.0.113.2',
        ipv6: '2001:db8:200::2',
        mac: '3c:8a:b0:77:01:01',
        netmask: '255.255.255.252',
        mtu: 9000,
        status: 'up'
      },
      {
        name: 'Hu0/0/1 (Edge Ingress)',
        ip: '198.18.0.1',
        ipv6: '2001:db8:300::1',
        mac: '3c:8a:b0:77:01:02',
        netmask: '255.255.255.252',
        mtu: 9000,
        status: 'up'
      }
    ],
    routingTable: [
      { destination: '104.21.0.0/16', gateway: '198.18.0.2', interface: 'Hu0/0/1', metric: 5, flags: 'UG' },
      { destination: '0.0.0.0/0', gateway: '198.18.0.2', interface: 'Hu0/0/1', metric: 50, flags: 'UG' }
    ],
    hardwareDetails: {
      hostname: 'core-sea-bb-01.transit.net',
      os: 'Junos OS 23.4R1',
      chipset: 'Juniper Express 5 Silicon Engine',
      asNumber: 2914
    },
    explanationSimple: 'The intercontinental highway of the internet. Tier-1 transit providers connect continents via undersea fiber cables and exchange massive volumes of traffic without paying peering fees.',
    explanationEngineer: 'Autonomous System transit router running Multi-Protocol BGP (MP-BGP) and MPLS label switching. Forwards packets at microsecond latency across transatlantic fiber optic links.'
  },
  {
    id: 'edge_server',
    name: 'Cloud Security Shield',
    role: 'edge',
    label: 'Cloud Security Shield',
    sublabel: 'Edge CDN (104.21.58.77)',
    x: 885,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'wan0',
        ip: '104.21.58.77',
        ipv6: '2606:4700:3038::6815:3a4d',
        mac: '06:12:44:89:fe:01',
        netmask: '255.255.255.0',
        mtu: 1500,
        status: 'up'
      },
      {
        name: 'vpc0',
        ip: '10.0.1.1',
        ipv6: 'fd00::1',
        mac: '06:12:44:89:fe:02',
        netmask: '255.255.255.0',
        mtu: 9000,
        status: 'up'
      }
    ],
    portsOpen: [80, 443, 8443],
    hardwareDetails: {
      hostname: 'edge-anycast-node-sea.cloud',
      os: 'Cloudflare / NGINX Plus on Linux',
      chipset: 'AMD Milan Server Cluster',
      asNumber: 13335
    },
    explanationSimple: 'A modern edge server or CDN (Content Delivery Network). It terminates the secure TLS connection close to the user, checks for cached assets, inspects for malicious traffic, and forwards requests to the origin backend.',
    explanationEngineer: 'BGP Anycast edge reverse proxy and Web Application Firewall (WAF). Negotiates TLS 1.3 handshake (X25519, AES-256-GCM), verifies certificates, and proxies HTTP requests to origin VPC.'
  },
  {
    id: 'web_server',
    name: 'Website Server',
    role: 'server',
    label: 'Website Server',
    sublabel: 'App Server (Node.js)',
    x: 1060,
    y: 260,
    status: 'idle',
    interfaces: [
      {
        name: 'eth0 (VPC)',
        ip: '10.0.1.50',
        ipv6: 'fd00::50',
        mac: '0a:58:0a:00:01:32',
        netmask: '255.255.255.0',
        mtu: 9000,
        status: 'up'
      }
    ],
    portsOpen: [3001, 8080],
    hardwareDetails: {
      hostname: 'app-prod-instance-04',
      os: 'Ubuntu 24.04 LTS (Node.js v20)',
      chipset: 'AWS Graviton3 ARM64 Processor',
      bufferSizeKb: 4096
    },
    explanationSimple: 'The application backend server running code (Express/Node.js). It evaluates the HTTP URL and method, executes business logic, queries the database, and composes the JSON response.',
    explanationEngineer: 'Application runtime server. Executes REST route dispatch (/api/products), parses query parameters, coordinates database connection pooling, serializes JSON payloads, and returns HTTP status codes.'
  },
  {
    id: 'database',
    name: 'Website Database',
    role: 'database',
    label: 'Website Database',
    sublabel: 'Database (Postgres)',
    x: 1060,
    y: 405,
    status: 'idle',
    interfaces: [
      {
        name: 'db0 (Private Subnet)',
        ip: '10.0.2.10',
        ipv6: 'fd00:db::10',
        mac: '0a:58:0a:00:02:0a',
        netmask: '255.255.255.0',
        mtu: 9000,
        status: 'up'
      }
    ],
    portsOpen: [5432],
    hardwareDetails: {
      hostname: 'db-cluster-primary-01',
      os: 'Rocky Linux Enterprise / PostgreSQL 16',
      chipset: '64-Core Xeon with NVMe PCIe 5.0 RAID 10',
      bufferSizeKb: 65536
    },
    explanationSimple: 'The database where structured information is permanently stored. It receives a SQL query from the web server, searches through indexed tables, and returns matching product records in milliseconds.',
    explanationEngineer: 'ACID-compliant relational database engine. Parses SQL query syntax, constructs index scan execution plan across B-tree indices on products_pkey, retrieves tuples, and returns row sets over internal socket.'
  }
];

export const INITIAL_LINKS = [
  {
    id: 'link_client_switch',
    source: 'client',
    target: 'switch',
    label: 'Cat6 LAN / Wi-Fi',
    medium: 'Ethernet Cat6',
    bandwidth: '1 Gbps',
    baseLatencyMs: 0.8,
    status: 'idle',
    pathD: 'M 80 260 L 220 260'
  },
  {
    id: 'link_switch_gateway',
    source: 'switch',
    target: 'gateway',
    label: 'Local Uplink',
    medium: 'Ethernet Cat6',
    bandwidth: '1 Gbps',
    baseLatencyMs: 0.4,
    status: 'idle',
    pathD: 'M 220 260 L 370 260'
  },
  {
    id: 'link_gateway_dns',
    source: 'gateway',
    target: 'dns',
    label: 'DNS Query Link',
    medium: 'Fiber Optic',
    bandwidth: '500 Mbps',
    baseLatencyMs: 12.0,
    status: 'idle',
    pathD: 'M 370 260 C 340 180, 340 130, 370 105'
  },
  {
    id: 'link_gateway_isp',
    source: 'gateway',
    target: 'isp_router',
    label: 'WAN Fiber Link',
    medium: 'Fiber Optic',
    bandwidth: '500 Mbps',
    baseLatencyMs: 4.5,
    status: 'idle',
    pathD: 'M 370 260 L 540 260'
  },
  {
    id: 'link_isp_transit',
    source: 'isp_router',
    target: 'transit_router',
    label: 'Tier-1 Optical Backbone',
    medium: 'Fiber Optic',
    bandwidth: '100 Gbps',
    baseLatencyMs: 14.2,
    status: 'idle',
    pathD: 'M 540 260 L 710 260'
  },
  {
    id: 'link_transit_edge',
    source: 'transit_router',
    target: 'edge_server',
    label: 'Edge Ingress Fiber',
    medium: 'Fiber Optic',
    bandwidth: '40 Gbps',
    baseLatencyMs: 6.8,
    status: 'idle',
    pathD: 'M 710 260 L 885 260'
  },
  {
    id: 'link_edge_server',
    source: 'edge_server',
    target: 'web_server',
    label: 'VPC Interconnect',
    medium: 'Interconnect Bus',
    bandwidth: '10 Gbps',
    baseLatencyMs: 1.2,
    status: 'idle',
    pathD: 'M 885 260 L 1060 260'
  },
  {
    id: 'link_server_database',
    source: 'web_server',
    target: 'database',
    label: 'Private DB Subnet',
    medium: 'Interconnect Bus',
    bandwidth: '10 Gbps',
    baseLatencyMs: 0.6,
    status: 'idle',
    pathD: 'M 1060 260 L 1060 405'
  }
];
