# 🏭 MASTER DOCUMENT — ECOSISTEMA DIGITAL MDK / TecManutenções
> FONTE ÚNICA DE VERDADE do workspace Antigravity.
> Repo: github.com/kiones91/tecmanutencao · Deploy: Vercel (automático a cada push em `main`)
> Versão 3.0 · 2026-08-16

---

## 0. COMO USAR (leia antes de codar)
1. Este documento é a fonte única. Regras de negócio, valores, fórmulas e SQL saem SOMENTE daqui.
2. Trabalhe por prompts (Seção 15), na ordem P0→P6. NÃO avance sem o usuário digitar "GO".
3. Todo prompt tem PORTÃO LOCAL: só pushar após verificar localmente (build + navegador).
4. Informação ausente → `// TODO-BUSINESS` + seção QUESTIONS. NUNCA invente números.
5. Entrega de cada prompt: CHECKLIST + evidências (log do build, testes, o que viu no browser) + QUESTIONS.

## 1. ESTADO ATUAL DO PROJETO (diagnóstico)
### Existe
- Next.js 16.3.1 no repo; Vercel com root na pasta do app (confirmar nome real: `app/` ou `aplicativo/`).
- Rotas: `/` (landing com CTAs), `/atendimento` (formulário Faísca: nome, WhatsApp, descrição, mídias, consentimento LGPD), `/admin` (login PLACEHOLDER + dashboard/leads/orçamentos/config com dados MOCKADOS), `/campo` (placeholder).
- `src/core/` = motor de precificação puro com 27 testes unitários.
- Supabase criado; envs `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel.
- Branch de produção: `main`.

### Quebrado / faltando (fila de trabalho)
- B1. Tailwind CSS NÃO aplica em produção (página "pelada": links azuis, SVGs gigantes). Commit 0e2ecc3 "pipeline completo" NÃO resolveu → P1.
- B2. Auth /admin é placeholder (sem Supabase Auth/MFA) → P2.
- B3. Listas mockadas → conectar tabelas reais → P2.
- B4. /campo inexistente (offline, OS, assinatura, sync) → P3.
- B5. Financeiro/fiscal/suprimentos/estoque inexistentes → P4.
- B6. BI/contratos inexistentes → P5.
- B7. Site institucional estático separado (`site/`) → P6 (opcional).

## 2. REGRAS DE PROCESSO (permanentes)
R1. `main` = produção; Vercel deploya sozinho.
R2. Antes de push: `npm run build` sem erros E página verificada no navegador local.
R3. Nunca commitar `.next/`, `node_modules/`, `.turbo/`.
R4. Negócio só deste documento; ausente → TODO-BUSINESS.
R5. Deps permitidas: next, react, tailwindcss, shadcn/radix, lucide-react, @supabase/supabase-js, @supabase/ssr, zod, vitest, date-fns, clsx, tailwind-merge. Outras → perguntar.
R6. Design system da Seção 4.
R7. Entregáveis por prompt: CHECKLIST + evidências + QUESTIONS; sem "GO" não avança.
R8. Commits pequenos e mensagens claras; não refatorar fora do escopo do prompt.

## 3. PRINCÍPIOS E DECISÕES DE PRODUTO
D1. Fricção zero: PWA público sem login.
D2. IA "Faísca" captura e triage, mas NUNCA exibe preço/prazo/laudo. Inteligência de precificação vive no PAINEL com aprovação humana (sobrepõe spec original).
D3. Margem blindada: tabelas de CUSTO e VENDA separadas; Markup Divisor; BDI; 3 cenários.
D4. Campo resiliente: IndexedDB + sync idempotente + Monitor de Sync.
D5. Auditoria e LGPD por padrão.
D6. Modo FECHADO (turnkey) padrão no industrial; ABERTO só com toggle do sócio.

## 4. DESIGN SYSTEM (identidade do site — obrigatório)
- bg `#0a0d14` · surface `#111622` · card `#161c2c` · border `#232b3e`
- texto `#f8fafc` · muted `#94a3b8`
- primary `#fcdc5d` · hover `#f5cb3c` · glow `drop-shadow(0 0 15px rgba(252,220,93,.3))`
- Fontes: **Outfit** (display 300–900) + **Inter** (corpo 400–700)
- Radius cards 16px; botões de campo ≥48px; ícones só lucide; PROIBIDO emoji em UI.
- /admin: denso mas limpo, skeletons, empty states, toasts.
- /campo: mobile-first, alto contraste, poucos toques, indicador online/offline sempre visível.
- Acessibilidade AA: contraste, focus visível, aria-labels.

## 5. ARQUITETURA
Stack: Next.js App Router + Tailwind + Shadcn · Supabase (Postgres+RLS, Auth+MFA, Storage, Realtime, Edge Functions) · OpenAI (GPT-4o + Whisper) ou Gemini · IndexedDB · FocusNFe.
Zonas: `/atendimento` (público) · `/admin` (MFA) · `/campo` (técnico).
Edge Functions: `fn-lead-capture`, `fn-ia-triage`, `fn-sync-outbox`, `fn-nfe-issue`, `fn-storage-sign`.
Buckets: `temp-public` (quarentena 24h), `clientes`, `os`, `docs`, `fiscal`.
Anti-abuso: rate limit 10 req/min, Turnstile invisível, token de sessão, 3 mídias/sessão, vídeo ≤20MB, áudio ≤5min, validação MIME, HMAC no webhook.

## 6. BANCO DE DADOS (SQL completo — migrations)
```sql
create type user_role as enum ('admin','tecnico','financeiro','sistema');
create table profiles (id uuid primary key references auth.users(id),
  role user_role not null default 'tecnico', nome text not null, criado_em timestamptz default now());

create table clientes (id uuid primary key default gen_random_uuid(), nome text not null,
  whatsapp text, cpf_cnpj text, tipo text check (tipo in ('predial','industrial','ambos')),
  endereco jsonb, observacoes text, criado_em timestamptz default now());

create table leads (id uuid primary key default gen_random_uuid(), nome text, whatsapp text,
  origem text, sessao_id text, ip inet, user_agent text, payload_ia jsonb, score int,
  status text not null default 'novo' check (status in
   ('novo','confirmado','qualificado','duplicado','invalido','convertido','descartado')),
  cliente_id uuid references clientes(id), criado_em timestamptz default now());

create table midias (id uuid primary key default gen_random_uuid(), owner_type text not null,
  owner_id uuid not null, tipo text check (tipo in ('imagem','video','audio','documento')),
  storage_path text not null, mime text, tamanho bigint, hash text, thumb_path text, meta jsonb,
  criado_em timestamptz default now());

create table linhas_servico (id uuid primary key default gen_random_uuid(), codigo text unique not null,
  nome text not null, anexo text not null default 'III' check (anexo in ('III','V')), ativa boolean default true);

create table recursos (id uuid primary key default gen_random_uuid(), nome text not null,
  tipo text check (tipo in ('socio_senior','socio_pleno','engenheiro','eletricista','ajudante','freelancer')),
  ativo boolean default true);

create table taxas_recurso (id uuid primary key default gen_random_uuid(),
  recurso_id uuid references recursos(id), linha_id uuid references linhas_servico(id),
  unidade text check (unidade in ('hora','dia')), custo numeric(10,2) not null,
  venda numeric(10,2) not null, venda_max numeric(10,2), vigencia_de date not null, vigencia_ate date,
  unique (recurso_id, linha_id, vigencia_de));

create table parametros_financeiros (id int primary key default 1,
  margem_padrao numeric(5,2) default 20, imposto_anexo3 numeric(5,2) default 6,
  imposto_anexo5 numeric(5,2) default 15.5, fator_r boolean default true,
  markup_material_min numeric(5,2) default 20, markup_material_max numeric(5,2) default 30,
  custo_fixo_mensal_min numeric(12,2) default 9000, custo_fixo_mensal_max numeric(12,2) default 13000,
  horas_uteis_mes numeric(8,2) default 320, km_min numeric(6,2) default 1.8, km_max numeric(6,2) default 2.5,
  alimentacao_dia numeric(8,2) default 70, saida_minima numeric(10,2) default 50,
  garantia_dias int default 90, art_padrao numeric(10,2) default 120, atualizado_em timestamptz default now());

create table adicionais (id uuid primary key default gen_random_uuid(), codigo text unique, nome text,
  tipo text check (tipo in ('percentual','fixo_dia','fixo_projeto')), valor numeric(10,2),
  ambito text check (ambito in ('custo','venda','ambos')), linha_id uuid references linhas_servico(id));

create table orcamentos (id uuid primary key default gen_random_uuid(), codigo serial unique,
  cliente_id uuid references clientes(id), lead_id uuid references leads(id),
  linha_id uuid references linhas_servico(id),
  status text default 'rascunho' check (status in
   ('rascunho','revisao','aprovado_interno','enviado','aceito','recusado','expirado','convertido')),
  modo text default 'fechado' check (modo in ('fechado','aberto')), validade_dias int default 7,
  premissas text, exclusoes text, totais jsonb, versao int default 1,
  aprovado_por uuid references profiles(id), criado_em timestamptz default now());

create table orcamento_itens (id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  tipo text check (tipo in ('servico','material','logistica','adicional','terceiro','taxa','bdi')),
  descricao text not null, recurso_id uuid references recursos(id), qtd numeric(10,2), unidade text,
  custo_unit numeric(12,2), venda_unit numeric(12,2), custo_total numeric(12,2),
  venda_total numeric(12,2), meta jsonb);

create table templates_orcamento (id uuid primary key default gen_random_uuid(),
  linha_id uuid references linhas_servico(id), nome text, itens jsonb, faixa_ref jsonb);

create table ordens_servico (id uuid primary key default gen_random_uuid(), codigo serial unique,
  orcamento_id uuid references orcamentos(id), cliente_id uuid references clientes(id),
  linha_id uuid references linhas_servico(id),
  status text default 'criada' check (status in
   ('criada','agendada','em_execucao','aguardando_cliente','concluida','assinada','faturada',
    'encerrada','garantia','cancelada')),
  inicio_previsto date, fim_previsto date, endereco jsonb,
  responsavel_tecnico uuid references profiles(id), criado_em timestamptz default now());

create table os_equipe (os_id uuid references ordens_servico(id), recurso_id uuid references recursos(id),
  papel text, primary key (os_id, recurso_id));

create table apontamentos (id uuid primary key default gen_random_uuid(), sync_id uuid not null unique,
  os_id uuid references ordens_servico(id), recurso_id uuid references recursos(id), data date not null,
  inicio timestamptz, fim timestamptz, horas numeric(6,2), adicionais jsonb, geo jsonb,
  sync_status text default 'pendente');

create table os_eventos (id uuid primary key default gen_random_uuid(), sync_id uuid unique,
  os_id uuid references ordens_servico(id), tipo text, payload jsonb, criado_em timestamptz default now());

create table assinaturas (id uuid primary key default gen_random_uuid(), sync_id uuid unique,
  os_id uuid references ordens_servico(id), signatario_nome text, signatario_doc text,
  imagem_path text, hash_documento text, ip inet, geo jsonb, user_agent text, termo_versao int,
  assinado_em timestamptz default now());

create table lancamentos_financeiros (id uuid primary key default gen_random_uuid(),
  os_id uuid references ordens_servico(id), tipo text check (tipo in ('receber','pagar')),
  categoria text, descricao text, valor numeric(12,2) not null, vencimento date,
  pago boolean default false, pago_em date, soft_delete boolean default false);

create table notas_fiscais (id uuid primary key default gen_random_uuid(),
  os_id uuid references ordens_servico(id), numero text, chave text,
  status text check (status in ('fila','processando','autorizada','rejeitada','cancelada')),
  xml_path text, pdf_path text, erro text, tentativas int default 0);

create table fornecedores (id uuid primary key default gen_random_uuid(), nome text, cnpj text, contato text);
create table cotacoes (id uuid primary key default gen_random_uuid(), os_id uuid,
  fornecedor_id uuid references fornecedores(id), descricao text, valor numeric(12,2),
  frete numeric(12,2), prazo_dias int, condicao text, validade_dias int, anexo_path text,
  status text default 'recebida', melhor boolean default false);

create table insumos (id uuid primary key default gen_random_uuid(), nome text, unidade text,
  estoque_min numeric, custo_medio numeric);
create table estoque_mov (id uuid primary key default gen_random_uuid(),
  insumo_id uuid references insumos(id), os_id uuid, qtd numeric,
  tipo text check (tipo in ('entrada','saida','devolucao')), criado_em timestamptz default now());

create table documentos (id uuid primary key default gen_random_uuid(), owner_type text,
  owner_id uuid, tipo text, storage_path text, meta jsonb);

create table auditoria (id bigserial primary key, user_id uuid, acao text, tabela text,
  registro_id uuid, antes jsonb, depois jsonb, ip inet, criado_em timestamptz default now());

create or replace function app_role() returns text language sql stable as $$
  select coalesce((select role::text from profiles where id = auth.uid()), 'publico');
$$;
-- RLS: habilitar em todas as tabelas acima; admin = tudo; tecnico = somente OS/apontamentos
-- atribuídos; financeiro (futuro) = financeiro/fiscal sem config; SEM delete físico em
-- lancamentos_financeiros e notas_fiscais; auditoria somente leitura p/ admin;
-- público NÃO tem policies (só Edge Functions com service_role escrevem leads/mídias).
```

## 7. REGRAS DE NEGÓCIO — MOTOR DE PRECIFICAÇÃO (`src/core`)
7.1. **Markup Divisor (obrigatório; PROÍBE `custo + %`):**
`Preço = CustoTotal / (1 − (Margem% + Imposto% + TaxasOperacionais%))` — bloqueia se soma ≥ 100%.
7.2. **Imposto por linha:** Anexo III = 6%. Anexo V = 15,5% → cai p/ 6% com Fator R (folha ≥ 28%).
7.3. **BDI:** `BDI_hora = ponto_médio(custo_fixo_mensal 9.000–13.000) / horas_uteis_mes (320)` → item "Custo Administrativo" em todo orçamento. (Custo fixo inclui: galpão 3–5k, energia/água/internet 0,8–1,2k, seguro/IPTU 350, contabilidade 0,4–0,7k, rateios de CREA/alvarás, veículo 1,5k+300, combustível 1,5–2,5k, insumos 0,8–1,5k.)
7.4. **Mão de obra:** SEMPRE tabela de VENDA da linha/vigência (nunca custo+%).
7.5. **Materiais:** custo × markup 20–30% (juros, frete, garantia de queima).
7.6. **Terceirizados:** venda HH × h vs custo real × h; delta = "lucro hora terceirizada" visível no DRE.
7.7. **Adicionais:** Periculosidade +30% (linha viva/AT/MT) · Noturno +50% (22h–05h) · Parada/fim de semana +50% · NR-33/35 R$ 80/dia/pessoa · Atmosfera explosiva R$ 100/dia · Ruído/poeira/peçonhentos R$ 50/dia.
7.8. **Logística:** Alimentação R$ 70/dia/pessoa · Km R$ 1,80–2,50 · Pedágio real · Hotel real.
7.9. **Saída mínima predial:** R$ 50.
7.10. **3 cenários no composer:** (a) Divisor · (b) Custo + Lucro-alvo · (c) Faixa do template. Sócio ajusta/aprova; registrado em auditoria.
7.11. **Guardas:** alerta bloqueante `venda < custo`; envio só com `aprovado_interno`; ART ~R$ 120 repassada; ETS NR12 (~R$ 2.000/apreciação) repassado integralmente; garantia 90 dias com checklist de vistoria.

## 8. SEEDS — LINHAS, TAXAS E TEMPLATES (dossiês reais)
### 8.1 Taxas de venda (R$)
| Recurso | Linha | Un | Venda | Venda máx | Custo real |
|---|---|---|---|---|---|
| Kiones | AUTOMACAO | h | 200 | 300 | TODO-BUSINESS |
| Kiones | PARADA (liderança) | h | 120 | 120 | TODO-BUSINESS |
| Kiones | PREDIAL | h | 50 | 50 | REVISAR |
| Kiones | INDUSTRIAL | h | 90 | 90 | REVISAR |
| Dioleno | AUTOMACAO | h | 120 | 150 | TODO-BUSINESS |
| Dioleno | AUTOMACAO (SW CLP/IHM) | h | 180 | 180 | TODO-BUSINESS |
| Dioleno | PARADA (liderança) | h | 120 | 120 | TODO-BUSINESS |
| Maike | NR12/AUTOMACAO (engenharia) | h | 250 | 250 | TODO-BUSINESS |
| Maike | PARADA (gestão) | h | 200 | 200 | TODO-BUSINESS |
| Maike | PROJETOS | h | 150 | 200 | TODO-BUSINESS |
| Eletricista industrial | INDUSTRIAL/PARADA | h | 80 | 100 | 35–50 (freela) |
| Ajudante | INDUSTRIAL | h | 45 | 60 | mens. 1.800–2.200 |
| Ajudante N1/N2/N3 | PREDIAL | d | 70 / 90 / 120 | — | — |

### 8.2 Templates (itens padrão + faixa de referência)
**NR12 TURNKEY** · R$ 27.900–32.000 · 15–30 dias · modo FECHADO
Engenharia 30h×250 (7.500) · Montagem 40h×140 (5.600) · Materiais 8.000×1,3 (10.400) · ART 2×120 · Logística 600 · Impostos ~800 · Lucro-alvo 3.000–5.000.
Etapas: apreciação 1d campo+3d escritório · projeto 3–5d · materiais+painel 5–10d+2d · campo 2–3d · comissionamento/laudo 1d.
**AUTOMAÇÃO/RETROFIT** · R$ 69.500–80.000 · 20–45 dias
Levantamento 2d · Eng HW 40h×250 (10.000) · Eng SW 60h×180 (10.800) · Montagem 80h×140 (11.200) · Materiais 20.000×1,2 (24.000) · Fixos/logística/impostos 3.500 · Lucro-alvo 10.000.
Pitch: "máquina nova custa 500k; retrofit 80k entrega mesma produtividade + dados".
**PARADA PROGRAMADA (5 dias, 7 pessoas)** · R$ 41.900
Gestão 40h×200 (8.000) · Liderança 80h×120 (9.600) · 4 freelas 160h×80 (12.800; custo 35–50) · Insumos/EPIs 2.000 · Alimentação/transporte 1.500 · Lucro-alvo 6.000.
Combo obrigatório na proposta: execução + laudo termográfico/relatório de condição.
**CONTRATO MENSAL** · preventivo recorrente, SLA, faturamento mensal (P5).

## 9. MÁQUINAS DE ESTADO
Lead: novo→confirmado→qualificado→convertido | duplicado|invalido|descartado
Orçamento: rascunho→revisao→aprovado_interno→enviado→aceito→convertido | recusado|expirado
OS: criada→agendada→em_execucao→aguardando_cliente→concluida→assinada→faturada→encerrada | garantia|cancelada
NF: fila→processando→autorizada|rejeitada (retry 3 → contingência manual)|cancelada

## 10. PWA PÚBLICO — FAÍSCA (regras do agente)
Sem login; coleta nome+WhatsApp natural; recebe texto/áudio/imagem/vídeo; `fn-ia-triage` devolve `{resumo, categoria(predial|industrial), urgencia, confianca, midias[]}`; confiança <0.7 → pedir mais mídias; emergência (fumaça/choque/curto) → orientar segurança+urgência; encerra SEMPRE com: "Recebido! Nossa equipe técnica analisa e envia o orçamento no seu WhatsApp." NUNCA cita valores.

## 11. PAINEL ADMIN — MÓDULOS
Dashboard (funil, margem prev×real, caixa 30/60/90, alertas) · CRM Leads (dedup WhatsApp, score, realtime, converter em cliente) · Ficha Cliente multimídia (URLs assinadas) · Motor de Precificação (composer, 3 cenários, templates, aprovação, trilha) · OS/Agenda (equipe, etapas, vínculos) · Monitor de Sync · Financeiro (a receber/pagar, conciliação, DRE por OS) · Fiscal (fila FocusNFe, XML/PDF) · Suprimentos (cotações; melhor = menor custo total ponderado por prazo, destaque verde) · Estoque flutuante · Documentos (ART, laudos, APR/PT, garantia 90d) · Configurações (parâmetros, linhas, recursos, taxas, adicionais, templates).

## 12. PWA FIELD — ESPECIFICAÇÃO OFFLINE
Check-in/out com geo · fotos antes/depois c/ marca d'água (data/hora/OS) · apontamento horas+adicionais · baixa de insumos · assinatura touch offline · TUDO no IndexedDB com outbox: `sync_id` UUID, status pendente|sincronizando|sincronizado|erro, retry exponencial, hash SHA-256, compressão JPEG q0.7 ≤1600px, original sobe depois · `fn-sync-outbox` idempotente · manifest+service worker (instalável).

## 13. LGPD / JURÍDICO
Consentimento na 1ª mensagem (retenção 5 anos); leads descartados anonimizados; URLs assinadas; trilha da assinatura (nome, doc, data/hora, IP, geo, hash do termo, versão, user-agent); termo de garantia 90d com checklist de vistoria (fotos antes/depois, fiações preexistentes registradas).

## 14. MIGRAÇÃO LOCAL (setup único do usuário)
```bash
git clone https://github.com/kiones91/tecmanutencao.git
cd tecmanutencao          # abrir pasta no Antigravity
# na pasta do app Next (package.json):
npm install
# .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON
npm run dev
```

## 15. PROMPTS POR ETAPA (execute UM por vez, aguarde GO)
**P0 — MAPA (sem código):** leia o repo e responda: 1) pasta real do app Next; 2) versão do Tailwind (v3/v4) e configs atuais; 3) rotas e quais usam mocks; 4) estrutura src; 5) lixo a remover; 6) envs necessárias. Aguarde GO.

**P1 — TAILWIND DEFINITIVO (B1):** 1) pipeline coerente com a versão: v4 → postcss `@tailwindcss/postcss` + globals `@import "tailwindcss";` + tokens R6 via @theme; v3 → tailwindcss+autoprefixer + content cobrindo caminhos REAIS; 2) layout raiz importa globals.css; 3) PORTÃO LOCAL: `/` e `/atendimento` estilizadas no browser (amarelo #fcdc5d, zero link azul, zero SVG gigante) + build com CSS >10kB (colar evidências); 4) só então push.

**P2 — AUTH REAL + ZERO MOCKS (B2/B3):** Supabase Auth e-mail/senha + MFA admin; /login /logout; middleware protegendo /admin e /campo; sessão @supabase/ssr; substituir TODOS os mocks pelas tabelas da Seção 6 (migrations aplicadas); realtime em /admin/leads; mídias assinadas; docs/SETUP.md (criar admin + profile role='admin' + secrets OPENAI das edge functions). PORTÃO: lead criado em /atendimento aparece ao vivo no admin.

**P3 — CAMPO OFFLINE + OS + ASSINATURA + MONITOR (B4):** Seções 9+12 completas; testes unit (idempotência, hash) + E2E offline→sync→admin.

**P4 — FINANCEIRO + FISCAL + SUPRIMENTOS + ESTOQUE (B5):** DRE por OS com lucro/hora terceirizada; fila FocusNFe c/ retry/contingência; cotações; estoque_mov.

**P5 — BI + CONTRATOS RECORRENTES (B6).**

**P6 — UNIFICAÇÃO DO SITE (B7, opcional):** portar as 3 páginas de site/ para rotas Next mantendo visual 1:1.

## 16. TODO-BUSINESS (decisões pendentes do sócio)
1) Custo interno (pró-labore) de Kiones/Dioleno/Maike p/ DRE.
2) "Eletricista Montador R$11/h" e "F.C R$23/h" da spec original parecem CUSTO — confirmar ou remover.
3) Legalidade trabalhista de noturno +50% e parada +50%.
4) Calibrar horas_uteis_mes (320) do BDI.
5) Escolher OpenAI vs Gemini p/ Faísca.

## 17. ACEITE GLOBAL POR ETAPA
[ ] Build verde · [ ] Portão local visto no browser · [ ] Testes do core verdes · [ ] Commit pequeno no main · [ ] Deploy Vercel Ready · [ ] Checagem em aba anônima no domínio de produção.
