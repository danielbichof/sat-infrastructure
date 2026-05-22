import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../..');
const ENV_PATH = path.join(ROOT_DIR, '.env');
const OUTPUT_DIR = path.join(ROOT_DIR, 'nextcloud/evidencias');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'evidencia-nextcloud.png');
const NEXTCLOUD_URL = process.env.NEXTCLOUD_URL || 'http://localhost:8080';
const UPLOAD_FILE = path.join('/tmp', 'pcsi-nextcloud-upload.txt');
const UPLOAD_NAME = path.basename(UPLOAD_FILE);

const parseEnv = (raw) => {
  const env = {};
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  });
  return env;
};

const run = async () => {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error(`.env não encontrado em ${ENV_PATH}`);
  }

  const env = parseEnv(fs.readFileSync(ENV_PATH, 'utf8'));
  const adminUser = env.NEXTCLOUD_ADMIN_USER;
  const adminPass = env.NEXTCLOUD_ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    throw new Error('NEXTCLOUD_ADMIN_USER/PASSWORD ausentes no .env');
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(UPLOAD_FILE, `Evidência Nextcloud - ${new Date().toISOString()}\n`, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login
  await page.goto(`${NEXTCLOUD_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[name="user"], input#user', adminUser);
  await page.fill('input[name="password"], input#password', adminPass);
  await page.click('button[type="submit"], input[type="submit"]');
  await page.waitForURL('**/apps/**', { timeout: 30000 });

  // Files app
  await page.goto(`${NEXTCLOUD_URL}/apps/files/`, { waitUntil: 'networkidle' });

  // Upload file using hidden input
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(UPLOAD_FILE);

  // Wait for upload to appear
  await page.waitForSelector(`text=${UPLOAD_NAME}`, { timeout: 30000 });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: OUTPUT_FILE, fullPage: true });

  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
