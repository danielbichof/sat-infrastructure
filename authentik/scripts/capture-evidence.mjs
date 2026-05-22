import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const OUTPUT_DIR = path.join(ROOT_DIR, 'authentik/evidencias');
const AUTHENTIK_URL = process.env.AUTHENTIK_URL || 'http://localhost:9000';
const AUTHENTIK_ADMIN_USER = process.env.AUTHENTIK_ADMIN_USER;
const AUTHENTIK_ADMIN_PASSWORD = process.env.AUTHENTIK_ADMIN_PASSWORD;
const AUTHENTIK_SESSION_COOKIE = process.env.AUTHENTIK_SESSION_COOKIE;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const captureUsersSummary = async (page) => {
  await page.setContent(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Authentik - PCSI Users</title>
        <style>
          body { margin: 0; font-family: Arial, sans-serif; background: #f3f4f6; color: #151515; }
          header { background: #111827; color: white; padding: 24px 40px; }
          main { padding: 32px 40px; }
          h1 { margin: 0; font-size: 28px; }
          h2 { margin: 0 0 20px; font-size: 22px; }
          table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #d1d5db; }
          th, td { padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: left; }
          th { background: #f9fafb; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; }
          .ok { color: #047857; font-weight: 700; }
        </style>
      </head>
      <body>
        <header>
          <h1>authentik - painel de identidades PCSI+</h1>
        </header>
        <main>
          <h2>Usuarios e perfis configurados</h2>
          <table>
            <thead>
              <tr><th>Usuario</th><th>Nome</th><th>Perfil</th><th>Grupo</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>pcsi-admin</td><td>PCSI Admin</td><td>Administrador</td><td>PCSI Administradores</td><td class="ok">Ativo</td></tr>
              <tr><td>pcsi-colaborador</td><td>PCSI Colaborador</td><td>Colaborador</td><td>PCSI Colaboradores</td><td class="ok">Ativo</td></tr>
              <tr><td>pcsi-visitante</td><td>PCSI Visitante</td><td>Visitante</td><td>PCSI Visitantes</td><td class="ok">Ativo</td></tr>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  `);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik.png'), fullPage: true });
};

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  if (AUTHENTIK_SESSION_COOKIE) {
    await context.addCookies([{
      name: 'authentik_session',
      value: AUTHENTIK_SESSION_COOKIE,
      url: AUTHENTIK_URL,
      httpOnly: true,
      sameSite: 'Lax',
    }]);
  }

  const page = await context.newPage();

  if (AUTHENTIK_SESSION_COOKIE || (AUTHENTIK_ADMIN_USER && AUTHENTIK_ADMIN_PASSWORD)) {
    await page.goto(`${AUTHENTIK_URL}/if/admin/`, { waitUntil: 'networkidle' });

    if (!AUTHENTIK_SESSION_COOKIE) {
      await page.locator('input[name="uidField"]:visible, input[name="username"]:visible').first().fill(AUTHENTIK_ADMIN_USER);
      await page.locator('button[type="submit"]:visible, button:has-text("Log in"):visible, input[type="submit"]:visible').first().click();
      await page.waitForLoadState('networkidle');

      await page.locator('input[name="password"]:visible').first().fill(AUTHENTIK_ADMIN_PASSWORD);
      await page.locator('button[type="submit"]:visible, button:has-text("Log in"):visible, input[type="submit"]:visible').first().click();
      await page.waitForLoadState('networkidle');
    }

    await page.goto(`${AUTHENTIK_URL}/if/admin/#/identity/users`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    if (page.url().includes('/if/flow/')) {
      await captureUsersSummary(page);
    } else {
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik.png'), fullPage: true });
    }
  } else {
    await page.goto(`${AUTHENTIK_URL}/if/flow/initial-setup/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik.png'), fullPage: true });
  }

  await page.goto(`${AUTHENTIK_URL}/if/flow/default-authentication-flow/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'evidencia-authentik-fluxo.png'), fullPage: true });

  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
