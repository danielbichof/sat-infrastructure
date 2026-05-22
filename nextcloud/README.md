# Nextcloud — Arquivos e Colaboração

## Como subir

cp root.env.example .env   # apenas na primeira vez
docker compose --profile nextcloud up -d

URL de acesso: http://localhost:${NEXTCLOUD_PORT}

## SSO com Authentik

Siga: docs/authentik-nextcloud-oidc.md

## Evidência

Capturar print do painel após login e upload de arquivo.
