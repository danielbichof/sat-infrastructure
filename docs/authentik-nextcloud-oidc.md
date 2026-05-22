# Authentik + Nextcloud (OIDC)

Este guia configura o Nextcloud para autenticar via Authentik (OIDC), sem senha local.

## Pré-requisitos

- Authentik rodando em http://localhost:9000
- Nextcloud rodando em http://localhost:8080
- Usuário admin do Authentik criado (initial setup)
- Usuário admin do Nextcloud criado

## 1) Criar Provider OIDC no Authentik

1. Acesse Authentik: http://localhost:9000
2. Vá em **Applications > Providers** e clique **Create**.
3. Selecione **OAuth2/OpenID Provider**.
4. Preencha:
   - **Name**: nextcloud-oidc
   - **Authorization flow**: default-provider-authorization-implicit-consent (ou o padrão existente)
   - **Client type**: Confidential
   - **Signing Key**: default
5. Salve. Anote:
   - **Client ID**
   - **Client Secret**
   - **OpenID Configuration URL** (ou o Issuer URL)

## 2) Criar Application no Authentik

1. Vá em **Applications > Applications** e clique **Create**.
2. Preencha:
   - **Name**: Nextcloud
   - **Slug**: nextcloud
   - **Provider**: selecione o provider criado (nextcloud-oidc)
   - **Launch URL**: http://localhost:8080
3. Salve.

## 3) Configurar Nextcloud (OIDC)

1. Acesse o Nextcloud como admin.
2. Vá em **Apps** e instale um app OIDC (uma das opções):
   - **OpenID Connect Login**
   - **Social Login**
3. Após instalar, vá em **Administração > Configurações > Segurança** (ou menu do app) e configure:
   - **Provider**: Authentik
   - **Issuer/Discovery URL**: use o OpenID Configuration URL do Authentik
   - **Client ID**: (do provider)
   - **Client Secret**: (do provider)
   - **Scopes**: openid profile email
   - **Redirect URI**: normalmente http://localhost:8080/apps/sociallogin/custom_oidc/Authentik (ver no app)
4. Salve a configuração.

## 4) Testar fluxo de login

1. Abra uma janela anônima.
2. Acesse http://localhost:8080
3. Clique em **Login via Authentik**.
4. Faça login no Authentik.
5. Confirme que retorna ao Nextcloud já autenticado.

## Evidências sugeridas

- Print do Authentik mostrando provider/app criados.
- Print do Nextcloud autenticado via Authentik.
