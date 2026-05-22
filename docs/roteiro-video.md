# Roteiro do Vídeo

## Plano de vídeo — Authentik

**Objetivo da cena:** mostrar que o Authentik resolve a falta de autenticação centralizada da i9+, criando um ponto único para gerenciar usuários, perfis e login em outros serviços da POC.

**Duração sugerida:** 2 a 3 minutos dentro do vídeo final.

### 1. Contexto do problema (15–25s)

**Imagem:** aluno em câmera ou tela com o repositório/diagrama simples da POC.

**Fala sugerida:**
> Antes do PCSI+, o problema apresentado era a falta de padronização no controle de acessos. Cada ferramenta poderia acabar com usuários e senhas separados, dificultando rastreabilidade, gestão e desligamento de colaboradores.

**Mensagem principal:** a i9+ precisa de identidade centralizada para reduzir credenciais espalhadas.

### 2. Apresentação da solução (20–30s)

**Imagem:** abrir `http://localhost:9000` ou mostrar `authentik/evidencias/evidencia-authentik-fluxo.png`.

**Fala sugerida:**
> Para resolver isso, usamos o Authentik como provedor central de identidade. Ele funciona como a porta de entrada do ecossistema: o usuário autentica uma vez e os serviços integrados podem confiar nessa identidade.

**Pontos obrigatórios:**
- Authentik é open source.
- Roda localmente via Docker Compose.
- Não é ambiente de produção; é uma POC demonstrável.

### 3. Como o serviço sobe (20–30s)

**Imagem:** terminal na pasta `authentik/`, sem expor senhas do `.env`.

**Comandos a mostrar:**

```bash
cd authentik
docker compose up -d
docker compose ps
```

**Fala sugerida:**
> O serviço sobe com imagens oficiais via Docker Compose, sem Dockerfile customizado e sem orquestração externa. Depois do `up -d`, o painel fica acessível localmente na porta 9000.

**Cuidado:** não abrir ou ampliar o conteúdo do `.env`.

### 4. Usuários e perfis (35–45s)

**Imagem:** painel do Authentik ou `authentik/evidencias/evidencia-authentik.png`.

**Fala sugerida:**
> Para demonstrar a gestão de acesso, configuramos três perfis: um administrador, um colaborador e um visitante. Cada usuário pertence a um grupo diferente, o que permite separar responsabilidades e permissões.

**Usuários a mostrar:**
- `pcsi-admin` — perfil administrador — grupo `PCSI Administradores`
- `pcsi-colaborador` — perfil colaborador — grupo `PCSI Colaboradores`
- `pcsi-visitante` — perfil visitante — grupo `PCSI Visitantes`

**Mensagem principal:** a gestão sai de senhas desorganizadas e passa para usuários e grupos centralizados.

### 5. Fluxo de autenticação (30–45s)

**Imagem:** tela de login do Authentik e, se disponível, fluxo de login com Nextcloud.

**Fala sugerida:**
> O Authentik também viabiliza SSO. Na POC, a integração prioritária é com o Nextcloud via OIDC: o usuário acessa o Nextcloud, é redirecionado ao Authentik, faz login e volta autenticado sem usar uma senha própria do Nextcloud.

**Fluxo narrado:**
1. Usuário tenta acessar o Nextcloud.
2. Nextcloud redireciona para o Authentik.
3. Authentik valida a identidade.
4. Nextcloud recebe a autenticação e abre a sessão.

**Critério de sucesso:** deixar claro que o Nextcloud confia no Authentik como IdP.

### 6. Valor para a i9+ (20–30s)

**Imagem:** aluno em câmera ou tela com Databook/arquitetura.

**Fala sugerida:**
> Na prática, isso dá à i9+ um ponto único para criar, bloquear e auditar acessos. Quando um colaborador entra, troca de função ou sai da empresa, a gestão acontece em um lugar central, reduzindo compartilhamento informal de senhas.

**Benefícios a citar:**
- controle centralizado de usuários;
- separação por perfis;
- base para SSO;
- menos credenciais espalhadas;
- melhor rastreabilidade.

### 7. Fechamento da cena (10–15s)

**Fala sugerida:**
> Assim, o Authentik deixa de ser apenas uma tela de login e se torna o componente central de identidade do PCSI+, conectando segurança, gestão de acesso e experiência do usuário.

**Transição recomendada:** seguir para a demonstração do Nextcloud com SSO.

### Checklist da gravação Authentik

- [ ] Mostrar `docker compose up -d` dentro da pasta `authentik/`.
- [ ] Mostrar acesso a `http://localhost:9000`.
- [ ] Mostrar os três perfis: administrador, colaborador e visitante.
- [ ] Mostrar ou narrar o fluxo OIDC com Nextcloud.
- [ ] Não expor senha, secret, token ou conteúdo sensível do `.env`.
- [ ] Não exibir marcas proibidas sem autorização.
- [ ] Reforçar que é POC local, não produção.

## Abertura (alunos apresentam o projeto)

- Breve apresentação da equipe e do problema da i9+
- Explicar o que é o PCSI+ e a proposta da POC
- Dizer que todas as ferramentas são open source e rodam localmente via Docker Compose

## Demonstração Authentik

- Mostrar o painel do Authentik
- Explicar que ele centraliza identidade e viabiliza SSO
- Mostrar um usuário criado (sem expor senha)

## Demonstração Nextcloud com SSO

- Abrir Nextcloud e clicar em "Login via Authentik"
- Mostrar o redirecionamento para Authentik
- Fazer login no Authentik
- Retornar ao Nextcloud autenticado
- Fazer upload de um arquivo de exemplo

## Demonstração Vaultwarden

- Abrir o Vaultwarden
- Mostrar o cofre com uma credencial de exemplo
- Explicar que elimina o envio de senha por WhatsApp

## Demonstração Wazuh

- Abrir o dashboard do Wazuh
- Mostrar uma métrica/alerta ativo
- Explicar que fornece visibilidade de eventos de segurança

## Depoimento i9+

- Inserir fala de Alessandro ou Sandro confirmando valor do ecossistema

## Encerramento e créditos

- Recapitular os 4 problemas resolvidos
- Creditar todos os alunos
- Reforçar que não é ambiente de produção

## Regras obrigatórias

- Não exibir marcas da i9+ sem autorização prévia
- Não exibir marca Universidade Positivo ou Cruzeiro do Sul
- Todos os alunos devem aparecer e ser creditados
- Depoimento da i9+ é obrigatório para nota máxima
