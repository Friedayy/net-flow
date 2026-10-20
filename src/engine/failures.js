// Failure Laboratory Scenarios & Diagnostic Rules (Plain JavaScript)

export const FAILURE_SCENARIOS = {
  NONE: {
    id: 'NONE',
    title: 'Normal Operation (Baseline Journey)',
    shortDescription: 'Unimpeded end-to-end request: DNS resolution, TCP handshake, TLS 1.3 negotiation, route dispatch, database query, and 200 OK response.',
    technicalDescription: 'Standard full network journey executing complete encapsulation across Layer 2 Ethernet, Layer 3 IPv4/IPv6, Layer 4 TCP state machine, and Layer 7 HTTPS/SQL.',
    layer: 'Application',
    protocol: 'HTTP/1.1',
    expectedErrorCode: '200 OK',
    symptoms: ['None (Request completes with normal round-trip latency)'],
    diagnosticTools: ['curl -iv https://example.com/products', 'mtr -rw example.com'],
    recoverySteps: ['Everything operating normally. No remediation necessary.']
  },
  DNS_FAILURE: {
    id: 'DNS_FAILURE',
    title: 'DNS Resolution Failure (NXDOMAIN / Timeout)',
    shortDescription: 'The domain name cannot be resolved. The resolver returns NXDOMAIN or times out.',
    technicalDescription: 'Client issues UDP query on port 53 for hostname A record. The recursive DNS resolver queries TLD/Root and receives NXDOMAIN (Non-Existent Domain, RCODE 3). No IP address is available; socket creation terminates before any TCP SYN can be transmitted.',
    layer: 'Application',
    protocol: 'DNS',
    expectedErrorCode: 'ERR_NAME_NOT_RESOLVED (NXDOMAIN)',
    symptoms: [
      'Browser displays "Server IP address could not be found"',
      'No TCP SYN packet is ever emitted by the client',
      'Ping fails immediately with "unknown host"',
      'Socket connection cannot be initiated'
    ],
    diagnosticTools: [
      'dig +trace example.invalid',
      'nslookup example.invalid 1.1.1.1',
      'systemd-resolve --status',
      'cat /etc/resolv.conf'
    ],
    recoverySteps: [
      'Verify the hostname spelling and top-level domain (TLD).',
      'Check registrar nameserver delegation (NS records).',
      'Verify authorative DNS zone file has an active A or AAAA record.',
      'Check local DNS server reachability or switch to public resolver (1.1.1.1, 8.8.8.8).'
    ]
  },
  CONNECTION_REFUSED: {
    id: 'CONNECTION_REFUSED',
    title: 'Connection Refused (TCP RST from Destination)',
    shortDescription: 'The destination IP is reached, but no process is listening on the target port (443/3001).',
    technicalDescription: 'Client successfully routes TCP SYN to the destination server IP. The destination operating system kernel inspects the listening socket table, finds no daemon bound to port 443, and immediately responds with a TCP segment with RST and ACK flags set (Seq=0, Ack=Seq+1).',
    layer: 'Transport',
    protocol: 'TCP',
    expectedErrorCode: 'ECONNREFUSED / ERR_CONNECTION_REFUSED',
    symptoms: [
      'Browser displays "This site cannot be reached - connection refused"',
      'Packets reach the destination machine, but TCP handshake fails immediately',
      'Client socket receives TCP RST flag from destination',
      'Zero application data or TLS negotiation occurs'
    ],
    diagnosticTools: [
      'nc -zv 104.21.58.77 443',
      'ss -tulpn | grep :443 (on server)',
      'systemctl status nginx / netflow-server',
      'tcpdump -nn -i any "tcp[tcpflags] & (tcp-rst) != 0"'
    ],
    recoverySteps: [
      'Check if the web server daemon (Nginx, Express, Caddy) is running on the host.',
      'Verify the server process is bound to 0.0.0.0 rather than 127.0.0.1 (localhost only).',
      'Ensure the server listening port matches the requested port in the URL.',
      'Inspect host firewall (ufw, iptables, nftables) to ensure the port is not blocked.'
    ]
  },
  PACKET_LOSS: {
    id: 'PACKET_LOSS',
    title: 'Packet Loss & TCP Retransmission (RTO Timeout)',
    shortDescription: 'A packet is dropped on an intermediate transit link. TCP retransmission timer recovers the connection.',
    technicalDescription: 'An intermediate router encounters link congestion or buffer overflow and silently drops the TCP SYN or data packet. The client TCP stack starts a Retransmission Timeout (RTO, typically 1000ms initially). When no ACK arrives before timer expiration, the client retransmits the segment with the same sequence number, adding latency.',
    layer: 'Network',
    protocol: 'TCP',
    expectedErrorCode: 'HIGH_LATENCY / RETRANSMIT_RECOVERED',
    symptoms: [
      'Noticeable 1000ms-3000ms delay in connection setup',
      'Duplicate packet transmission visible in packet sniffer',
      'TCP congestion window (CWND) cuts in half upon packet drop',
      'Connection eventually succeeds but round-trip time spikes'
    ],
    diagnosticTools: [
      'ping -c 50 -i 0.2 104.21.58.77',
      'mtr -z 104.21.58.77 (shows per-hop packet loss %)',
      'ip -s link show (check CRC errors or dropped rx/tx)',
      'wireshark / tshark -Y "tcp.analysis.retransmission"'
    ],
    recoverySteps: [
      'Identify the faulty hop using MTR / traceroute.',
      'Check physical cables or optical transceivers for CRC errors and signal degradation.',
      'Upgrade link capacity or tune Quality of Service (QoS) queues at the congested router.',
      'Adjust TCP congestion control algorithm (e.g., enable BBR over CUBIC).'
    ]
  },
  BROKEN_LINK: {
    id: 'BROKEN_LINK',
    title: 'Broken Network Link / Unreachable Route',
    shortDescription: 'A physical fiber cut between Router 1 and Router 2 drops all packets. Router returns ICMP Host Unreachable.',
    technicalDescription: 'The optical interconnect between the ISP core router and the Tier-1 backbone is severed. The ISP router attempts ARP/next-hop resolution, receives no response, and either drops the packet or returns an ICMP Type 3, Code 1 (Destination Host Unreachable) packet back to the sender.',
    layer: 'Physical/Link',
    protocol: 'ICMP',
    expectedErrorCode: 'EHOSTUNREACH / ICMP_DEST_UNREACHABLE',
    symptoms: [
      'Packet flow halts midway at Router 1',
      'ICMP Destination Unreachable message returned to client',
      'Traceroute shows stars (* * *) after hop 1',
      'Zero packets reach the destination server'
    ],
    diagnosticTools: [
      'traceroute -n 104.21.58.77',
      'ip route get 104.21.58.77',
      'ethtool eth0 (check Speed/Duplex/Link detected)',
      'show ip bgp summary (check BGP peer status)'
    ],
    recoverySteps: [
      'Reroute traffic dynamically using BGP dynamic routing protocols to alternate transit provider.',
      'Dispatch field technicians to inspect fiber lines and patch panels.',
      'Enable multi-homing with redundant WAN gateways (dual-ISP failover).'
    ]
  },
  HTTP_404: {
    id: 'HTTP_404',
    title: 'HTTP 404 Not Found (Resource Missing)',
    shortDescription: 'The entire network connection succeeds, but the web server has no route matching the requested path.',
    technicalDescription: 'Physical link, ARP, IP routing, TCP handshake, and TLS 1.3 encryption all complete with 100% success! The HTTP GET request reaches the application router. The web server router table finds no handler for the requested URL path and returns HTTP/1.1 404 Not Found with a JSON/HTML error body.',
    layer: 'Application',
    protocol: 'HTTP/1.1',
    expectedErrorCode: '404 Not Found',
    symptoms: [
      'Network connection is completely healthy',
      'Status code 404 returned with Content-Type: application/json',
      'Browser renders standard 404 page',
      'Server logs show route mismatch'
    ],
    diagnosticTools: [
      'curl -i https://example.com/non-existent-endpoint',
      'grep "GET /non-existent" /var/log/nginx/access.log',
      'Check backend route definitions in Express app.use() / app.get()'
    ],
    recoverySteps: [
      'Double check the URL path spelling and query parameters.',
      'Ensure the backend route handler is registered in the router module.',
      'Check reverse proxy URL rewrite rules (e.g. nginx proxy_pass trailing slash).'
    ]
  },
  HTTP_500: {
    id: 'HTTP_500',
    title: 'HTTP 500 Internal Server Error (Application Crash)',
    shortDescription: 'Network layers succeed, but the backend application crashes during route execution.',
    technicalDescription: 'The HTTP request safely arrives at the web server and matches an active route. During execution, the backend code throws an unhandled exception (e.g., null pointer, type error, or missing environment variable). The framework catch-block serializes an HTTP 500 response back to the client.',
    layer: 'Application',
    protocol: 'HTTP/1.1',
    expectedErrorCode: '500 Internal Server Error',
    symptoms: [
      'TCP and TLS establish without issues',
      'Server responds with status code 500',
      'Stack trace logged in server console',
      'Client receives generic error message'
    ],
    diagnosticTools: [
      'journalctl -u netflow-backend.service -f',
      'tail -f /var/log/app/error.log',
      'Sentry / Datadog APM exception tracker',
      'curl -iv https://example.com/api/simulate/error-500'
    ],
    recoverySteps: [
      'Inspect application error logs and stack traces for the crashing file and line number.',
      'Wrap dangerous operations in try-catch blocks and validate request payload schema.',
      'Verify runtime environment variables and secrets are populated correctly.'
    ]
  },
  DB_UNAVAILABLE: {
    id: 'DB_UNAVAILABLE',
    title: 'Database Outage / Connection Refused',
    shortDescription: 'The web server receives the request, but fails to connect to the database on port 5432.',
    technicalDescription: 'The client-to-web-server communication completes. The web server executes a database query (`SELECT * FROM products`), but its internal TCP socket connection to `10.0.2.10:5432` times out or is refused (PostgreSQL down). The web server gracefully returns HTTP 503 Service Unavailable or 500.',
    layer: 'System',
    protocol: 'SQL',
    expectedErrorCode: '503 Service Unavailable (DB Connection Timeout)',
    symptoms: [
      'Client request hangs at the web server for 1000ms before returning 503',
      'Server error: "connect ECONNREFUSED 10.0.2.10:5432"',
      'Database connection pool exhausted',
      'Partial system degradation'
    ],
    diagnosticTools: [
      'pg_isready -h 10.0.2.10 -p 5432',
      'systemctl status postgresql-16',
      'netstat -ant | grep 5432',
      'SELECT count(*) FROM pg_stat_activity;'
    ],
    recoverySteps: [
      'Restart the database daemon (systemctl restart postgresql).',
      'Increase max_connections in postgresql.conf and deploy PgBouncer connection pooler.',
      'Verify internal VPC firewall security groups permit traffic on port 5432.',
      'Check disk space on database cluster partitions (df -h).'
    ]
  },
  TIMEOUT: {
    id: 'TIMEOUT',
    title: 'Request Gateway Timeout (HTTP 504 / Client Socket Timeout)',
    shortDescription: 'The reverse proxy or client waiting time expires before the origin server finishes processing.',
    technicalDescription: 'The client or edge reverse proxy connects to the origin server and sends the request. The origin server enters a long computational loop or hangs indefinitely. After the configured timeout threshold (e.g. 5000ms), the edge proxy terminates the connection and returns HTTP 504 Gateway Timeout.',
    layer: 'Application',
    protocol: 'HTTP/1.1',
    expectedErrorCode: '504 Gateway Timeout',
    symptoms: [
      'Client spinner spins continuously for the full timeout duration',
      'Reverse proxy closes client connection with 504 status',
      'Origin server worker CPU at 100% or deadlocked in mutex wait',
      'High latency metrics across monitoring dashboard'
    ],
    diagnosticTools: [
      'curl -m 5 -iv https://example.com/slow-endpoint',
      'nginx error.log: "[error] upstream timed out (110: Connection timed out)"',
      'top / htop on application server to check CPU/RAM saturation',
      'node --prof / perf report for CPU profiling'
    ],
    recoverySteps: [
      'Optimize slow database queries and add missing indices on frequently filtered columns.',
      'Offload long-running computational jobs to background worker queues (BullMQ, Celery).',
      'Increase proxy read timeouts if the operation is intentionally long-running.'
    ]
  }
};
