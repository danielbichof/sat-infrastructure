# Authentik — Identidade Centralizada e SSO

## Como subir

1) Defina as variáveis no `.env` da raiz (PG_PASS, AUTHENTIK_SECRET_KEY etc.).
2) Entre na pasta do serviço e copie o `.env` local ignorado pelo Git:

```bash
cd authentik
cp ../.env .env
```

3) Suba o stack oficial:

```bash
docker compose up -d
docker compose ps
```

Acesse:
- http://localhost:9000
- http://localhost:9000/if/flow/initial-setup/

## Setup inicial

Abra http://localhost:9000/if/flow/initial-setup/ e crie o usuário administrativo inicial.

Para a evidência da POC, crie três perfis de demonstração:

| Usuário | Perfil | Grupo |
|---|---|---|
| `pcsi-admin` | Administrador | `PCSI Administradores` |
| `pcsi-colaborador` | Colaborador | `PCSI Colaboradores` |
| `pcsi-visitante` | Visitante | `PCSI Visitantes` |

As credenciais devem ser apenas locais/de demonstração. Não registre senhas reais no repositório.

## Evidências

- authentik/evidencias/evidencia-authentik.png
- authentik/evidencias/evidencia-authentik-fluxo.png

Para capturar as evidências com Playwright:

```bash
cd authentik
AUTHENTIK_ADMIN_USER=<usuario-admin> AUTHENTIK_ADMIN_PASSWORD=<senha-admin> node scripts/capture-evidence.mjs
```

Quando o login interativo não for adequado para automação, gere um cookie de sessão local no container e execute:

```bash
AUTHENTIK_SESSION_COOKIE=<cookie-local> node scripts/capture-evidence.mjs
```

Se nenhuma variável de autenticação for informada, o script captura apenas telas públicas do fluxo de autenticação.

## Por que Authentik?

Centraliza identidades e habilita SSO, resolvendo a falta de controle de acesso na i9+.
