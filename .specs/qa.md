# Spec Técnica — QA Checklist (docs/qa-checklist.md)
**sat-infrastructure / PCSI+**
**Responsável:** Daniel
**Prazo:** 23 a 24/05/2026
**Pré-requisito:** Todas as ferramentas funcionando e Databook concluído

---

## Objetivo

Produzir `docs/qa-checklist.md` com todos os critérios de aceite verificados e evidências referenciadas, garantindo que a entrega ao professor Rafael e à i9+ está completa e rastreável.

---

## Template do checklist

Copie abaixo para `docs/qa-checklist.md` e preencha os campos `[ ]` conforme cada item for verificado:

```markdown
# QA Checklist — PCSI+
**Data de verificação:** [DD/MM/2026]
**Verificado por:** [Nome]

---

## Ferramentas

### Authentik
- [ ] Container rodando (`docker compose ps` mostra `Up`)
- [ ] Acessível via browser em `http://localhost:9000`
- [ ] 3 perfis de usuário criados no diretório
- [ ] Fluxo de autenticação configurado
- [ ] Evidência: `authentik/evidencias/evidencia-authentik.png` existe
- [ ] Evidência SSO: `authentik/evidencias/evidencia-authentik-fluxo.png` existe

### Nextcloud
- [ ] Container rodando (`docker compose ps` mostra `Up`)
- [ ] Acessível via browser em `http://localhost:8080`
- [ ] Upload de arquivo demonstrado com sucesso
- [ ] Botão "Login com Authentik" visível na tela de login
- [ ] Login via Authentik funcional (SSO completo)
- [ ] Usuário `pcsi-user` aparece em Administração > Usuários após SSO
- [ ] Evidência: `nextcloud/evidencias/evidencia-nextcloud.png` existe
- [ ] Evidência SSO: `nextcloud/evidencias/evidencia-nextcloud-sso.png` existe

### Vaultwarden
- [ ] Container rodando (`docker compose ps` mostra `Up`)
- [ ] Acessível via browser em `http://localhost:8082`
- [ ] Cofre com pelo menos uma credencial de exemplo criada
- [ ] Evidência: `vaultwarden/evidencias/evidencia-vaultwarden.png` existe

### Wazuh
- [ ] Container rodando (`docker compose ps` mostra `Up`)
- [ ] Dashboard acessível em `https://localhost:443`
- [ ] Pelo menos uma métrica ativa visível no dashboard
- [ ] Manual do agente disponível em `wazuh/docs/wazuh-manual-agente.pdf`
- [ ] Evidência: `wazuh/docs/dashboard-wazuh.png` existe

---

## Documentação

- [ ] `docs/authentik-nextcloud-oidc.md` existe e está completo
- [ ] `docs/databook.md` existe com seções de todas as 4 ferramentas
- [ ] `docs/roteiro-video.md` existe e foi aprovado pelo grupo
- [ ] `docs/qa-checklist.md` (este arquivo) preenchido e commitado
- [ ] `README.md` da raiz do repositório atualizado com instruções de acesso

---

## Vídeo

- [ ] Todos os 15 alunos aparecem no vídeo explicando alguma parte
- [ ] Depoimento de Alessandro ou Sandro (i9+) gravado e incluído
- [ ] Vídeo não contém marca da i9+ sem autorização prévia
- [ ] Vídeo não contém marca da Universidade Positivo ou Cruzeiro do Sul
- [ ] Vídeo final aprovado pelo grupo antes de 22/05

---

## Publicação no Instagram

- [ ] Post publicado antes de 25/05 às 17h
- [ ] @extensaoup marcado
- [ ] @mestrerafael47 marcado
- [ ] Link permanente do post obtido e registrado abaixo

**Link do post:** [colar aqui]

---

## Entrega ao professor Rafael

- [ ] Link do repositório `sat-infrastructure` com acesso de leitura enviado
- [ ] Link do `docs/roteiro-video.md` compartilhável enviado
- [ ] Link do vídeo final enviado
- [ ] Link permanente do post no Instagram enviado
- [ ] Todos os links enviados antes de 25/05 às 17h

---

## Resultado final

**Status:** [ ] Aprovado / [ ] Reprovado (itens pendentes listados abaixo)

**Itens pendentes:**
- 

**Responsável pela verificação:** [Nome]
**Data:** [DD/MM/2026]
```

---

## Como usar este spec

1. Crie o arquivo `docs/qa-checklist.md` no repositório com o template acima
2. Percorra cada item no dia 23 ou 24/05
3. Para cada item marcado como `[x]`, confirme visualmente ou via comando
4. Se algum item falhar, abra issue no repositório ou notifique o responsável da squad
5. O checklist só é considerado concluído quando todos os itens estiverem marcados

---

## Saída esperada deste spec

- `docs/qa-checklist.md` criado e commitado
- Todos os itens verificados e marcados antes de 25/05 às 12h (margem de 5 horas antes do prazo)