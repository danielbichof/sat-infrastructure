# Vaultwarden — Cofre de Senhas Local

## Como subir

1) Gere os certificados locais:

```bash
cd vaultwarden
./scripts/bootstrap-certs.sh
```

2) Suba o container:

```bash
docker compose up -d
```

Acesse: https://localhost:8443

## Credenciais
- Crie sua conta no primeiro acesso
- SIGNUPS_ALLOWED=true permite o cadastro inicial

## Como desligar

docker compose down

## Por que Vaultwarden?
Elimina o envio de senhas via WhatsApp e e-mail.
Todas as credenciais ficam criptografadas em servidor
local, acessível apenas pela equipe autorizada.
