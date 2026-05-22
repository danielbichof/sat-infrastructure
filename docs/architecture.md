# Spec de Arquitetura — sat-infrastructure
**PCSI+ | Extensão Universitária | Universidade Positivo**
**Versão 1.0 | Maio de 2026**

---

## 1. Modelo de deployment

O ecossistema não tem host compartilhado. Cada serviço roda na máquina local do responsável pela squad, isolado por Docker Compose. O repositório `sat-infrastructure` é a fonte única de artefatos, configurações e evidências.

```
Desenvolvedor (máquina local)
├── Docker Engine
│   ├── authentik/     → docker compose up -d  (porta 9000)
│   ├── nextcloud/     → docker compose up -d  (porta 8080)
│   ├── vaultwarden/   → docker compose up -d  (porta 8082)
│   └── wazuh/         → docker compose up -d  (porta 443)
└── Browser            → http://localhost:{porta}
```

Para a gravação do vídeo de demonstração, todos os serviços precisam rodar simultaneamente em uma única máquina com mínimo de 12 GB de RAM.

---

## 2. Arquitetura de containers

### 2.1 Authentik

| Campo | Valor |
|---|---|
| Imagem | `ghcr.io/goauthentik/server` |
| Versão | Latest (ver docker-compose.yml) |
| Porta exposta | 9000 (HTTP) |
| Papel | IdP — emite tokens OIDC para serviços integrados |

**Containers do stack:**

```
authentik-server     ← aplicação principal (porta 9000)
authentik-worker     ← background tasks (emails, fluxos assíncronos)
postgresql           ← banco de dados relacional
redis                ← cache e filas de tarefas
```

**Rede Docker:** `authentik-net` (bridge, isolada)

**Volumes persistentes:**
```
authentik_db     → dados do PostgreSQL
authentik_redis  → dados do Redis
authentik_media  → arquivos de mídia (logos, certificados)
```

**RAM estimada:** ~2 GB (server + worker + postgres + redis)

---

### 2.2 Nextcloud

| Campo | Valor |
|---|---|
| Imagem | `nextcloud:28` |
| Porta exposta | 8080 (HTTP) |
| Papel | Plataforma de compartilhamento de arquivos com SSO |

**Containers do stack:**

```
nextcloud     ← aplicação PHP/Apache (porta 8080)
nextcloud-db  ← MariaDB 10.11
```

**Rede Docker:** `nextcloud-net` (bridge, isolada)

**Volumes persistentes:**
```
nextcloud_data  → arquivos e configurações da aplicação
nextcloud_db    → dados do MariaDB
```

**App adicional:** `social_login` instalado via `occ` para aceitar tokens OIDC do Authentik.

**RAM estimada:** ~1 GB

---

### 2.3 Vaultwarden

| Campo | Valor |
|---|---|
| Imagem | `vaultwarden/server:latest` |
| Porta exposta | 8082 (HTTP) |
| Papel | Cofre de senhas (alternativa open source ao Bitwarden) |

**Containers do stack:**

```
vaultwarden   ← aplicação standalone (porta 8082)
```

**Rede Docker:** `vaultwarden-net` (bridge, isolada)

**Volumes persistentes:**
```
vaultwarden_data  → banco SQLite + chaves de criptografia
```

**RAM estimada:** ~0.2 GB

---

### 2.4 Wazuh

| Campo | Valor |
|---|---|
| Imagem | `wazuh/wazuh-manager`, `wazuh/wazuh-indexer`, `wazuh/wazuh-dashboard` |
| Porta exposta | 443 (HTTPS) |
| Papel | SIEM — coleta e analisa eventos de segurança dos endpoints |

**Containers do stack:**

```
wazuh-manager    ← coleta e processa eventos dos agentes
wazuh-indexer    ← OpenSearch (armazenamento e indexação)
wazuh-dashboard  ← interface web (porta 443)
```

**Rede Docker:** `wazuh-net` (bridge, isolada)

**Volumes persistentes:**
```
wazuh_manager_data   → regras, decoders, logs dos agentes
wazuh_indexer_data   → índices OpenSearch
wazuh_dashboard_data → configurações do dashboard
```

**RAM estimada:** 4 a 6 GB

---

## 3. Topologia de rede

Cada serviço opera em uma rede Docker isolada. Não há roteamento entre redes. A única comunicação entre serviços ocorre via HTTP entre o browser do usuário e os serviços individuais, com exceção do fluxo OIDC descrito na seção 4.

```
┌─────────────────────────────────────────────────────┐
│                    localhost                         │
│                                                      │
│  authentik-net    nextcloud-net    vaultwarden-net   │
│  ┌──────────┐    ┌───────────┐    ┌─────────────┐   │
│  │Authentik │    │ Nextcloud │    │ Vaultwarden │   │
│  │  :9000   │    │   :8080   │    │    :8082    │   │
│  └──────────┘    └───────────┘    └─────────────┘   │
│                                                      │
│  wazuh-net                                           │
│  ┌──────────────────────────┐                        │
│  │          Wazuh           │                        │
│  │          :443            │                        │
│  └──────────────────────────┘                        │
└─────────────────────────────────────────────────────┘
                    │
              Browser do usuário
```

---

## 4. Arquitetura de integração — SSO via OIDC

### 4.1 Componentes

| Componente | Papel no fluxo |
|---|---|
| Authentik | IdP: verifica identidade e emite tokens OIDC |
| Nextcloud | Service Provider (SP): consome o token e cria sessão |
| social_login (app) | Plugin do Nextcloud que implementa o cliente OIDC |

### 4.2 Configuração do Authentik

```
Application: Nextcloud
  └── Provider: Nextcloud OIDC Provider
        ├── Type: OAuth2/OpenID Connect
        ├── Client type: Confidential
        ├── Redirect URI: http://localhost:8080/apps/social_login/custom_oidc/authentik/callback
        └── Scopes: openid, email, profile
```

### 4.3 Configuração do Nextcloud

```
Social Login > Custom OpenID Connect
  ├── Internal name: authentik
  ├── Authorize URL: http://localhost:9000/application/o/nextcloud/authorize/
  ├── Token URL:     http://localhost:9000/application/o/token/
  ├── User info URL: http://localhost:9000/application/o/userinfo/
  ├── Client ID:     {valor do provider no Authentik}
  ├── Client Secret: {valor do provider no Authentik}
  └── Scope:         openid email profile
```

### 4.4 Fluxo de autenticação (passo a passo)

```
1. Usuário acessa http://localhost:8080
2. Nextcloud renderiza tela de login com botão "Login com Authentik"
3. Usuário clica no botão
4. Nextcloud redireciona para:
   http://localhost:9000/application/o/nextcloud/authorize/
   ?response_type=code
   &client_id={client_id}
   &redirect_uri=http://localhost:8080/apps/social_login/...
   &scope=openid email profile
5. Authentik autentica o usuário (senha, MFA se configurado)
6. Authentik redireciona para o Nextcloud com um authorization code
7. Nextcloud troca o code por um access token (chamada server-side)
8. Nextcloud chama /userinfo para obter email e nome do usuário
9. Nextcloud cria ou localiza o usuário e inicia a sessão
10. Usuário acessa o dashboard do Nextcloud sem ter digitado senha nele
```

### 4.5 Referência de implementação

`docs/authentik-nextcloud-oidc.md`

---

## 5. Estrutura do repositório

```
sat-infrastructure/
├── README.md                           ← Visão geral e instruções de acesso
├── LICENSE
│
├── authentik/
│   ├── docker-compose.yml              ← Stack: server, worker, postgres, redis
│   ├── README.md
│   ├── certs/                          ← Certificados TLS (gerados pelo Authentik)
│   ├── custom-templates/               ← Templates HTML customizados
│   ├── data/                           ← Volume montado de mídia
│   ├── evidencias/
│   │   ├── evidencia-authentik.png     ← Dashboard + usuários
│   │   └── evidencia-authentik-fluxo.png ← Fluxo SSO configurado
│   └── scripts/
│       └── capture-evidence.mjs        ← Script Puppeteer de captura automática
│
├── nextcloud/
│   ├── docker-compose.yml              ← Stack: nextcloud, mariadb
│   ├── README.md
│   └── evidencias/
│       ├── evidencia-nextcloud.png     ← Dashboard + upload de arquivo
│       └── evidencia-nextcloud-sso.png ← Login via Authentik
│
├── vaultwarden/
│   ├── docker-compose.yml              ← Stack: vaultwarden (standalone)
│   ├── README.md
│   └── evidencias/
│       └── evidencia-vaultwarden.png   ← Dashboard + cofre com credenciais
│
├── wazuh/
│   ├── docker-compose.yml              ← Stack: manager, indexer, dashboard
│   ├── README.md
│   └── docs/
│       ├── dashboard-wazuh.png         ← Dashboard com métrica ativa
│       └── wazuh-manual-agente.pdf     ← Instruções de instalação do agente
│
└── docs/
    ├── authentik-nextcloud-oidc.md     ← Guia de integração SSO (concluído)
    ├── reanalise-arquitetura-pcsi.md   ← Análise de viabilidade da arquitetura
    ├── databook.md                     ← Documento técnico para a i9+ (pendente)
    ├── roteiro-video.md                ← Roteiro do vídeo de demonstração (pendente)
    └── qa-checklist.md                 ← Checklist de entrega (pendente)
```

---

## 6. Requisitos de ambiente

### Por squad (desenvolvimento individual)

| Recurso | Mínimo |
|---|---|
| RAM (por serviço) | Variável — ver seção 2 |
| Docker Engine | 24+ |
| Docker Compose | V2 (comando `docker compose`) |
| Acesso à internet | Necessário apenas para pull inicial das imagens |
| SO | Linux, macOS ou Windows com WSL2 |

### Para gravação do vídeo (todos os serviços simultâneos)

| Recurso | Mínimo |
|---|---|
| RAM | 12 GB disponíveis |
| CPU | 4 cores |
| Disco | 20 GB livres |
| Rede | Loopback apenas (sem necessidade de internet durante demo) |

---

## 7. Fronteiras de segurança

Esta é uma POC em ambiente local. As seguintes práticas de segurança estão fora do escopo deliberadamente:

| Prática | Motivo da exclusão |
|---|---|
| HTTPS nos serviços | Sem domínio, certificado auto-assinado criaria atrito na demo |
| Senhas de produção | As credenciais nos docker-compose.yml são de desenvolvimento |
| Isolamento de rede entre hosts | Sem host compartilhado |
| Backup automatizado | Volumes Docker locais, sem SLA |
| MFA obrigatório | Configurável no Authentik, mas não exigido na POC |

Para adoção em produção pela i9+, todos os pontos acima precisam ser endereçados. O Databook (`docs/databook.md`) inclui recomendações específicas para cada um.

---

## 8. Pontos de extensão

| Extensão | Viabilidade | Esforço estimado |
|---|---|---|
| SSO Vaultwarden + Authentik via OIDC | Alta (Vaultwarden suporta OIDC nativo) | 2 a 4 horas |
| HTTPS com Nginx Proxy Manager | Alta | 2 horas |
| Wazuh monitorando múltiplas máquinas | Alta (via agente) | 30 min por máquina |
| Nextcloud com S3 como storage backend | Média | 4 horas |
| Authentikit com LDAP/Active Directory | Alta | 4 a 8 horas |
| Orquestração via Kubernetes | Baixa (complexidade alta sem ganho na POC) | Dias |

---

## 9. Decisões arquiteturais e justificativas

**Por que Docker Compose e não Kubernetes?**
A POC precisa rodar em máquinas de estudantes com hardware variável. Kubernetes exigiria um cluster ou Minikube, adicionando camadas de complexidade sem valor para a demonstração do ecossistema de segurança. Docker Compose é declarativo, reversível e amplamente conhecido.

**Por que sem host compartilhado?**
Coordenar VPS ou servidor compartilhado entre 15 estudantes com prazos curtos cria dependência de disponibilidade, permissões e custo. Cada squad tendo autonomia sobre seu serviço elimina o ponto único de falha de infraestrutura.

**Por que Authentik e não Keycloak?**
Authentik tem interface mais moderna, documentação de SSO mais direta para casos simples, e curva de aprendizado menor para quem não conhece IAM. Keycloak seria mais adequado para produção com LDAP/AD complexo.

**Por que Vaultwarden e não Bitwarden oficial?**
Vaultwarden é um servidor Bitwarden-compatible open source que roda com menos de 200 MB de RAM. O Bitwarden oficial exigiria MSSQL ou PostgreSQL dedicado e múltiplos containers, tornando-o desproporcional para a POC.

**Por que a integração SSO se limita ao Nextcloud?**
A integração Authentik + Nextcloud demonstra o valor do SSO de forma clara e documentada. Adicionar Vaultwarden ao SSO antes do prazo aumentaria o risco de nada funcionar. A extensão está mapeada como ponto de extensão pós-entrega.