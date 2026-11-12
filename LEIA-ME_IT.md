# LECASU — Simulador Solar Fotovoltaico & Portal Administrativo

**Pacote Oficial de Produção & Deploy — LECASU LDA**

Este projeto é uma aplicação web moderna, responsiva e PWA (Progressive Web App) concebida para a **LECASU (Energy and Engineering Solutions)** em Moçambique. Permite aos clientes dimensionarem sistemas solares e à equipa técnica gerir o catálogo oficial de equipamentos.

---

## 1. Segurança & Acesso ao Portal Administrativo

* **Ocultação Pública:** O botão de acesso ao Admin foi **completamente removido** do simulador público (`index.html`). Nenhum cliente ou visitante tem acesso visual ao painel.
* **Link Específico de Acesso (Privado):**
  * URL direta: `admin.html` ou `/admin` (ex.: `https://seu-dominio.co.mz/admin.html` ou `http://localhost:5500/admin`)
* **Credenciais Padrão de Primeiro Acesso:**
  * **Utilizador:** `admin@lecasu.co.mz` (ou apenas `admin`)
  * **Palavra-passe:** `lecasu2026`
* **Alteração de Palavra-passe & Variáveis de Ambiente:** Na aba *Configurações & Backup* do portal, a palavra-passe pode ser alterada a qualquer momento (com persistência encriptada via `scrypt` em `data/admin.json` no servidor Node.js). Em produção Node/Docker, pode também definir `ADMIN_USER`, `ADMIN_PASSWORD` e `SESSION_SECRET`.
* **Sessão Protegida:** Quando executado via [`backend/server-app.js`](backend/server-app.js), a sessão administrativa utiliza cookie `HttpOnly; SameSite=Strict` assinado por HMAC no servidor, e ficheiros internos (`backend/`, `LEIA-ME_IT.md`, `data/`) são bloqueados de acesso HTTP direto.

---

## 2. Estrutura dos Ficheiros

```text
LECASU_Simulador_Solar/
├── index.html          # Simulador solar público para clientes (Design Claro Corporativo)
├── style.css           # Design system responsivo (Desktop 100vh, Tablet, Mobile)
├── shared-catalog.js   # Fonte única do catálogo padrão e utilitários partilhados
├── app.js              # Motor de cálculo solar (HSP 4.8, EDM 10.50 MT/kWh, IVA 16%)
├── admin.html          # Portal de Administração (Restrito por autenticação)
├── admin.css           # Estilos dedicados do painel administrativo
├── admin.js            # Lógica de login, operações CRUD e sincronização com backend
├── backend/
│   └── server-app.js   # Servidor HTTP + API REST (/api/products, /api/auth/*, /api/quotes, /health)
├── api/
│   └── index.js        # Entrypoint Vercel Serverless Function (/api/* e /health)
├── sw.js               # Service Worker PWA v23 (Offline e pré-cache de ilustrações)
├── manifest.json       # Manifesto PWA com tema oficial da LECASU
├── .htaccess           # Configuração de produção para Apache / cPanel / Shared Hosting
├── vercel.json         # Configuração de produção para Vercel
├── _redirects          # Configuração de rotas para Netlify / Cloudflare Pages
├── _headers            # Headers de segurança para Netlify / Cloudflare
├── Dockerfile          # Imagem de contentor leve Node.js Alpine
├── .dockerignore       # Ficheiros ignorados pelo Docker
├── package.json        # Metadados e scripts de execução
├── logo.png            # Logotipo oficial da LECASU
├── favicon.png         # Ícone de favoritos para o navegador
├── icon-192.png        # Ícone de app para telemóveis (192x192)
├── icon-512.png        # Ícone de app em alta definição (512x512)
└── img/products/       # 12 Ilustrações SVG oficiais de painéis, inversores e baterias
    ├── panel-jinko.svg
    ├── panel-canadian.svg
    ├── panel-ja.svg
    ├── panel-longi.svg
    ├── inv-deye-lv.svg
    ├── inv-megatron-lv.svg
    ├── inv-livoltek-lv.svg
    ├── inv-sigen-hv.svg
    ├── bat-deye-lv.svg
    ├── bat-megatron-lv.svg
    ├── bat-livoltek-bhf.svg
    └── bat-sigen-hv.svg
```

---

## 3. Como Fazer o Deploy (Pronto para Produção)

O projeto está 100% pronto para produção e pode ser publicado imediatamente através de qualquer um dos seguintes métodos:

### Opção A: Hospedagem cPanel / Apache / Servidor Web Tradicional (Recomendado em Moçambique)
1. Conecte-se ao seu cPanel ou cliente FTP/SFTP (FileZilla).
2. Aceda à pasta pública (ex.: `public_html/` ou subpasta `public_html/simulador/`).
3. Envie todos os ficheiros da pasta do projeto (certifique-se de incluir o ficheiro oculto `.htaccess`).
4. **Pronto!** O simulador estará ativo no domínio e a rota `/admin` redirecionará automaticamente para `admin.html`.

### Opção B: Servidor Node.js / VPS (Ubuntu, Debian, CentOS, PM2)
1. No seu servidor VPS ou droplet, copie os ficheiros do projeto.
2. Inicie o servidor:
   ```bash
   npm start
   ```
   *(Ou com PM2 para manter o processo sempre ativo em segundo plano):*
   ```bash
   npm install -g pm2
   pm2 start backend/server-app.js --name "lecasu-solar"
   pm2 save
   ```
3. A porta padrão é `5500` (ou a definida pela variável de ambiente `PORT`).

### Opção C: Contentor Docker (AWS, GCP, Azure, Railway, Render, Coolify)
1. Para construir a imagem Docker:
   ```bash
   docker build -t lecasu-solar .
   ```
2. Para executar o contentor:
   ```bash
   docker run -d -p 5500:5500 --name lecasu-solar-app lecasu-solar
   ```

### Opção D: Vercel / Netlify / Cloudflare Pages (Deploy Estático com 1 Clique)
* **Vercel:** Conecte o repositório ou execute `vercel --prod` na pasta. O ficheiro `vercel.json` configura automaticamente as rotas e headers de segurança.
* **Netlify / Cloudflare:** Os ficheiros `_redirects` e `_headers` já presentes garantem o roteamento e cache adequados.

---

## 4. Parâmetros de Engenharia Fotovoltaica Aplicados

* **Radiação Solar de Moçambique:** 4.8 HSP (Horas de Sol Pico) com Performance Ratio (PR) de 76%.
* **Tarifa Elétrica EDM (Estimativa):** ~10,50 MT/kWh para cálculo de poupança mensal na fatura.
* **Fator de Sustentabilidade:** 0,82 kg de emissões de CO₂ evitadas por cada kWh solar gerado.
* **Taxa Legal de IVA:** 16% (legislação tributária vigente em Moçambique), discriminado de forma clara nos orçamentos, resumos e folha de impressão A4.
* **Banco de Baterias LiFePO4:** Margem de descarga de 90% (DoD) e eficiência de conversão de 92%.
* **Compatibilidade Elétrica Automática:** O sistema sincroniza automaticamente a tensão (LV ~48V vs HV 300-900V) e fases (1ph, Split-Phase, 3ph) entre inversores e baterias.

---

## 5. Checklist de Verificação de Produção

- [x] Botão de Admin removido da interface pública do cliente.
- [x] Rota privada de login via `admin.html` ou `/admin`.
- [x] Autenticação com verificação de utilizador/palavra-passe e feedback visual.
- [x] Capacidade do administrador alterar a palavra-passe no painel.
- [x] Todos os 12 SVGs oficiais de painéis, inversores e baterias presentes e em cache.
- [x] PWA offline funcional via Service Worker `v23` e `manifest.json`.
- [x] Headers de segurança contra clickjacking (`X-Frame-Options: SAMEORIGIN`) e MIME sniffing (`nosniff`).
- [x] Proposta formal A4 com código único rastreável (`LEC-2026-XXXX`) pronta para impressão ou PDF.
