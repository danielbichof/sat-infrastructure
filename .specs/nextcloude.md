# Spec Técnica — Nextcloud
**sat-infrastructure / PCSI+**
**Responsável:** Daniel
**Prazo:** 21/05/2026 (hoje)
**Bloqueio:** Esta spec é pré-requisito da spec de SSO.

---

## Objetivo

Subir o Nextcloud via Docker Compose na porta 8080, criar um usuário admin, fazer upload de um arquivo de exemplo e capturar a evidência em `nextcloud/evidencias/evidencia-nextcloud.png`.

---

## Estrutura de arquivos esperada

```
nextcloud/
├── README.md
├── docker-compose.yml
└── evidencias/
    └── evidencia-nextcloud.png
```

---

## 1. docker-compose.yml

Crie `nextcloud/docker-compose.yml` com o conteúdo abaixo:

```yaml
services:
  nextcloud-db:
    image: mariadb:10.11
    container_name: nextcloud-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: nextcloudpassword
    volumes:
      - nextcloud_db:/var/lib/mysql
    networks:
      - nextcloud-net

  nextcloud:
    image: nextcloud:28
    container_name: nextcloud
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      NEXTCLOUD_ADMIN_USER: admin
      NEXTCLOUD_ADMIN_PASSWORD: admin123
      MYSQL_HOST: nextcloud-db
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: nextcloudpassword
      NEXTCLOUD_TRUSTED_DOMAINS: localhost
    volumes:
      - nextcloud_data:/var/www/html
    depends_on:
      - nextcloud-db
    networks:
      - nextcloud-net

volumes:
  nextcloud_db:
  nextcloud_data:

networks:
  nextcloud-net:
    driver: bridge
```

---

## 2. Subir os containers

```bash
cd nextcloud
docker compose up -d
```

Aguarde ~60 segundos antes de acessar. O Nextcloud precisa inicializar o banco na primeira execução.

Para acompanhar a inicialização:

```bash
docker compose logs -f nextcloud
```

Quando aparecer `apache2 -D FOREGROUND` nos logs, está pronto.

---

## 3. Verificar acesso

Acesse `http://localhost:8080` no browser.

Credenciais:
- Usuário: `admin`
- Senha: `admin123`

Critério de aceite: tela de dashboard do Nextcloud carregada sem erro.

---

## 4. Criar usuário de teste (para SSO)

Antes de integrar com Authentik, crie um usuário local para validar que o Nextcloud funciona independente:

1. Menu superior direito > Administração > Usuários
2. Clique em "Novo usuário"
3. Nome: `testuser`, Email: `testuser@pcsi.local`, Senha: `test123`
4. Salvar

Esse usuário não é necessário para o SSO, mas serve como evidência de controle de acesso.

---

## 5. Upload de arquivo de exemplo

1. Vá para "Arquivos" no menu lateral
2. Clique em "+" > "Fazer upload de arquivo"
3. Suba qualquer arquivo (pode ser um `.txt` com conteúdo qualquer)
4. Confirme que aparece na listagem

---

## 6. Capturar evidência

A evidência precisa mostrar o dashboard do Nextcloud logado com o arquivo enviado visível.

Caminho esperado: `nextcloud/evidencias/evidencia-nextcloud.png`

```bash
mkdir -p nextcloud/evidencias
```

Tire o print manualmente ou use o script abaixo (Node.js com Puppeteer, se disponível):

```js
// capture-nextcloud.mjs
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

// Login
await page.goto('http://localhost:8080/login');
await page.type('#user', 'admin');
await page.type('#password', 'admin123');
await page.click('[type="submit"]');
await page.waitForNavigation();

// Screenshot do dashboard
mkdirSync('evidencias', { recursive: true });
await page.screenshot({ path: 'evidencias/evidencia-nextcloud.png', fullPage: false });

await browser.close();
console.log('Evidência capturada.');
```

```bash
cd nextcloud
node capture-nextcloud.mjs
```

---

## 7. Validação final

| Critério | Como verificar |
|---|---|
| Container rodando | `docker compose ps` mostra `nextcloud` e `nextcloud-db` como `Up` |
| Acesso via browser | `http://localhost:8080` responde com dashboard |
| Upload funcional | Arquivo visível na listagem de arquivos do admin |
| Evidência gerada | Arquivo existe em `nextcloud/evidencias/evidencia-nextcloud.png` |

---

## Troubleshooting comum

**"Internal Server Error" ao acessar**
O banco ainda está inicializando. Aguarde mais 30 segundos e tente novamente.

**Porta 8080 já em uso**
```bash
lsof -i :8080
# ou
docker ps | grep 8080
```
Pare o container conflitante ou mude para `:8081` no compose e ajuste na spec de SSO também.

**Containers não sobem**
```bash
docker compose logs nextcloud-db
docker compose logs nextcloud
```
Verifique se há erro de variável de ambiente ou conflito de volume.

**Resetar tudo do zero**
```bash
docker compose down -v
docker compose up -d
```
O `-v` destrói os volumes. Use só se necessário.

---

## Saída esperada deste spec

- `nextcloud/docker-compose.yml` criado e funcional
- `nextcloud/evidencias/evidencia-nextcloud.png` com dashboard visível
- Nextcloud acessível em `http://localhost:8080`
- Pronto para receber a integração de SSO (próximo spec)