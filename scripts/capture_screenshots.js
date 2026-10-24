import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOT_DIR = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('[Puppeteer] Launching Chromium in high-res mode...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2
  });

  console.log('[Puppeteer] Navigating to NetFlow on http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for health check / API status to be ready
  await page.waitForFunction(() => document.body.innerText.includes('API READY'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // ----------------------------------------------------
  // Fig 4.1 — Network canvas mid-journey
  // ----------------------------------------------------
  console.log('[Puppeteer] Capturing Fig 4.1: Network Canvas mid-journey...');
  // Step forward to step 6 (e.g. TCP SYN-ACK in flight along the internet link)
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 700));

  const fig41Path = path.join(SCREENSHOT_DIR, 'fig_4_1_network_canvas_mid_journey.png');
  await page.screenshot({ path: fig41Path, fullPage: false });
  console.log(`[Puppeteer] Saved Fig 4.1: ${fig41Path}`);

  // ----------------------------------------------------
  // Fig 4.2 — Packet Inspector: 4-layer breakdown + Wireshark hex dump
  // ----------------------------------------------------
  console.log('[Puppeteer] Capturing Fig 4.2: Packet Inspector (4-layer + hex dump)...');
  
  // Advance to step 9 (HTTP Request packet with complete Layer 7, Layer 4, Layer 3, and Layer 2)
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 400));

  // Switch to Packet Dissector view
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header nav button'));
    const inspectorBtn = buttons.find(b => b.innerText.includes('Packet Dissector'));
    if (inspectorBtn) inspectorBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const fig42Path = path.join(SCREENSHOT_DIR, 'fig_4_2_packet_inspector.png');
  await page.screenshot({ path: fig42Path, fullPage: false });
  console.log(`[Puppeteer] Saved Fig 4.2: ${fig42Path}`);

  // ----------------------------------------------------
  // Fig 4.3 — Failure Lab + Live Backend Probe
  // ----------------------------------------------------
  console.log('[Puppeteer] Capturing Fig 4.3: Failure Lab + Live Backend Probe...');
  
  // Switch to Failure Lab view
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header nav button'));
    const failBtn = buttons.find(b => b.innerText.includes('Failure Lab'));
    if (failBtn) failBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Connection Refused scenario
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('strong, div, h4'));
    const connRefused = items.find(el => el.innerText && el.innerText.includes('Connection Refused'));
    if (connRefused) connRefused.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click Execute Real Wire Probe to test against live backend (:3001)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const probeBtn = buttons.find(b => b.innerText.includes('Execute Real Wire Probe'));
    if (probeBtn) probeBtn.click();
  });
  // Wait for probe fetch to resolve
  await new Promise(r => setTimeout(r, 1500));

  const fig43Path = path.join(SCREENSHOT_DIR, 'fig_4_3_failure_lab_live_backend.png');
  await page.screenshot({ path: fig43Path, fullPage: false });
  console.log(`[Puppeteer] Saved Fig 4.3: ${fig43Path}`);

  // ----------------------------------------------------
  // Fig 4.4 — Live Demo API: Real Request vs Simulation
  // ----------------------------------------------------
  console.log('[Puppeteer] Capturing Fig 4.4: Live Demo API (Real Request vs Simulation)...');
  
  // Switch to Live Demo API view
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header nav button'));
    const apiBtn = buttons.find(b => b.innerText.includes('Live Demo API'));
    if (apiBtn) apiBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Execute Real HTTP Request
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const execBtn = buttons.find(b => b.innerText.includes('Execute Real HTTP Request'));
    if (execBtn) execBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const fig44Path = path.join(SCREENSHOT_DIR, 'fig_4_4_live_backend_real_vs_sim.png');
  await page.screenshot({ path: fig44Path, fullPage: false });
  console.log(`[Puppeteer] Saved Fig 4.4: ${fig44Path}`);

  await browser.close();
  console.log('[Puppeteer] All 4 high-res screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('[Puppeteer] Error during screenshot capture:', err);
  process.exit(1);
});
