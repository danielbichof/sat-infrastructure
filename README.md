# SAT Infrastructure (PCSI+)

Repositorio da POC de seguranca da informacao da i9+ (extensao universitaria), com foco em infraestrutura local via Docker Compose e evidencias tecnicas para avaliacao academica e futura adocao.

## Visao geral

O projeto demonstra um ecossistema basico de seguranca com ferramentas open source:

- Authentik: identidade centralizada e SSO
- Nextcloud: arquivos e colaboracao com rastreabilidade
- Vaultwarden: cofre de senhas
- Wazuh: monitoramento de eventos de seguranca

Integracao chave: SSO Authentik -> Nextcloud via OIDC (ver docs/authentik-nextcloud-oidc.md).

## Requisitos

- Docker e Docker Compose
- 12 GB de RAM recomendados para rodar tudo ao mesmo tempo (ou rode um por vez)
- Todas as configuracoes e caminhos referenciados devem ficar dentro do repositorio

## Portas (padrao)

- Authentik: http://localhost:9000 (HTTPS: 9443)
- Nextcloud: http://localhost:8080
- Vaultwarden: https://localhost:8443
- Wazuh: https://localhost

## Observacao importante (Wazuh)

O Wazuh usa arquivos de configuracao em wazuh/config/. Certifique-se de que essa pasta exista no repositorio e contenha os certificados e configs exigidos pelo compose antes de subir o stack.

## Como clonar e rodar (visao geral)

1) Clone o repositorio e entre na pasta:

git clone <URL_DO_REPO>
cd sat-infrastructure

2) Copie o env raiz (obrigatorio, contem todas as configs):

cp root.env.example .env

3) Suba tudo pelo docker-compose da raiz, ou um servico isolado.

- docker compose up -d
- docker compose up -d authentik authentik-worker postgresql redis
- docker compose up -d nextcloud db
- docker compose up -d vaultwarden
- docker compose up -d wazuh.manager wazuh.indexer wazuh.dashboard

## Subir cada servico (resumo rapido)

### Authentik

cd authentik
cp .env.example .env
# edite .env e defina PG_PASS e AUTHENTIK_SECRET_KEY

docker compose up -d
Acesse: http://localhost:9000/if/flow/initial-setup/

### Nextcloud

cd nextcloud
./scripts/bootstrap-env.sh

docker compose up -d
Acesse: http://localhost:8080

### Vaultwarden

cd vaultwarden
# confira o README da pasta e ajuste as configuracoes locais

docker compose up -d
Acesse: https://localhost:8443

### Wazuh

cd wazuh

docker compose up -d
Acesse: https://localhost

## SSO Authentik + Nextcloud

Depois que Authentik e Nextcloud estiverem ativos, siga:

- docs/authentik-nextcloud-oidc.md

## Evidencias

Cada ferramenta possui pasta de evidencias. Exemplos:

- authentik/evidencias/evidencia-authentik.png
- authentik/evidencias/evidencia-authentik-fluxo.png
- nextcloud/evidencias/evidencia-nextcloud.png
- vaultwarden/evidencias/evidencia-vaultwarden.png
- wazuh/docs/dashboard-wazuh.png

## Troubleshooting rapido

- Ver containers: docker compose ps
- Ver logs: docker compose logs -f
- Parar stack: docker compose down
- Se houver conflito de porta, altere a porta no docker-compose.yml do servico

## Documentos importantes

- PRD do projeto: PRD.md
- Guia OIDC: docs/authentik-nextcloud-oidc.md
- Reanalise da arquitetura: docs/reanalise-arquitetura-pcsi.md
