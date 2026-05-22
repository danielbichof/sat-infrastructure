# Authentik — Identidade Centralizada e SSO

## Como subir

1) Defina as variáveis no .env da raiz (PG_PASS, AUTHENTIK_SECRET_KEY etc.).
2) Suba pelo compose da raiz:

```bash
cd ..
docker compose up -d postgresql redis authentik authentik-worker
```

Acesse: http://localhost:${AUTHENTIK_HTTP_PORT:-9000}

## Setup inicial

Abra:
- http://localhost:9000/if/flow/initial-setup/

Crie o usuário admin e salve a senha.

## Evidências

- authentik/evidencias/evidencia-authentik.png
- authentik/evidencias/evidencia-authentik-fluxo.png

## Por que Authentik?

Centraliza identidades e habilita SSO, resolvendo a falta de controle de acesso na i9+.
