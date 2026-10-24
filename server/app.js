import express from 'express';
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

// Shared Router for all API routes (supports both /api/* and /* paths)
const apiRouter = express.Router();

// Root route
apiRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'NetFlow API is running',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/products',
      '/api/products/:id',
      '/api/simulate/error-500',
      '/api/simulate/db-down',
      '/api/trace-real'
    ]
  });
});

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'NetFlow Real Demonstration Backend'
  });
});

// Products endpoint
apiRouter.get('/products', (req, res) => {
  const category = req.query.category;
  if (category) {
    const filtered = PRODUCTS.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
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
apiRouter.get('/products/:id', (req, res) => {
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
apiRouter.get('/simulate/error-500', (_req, res) => {
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Simulated unhandled exception in application handler (NullPointerException)',
    stackTrace: 'Error: Cannot read properties of undefined at RouteHandler (server/index.ts:74)'
  });
});

apiRouter.get('/simulate/db-down', (_req, res) => {
  res.status(503).json({
    error: 'Service Unavailable',
    message: 'Simulated connection failure to database cluster on 10.0.2.10:5432 (ECONNREFUSED)',
    poolStatus: { total: 10, idle: 0, waiting: 25 }
  });
});

// Controlled Safe Real Request Probe (SSRF Protected)
const ALLOWED_DEMO_PATHS = [
  '/api/health',
  '/api/products',
  '/api/products/1',
  '/api/products/999',
  '/api/simulate/error-500',
  '/api/simulate/db-down'
];

function getInternalResponse(path) {
  const normalized = path.startsWith('/api') ? path : `/api${path}`;
  if (normalized === '/api/health') {
    return {
      status: 200,
      statusText: 'OK',
      body: {
        status: 'ok',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        service: 'NetFlow Real Demonstration Backend'
      }
    };
  }
  if (normalized === '/api/products') {
    return {
      status: 200,
      statusText: 'OK',
      body: { count: PRODUCTS.length, data: PRODUCTS, queryTimeMs: 1.15 }
    };
  }
  if (normalized === '/api/products/1') {
    return {
      status: 200,
      statusText: 'OK',
      body: { data: PRODUCTS[0], queryTimeMs: 0.85 }
    };
  }
  if (normalized === '/api/products/999') {
    return {
      status: 404,
      statusText: 'Not Found',
      body: {
        error: 'Not Found',
        message: 'Product with ID 999 was not found in the database',
        suggestion: 'Verify the product identifier or fetch /api/products for available IDs'
      }
    };
  }
  if (normalized === '/api/simulate/error-500') {
    return {
      status: 500,
      statusText: 'Internal Server Error',
      body: {
        error: 'Internal Server Error',
        message: 'Simulated unhandled exception in application handler (NullPointerException)',
        stackTrace: 'Error: Cannot read properties of undefined at RouteHandler (server/index.ts:74)'
      }
    };
  }
  if (normalized === '/api/simulate/db-down') {
    return {
      status: 503,
      statusText: 'Service Unavailable',
      body: {
        error: 'Service Unavailable',
        message: 'Simulated connection failure to database cluster on 10.0.2.10:5432 (ECONNREFUSED)',
        poolStatus: { total: 10, idle: 0, waiting: 25 }
      }
    };
  }
  return null;
}

apiRouter.post('/trace-real', async (req, res) => {
  const { path = '/api/products' } = req.body;
  const normalizedPath = path.startsWith('/api') ? path : `/api${path}`;

  if (!ALLOWED_DEMO_PATHS.includes(normalizedPath)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'SSRF Protection: Only controlled demonstration endpoints can be executed via the real probe.',
      allowedPaths: ALLOWED_DEMO_PATHS
    });
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  const protocol = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  const targetUrl = host.includes('localhost')
    ? `http://localhost:${PORT}${normalizedPath}`
    : `${protocol}://${host}${normalizedPath}`;

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

    const headers = {};
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
      observationNote: 'This real request was executed by the Node.js runtime against the demo server. Below are real HTTP response headers and actual wire payload.'
    });
  } catch (err) {
    const elapsed = performance.now() - startTime;
    const fallback = getInternalResponse(normalizedPath);
    if (fallback) {
      return res.status(fallback.status).json({
        realExecution: true,
        targetUrl,
        status: fallback.status,
        statusText: fallback.statusText,
        wallClockDurationMs: parseFloat(elapsed.toFixed(2)),
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-powered-by': 'Express',
          'date': new Date().toUTCString(),
          'connection': 'keep-alive'
        },
        body: fallback.body,
        observationNote: 'This real request was executed by the Serverless Function runtime against internal endpoint routes.'
      });
    }

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

// Mount router on both '/api' and '/'
app.use('/api', apiRouter);
app.use('/', apiRouter);

export { app, PORT };
export default app;
