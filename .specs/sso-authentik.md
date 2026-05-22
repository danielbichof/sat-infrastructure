# Spec Técnica — SSO Authentik + Nextcloud (OIDC)
**sat-infrastructure / PCSI+**
**Responsável:** Daniel
**Prazo:** 21/05/2026 (hoje)
**Pré-requisito:** Nextcloud rodando em `http://localhost:8080` (spec-nextcloud.md concluída)

---

## Objetivo

Configurar o SSO entre Authentik (IdP) e Nextcloud via OIDC, de modo que o usuário faça login uma única vez no Authentik e acesse o Nextcloud sem senha separada. Capturar evidência do fluxo funcional.

---

## Visão geral do fluxo

```
Browser
  |
  | 1. acessa http://localhost:8080
  v
Nextcloud
  |
  | 2. redireciona para login Authentik
  v
Authentik (http://localhost:9000)
  |
  | 3. autentica usuário
  | 4. retorna token OIDC
  v
Nextcloud
  |
  | 5. aceita token, cria sessão
  v
Dashboard do Nextcloud (logado)
```

---

## Parte 1 — Configurar Authentik como IdP

### 1.1 Criar Application no Authentik

1. Acesse `http://localhost:9000` e faça login como admin
2. Vá em **Applications > Applications**
3. Clique em **Create with wizard**
4. Preencha:
   - Name: `Nextcloud`
   - Slug: `nextcloud`
5. Avance para o próximo passo

### 1.2 Criar Provider OIDC

Na tela do wizard (ou em **Applications > Providers > Create**):

- Provider type: **OAuth2/OpenID Connect Provider**
- Name: `Nextcloud OIDC Provider`
- Authorization flow: `default-authorization-flow`
- Client type: `Confidential`
- Redirect URIs:
  ```
  http://localhost:8080/apps/social_login/custom_oidc/authentik/callback
  ```
- Scopes: marque `email`, `openid`, `profile`
- Clique em **Finish** ou **Save**

### 1.3 Copiar credenciais do Provider

Após criar, abra o provider e anote:
- **Client ID** (ex: `abc123xyz`)
- **Client Secret** (ex: `def456uvw`)
- **OpenID Configuration URL**: `http://localhost:9000/application/o/nextcloud/.well-known/openid-configuration`

Guarde esses três valores. Serão usados na Parte 2.

---

## Parte 2 — Configurar Nextcloud para aceitar OIDC

### 2.1 Instalar app Social Login

O Nextcloud precisa do app `social_login` para aceitar OIDC externo.

```bash
docker exec -u www-data nextcloud php occ app:install social_login
```

Verifique se foi instalado:

```bash
docker exec -u www-data nextcloud php occ app:list | grep social
```

Saída esperada: `- social_login: x.x.x`

### 2.2 Configurar o provider OIDC no Nextcloud

1. Acesse `http://localhost:8080` logado como `admin`
2. Vá em **Configurações (ícone de usuário) > Administração > Social login**
3. Role até a seção **Custom OpenID Connect**
4. Clique em **Add custom OpenID Connect**
5. Preencha:

| Campo | Valor |
|---|---|
| Internal name | `authentik` |
| Title | `Login com Authentik` |
| Authorize URL | `http://localhost:9000/application/o/nextcloud/authorize/` |
| Token URL | `http://localhost:9000/application/o/token/` |
| User info URL | `http://localhost:9000/application/o/userinfo/` |
| Client ID | (o que você copiou no passo 1.3) |
| Client Secret | (o que você copiou no passo 1.3) |
| Scope | `openid email profile` |
| Groups claim (opcional) | deixe vazio |

6. Clique em **Save**

### 2.3 Ajustar configuração de redirecionamento (se necessário)

Se o Nextcloud reclamar de trusted domain durante o redirect, execute:

```bash
docker exec -u www-data nextcloud php occ config:system:set trusted_domains 1 --value=localhost
```

---

## Parte 3 — Criar usuário de teste no Authentik

O usuário precisa existir no Authentik para completar o fluxo SSO.

1. Acesse `http://localhost:9000`
2. Vá em **Directory > Users > Create**
3. Preencha:
   - Username: `pcsi-user`
   - Email: `pcsi@pcsi.local`
   - Name: `PCSI User`
4. Salve e defina uma senha em **Set Password**

---

## Parte 4 — Testar o fluxo SSO

### 4.1 Teste em aba anônima

Use aba anônima para garantir que não há sessão ativa.

1. Acesse `http://localhost:8080`
2. Na tela de login do Nextcloud, o botão **"Login com Authentik"** deve aparecer abaixo do formulário padrão
3. Clique no botão
4. O browser redireciona para `http://localhost:9000`
5. Faça login com `pcsi-user` e a senha definida
6. Authentik pede autorização (na primeira vez) — clique em **Allow**
7. Browser redireciona de volta para `http://localhost:8080`
8. Nextcloud abre o dashboard logado como `pcsi-user`

Critério de aceite: usuário autenticado no Nextcloud sem ter digitado senha no Nextcloud.

### 4.2 Verificar usuário criado automaticamente

Após o fluxo acima, verifique no Nextcloud:

1. Admin > Usuários
2. O usuário `pcsi-user` deve aparecer na lista, criado automaticamente pelo social_login

---

## Parte 5 — Capturar evidência do fluxo SSO

A evidência precisa mostrar o Nextcloud com o usuário `pcsi-user` logado via Authentik.

Caminho esperado: `nextcloud/evidencias/evidencia-nextcloud-sso.png`

Print sugerido: tela do Nextcloud mostrando o menu do usuário com `pcsi-user` no canto superior direito, após fluxo SSO.

```bash
mkdir -p nextcloud/evidencias
# salve o print como evidencia-nextcloud-sso.png
```

---

## Validação final

| Critério | Como verificar |
|---|---|
| Provider criado no Authentik | Applications > Providers lista `Nextcloud OIDC Provider` |
| App social_login instalado | `php occ app:list` mostra `social_login` |
| Botão de SSO visível | Tela de login do Nextcloud exibe "Login com Authentik" |
| Fluxo completo funcional | Login via Authentik redireciona e autentica no Nextcloud |
| Usuário auto-criado | Usuário `pcsi-user` aparece em Administração > Usuários |
| Evidência capturada | `nextcloud/evidencias/evidencia-nextcloud-sso.png` existe |

---

## Troubleshooting

**Botão "Login com Authentik" não aparece**
Verifique se o app social_login está ativado: Configurações > Apps > busque "Social Login" e confirme que está habilitado.

**Erro "redirect_uri mismatch" no Authentik**
A Redirect URI no provider do Authentik precisa ser exatamente:
```
http://localhost:8080/apps/social_login/custom_oidc/authentik/callback
```
Sem barra no final, sem https.

**Erro 500 no Nextcloud após redirect**
```bash
docker exec -u www-data nextcloud php occ log:tail
```
Verifique se o Client Secret foi copiado corretamente.

**Authentik não está acessível durante o fluxo**
Os dois containers precisam estar rodando simultaneamente. Verifique:
```bash
# Na pasta authentik
docker compose ps

# Na pasta nextcloud
docker compose ps
```

**Usuário não é criado automaticamente no Nextcloud**
Verifique se o campo `email` está vindo no token. No Authentik, o provider precisa ter o scope `email` selecionado.

---

## Saída esperada deste spec

- Authentik com Application `Nextcloud` e Provider OIDC configurados
- Nextcloud com app `social_login` instalado e provider `authentik` configurado
- Fluxo SSO funcional: login no Authentik autentica no Nextcloud
- `nextcloud/evidencias/evidencia-nextcloud-sso.png` capturada
- Critério de sucesso do PRD atendido: SSO via Authentik integrado ao Nextcloud