import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { PRODUCTS } from './data.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[HTTP] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'NetFlow Real Demonstration Backend'
  });
});

// Products endpoint
app.get('/api/products', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  if (category) {
    const filtered = PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json({
      count: filtered.length,
      data: filtered,
      queryTimeMs: 1.42
    });
  }
  res.json({
    count: PRODUCTS.length,
    data: PRODUCTS,
    queryTimeMs: 1.15
  });
});

// Single product endpoint
app.get('/api/products/:id', (req: Request, res: Response) => {
  const rawId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  const id = parseInt(rawId || '', 10);
  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Product ID must be an integer'
    });
  }

  const product = PRODUCTS.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product with ID ${id} was not found in the database`,
      suggestion: 'Verify the product identifier or fetch /api/products for available IDs'
    });
  }

  res.json({
    data: product,
    queryTimeMs: 0.85
  });
});

// Simulated failure endpoints for live testing
app.get('/api/simulate/error-500', (_req: Request, res: Response) => {
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Simulated unhandled exception in application handler (NullPointerException)',
    stackTrace: 'Error: Cannot read properties of undefined at RouteHandler (server/index.ts:74)'
  });
});

app.get('/api/simulate/db-down', (_req: Request, res: Response) => {
  res.status(503).json({
    error: 'Service Unavailable',
    message: 'Simulated connection failure to database cluster on 10.0.2.10:5432 (ECONNREFUSED)',
    poolStatus: { total: 10, idle: 0, waiting: 25 }
  });
});

// Controlled Safe Real Request Probe (SSRF Protected)
// Only allows testing predetermined internal demo endpoints
const ALLOWED_DEMO_PATHS = [
  '/api/health',
  '/api/products',
  '/api/products/1',
  '/api/products/999', // Triggers 404
  '/api/simulate/error-500',
  '/api/simulate/db-down'
];

app.post('/api/trace-real', async (req: Request, res: Response) => {
  const { path = '/api/products' } = req.body;

  // Strict allowlist validation to protect against SSRF
  if (!ALLOWED_DEMO_PATHS.includes(path)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'SSRF Protection: Only controlled demonstration endpoints can be executed via the real probe.',
      allowedPaths: ALLOWED_DEMO_PATHS
    });
  }

  const targetUrl = `http://localhost:${PORT}${path}`;
  const startTime = performance.now();

  try {
    const fetchResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NetFlow-Probe/1.0',
        'Accept': 'application/json'
      }
    });

    const elapsed = performance.now() - startTime;
    const body = await fetchResponse.json().catch(() => ({}));

    // Capture response headers
    const headers: Record<string, string> = {};
    fetchResponse.headers.forEach((value, key) => {
      headers[key] = value;
    });

    res.json({
      realExecution: true,
      targetUrl,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
      wallClockDurationMs: parseFloat(elapsed.toFixed(2)),
      headers,
      body,
      observationNote: 'This real request was executed by the Node.js runtime against the local demo server. Below are real HTTP response headers and actual wire payload.'
    });
  } catch (err: any) {
    const elapsed = performance.now() - startTime;
    res.status(502).json({
      realExecution: true,
      targetUrl,
      status: 502,
      wallClockDurationMs: parseFloat(elapsed.toFixed(2)),
      error: 'Bad Gateway',
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`[NetFlow Server] Listening on http://localhost:${PORT}`);
});
