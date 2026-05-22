# Guia do Usuário (uso humano)

Este guia explica como usar as quatro ferramentas da POC PCSI+ do ponto de vista de um usuário final, sem detalhes técnicos de infraestrutura.

## 1) Visão geral rápida

Você terá acesso a quatro sistemas locais no navegador:
- Authentik: central de login
- Nextcloud: arquivos e colaboração
- Vaultwarden: cofre de senhas
- Wazuh: painel de segurança

Todos rodam localmente no seu computador.

## 2) Acessos (URLs)

- Authentik: http://localhost:9000
- Nextcloud: http://localhost:8080
- Vaultwarden: https://localhost:8443
- Wazuh: https://localhost

Observação: Vaultwarden e Wazuh usam certificado local. O navegador pode avisar “conexão não segura”. Clique em “Avançado” e prossiga.

## 3) Authentik (central de login)

Uso típico:
1) Abra o Authentik.
2) Faça login com o usuário e senha fornecidos pelo responsável do laboratório.
3) Use o Authentik apenas para autenticar acesso aos demais sistemas (principalmente o Nextcloud via SSO).

Para o usuário final, o Authentik funciona como a “tela de login central”.

## 4) Nextcloud (arquivos)

Como entrar (login normal):
1) Abra http://localhost:8080
2) Digite seu usuário e senha.
3) Você verá a área de arquivos.

Como entrar via SSO (login com Authentik):
1) Abra http://localhost:8080
2) Clique em “Login com Authentik”.
3) Faça login no Authentik e você será redirecionado para o Nextcloud já autenticado.

Como usar no dia a dia:
- Para enviar um arquivo: clique em “New” > “Upload” e selecione o arquivo.
- Para criar pasta: “New” > “New folder”.
- Para compartilhar: selecione o arquivo e use o menu de compartilhamento.
- Para sair: menu do usuário (canto superior direito) > “Log out”.

## 5) Vaultwarden (cofre de senhas)

Como entrar:
1) Abra https://localhost:8443
2) Crie uma conta (se permitido) ou faça login com a conta já criada.

Como usar no dia a dia:
- Para guardar uma senha: clique em “+ New item” e preencha os campos.
- Para organizar: use “Folders” ou “Collections”.
- Para consultar: pesquise pelo nome do item no topo.

Importante: não use senhas reais de produção. Use apenas credenciais de teste.

## 6) Wazuh (painel de segurança)

Como entrar:
1) Abra https://localhost
2) Faça login com as credenciais fornecidas.

Como usar no dia a dia:
- Dashboard: visão geral do ambiente.
- Alerts: lista de alertas detectados.
- Agents: lista de agentes monitorados (nesta POC, pode estar vazio).

Esse painel é para observação e demonstração; não é necessário alterar configurações.

## 7) Dúvidas comuns

- “Não carrega o sistema”: aguarde 2–3 minutos e tente novamente.
- “Certificado inválido”: é normal em ambiente local; prossiga no navegador.
- “Esqueci a senha”: peça ao responsável do laboratório para redefinir.

## 8) O que não fazer

- Não tente configurar servidores, orquestração ou Docker manualmente.
- Não altere configurações internas dos sistemas sem orientação.
- Não use credenciais reais de produção.
