# SETUP FASE 2 — CAPTAÇÃO (FAÍSCA + CRM)

## 📋 PRÉ-REQUISITOS

1. **Conta Supabase** criada em https://supabase.com
2. **Conta OpenAI** com API Key (para Whisper e Vision API)
3. **Conta Cloudflare Turnstile** (opcional, para produção)

---

## 🔧 1. CRIAR PROJETO SUPABASE

1. Acesse https://supabase.com → "New Project"
2. Escolha organização, nome do projeto e senha do banco
3. Aguarde provisionamento (~2 min)

---

## 🗄️ 2. APLICAR MIGRATIONS

No dashboard do Supabase → SQL Editor, execute:

### 2.1 Migration principal (já existe em `app/supabase/migrations/0001_schema_base.sql`)

Copie o conteúdo do arquivo e execute no SQL Editor.

### 2.2 Migration específica de leads/clientes/mídias

```sql
-- Tabela de leads (CRM)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  cpf_cnpj text,
  origem text default 'faísca-web',
  sessao_id text,
  ip inet,
  user_agent text,
  payload_ia jsonb,
  score int default 50,
  status text not null default 'novo' check (status in (
    'novo','confirmado','qualificado','duplicado','invalido','descartado','convertido'
  )),
  cliente_id uuid references clientes(id),
  criado_em timestamptz default now()
);

-- Tabela de mídias
create table if not exists midias (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null,
  owner_id uuid not null,
  tipo text check (tipo in ('imagem','video','audio','documento')),
  storage_path text not null,
  mime text,
  tamanho bigint,
  hash text,
  thumb_path text,
  meta jsonb,
  criado_em timestamptz default now()
);

-- Índices para performance
create index idx_leads_whatsapp on leads(whatsapp);
create index idx_leads_status on leads(status);
create index idx_leads_criado_em on leads(criado_em desc);
create index idx_midias_owner on midias(owner_type, owner_id);

-- RLS (Row Level Security)
alter table leads enable row level security;
alter table midias enable row level security;

-- Políticas de acesso
create policy "admin all leads" on leads for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

create policy "admin all midias" on midias for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- Publication para realtime
alter publication supabase_realtime add table leads;
```

---

## 🔑 3. CONFIGURAR VARIÁVEIS DE AMBIENTE

Crie `.env.local` na raiz do projeto `app/`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON

# Edge Functions (segredos do servidor - configurar no Supabase Dashboard)
# Ir para: Project Settings → Edge Functions → Secrets
# Adicionar:
# - OPENAI_API_KEY=sk-...
# - SUPABASE_URL (mesma da acima)
# - SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE

# Cloudflare Turnstile (opcional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

### 3.1 Configurar Secrets nas Edge Functions

No terminal, com Supabase CLI instalado:

```bash
cd app
supabase login
supabase link --project-ref SEU_PROJECT_REF

# Adicionar secrets
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

---

## 🪣 4. CONFIGURAR BUCKETS DE STORAGE

No dashboard do Supabase → Storage:

### 4.1 Bucket `temp-public` (quarentena 24h)

```bash
# Via CLI ou interface web
# Criar bucket chamado "temp-public"
# Política: público apenas para upload, privado para leitura
```

SQL para política:

```sql
-- Criar bucket se não existir
insert into storage.buckets (id, name, public) 
values ('temp-public', 'temp-public', false)
on conflict (id) do nothing;

-- Política de upload público (com limitações)
create policy "Upload público temp"
on storage.objects for insert
with check (bucket_id = 'temp-public');

-- Política de leitura apenas admin
create policy "Leitura admin temp"
on storage.objects for select
using (auth.uid() in (select id from profiles where role = 'admin'));
```

### 4.2 Bucket `clientes` (mídias qualificadas)

```sql
insert into storage.buckets (id, name, public) 
values ('clientes', 'clientes', false)
on conflict (id) do nothing;

create policy "Admin full access clientes"
on storage.objects for all
using (auth.uid() in (select id from profiles where role = 'admin'))
with check (auth.uid() in (select id from profiles where role = 'admin'));
```

---

## 🤖 5. CONFIGURAR EDGE FUNCTIONS

### 5.1 Deploy das functions

```bash
cd app/supabase/functions

# Deploy fn-ia-triage
supabase functions deploy fn-ia-triage

# Deploy fn-lead-capture
supabase functions deploy fn-lead-capture
```

### 5.2 URLs das functions

Após deploy, anote as URLs:
- `https://SEU_PROJETO_REF.supabase.co/functions/v1/fn-ia-triage`
- `https://SEU_PROJETO_REF.supabase.co/functions/v1/fn-lead-capture`

Atualize o código em `src/app/(public)/atendimento/page.tsx` com a URL correta.

---

## 🧪 6. TESTES LOCAIS

### 6.1 Rodar desenvolvimento

```bash
cd app
npm run dev
```

Acesse: `http://localhost:3000/atendimento`

### 6.2 Testar fluxo completo

1. Preencher formulário com nome, WhatsApp e descrição
2. Upload de imagem/vídeo (até 3 mídias)
3. Submeter → deve criar lead no Supabase
4. Acessar `/admin/leads` → ver lead em tempo real
5. Testar ações: confirmar, qualificar, converter

---

## 🚨 7. PRODUÇÃO — CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas na Vercel/Netlify
- [ ] Secrets do Supabase configurados (OpenAI, Service Role Key)
- [ ] Buckets de storage criados com políticas corretas
- [ ] Edge Functions deployadas
- [ ] Migrações aplicadas no banco
- [ ] Domínio personalizado configurado (opcional)
- [ ] HTTPS habilitado
- [ ] Teste de carga realizado (rate limiting funcionando)

---

## 📊 MONITORAMENTO

### Logs das Edge Functions

```bash
supabase functions logs fn-ia-triage
supabase functions logs fn-lead-capture
```

### Dashboard Supabase

- Logs de banco em: Dashboard → Database → Query Performance
- Usage de API em: Dashboard → Home → API Stats

---

## ❓ TROUBLESHOOTING

### Erro: "Invalid API Key"
- Verifique se `OPENAI_API_KEY` está configurada nos secrets da function
- Teste a key separadamente: `curl https://api.openai.com/v1/models -H "Authorization: Bearer sk-..."`

### Erro: "Bucket not found"
- Execute o SQL de criação dos buckets
- Verifique permissões no dashboard Storage

### Leads não aparecem em realtime
- Confirme que `alter publication supabase_realtime add table leads;` foi executado
- Verifique políticas RLS

---

**Próxima fase:** F3 — Precificação (motor + templates + composer + aprovação)
