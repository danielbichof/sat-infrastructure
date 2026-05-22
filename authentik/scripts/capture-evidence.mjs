import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('authentik/evidencias');
const AUTHENTIK_URL = process.env.AUTHENTIK_URL || 'http://localhost:9000';

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${AUTHENTIK_URL}/if/flow/initial-setup/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik.png'), fullPage: true });

  // If SSO flow evidence requires a different URL, adjust below and re-run.
  await page.goto(`${AUTHENTIK_URL}/if/flow/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik-fluxo.png'), fullPage: true });

  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
