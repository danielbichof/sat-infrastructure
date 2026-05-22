# Spec Técnica — Databook (docs/databook.md)
**sat-infrastructure / PCSI+**
**Responsável:** Daniel
**Prazo:** 21/05/2026 (hoje)
**Pré-requisito:** Todas as ferramentas funcionando (ou ao menos com evidências em mãos)

---

## Objetivo

Produzir o arquivo `docs/databook.md` com arquitetura geral e uma seção por ferramenta, servindo como referência técnica para a i9+ tomar decisão de adoção.

---

## Estrutura obrigatória do Databook

```
docs/databook.md
├── Capa / Metadados
├── 1. Visão geral do PCSI+
├── 2. Arquitetura geral
├── 3. Authentik
├── 4. Nextcloud
├── 5. Vaultwarden
├── 6. Wazuh
└── 7. Recomendações para adoção
```

---

## Template completo

Copie o bloco abaixo e preencha os campos marcados com `[...]`:

```markdown
# Databook Técnico — PCSI+
**Programa Corporativo de Segurança da Informação**
**Startup i9+ | Extensão Universitária | Universidade Positivo**
**Versão 1.0 | Maio de 2026**

---

## 1. Visão geral

O PCSI+ demonstra que uma startup de pequeno porte pode resolver quatro problemas críticos de segurança da informação com custo zero em licenças: ausência de identidade centralizada, compartilhamento não rastreável de arquivos, distribuição insegura de credenciais e falta de visibilidade sobre eventos de segurança.

O ecossistema é composto por quatro ferramentas open source configuradas via Docker Compose: Authentik, Nextcloud, Vaultwarden e Wazuh.

---

## 2. Arquitetura geral

Cada ferramenta opera de forma independente em container Docker. A única integração entre ferramentas é o SSO via OIDC entre Authentik (IdP) e Nextcloud.

| Ferramenta | Problema resolvido | Porta | RAM estimada |
|---|---|---|---|
| Authentik | Ausência de identidade centralizada e SSO | :9000 | ~2 GB |
| Nextcloud | Compartilhamento não rastreável de arquivos | :8080 | ~1 GB |
| Vaultwarden | Distribuição insegura de credenciais | :8082 | ~0,2 GB |
| Wazuh | Falta de visibilidade sobre eventos de segurança | :443 | 4 a 6 GB |

**Requisito mínimo de hardware para rodar o ecossistema completo:** 12 GB de RAM.

### Diagrama de integração

```
Usuário (browser)
    |
    | 1. login único
    v
Authentik (IdP) :9000
    |
    | 2. token OIDC
    v
Nextcloud :8080  ←  aceita o token sem senha própria
```

Vaultwarden e Wazuh operam de forma independente, sem integração com o Authentik nesta POC.

---

## 3. Authentik

### O que resolve

Centraliza a autenticação da equipe. Com o Authentik, cada colaborador tem um único usuário que dá acesso a múltiplos serviços. Elimina o problema de contas compartilhadas e senhas enviadas por WhatsApp.

### Como foi configurado

[Descreva brevemente: versão da imagem Docker usada, porta, volumes, variáveis de ambiente principais. Pode referenciar o docker-compose.yml do repositório.]

### Evidências

- Dashboard acessível: `authentik/evidencias/evidencia-authentik.png`
- Fluxo SSO configurado: `authentik/evidencias/evidencia-authentik-fluxo.png`

### Recomendações para a i9+

- Criar um grupo por função (dev, design, gestão) e atribuir permissões por grupo, não por usuário
- Ativar MFA (autenticação em dois fatores) para todos os colaboradores
- Configurar integração futura com Vaultwarden via OIDC (não coberta nesta POC)

---

## 4. Nextcloud

### O que resolve

Substitui o Google Drive ou Notion não auditado por uma plataforma de compartilhamento de arquivos com rastreabilidade completa: quem enviou, quando, quem acessou.

### Como foi configurado

[Descreva: versão, porta 8080, banco MariaDB, variáveis NEXTCLOUD_ADMIN_USER, app social_login instalado para OIDC.]

### Integração com Authentik

O login no Nextcloud é feito via Authentik. O usuário clica em "Login com Authentik", é redirecionado para o Authentik, autentica uma vez e retorna ao Nextcloud com sessão ativa, sem senha separada.

### Evidências

- Dashboard acessível: `nextcloud/evidencias/evidencia-nextcloud.png`
- Fluxo SSO funcional: `nextcloud/evidencias/evidencia-nextcloud-sso.png`

### Recomendações para a i9+

- Criar pastas por projeto com permissões por grupo (alinhado com os grupos do Authentik)
- Ativar versionamento de arquivos para rastrear alterações
- Configurar backup automático do volume Docker em solução de armazenamento externa

---

## 5. Vaultwarden

### O que resolve

Elimina o compartilhamento de senhas por WhatsApp ou planilhas. Cada colaborador tem acesso a cofres compartilhados com as credenciais de serviços da empresa, sem precisar ver a senha em texto puro.

### Como foi configurado

[Descreva: versão, porta 8082, variável SIGNUPS_ALLOWED, ADMIN_TOKEN.]

### Evidências

- Dashboard acessível: `vaultwarden/evidencias/evidencia-vaultwarden.png`

### Recomendações para a i9+

- Desativar cadastro público (`SIGNUPS_ALLOWED=false`) e criar contas manualmente
- Criar organizações no Vaultwarden para separar cofres por projeto ou cliente
- Integrar com Authentik via OIDC como evolução futura (fora do escopo desta POC)

---

## 6. Wazuh

### O que resolve

Monitora eventos de segurança nos dispositivos da equipe: tentativas de login, alterações de arquivos críticos, execução de processos suspeitos. Dá visibilidade sobre o que acontece nos endpoints da empresa.

### Como foi configurado

[Descreva: versão, porta 443, RAM necessária (4 a 6 GB), referência ao docker-compose.yml.]

### Instalação do agente

A instalação do agente Wazuh nos dispositivos da equipe está documentada em `wazuh/docs/wazuh-manual-agente.pdf`. O agente precisa ser instalado em cada máquina que se deseja monitorar.

### Evidências

- Dashboard com métrica ativa: `wazuh/docs/dashboard-wazuh.png`
- Manual do agente: `wazuh/docs/wazuh-manual-agente.pdf`

### Recomendações para a i9+

- Instalar o agente Wazuh em todas as máquinas da equipe seguindo o manual
- Configurar alertas por email para eventos críticos (tentativas de login com falha, rootkit detection)
- Reservar uma máquina dedicada para o Wazuh em produção, dado o consumo de RAM

---

## 7. Recomendações para adoção

### Ordem de adoção sugerida

1. **Authentik** — base de tudo. Configure primeiro, crie os usuários e grupos da equipe.
2. **Vaultwarden** — impacto imediato. Migre as senhas compartilhadas para cofres em uma semana.
3. **Nextcloud** — substitua as ferramentas de compartilhamento não auditadas gradualmente.
4. **Wazuh** — instale o agente nas máquinas da equipe após os três anteriores estarem estáveis.

### Infraestrutura mínima para produção

- Um servidor com 12 GB de RAM e 100 GB de disco (ou VPS equivalente)
- Domínio próprio com HTTPS (Let's Encrypt via Traefik ou Nginx Proxy Manager)
- Backup diário dos volumes Docker

### Custo estimado

| Item | Custo |
|---|---|
| Licenças de software | R$ 0 (tudo open source) |
| VPS mínima (ex: Hetzner CX21) | ~R$ 80/mês |
| Domínio | ~R$ 50/ano |
| **Total aproximado** | **~R$ 80/mês** |

### O que esta POC não cobre

- Alta disponibilidade e redundância
- Backup automatizado
- HTTPS com domínio próprio
- Integração Vaultwarden + Authentik via OIDC
- Monitoramento de múltiplas máquinas com Wazuh

---

*Documento produzido como parte do PCSI+ — Programa Corporativo de Segurança da Informação*
*Extensão Universitária | Universidade Positivo | Maio de 2026*
```

---

## Campos que precisam ser preenchidos manualmente

Após copiar o template, preencha os trechos marcados com `[...]` consultando os `docker-compose.yml` de cada ferramenta no repositório. São apenas descrições curtas — 3 a 5 linhas por ferramenta.

| Seção | O que preencher | Onde buscar |
|---|---|---|
| Authentik | Versão da imagem, volumes, variáveis principais | `authentik/docker-compose.yml` |
| Nextcloud | Versão, banco, app social_login | `nextcloud/docker-compose.yml` |
| Vaultwarden | Versão, porta, variáveis de admin | `vaultwarden/docker-compose.yml` |
| Wazuh | Versão, RAM, porta | `wazuh/docker-compose.yml` |

---

## Saída esperada deste spec

- `docs/databook.md` criado e commitado no repositório
- Todas as seções preenchidas, incluindo referências às evidências de cada ferramenta
- Documento legível por um não-técnico da i9+ (Alessandro ou Sandro)