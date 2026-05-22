# Databook PCSI+

## 1. Visão geral da arquitetura

O PCSI+ demonstra um ecossistema mínimo de segurança da informação com quatro ferramentas open source rodando localmente via Docker Compose, sem orquestração e sem host compartilhado. A arquitetura prioriza dois objetivos:

- Centralizar identidades e acessos (Authentik + SSO com Nextcloud)
- Dar rastreabilidade e visibilidade sobre arquivos, credenciais e eventos de segurança

Ferramentas:

- Authentik (IdP central + SSO)
- Nextcloud (arquivos e colaboração com rastreabilidade)
- Vaultwarden (cofre de credenciais)
- Wazuh (monitoramento e telemetria de segurança)

## 2. Authentik

**Problema resolvido:** ausência de identidade centralizada e SSO.

**Como acessar:** http://localhost:9000

**Função na POC:** autenticar usuários e emitir tokens OIDC para o Nextcloud.

**Evidências:**
- authentik/evidencias/evidencia-authentik.png
- authentik/evidencias/evidencia-authentik-fluxo.png

## 3. Nextcloud

**Problema resolvido:** compartilhamento não rastreável de arquivos.

**Como acessar:** http://localhost:8080

**Função na POC:** armazenamento e colaboração com autenticação via Authentik (SSO OIDC).

**Evidências:**
- nextcloud/evidencias/evidencia-nextcloud.png

## 4. Vaultwarden

**Problema resolvido:** distribuição insegura de credenciais.

**Como acessar:** https://localhost:8443

**Função na POC:** cofre centralizado de senhas e credenciais compartilhadas.

**Evidências:**
- vaultwarden/evidencias/evidencia-vaultwarden.png

## 5. Wazuh

**Problema resolvido:** falta de visibilidade sobre eventos de segurança.

**Como acessar:** https://localhost

**Função na POC:** dashboard e visibilidade de eventos, logs e alertas de segurança.

**Evidências:**
- wazuh/docs/dashboard-wazuh.png
- wazuh/docs/wazuh-manual-agente.pdf

## 6. Integração SSO (Authentik + Nextcloud)

Fluxo resumido:

1) Usuário acessa o Nextcloud
2) Nextcloud redireciona para o Authentik (OIDC)
3) Authentik autentica e emite token
4) Nextcloud aceita o token e inicia sessão

Guia completo: docs/authentik-nextcloud-oidc.md

## 7. Pontos de evolução

- Integrar Vaultwarden ao Authentik via OIDC (opcional)
- Automatizar captura de evidências do Nextcloud
- Criar ambiente de produção com servidor dedicado
