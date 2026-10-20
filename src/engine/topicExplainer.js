// Centralized Networking Knowledge Bank
// Provides brief tooltips on hover and rich deep-dive explanations on click for all topics



export const TOPIC_EXPLANATIONS = {
  // =====================
  // NODES & DEVICES
  // =====================
  client: {
    id: 'client',
    title: 'Your Computer (Browser Host)',
    category: 'Device',
    brief: 'Your computer or phone running the web browser. It parses URLs, queries DNS, opens TCP sockets, and renders the webpage.',
    mentalModel: 'The person writing and sending the letter. It chooses what address to write on the envelope and reads the reply when it arrives.',
    technicalDetails: [
      'Operating system kernel network stack (RFC 1122).',
      'Allocates dynamic ephemeral ports (e.g. 54321) for outbound connections.',
      'Operates local stub resolver cache to avoid redundant DNS lookups.',
      'Maintains TCP socket states (CLOSED → SYN_SENT → ESTABLISHED).',
      'Executes TLS 1.3 cryptographic key generation and HTML/CSS/DOM rendering pipeline.'
    ],
    rfc: 'RFC 1122 / RFC 3986',
    troubleshootingCmd: 'netstat -an | grep ESTABLISHED'
  },
  switch: {
    id: 'switch',
    title: 'Wi-Fi / Local Switch',
    category: 'Device',
    brief: 'Local Ethernet switch or Wi-Fi router. Forwards raw data frames between local devices using hardware MAC addresses.',
    mentalModel: 'The mailroom clerk inside your office building. It only looks at the room number (MAC address) to deliver packets between desks.',
    technicalDetails: [
      'IEEE 802.1D transparent bridging device operating strictly at Layer 2.',
      'Maintains CAM (Content Addressable Memory) table mapping MAC addresses to physical ports.',
      'Inspects Source MAC of incoming frames to automatically learn device locations.',
      'Forwards frames at wire speed without inspecting IP headers or altering payloads.'
    ],
    rfc: 'IEEE 802.1D / IEEE 802.3',
    troubleshootingCmd: 'brctl showmacs br0'
  },
  gateway: {
    id: 'gateway',
    title: 'Home Wi-Fi Router (Gateway)',
    category: 'Device',
    brief: 'The home or office boundary router. Uses NAT (Network Address Translation) to convert private IP addresses into a public routable IP.',
    mentalModel: 'The company receptionist who receives internal calls and dials out using the company public phone number, remembering which extension to ring back.',
    technicalDetails: [
      'NAPT / PAT (Port Address Translation, RFC 3022) with stateful firewall inspection.',
      'Rewrites private IPv4 source address (192.168.1.105) to public WAN IP (198.51.100.42).',
      'Assigns unique public NAT port (e.g. 61001) to multiplex thousands of internal connections.',
      'Decrements TTL counter and recalculates IPv4 checksums before forwarding.'
    ],
    rfc: 'RFC 3022 / RFC 1812',
    troubleshootingCmd: 'iptables -t nat -L -n -v'
  },
  dns: {
    id: 'dns',
    title: 'DNS Phonebook (Domain Directory)',
    category: 'Device',
    brief: 'The internet address book. Converts human domain names like "example.com" into machine-routable numerical IP addresses like 104.21.58.77.',
    mentalModel: 'A phone directory assistant. You say the business name, and they give you the exact telephone number to dial.',
    technicalDetails: [
      'Recursive DNS daemon (RFC 1034/1035) listening on UDP/TCP port 53.',
      'Hierarchical resolution: Queries Root (.) → TLD (.com) → Authoritative Nameserver.',
      'Stores answers in memory cache bounded by Time-To-Live (TTL, e.g. 300 seconds).',
      'Supports DNSSEC cryptographic signature validation against cache poisoning.'
    ],
    rfc: 'RFC 1034 / RFC 1035',
    troubleshootingCmd: 'dig +trace example.com'
  },
  isp_router: {
    id: 'isp_router',
    title: 'Internet Provider (ISP Node)',
    category: 'Device',
    brief: 'An industrial carrier router at your Internet Service Provider. Forwards traffic into the national fiber backbone via BGP.',
    mentalModel: 'The regional postal distribution warehouse sorting tractor-trailers onto interstate highways.',
    technicalDetails: [
      'Carrier-class router running Multi-Protocol BGP (MP-BGP) and MPLS.',
      'Uses Forwarding Information Base (FIB) in TCAM silicon for microsecond routing.',
      'Decrements IPv4 TTL by 1 (e.g., 64 → 63) to prevent packets from looping infinitely.',
      'Connects customer fiber lines to multi-gigabit Tier-1 peering points.'
    ],
    rfc: 'RFC 4271 (BGP-4) / RFC 1812',
    troubleshootingCmd: 'traceroute -n 104.21.58.77'
  },
  transit_router: {
    id: 'transit_router',
    title: 'Global Internet Highway (Backbone)',
    category: 'Device',
    brief: 'The intercontinental highway of the internet. Moves petabytes of data across undersea optical fiber cables between continents.',
    mentalModel: 'The transoceanic cargo shipping lanes connecting continents without paying toll fees.',
    technicalDetails: [
      'Tier-1 network operator (e.g., NTT, Lumen, Telia) with settlement-free peering.',
      'Transfers packets across 100G/400G Dense Wavelength Division Multiplexing (DWDM).',
      'Carries complete global BGP routing table (> 900,000 IPv4 prefixes).',
      'Provides transit bandwidth connecting ISPs to cloud providers and data centers.'
    ],
    rfc: 'RFC 4271 / RFC 7454',
    troubleshootingCmd: 'mtr --report 104.21.58.77'
  },
  edge_server: {
    id: 'edge_server',
    title: 'Cloud Security Shield (CDN & Edge)',
    category: 'Device',
    brief: 'A Cloudflare/NGINX edge proxy located close to the user. Terminates TLS encryption, blocks DDoS attacks, and forwards traffic to the origin.',
    mentalModel: 'The security checkpoint and reception lobby at an office building that verifies guest credentials before letting them enter the private elevators.',
    technicalDetails: [
      'BGP Anycast routing brings user to the geographically nearest data center.',
      'Terminates TLS 1.3 encryption close to user to minimize handshake latency (1-RTT).',
      'Evaluates Web Application Firewall (WAF) rate limits and DDoS mitigation rules.',
      'Proxies authenticated HTTP requests to the private origin VPC network (10.0.1.50).'
    ],
    rfc: 'RFC 8446 / RFC 7230',
    troubleshootingCmd: 'curl -Iv https://example.com'
  },
  web_server: {
    id: 'web_server',
    title: 'Website Server (App Backend)',
    category: 'Device',
    brief: 'The application backend running Node.js / Express. It executes route logic, checks authentication, queries the database, and builds the response.',
    mentalModel: 'The chef in the restaurant kitchen who reads the order ticket, gathers ingredients, cooks the dish, and puts it on a plate.',
    technicalDetails: [
      'Application runtime listening on internal VPC port 3001.',
      'Dispatches URL route handlers (e.g. GET /api/products).',
      'Coordinates connection pooling to the internal PostgreSQL database.',
      'Serializes product objects into JSON and attaches HTTP caching headers.'
    ],
    rfc: 'RFC 9110 (HTTP Semantics)',
    troubleshootingCmd: 'ss -tulpn | grep 3001'
  },
  database: {
    id: 'database',
    title: 'Website Database (Data Storage)',
    category: 'Device',
    brief: 'The relational database (PostgreSQL 16). Stores product records on high-speed NVMe storage and returns query results in milliseconds.',
    mentalModel: 'The organized warehouse archive where every item is cataloged on indexed shelves for instant retrieval.',
    technicalDetails: [
      'ACID-compliant relational database engine on internal port 5432.',
      'Query planner executes B-Tree Index Scan across products_pkey.',
      'Retrieves matching rows in sub-2ms with zero disk thrashing.',
      'Transfers structured binary row sets over internal VPC socket.'
    ],
    rfc: 'PostgreSQL Wire Protocol 3.0',
    troubleshootingCmd: 'pg_isready -h 10.0.2.10 -p 5432'
  },

  // =====================
  // PROTOCOLS & PHASES
  // =====================
  url_parsing: {
    id: 'url_parsing',
    title: 'URL Parsing & Protocol Validation',
    category: 'Phase',
    brief: 'The browser decomposes your URL into scheme (https://), domain (example.com), port (443), and resource path (/products).',
    mentalModel: 'Reading the envelope address to understand the country, city, street, and recipient name.',
    technicalDetails: [
      'URL specification (RFC 3986 / WHATWG URL Standard).',
      'Normalizes hostname into lowercase ASCII using Punycode/IDNA for internationalized domains.',
      'Infers standard protocol ports: port 443 for HTTPS, port 80 for HTTP.'
    ],
    rfc: 'RFC 3986'
  },
  dns_lookup: {
    id: 'dns_lookup',
    title: 'DNS Resolution (Domain to IP)',
    category: 'Protocol',
    brief: 'Queries the DNS recursive resolver over UDP port 53 to map the domain name to an IP address.',
    mentalModel: 'Looking up a friend in your phone contacts to find their number before calling.',
    technicalDetails: [
      'Transmitted as a UDP datagram to 1.1.1.1:53 with Recursion Desired (RD=1).',
      'Resolves A record (IPv4 32-bit) or AAAA record (IPv6 128-bit).',
      'If DNS fails (NXDOMAIN), socket connection terminates immediately with ERR_NAME_NOT_RESOLVED.'
    ],
    rfc: 'RFC 1035',
    troubleshootingCmd: 'nslookup example.com 1.1.1.1'
  },
  arp: {
    id: 'arp',
    title: 'ARP (Address Resolution Protocol)',
    category: 'Protocol',
    brief: 'Discovers the physical Layer 2 MAC address of the local gateway router for the destination IP.',
    mentalModel: 'Shouting in a crowded room: "Who here is John?" so John can raise his hand and give you his exact seat number.',
    technicalDetails: [
      'EtherType 0x0806 broadcast frame sent to FF:FF:FF:FF:FF:FF.',
      'Gateway responds with unicast reply containing its MAC (00:1c:73:9a:11:01).',
      'MAC addresses are required for local delivery across Ethernet switches and Wi-Fi.'
    ],
    rfc: 'RFC 826',
    troubleshootingCmd: 'arp -a'
  },
  tcp_handshake: {
    id: 'tcp_handshake',
    title: 'TCP 3-Way Handshake (SYN → SYN-ACK → ACK)',
    category: 'Protocol',
    brief: 'Establishes a reliable connection between client and server by synchronizing sequence numbers.',
    mentalModel: 'The three-beat handshake: "Can you hear me?" → "Yes, I hear you, can you hear me?" → "Yes, we are connected!"',
    technicalDetails: [
      'Step 1: Client sends SYN with random Initial Sequence Number (Seq=1000).',
      'Step 2: Server sends SYN-ACK (Seq=5000, Ack=1001).',
      'Step 3: Client sends ACK (Seq=1001, Ack=5001). Both enter ESTABLISHED state.',
      'Guarantees packet order, flow control (Window Size), and loss recovery.'
    ],
    rfc: 'RFC 793 / RFC 9293',
    troubleshootingCmd: 'ss -t -a'
  },
  tls_handshake: {
    id: 'tls_handshake',
    title: 'TLS 1.3 Cryptographic Handshake',
    category: 'Protocol',
    brief: 'Authenticates the server digital certificate and derives symmetric AES-256 session keys in just 1 round trip.',
    mentalModel: 'Locking your conversation inside an unbreakable titanium safe where only you and the server hold the combination.',
    technicalDetails: [
      'ClientHello proposes cipher suites and provides Diffie-Hellman KeyShare (X25519).',
      'ServerHello provides server key share and digital certificate signed by a trusted CA.',
      'Both sides compute symmetric session key. Eavesdroppers see only random ciphertext.',
      'Provides Forward Secrecy: Past sessions cannot be decrypted even if server private key is leaked later.'
    ],
    rfc: 'RFC 8446',
    troubleshootingCmd: 'openssl s_client -connect example.com:443 -tls1_3'
  },
  http_req: {
    id: 'http_req',
    title: 'HTTP Request Transmission',
    category: 'Protocol',
    brief: 'Transmits the application HTTP command (GET /products) and headers over the established encrypted TLS tunnel.',
    mentalModel: 'Placing your order with the waiter: "I would like to see the catalog menu, please."',
    technicalDetails: [
      'Encapsulated inside TLS 1.3 Application Data Record.',
      'Specifies HTTP Method (GET/POST), Request Path, Host, Accept, and User-Agent headers.',
      'Traverses routers as encrypted TCP payload; intermediate hops cannot inspect or tamper with content.'
    ],
    rfc: 'RFC 9110 / RFC 9112',
    troubleshootingCmd: 'curl -v -X GET https://example.com/products'
  },
  db_query: {
    id: 'db_query',
    title: 'Database Query & Index Scan',
    category: 'Protocol',
    brief: 'The web server queries PostgreSQL for product data using an optimized B-tree primary key index scan.',
    mentalModel: 'Using the index at the back of a reference book to flip straight to page 42 instead of reading every page.',
    technicalDetails: [
      'SQL query: SELECT id, name, category, price, stock FROM products ORDER BY id ASC LIMIT 50;',
      'PostgreSQL engine executes Index Scan on products_pkey in 1.15ms.',
      'Transfers row tuples over low-latency VPC socket back to the Express worker.'
    ],
    rfc: 'SQL-92 / PostgreSQL 16 Docs',
    troubleshootingCmd: 'EXPLAIN ANALYZE SELECT * FROM products;'
  },
  http_res: {
    id: 'http_res',
    title: 'HTTP 200 OK Response & Egress',
    category: 'Protocol',
    brief: 'Server serializes product data into JSON and returns HTTP/1.1 200 OK across the return path to your browser.',
    mentalModel: 'The waiter delivering your delicious cooked meal to your table.',
    technicalDetails: [
      'Status Code 200 OK indicates successful fulfillment.',
      'Headers specify Content-Type: application/json, Content-Length, and ETag.',
      'Traverses reverse proxy, transit backbones, and NAT gateway back to client socket.'
    ],
    rfc: 'RFC 9110',
    troubleshootingCmd: 'curl -i https://example.com/products'
  },
  browser_render: {
    id: 'browser_render',
    title: 'Browser Decryption & UI Render',
    category: 'Phase',
    brief: 'Browser decrypts TLS ciphertext, parses JSON payload, runs JavaScript rendering, and displays product cards on screen.',
    mentalModel: 'Opening the package delivered to your door and placing the contents neatly onto your desk.',
    technicalDetails: [
      'Hardware AES-NI decryption decodes wire bytes into plaintext JSON.',
      'V8 JavaScript engine parses JSON string into native memory objects.',
      'React state triggers component reconciliation and DOM paint.',
      'TCP connection kept alive in socket pool for subsequent instant requests.'
    ],
    rfc: 'W3C HTML5 / DOM Standards'
  },

  // =====================
  // METRICS
  // =====================
  dns_metric: {
    id: 'dns_metric',
    title: 'DNS Resolution Latency',
    category: 'Metric',
    brief: 'Time taken to resolve domain to numerical IP. Sub-1ms on cache hit; 10-25ms on WAN query.',
    mentalModel: 'How long it takes to look up someone in your contacts before dialing.',
    technicalDetails: [
      'If cached in OS resolver memory: ~0.1ms.',
      'If recursive WAN query to 1.1.1.1: 1 round trip across UDP port 53 (typically 8-25ms).'
    ]
  },
  tcp_metric: {
    id: 'tcp_metric',
    title: 'TCP Handshake Duration',
    category: 'Metric',
    brief: 'One full round trip time (1-RTT) to exchange SYN, SYN-ACK, and ACK packets.',
    mentalModel: 'The time required to say hello and confirm the other person is listening.',
    technicalDetails: [
      'Directly determined by physical distance and speed of light in fiber optic glass (~200,000 km/s).',
      'Typically 15-40ms for domestic transit, 80-150ms for transoceanic cables.'
    ]
  },
  tls_metric: {
    id: 'tls_metric',
    title: 'TLS 1.3 Handshake Duration',
    category: 'Metric',
    brief: 'Time taken to exchange cryptographic public keys and certificates (1-RTT in TLS 1.3).',
    mentalModel: 'The time to securely exchange secret keys so no one can listen in.',
    technicalDetails: [
      'TLS 1.3 requires only 1 round trip (compared to 2 round trips in legacy TLS 1.2).',
      'Combined with TCP, full HTTPS setup requires 2-RTT total.'
    ]
  },
  rtt_metric: {
    id: 'rtt_metric',
    title: 'Round Trip Time (RTT)',
    category: 'Metric',
    brief: 'Total network latency for a packet to travel from your computer to the server and back.',
    mentalModel: 'The travel time for a boomerang thrown to a target and returning to your hand.',
    technicalDetails: [
      'Sum of serialization delay, propagation delay through fiber, and router queuing delay.',
      'Governs throughput under TCP congestion control algorithms (CUBIC, BBR).'
    ]
  },
  status_metric: {
    id: 'status_metric',
    title: 'HTTP Status Code',
    category: 'Metric',
    brief: 'The 3-digit standard response code indicating whether the request succeeded or what error occurred.',
    mentalModel: 'The official receipt stamp: 200 = Approved & Delivered, 404 = Item Missing, 500 = Cashier System Error.',
    technicalDetails: [
      '2xx Success: 200 OK, 201 Created.',
      '3xx Redirection: 301 Moved Permanently, 304 Not Modified.',
      '4xx Client Error: 400 Bad Request, 404 Not Found, 429 Too Many Requests.',
      '5xx Server Error: 500 Internal Error, 503 Service Unavailable, 504 Gateway Timeout.'
    ],
    rfc: 'RFC 9110'
  },
  server_metric: {
    id: 'server_metric',
    title: 'Server & DB Processing Time',
    category: 'Metric',
    brief: 'Time spent by the application server executing route logic and querying PostgreSQL.',
    mentalModel: 'How long the kitchen takes to prepare your food after receiving the order ticket.',
    technicalDetails: [
      'Covers Node.js event loop dispatch, ORM serialization, and SQL query execution.',
      'Optimized with connection pooling and B-tree indexing to keep latency under 15ms.'
    ]
  },

  // =====================
  // NETWORK LINKS
  // =====================
  link_client_switch: {
    id: 'link_client_switch',
    title: 'LAN Connection (Client to Switch)',
    category: 'Link',
    brief: 'High-speed local Cat6 Ethernet or Wi-Fi 6 wireless link connecting your machine to the local switch.',
    mentalModel: 'The hallway connecting your desk to your office floor reception.',
    technicalDetails: [
      '1 Gbps full-duplex Ethernet (IEEE 802.3ab) or 802.11ax Wi-Fi 6.',
      'Sub-millisecond propagation latency (< 0.5ms).',
      'Encapsulates IP packets inside IEEE 802.3 Ethernet frames with MAC addresses.'
    ],
    troubleshootingCmd: 'ethtool eth0'
  },
  link_switch_gateway: {
    id: 'link_switch_gateway',
    title: 'Internal Uplink (Switch to NAT Gateway)',
    category: 'Link',
    brief: 'Copper twisted-pair link carrying traffic from the local switch to the default gateway router.',
    mentalModel: 'The main elevator taking packages from the floor to the building mailroom.',
    technicalDetails: [
      'Gigabit Ethernet link with autonegotiation enabled.',
      'Handles broadcast ARP frames and unicast IP datagrams.'
    ],
    troubleshootingCmd: 'ip route show'
  },
  link_gateway_dns: {
    id: 'link_gateway_dns',
    title: 'DNS Resolution Path (Gateway to 1.1.1.1)',
    category: 'Link',
    brief: 'Broadband connection carrying UDP port 53 DNS queries to recursive nameservers.',
    mentalModel: 'Calling the phone operator to look up an unknown phone number.',
    technicalDetails: [
      'Lightweight connectionless UDP packets (RFC 768).',
      'No TCP 3-way handshake overhead; query and answer fit within single packets.'
    ],
    troubleshootingCmd: 'dig @1.1.1.1 example.com'
  },
  link_gateway_isp: {
    id: 'link_gateway_isp',
    title: 'Access Network (Gateway to ISP Fiber)',
    category: 'Link',
    brief: 'Gigabit Passive Optical Network (GPON) or DOCSIS cable connecting home to ISP central office.',
    mentalModel: 'The on-ramp connecting your local neighborhood road to the state highway.',
    technicalDetails: [
      'GPON optical fiber or coaxial broadband access link.',
      'Terminates at ISP Optical Line Terminal (OLT) or CMTS.',
      'Base physical latency typically 2ms to 8ms.'
    ],
    troubleshootingCmd: 'ping 192.168.1.1'
  },
  link_isp_transit: {
    id: 'link_isp_transit',
    title: 'Carrier Peering (ISP to Tier-1 Backbone)',
    category: 'Link',
    brief: 'High-capacity 100 Gbps optical fiber link connecting regional ISP to global Tier-1 transit providers.',
    mentalModel: 'The high-speed interstate freeway connecting regional sorting hubs.',
    technicalDetails: [
      'BGP-4 Autonomous System border peering (e.g. AS13335 to AS3356).',
      'Carries encapsulated MPLS or native IPv4/IPv6 BGP traffic across transcontinental fiber.'
    ],
    troubleshootingCmd: 'traceroute -q 1 104.21.58.77'
  },
  link_transit_edge: {
    id: 'link_transit_edge',
    title: 'Cloud Interconnect (Tier-1 to CDN Edge)',
    category: 'Link',
    brief: 'Direct fiber peering bringing packets into Cloudflare/Fastly Anycast edge points of presence (PoP).',
    mentalModel: 'The express off-ramp leading directly into the cloud logistics airport.',
    technicalDetails: [
      'Direct Settlement-Free Peering at major Internet Exchange Points (IXPs) like Equinix, DE-CIX.',
      'Routes traffic to nearest edge server within 10-25ms.'
    ],
    troubleshootingCmd: 'curl -Iv https://example.com'
  },
  link_edge_server: {
    id: 'link_edge_server',
    title: 'Cloud Private Network (Edge Proxy to Origin)',
    category: 'Link',
    brief: 'Encrypted private cloud backbone (AWS Direct Connect, Cloudflare Argo) to the origin server.',
    mentalModel: 'A private secure conveyor tunnel running directly from the airport to the factory floor.',
    technicalDetails: [
      'Internal VPC overlay network over WireGuard or IPsec.',
      'Multiplexes HTTP/2 or HTTP/3 keep-alive streams to eliminate TCP handshake latency.'
    ]
  },
  link_server_db: {
    id: 'link_server_db',
    title: 'Database Private Fabric (Server to PostgreSQL)',
    category: 'Link',
    brief: 'Ultra-low-latency 10 Gbps private subnet link between Express application worker and PostgreSQL.',
    mentalModel: 'A pneumatic message tube between the restaurant chef and the ingredient pantry.',
    technicalDetails: [
      'Sub-millisecond intra-datacenter VPC socket link (< 1ms).',
      'Carries binary PostgreSQL wire protocol 3.0 queries and row sets.'
    ],
    troubleshootingCmd: 'pg_isready -h localhost -p 5432'
  },

  // =====================
  // OSI / TCP-IP LAYERS
  // =====================
  layer_application: {
    id: 'layer_application',
    title: 'Layer 7: Application Layer',
    category: 'Protocol',
    brief: 'The topmost layer where user software communicates. Formats HTTP commands, handles JSON data, and parses HTML.',
    mentalModel: 'The letter itself written inside the envelope — your words and requested actions.',
    technicalDetails: [
      'Protocols: HTTP/1.1, HTTP/2, HTTP/3, DNS, TLS 1.3, WebSocket.',
      'Carries application semantics: Methods (GET, POST), Headers, Status Codes (200, 404), and JSON bodies.',
      'Does not worry about routing or packet loss; relies entirely on Layer 4 Transport for delivery.'
    ],
    rfc: 'RFC 9110 / RFC 8446'
  },
  layer_transport: {
    id: 'layer_transport',
    title: 'Layer 4: Transport Layer',
    category: 'Protocol',
    brief: 'Manages end-to-end communication between software processes using Port numbers. Provides reliable delivery via TCP.',
    mentalModel: 'The certified mail tracking number and delivery receipt guarantee.',
    technicalDetails: [
      'Protocols: TCP (reliable, ordered, connection-oriented) and UDP (lightweight, connectionless).',
      'Uses 16-bit Port Numbers (e.g. Port 443 for HTTPS, Port 54321 for client socket).',
      'Provides Sequence numbers, Acknowledgments, Window flow control, and Retransmission timeouts (RTO).'
    ],
    rfc: 'RFC 793 / RFC 768'
  },
  layer_network: {
    id: 'layer_network',
    title: 'Layer 3: Network Layer',
    category: 'Protocol',
    brief: 'Packages data into IP packets and routes them across multiple routers and networks worldwide using IP addresses.',
    mentalModel: 'The postal street address and zip code written on the outside of the envelope.',
    technicalDetails: [
      'Protocols: IPv4 (32-bit addresses, e.g. 104.21.58.77) and IPv6 (128-bit addresses).',
      'Routers inspect destination IP, decrement Time-To-Live (TTL), and consult routing tables (FIB).',
      'Does not guarantee packet delivery or order; best-effort packet forwarding.'
    ],
    rfc: 'RFC 791 (IPv4) / RFC 8200 (IPv6)'
  },
  layer_datalink: {
    id: 'layer_datalink',
    title: 'Layer 2: Data Link Layer',
    category: 'Protocol',
    brief: 'Moves raw Ethernet frames directly between two physically adjacent devices on the same local network using MAC addresses.',
    mentalModel: 'The hand-to-hand pass of the envelope from one postal courier to the next along the route.',
    technicalDetails: [
      'Protocols: Ethernet II (IEEE 802.3), Wi-Fi (IEEE 802.11).',
      'Uses 48-bit hardware MAC addresses (e.g. 00:1c:73:9a:11:01).',
      'Calculates Cyclic Redundancy Check (CRC-32 FCS) to instantly discard corrupted frames.'
    ],
    rfc: 'IEEE 802.3 / IEEE 802.11'
  },

  // =====================
  // FAILURES & ANOMALIES
  // =====================
  preset_dns_failure: {
    id: 'preset_dns_failure',
    title: 'DNS Resolution Failure (NXDOMAIN)',
    category: 'Failure',
    brief: 'The domain name does not exist. DNS resolver responds with NXDOMAIN, terminating the request before any TCP connection can start.',
    mentalModel: 'Trying to look up a phone number for a person who doesn’t exist in the directory.',
    technicalDetails: [
      'DNS RCODE 3 (Non-Existent Domain / NXDOMAIN, RFC 1035).',
      'Browser displays chrome-error://chromewebdata/ or ERR_NAME_NOT_RESOLVED.',
      'No TCP SYN packet is ever emitted because destination IP is unknown.'
    ],
    rfc: 'RFC 1035 Section 4.1.1',
    troubleshootingCmd: 'dig nonexistent-domain-xyz.invalid'
  },
  DNS_FAILURE: {
    id: 'DNS_FAILURE',
    title: 'DNS NXDOMAIN Failure',
    category: 'Failure',
    brief: 'The queried domain name is not registered. DNS resolver returns NXDOMAIN and the browser aborts.',
    mentalModel: 'Dialing a disconnected phone number with an automated "This number is not in service" tone.',
    technicalDetails: [
      'DNS Resolver queries Root and TLD servers; Authoritative server returns RCODE=3 (NXDOMAIN).',
      'Operating system stub resolver sets getaddrinfo() return code EAI_NONAME.'
    ],
    troubleshootingCmd: 'nslookup bogus-test-name.com'
  },
  preset_conn_refused: {
    id: 'preset_conn_refused',
    title: 'Connection Refused (TCP RST Flag)',
    category: 'Failure',
    brief: 'The destination IP was reached, but no server process is listening on the target port. The kernel immediately sends back a TCP RST.',
    mentalModel: 'Arriving at an office building, knocking on door #443, and finding the room completely empty.',
    technicalDetails: [
      'Client sends TCP SYN to port 443; Destination kernel has no listening socket with backlog.',
      'Operating system kernel generates TCP packet with RST (Reset) and ACK flags enabled.',
      'Client socket receives ECONNREFUSED error and terminates immediately.'
    ],
    rfc: 'RFC 793 Section 3.4',
    troubleshootingCmd: 'nc -zv example.com 443'
  },
  CONNECTION_REFUSED: {
    id: 'CONNECTION_REFUSED',
    title: 'TCP Connection Reset (RST)',
    category: 'Failure',
    brief: 'Host is active, but port is closed. Target kernel replies with TCP RST to abort connection immediately.',
    mentalModel: 'A security guard at the gate telling you "No one works in that office, turn around."',
    technicalDetails: [
      'TCP header RST bit = 1. Acknowledges client Initial Sequence Number.',
      'Zero connection state maintained on server; connection aborted in 1 RTT.'
    ],
    troubleshootingCmd: 'ss -tlpn'
  },
  preset_packet_loss: {
    id: 'preset_packet_loss',
    title: 'Packet Loss & TCP Retransmission',
    category: 'Failure',
    brief: 'An in-flight packet was dropped by a congested router. TCP timer fires (RTO) and re-sends the packet automatically.',
    mentalModel: 'A letter getting lost in the mail; after waiting a week with no reply, you mail a duplicate copy.',
    technicalDetails: [
      'TCP Retransmission Timeout (RTO) calculated dynamically via Jacobson’s algorithm.',
      'Default initial RTO is typically 1000ms.',
      'Causes visible latency spike, but connection eventually succeeds without application error.'
    ],
    rfc: 'RFC 6298 (Computing TCP Retransmission Timer)',
    troubleshootingCmd: 'ping -c 20 -i 0.2 example.com'
  },
  PACKET_LOSS: {
    id: 'PACKET_LOSS',
    title: 'Buffer Overrun & Retransmit',
    category: 'Failure',
    brief: 'A network queue overflowed and dropped the packet. TCP protocol recovers by detecting missing ACKs and retransmitting.',
    mentalModel: 'A bucket overflowing in heavy rain; extra raindrops spill over the edge.',
    technicalDetails: [
      'Router tail-drop occurs when FIFO queue is full (RFC 2309).',
      'Sender detects either 3 duplicate ACKs (Fast Retransmit) or RTO expiration.'
    ],
    troubleshootingCmd: 'tc qdisc show'
  },
  preset_http_404: {
    id: 'preset_http_404',
    title: 'HTTP 404 Route Not Found',
    category: 'Failure',
    brief: 'All network routing, TCP handshakes, and TLS encryption succeeded perfectly, but the web server has no route matching the requested path.',
    mentalModel: 'Successfully walking into a restaurant, sitting down, and asking for a car tire from the menu.',
    technicalDetails: [
      'HTTP Status Code 404 Not Found (RFC 9110).',
      'Client error (4xx): The URL path (/non-existent-api) has no registered Express route handler.',
      'Server returns JSON error body: {"error": "Route Not Found", "status": 404}.'
    ],
    rfc: 'RFC 9110 Section 15.5.5',
    troubleshootingCmd: 'curl -i https://example.com/missing-url'
  },
  preset_db_down: {
    id: 'preset_db_down',
    title: 'Database Cluster Outage (HTTP 500)',
    category: 'Failure',
    brief: 'The Express web server accepted the request, but cannot connect to PostgreSQL on port 5432. Returns 500 Internal Server Error.',
    mentalModel: 'The waiter takes your order to the kitchen, but discovers the pantry door is locked and no ingredients can be reached.',
    technicalDetails: [
      'Express route handler tries to obtain client from pg.Pool.',
      'Connection timed out after 3000ms with code ECONNREFUSED 10.0.2.10:5432.',
      'Server catches exception and responds with HTTP 500 Internal Server Error.'
    ],
    rfc: 'RFC 9110 Section 15.6.1',
    troubleshootingCmd: 'pg_isready -h 10.0.2.10 -p 5432'
  },
  DB_UNAVAILABLE: {
    id: 'DB_UNAVAILABLE',
    title: 'Database Unreachable',
    category: 'Failure',
    brief: 'Backend application failed to communicate with the database tier, triggering an HTTP 500 Internal Error.',
    mentalModel: 'The chef has an order ticket but the kitchen power went out.',
    technicalDetails: [
      'PostgreSQL daemon crashed or network partition between App VPC and DB subnet.',
      'Connection pool exhaustion throws timeout errors to calling handlers.'
    ]
  },
  preset_webpage: {
    id: 'preset_webpage',
    title: 'Full Baseline HTTPS Request',
    category: 'Phase',
    brief: 'The complete happy path: DNS resolution, ARP gateway discovery, TCP 3-way handshake, TLS 1.3 setup, HTTP GET, DB query, 200 OK.',
    mentalModel: 'A smooth textbook journey of a web request from keystroke to rendered screen.',
    technicalDetails: [
      'Follows full RFC standards across all 4 OSI/TCP-IP layers.',
      'Measures baseline performance of domestic fiber connection (~100-120ms total).'
    ]
  },
  preset_dns_cache: {
    id: 'preset_dns_cache',
    title: 'DNS Cache Hit (Sub-millisecond)',
    category: 'Phase',
    brief: 'Demonstrates modern OS resolver caching. Eliminates the external UDP DNS query entirely, saving ~20ms of round-trip time.',
    mentalModel: 'Remembering a friend’s phone number by heart so you don’t need to look it up.',
    technicalDetails: [
      'Resolves IP directly from nscd / systemd-resolved / browser in-memory DNS cache.',
      'TTL remaining is valid; immediately emits TCP SYN to cached IP.'
    ],
    troubleshootingCmd: 'systemd-resolve --statistics'
  },
  preset_real_api: {
    id: 'preset_real_api',
    title: 'Live Express Demo API Probe',
    category: 'Phase',
    brief: 'Traces a real HTTP roundtrip against the local Express backend running on your system.',
    mentalModel: 'Sending a real ping to a live server next door and measuring the real millisecond response.',
    technicalDetails: [
      'Queries the active Express 5 server running at http://localhost:3001/api/products.',
      'Returns live JSON records and authentic network response headers.'
    ],
    troubleshootingCmd: 'curl -i http://localhost:3001/api/products'
  }
};

/**
 * Universal topic resolver: looks up topic by ID, aliases, or normalized key
 */
export function getTopicExplanation(topicId) {
  if (!topicId) return undefined;
  
  // Exact match
  if (TOPIC_EXPLANATIONS[topicId]) {
    return TOPIC_EXPLANATIONS[topicId];
  }
  
  // Normalized lowercase / trimmed
  const normalized = topicId.toLowerCase().trim();
  if (TOPIC_EXPLANATIONS[normalized]) {
    return TOPIC_EXPLANATIONS[normalized];
  }

  // Common aliases
  const aliasMap = {
    'dns_query': 'dns_lookup',
    'dns_resolution': 'dns_lookup',
    'dns_cache': 'preset_dns_cache',
    'arp_query': 'arp',
    'arp_resolve': 'arp',
    'tcp_syn': 'tcp_handshake',
    'tcp_handshake_syn': 'tcp_handshake',
    'tcp_ack': 'tcp_handshake',
    'tls': 'tls_handshake',
    'tls13': 'tls_handshake',
    'http_request': 'http_req',
    'http_get': 'http_req',
    'express_route': 'web_server',
    'database_query': 'db_query',
    'sql_query': 'db_query',
    'http_response': 'http_res',
    'render': 'browser_render',
    'dom_render': 'browser_render',
    'dns_time': 'dns_metric',
    'tcp_time': 'tcp_metric',
    'tls_time': 'tls_metric',
    'rtt': 'rtt_metric',
    'status': 'status_metric',
    'status_code': 'status_metric',
    'server_time': 'server_metric',
    'l7': 'layer_application',
    'application': 'layer_application',
    'l4': 'layer_transport',
    'transport': 'layer_transport',
    'l3': 'layer_network',
    'network': 'layer_network',
    'l2': 'layer_datalink',
    'datalink': 'layer_datalink'
  };

  if (aliasMap[normalized] && TOPIC_EXPLANATIONS[aliasMap[normalized]]) {
    return TOPIC_EXPLANATIONS[aliasMap[normalized]];
  }

  // Try matching prefix or suffix
  const matchKey = Object.keys(TOPIC_EXPLANATIONS).find(k => 
    k.toLowerCase() === normalized || 
    k.toLowerCase().includes(normalized) || 
    normalized.includes(k.toLowerCase())
  );

  return matchKey ? TOPIC_EXPLANATIONS[matchKey] : undefined;
}
