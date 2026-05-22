# AGENTS.md — sat-infrastructure

Guia de contexto para agentes de IA trabalhando neste repositório.

---

## O que é este projeto

`sat-infrastructure` é a prova de conceito do **PCSI+ (Programa Corporativo de Segurança da Informação)**, produzida como extensão universitária pela Universidade Positivo para a startup i9+. O projeto demonstra um ecossistema de segurança open source configurado via Docker Compose.

**Prazo de entrega:** 25 de maio de 2026 às 17h.

---

## Regras inegociáveis

Antes de qualquer ação, leia e respeite estas regras:

1. **Nunca crie Dockerfiles customizados.** Todos os serviços usam imagens oficiais declaradas no `docker-compose.yml` de cada pasta. Se precisar configurar algo, use variáveis de ambiente ou volumes — nunca um Dockerfile próprio.

2. **Nunca modifique o `docker-compose.yml` de um serviço sem instrução explícita.** Cada arquivo foi testado. Alterações não solicitadas podem quebrar a evidência já capturada.

3. **Nunca crie um host compartilhado entre serviços.** Cada serviço roda de forma independente na máquina local do responsável. Não há orquestração (sem Kubernetes, sem Swarm, sem Portainer).

4. **Nunca altere arquivos de evidência já existentes.** Os arquivos em `*/evidencias/` e `wazuh/docs/` são artefatos de entrega. Se precisar atualizar uma evidência, adicione uma versão nova com sufixo de data.

5. **Nunca commite credenciais de produção.** As credenciais nos `docker-compose.yml` são exclusivas para desenvolvimento local. Não as substitua por segredos reais.

6. **Nunca use orquestração externa.** O comando correto para subir qualquer serviço é `docker compose up -d` dentro da pasta do serviço. Não use `docker-compose` (v1), não use `kubectl`, não use scripts de orquestração.

---

## Estrutura do repositório

```
sat-infrastructure/
├── AGENTS.md                           ← este arquivo
├── README.md                           ← visão geral e instruções de acesso
├── LICENSE
│
├── authentik/                          ← STATUS: Configurado
│   ├── docker-compose.yml
│   ├── evidencias/
│   │   ├── evidencia-authentik.png
│   │   └── evidencia-authentik-fluxo.png
│   └── scripts/
│       └── capture-evidence.mjs
│
├── nextcloud/                          ← STATUS: Pendente
│   ├── docker-compose.yml
│   ├── evidencias/
│   │   └── evidencia-nextcloud.png
│   └── README.md
│
├── vaultwarden/                        ← STATUS: Configurado
│   ├── docker-compose.yml
│   ├── evidencias/
│   │   └── evidencia-vaultwarden.png
│   └── README.md
│
├── wazuh/                              ← STATUS: Configurado
│   ├── docker-compose.yml
│   ├── README.md
│   └── docs/
│       ├── dashboard-wazuh.png
│       └── wazuh-manual-agente.pdf
│
└── docs/
    ├── authentik-nextcloud-oidc.md     ← STATUS: Concluído
    ├── reanalise-arquitetura-pcsi.md   ← STATUS: Concluído
    ├── databook.md                     ← STATUS: Pendente
    ├── roteiro-video.md                ← STATUS: Pendente
    └── qa-checklist.md                 ← STATUS: Pendente
```

---

## Serviços e portas

| Serviço | Pasta | Porta local | RAM estimada | Status |
|---|---|---|---|---|
| Authentik | `authentik/` | 9000 | ~2 GB | Configurado |
| Nextcloud | `nextcloud/` | 8080 | ~1 GB | Pendente |
| Vaultwarden | `vaultwarden/` | 8082 | ~0.2 GB | Configurado |
| Wazuh | `wazuh/` | 443 | 4–6 GB | Configurado |

**RAM total para rodar todos simultaneamente:** 7–9 GB. A máquina de gravação do vídeo precisa de no mínimo 12 GB disponíveis.

---

## Comandos por serviço

Todos os comandos abaixo devem ser executados dentro da pasta do serviço.

### Subir um serviço

```bash
cd {pasta-do-servico}
docker compose up -d
```

### Acompanhar logs

```bash
docker compose logs -f
```

### Verificar containers ativos

```bash
docker compose ps
```

### Parar sem apagar dados

```bash
docker compose down
```

### Resetar completamente (apaga volumes e dados)

```bash
docker compose down -v
docker compose up -d
```

Use `down -v` apenas quando necessário. Apaga todos os dados persistentes do serviço.

### Executar comando dentro do Nextcloud

```bash
docker exec -u www-data nextcloud php occ {comando}
```

Exemplos úteis:
```bash
docker exec -u www-data nextcloud php occ app:install social_login
docker exec -u www-data nextcloud php occ app:list
docker exec -u www-data nextcloud php occ config:system:set trusted_domains 1 --value=localhost
```

---

## Convenção de evidências

Toda evidência capturada segue nomenclatura estrita. Nunca renomeie ou reorganize esses arquivos.

| Ferramenta | Arquivo esperado | Localização |
|---|---|---|
| Authentik (dashboard) | `evidencia-authentik.png` | `authentik/evidencias/` |
| Authentik (fluxo SSO) | `evidencia-authentik-fluxo.png` | `authentik/evidencias/` |
| Nextcloud (dashboard) | `evidencia-nextcloud.png` | `nextcloud/evidencias/` |
| Nextcloud (SSO funcional) | `evidencia-nextcloud-sso.png` | `nextcloud/evidencias/` |
| Vaultwarden (dashboard) | `evidencia-vaultwarden.png` | `vaultwarden/evidencias/` |
| Wazuh (dashboard) | `dashboard-wazuh.png` | `wazuh/docs/` |
| Wazuh (manual do agente) | `wazuh-manual-agente.pdf` | `wazuh/docs/` |

**Conteúdo mínimo de cada evidência:**
- `evidencia-nextcloud.png` — dashboard logado como admin com arquivo enviado visível
- `evidencia-nextcloud-sso.png` — dashboard com usuário `pcsi-user` logado via Authentik (sem senha digitada no Nextcloud)

---

## Integração SSO — Authentik + Nextcloud

A única integração entre serviços neste projeto é o SSO via OIDC entre Authentik (IdP) e Nextcloud (SP).

**Referência completa:** `docs/authentik-nextcloud-oidc.md`

**Resumo da configuração:**

No Authentik (`http://localhost:9000`):
- Application: `Nextcloud`
- Provider type: OAuth2/OpenID Connect
- Client type: Confidential
- Redirect URI: `http://localhost:8080/apps/social_login/custom_oidc/authentik/callback`
- Scopes: `openid email profile`

No Nextcloud (`http://localhost:8080`):
- App `social_login` instalado via `occ`
- Provider interno nomeado `authentik`
- Authorize URL: `http://localhost:9000/application/o/nextcloud/authorize/`
- Token URL: `http://localhost:9000/application/o/token/`
- User info URL: `http://localhost:9000/application/o/userinfo/`

**Critério de sucesso do SSO:** usuário faz login no Authentik e o Nextcloud abre com sessão ativa, sem que a senha do Nextcloud tenha sido digitada.

---

## O que está fora do escopo

Se uma tarefa envolver qualquer item abaixo, recuse e sinalize para o responsável humano:

- Orquestração de containers (Kubernetes, Swarm, Portainer)
- Integração Vaultwarden + Authentik via OIDC (mapeado como extensão futura, não prioritário para o prazo)
- Configuração de HTTPS nos serviços locais
- Ambiente de produção ou VPS remota
- Instalação do agente Wazuh em múltiplas máquinas (o manual existe em `wazuh/docs/wazuh-manual-agente.pdf`)
- Ferramentas adicionais: OpenVAS, Suricata, SonarQube
- Alteração da estrutura de pastas do repositório

---

## Entregas pendentes e prioridade

Execute nesta ordem. Cada item é pré-requisito do próximo.

1. **`nextcloud/docker-compose.yml`** — criar o stack Nextcloud + MariaDB funcional na porta 8080
2. **`nextcloud/evidencias/evidencia-nextcloud.png`** — dashboard admin com upload visível
3. **SSO Authentik + Nextcloud** — instalar `social_login`, configurar provider OIDC, testar fluxo completo
4. **`nextcloud/evidencias/evidencia-nextcloud-sso.png`** — fluxo SSO completo documentado
5. **`docs/databook.md`** — documento técnico com seções de todas as quatro ferramentas
6. **`docs/roteiro-video.md`** — roteiro do vídeo de demonstração
7. **`docs/qa-checklist.md`** — checklist de entrega preenchido

---

## Troubleshooting rápido

**Container não sobe:**
```bash
docker compose logs {nome-do-container}
```
Verifique conflito de porta com `lsof -i :{porta}` ou `docker ps | grep {porta}`.

**Nextcloud retorna 500 após redirect de SSO:**
```bash
docker exec -u www-data nextcloud php occ log:tail
```
Verifique se o Client Secret foi copiado corretamente do provider no Authentik.

**Wazuh não responde em :443:**
Aguarde 2–3 minutos após `docker compose up -d`. O indexer (OpenSearch) demora para inicializar. Se persistir, verifique RAM disponível — Wazuh precisa de 4 GB.

**"redirect_uri mismatch" no Authentik durante SSO:**
A URI configurada no provider deve ser exatamente:
```
http://localhost:8080/apps/social_login/custom_oidc/authentik/callback
```
Sem barra no final, sem `https`.

**Porta em conflito:**
```bash
# Identificar processo usando a porta
lsof -i :{porta}

# Ou via docker
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

---

## Critérios de aceite por entrega

### Para a i9+

| Entrega | Critério mínimo |
|---|---|
| Authentik | Acessível em :9000, 3 usuários criados, SSO com Nextcloud funcional |
| Nextcloud | Acessível em :8080, upload demonstrado, login via Authentik ativo |
| Vaultwarden | Acessível em :8082, cofre com credencial de exemplo |
| Wazuh | Dashboard com métrica ativa em :443, manual do agente no repositório |
| Databook | Seções de todas as quatro ferramentas em `docs/databook.md` |

### Para o professor Rafael

| Entrega | Critério mínimo |
|---|---|
| Repositório | Acesso de leitura ao `sat-infrastructure` com todos os artefatos |
| Roteiro | `docs/roteiro-video.md` com link compartilhável |
| Vídeo | Todos os 15 alunos creditados, depoimento da i9+, sem marcas proibidas |
| Instagram | Post publicado antes de 25/05 às 17h com @extensaoup e @mestrerafael47 |

### Regras obrigatórias do vídeo

- Não pode conter a marca da i9+ sem autorização prévia
- Não pode conter a marca da Universidade Positivo ou Cruzeiro do Sul
- Todos os alunos devem ser creditados e aparecer explicando o projeto
- Depoimento de Alessandro ou Sandro (i9+) é obrigatório para nota máxima