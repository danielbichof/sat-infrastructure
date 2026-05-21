# PRD — sat-infrastructure
**Programa Corporativo de Segurança da Informação (PCSI+)**
**Startup i9+ | Extensão Universitária | Universidade Positivo**
**Versão 2.0 | Maio de 2026**

---

## 1. Visão geral

O `sat-infrastructure` é o repositório que centraliza a prova de conceito do PCSI+: um ecossistema de segurança da informação construído com ferramentas open source, configurado via Docker Compose, e documentado para que a startup i9+ possa avaliar e adotar a solução futuramente.

O projeto cumpre dois propósitos simultâneos: validar tecnicamente a arquitetura proposta para a i9+ e atender aos requisitos acadêmicos da disciplina de extensão do professor Rafael, com entrega até **25 de maio de 2026 às 17h**.

---

## 2. Problema

A i9+ opera sem padronização de acessos, sem rastreabilidade de quem acessa o quê, e sem um ponto central de controle de identidades. Colaboradores compartilham senhas por WhatsApp, armazenam projetos em plataformas não auditadas e não têm visibilidade sobre eventos de segurança nos dispositivos da equipe. O PCSI+ demonstra que é possível resolver esses quatro problemas com custo zero em licenças.

---

## 3. Objetivo

Demonstrar um ecossistema funcional de segurança da informação usando Authentik, Nextcloud, Vaultwarden e Wazuh, com evidências documentadas e um Databook técnico que permita à i9+ tomar uma decisão informada sobre adoção.

### Critério de sucesso

Para a i9+: Databook completo e demonstração funcional com SSO via Authentik integrado ao Nextcloud.

Para a disciplina: vídeo bem produzido com demonstração do ecossistema, depoimento de membro da i9+, crédito de todos os alunos e publicação no Instagram antes do prazo.

---

## 4. Stakeholders

| Papel | Identificação | Interesse |
|---|---|---|
| Empresa parceira | i9+ (SLBS) | Validar arquitetura de segurança adotável |
| Representante i9+ | Alessandro ou Sandro | Gravar depoimento para o vídeo final |
| Avaliador acadêmico | Professor Rafael | Aprovar entregas da Etapa 8 |
| Perfis Instagram | @extensaoup, @mestrerafael47 | Marcação obrigatória na publicação |
| Equipe executora | 15 estudantes UP | Entregar POC e aprovação na disciplina |

---

## 5. Escopo

### Dentro do escopo

- Quatro ferramentas open source configuradas via Docker Compose em máquinas locais: Authentik, Nextcloud, Vaultwarden e Wazuh.
- Integração SSO entre Authentik e Nextcloud via OIDC (já documentada em `docs/authentik-nextcloud-oidc.md`).
- Evidências visuais por ferramenta (prints, logs, PDFs) armazenadas em subpastas `evidencias/` de cada ferramenta.
- Script de captura de evidências automatizado para Authentik (`authentik/scripts/capture-evidence.mjs`).
- Databook técnico com arquitetura geral e seção de cada ferramenta.
- Vídeo de demonstração com depoimento da i9+ e crédito dos alunos.
- Publicação no Instagram com marcações obrigatórias.

### Fora do escopo

- Orquestração de containers (Kubernetes, Swarm, Portainer).
- Integração de Vaultwarden com Authentik via OIDC (opcional, não prioritário para o prazo).
- Ambiente de produção ou servidor dedicado.
- Instalação do agente Wazuh em múltiplas máquinas (manual de instalação entregue como alternativa).
- Ferramentas adicionais: OpenVAS, Suricata, SonarQube.

---

## 6. Arquitetura

Cada ferramenta roda de forma independente via Docker Compose na máquina local do responsável pela squad. Não há host compartilhado. O repositório GitHub é a fonte única de artefatos.

```
sat-infrastructure/
├── LICENSE
├── README.md
├── authentik/
│   ├── README.md
│   ├── certs/
│   ├── custom-templates/
│   ├── data/
│   ├── docker-compose.yml
│   ├── evidencias/
│   │   ├── evidencia-authentik-fluxo.png
│   │   └── evidencia-authentik.png
│   └── scripts/
│       └── capture-evidence.mjs
├── nextcloud/                        ← pendente
│   ├── README.md
│   ├── docker-compose.yml
│   └── evidencias/
│       └── evidencia-nextcloud.png
├── vaultwarden/
│   ├── README.md
│   ├── docker-compose.yml
│   └── evidencias/
│       └── evidencia-vaultwarden.png
├── wazuh/
│   ├── README.md
│   ├── docker-compose.yml
│   └── docs/
│       ├── dashboard-wazuh.png
│       └── wazuh-manual-agente.pdf
└── docs/
    ├── authentik-nextcloud-oidc.md
    ├── reanalise-arquitetura-pcsi.md
    ├── databook.md                   ← pendente
    ├── roteiro-video.md              ← pendente
    └── qa-checklist.md              ← pendente
```

### Ferramentas e problema resolvido

| Ferramenta | Problema resolvido | Porta local | Status |
|---|---|---|---|
| Authentik | Ausência de identidade centralizada e SSO | :9000 | Configurado |
| Nextcloud | Compartilhamento não rastreável de arquivos | :8080 | Pendente |
| Vaultwarden | Distribuição insegura de credenciais | :8082 | Configurado |
| Wazuh | Falta de visibilidade sobre eventos de segurança | :443 | Configurado |

### Fluxo de integração (SSO)

```
Usuário (browser)
    |
    | login único
    v
Authentik (IdP)
    |
    | token OIDC
    v
Nextcloud ← aceita o token sem senha própria
```

Referência de implementação: `docs/authentik-nextcloud-oidc.md`

### Consumo de RAM estimado

| Ferramenta | RAM |
|---|---|
| Authentik | ~2 GB |
| Nextcloud | ~1 GB |
| Vaultwarden | ~0,2 GB |
| Wazuh | 4 a 6 GB |
| **Total simultâneo** | **7 a 9 GB** |

A máquina usada para gravar o vídeo de demonstração precisa de no mínimo 12 GB de RAM para rodar todas as ferramentas ao mesmo tempo.

---

## 7. Status atual

| Entrega | Status | Arquivo de evidência |
|---|---|---|
| Authentik configurado | Concluído | `authentik/evidencias/evidencia-authentik.png` |
| Authentik fluxo SSO | Concluído | `authentik/evidencias/evidencia-authentik-fluxo.png` |
| Script de captura automática | Concluído | `authentik/scripts/capture-evidence.mjs` |
| Documentação SSO OIDC | Concluído | `docs/authentik-nextcloud-oidc.md` |
| Vaultwarden configurado | Concluído | `vaultwarden/evidencias/evidencia-vaultwarden.png` |
| Wazuh configurado | Concluído | `wazuh/docs/dashboard-wazuh.png` |
| Manual do agente Wazuh | Concluído | `wazuh/docs/wazuh-manual-agente.pdf` |
| Nextcloud configurado | **Pendente** | |
| Integração SSO Authentik + Nextcloud | **Pendente** | |
| Databook | **Pendente** | `docs/databook.md` |
| Roteiro do vídeo | **Pendente** | `docs/roteiro-video.md` |
| QA checklist | **Pendente** | `docs/qa-checklist.md` |
| Vídeo de demonstração | **Pendente** | |
| Post no Instagram | **Pendente** | |

---

## 8. Entregas e critérios de aceite

### Técnicas (para a i9+)

| Artefato | Critério mínimo |
|---|---|
| Authentik | Acessível via browser, 3 perfis de usuário criados, SSO com Nextcloud funcional |
| Nextcloud | Acessível via browser, upload de arquivo demonstrado, login via Authentik ativo |
| Vaultwarden | Acessível via browser, cofre com credenciais de exemplo |
| Wazuh | Dashboard com métrica ativa, manual do agente disponível no repo |
| Databook | Arquitetura geral e seção de cada ferramenta em `docs/databook.md` |

### Acadêmicas (para o professor Rafael)

| Artefato | Critério mínimo |
|---|---|
| Pasta do projeto | Link do repositório `sat-infrastructure` com acesso de leitura |
| Roteiro do vídeo | Arquivo `docs/roteiro-video.md` com link compartilhável |
| Vídeo | Alunos creditados e explicando, depoimento da i9+, sem marcas proibidas |
| Instagram | Publicação com @extensaoup e @mestrerafael47 marcados, link permanente disponível |

### Regras obrigatórias do vídeo

O vídeo não pode conter a marca da i9+ sem autorização prévia.
O vídeo não pode conter a marca da Universidade Positivo ou Cruzeiro do Sul.
Todos os alunos devem ser creditados e aparecer explicando o projeto.
O depoimento de Alessandro ou Sandro é obrigatório para a nota máxima.

---

## 9. Cronograma restante

Referência: hoje é 20 de maio de 2026. Restam 4 dias úteis.

| Data | Entrega esperada |
|---|---|
| 20/05 (hoje) | Nextcloud configurado e SSO com Authentik ativado |
| 21/05 | Databook completo, roteiro do vídeo finalizado |
| 21 a 22/05 | Gravação das cenas com os alunos e recebimento do depoimento da i9+ |
| 22/05 | Edição e aprovação do vídeo final |
| 23 a 24/05 | Revisão de QA, checklist preenchido |
| 25/05 até 17h | Post no Instagram, links consolidados e entregues ao professor Rafael |

---

## 10. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Nextcloud não configurado a tempo | Alto | Executar no Dia 20/05, é a última ferramenta pendente |
| SSO Authentik + Nextcloud não funcionar | Alto | `docs/authentik-nextcloud-oidc.md` já documenta os passos |
| Depoimento da i9+ não chegar a tempo | Crítico | Confirmar status hoje com Alessandro ou Sandro |
| Máquina de vídeo sem RAM suficiente | Alto | Identificar a máquina com 12 GB+ antes de 21/05 |
| Edição do vídeo atrasada | Alto | Vídeo aprovado até 22/05 — 25/05 só para publicação e envio |

---

## 11. Restrições técnicas

Cada ferramenta usa docker-compose com imagem oficial. Nenhum Dockerfile customizado.

Não há host compartilhado. Cada responsável executa na própria máquina.

Não há orquestração de containers.

A integração entre ferramentas se limita ao SSO via OIDC entre Authentik e Nextcloud.

O repositório `sat-infrastructure` é a fonte única de artefatos do projeto.

---

## 12. Processo de captura de evidências

O projeto adota captura automatizada de evidências via script Node.js (`authentik/scripts/capture-evidence.mjs`). Squads de outras ferramentas podem usar a mesma abordagem ou captura manual seguindo o padrão de nomenclatura:

| Ferramenta | Arquivo esperado | Localização |
|---|---|---|
| Authentik | `evidencia-authentik.png` | `authentik/evidencias/` |
| Authentik (fluxo SSO) | `evidencia-authentik-fluxo.png` | `authentik/evidencias/` |
| Nextcloud | `evidencia-nextcloud.png` | `nextcloud/evidencias/` |
| Vaultwarden | `evidencia-vaultwarden.png` | `vaultwarden/evidencias/` |
| Wazuh (dashboard) | `dashboard-wazuh.png` | `wazuh/docs/` |
| Wazuh (agente) | `wazuh-manual-agente.pdf` | `wazuh/docs/` |

---

## 13. Glossário

**POC (Prova de Conceito):** Demonstração funcional de uma solução em ambiente controlado, sem intenção de uso em produção imediata.

**OIDC (OpenID Connect):** Protocolo de autenticação baseado em OAuth 2.0 que permite que um serviço confie na identidade verificada por outro. Usado aqui para que o Nextcloud aceite o login feito no Authentik.

**IdP (Identity Provider):** Serviço responsável por verificar a identidade do usuário e emitir tokens de acesso. No PCSI+, esse papel é do Authentik.

**SSO (Single Sign-On):** Autenticação única que dá acesso a múltiplos serviços. O usuário loga uma vez no Authentik e acessa Nextcloud sem precisar de senha separada.

**Docker Compose:** Ferramenta que permite configurar e subir aplicações em containers a partir de um arquivo declarativo (`docker-compose.yml`).

**Databook:** Documento técnico consolidado com arquitetura, configurações e recomendações, servindo de referência para adoção futura pela i9+.

---

*Documento mantido em `docs/PRD.md` no repositório `sat-infrastructure`.*
*Última atualização: 20 de maio de 2026.*
