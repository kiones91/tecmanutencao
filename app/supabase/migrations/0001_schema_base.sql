-- ============================================
-- MIGRATION 0001: Schema Base - TecManutenções ERP
-- ============================================

-- PERFIS E AUTENTICAÇÃO
create type user_role as enum ('admin','tecnico','financeiro','sistema');

create table profiles (
  id uuid primary key references auth.users(id),
  role user_role not null default 'tecnico',
  nome text not null,
  email text unique,
  criado_em timestamptz default now()
);

-- CRM
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text unique,
  cpf_cnpj text,
  tipo text check (tipo in ('predial','industrial','ambos')),
  endereco jsonb,
  observacoes text,
  criado_em timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  whatsapp text,
  origem text,
  sessao_id text,
  ip inet,
  user_agent text,
  payload_ia jsonb,
  score int,
  status text not null default 'novo' check (status in
    ('novo','confirmado','qualificado','duplicado','invalido','convertido','descartado')),
  cliente_id uuid references clientes(id),
  criado_em timestamptz default now()
);

create table midias (
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

-- PRECIFICAÇÃO
create table linhas_servico (
  id uuid primary key default gen_random_uuid(),
  codigo text unique not null,
  nome text not null,
  anexo text not null default 'III' check (anexo in ('III','V')),
  ativa boolean default true
);

create table recursos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text check (tipo in
    ('socio_senior','socio_pleno','engenheiro','eletricista','ajudante','freelancer')),
  ativo boolean default true
);

create table taxas_recurso (
  id uuid primary key default gen_random_uuid(),
  recurso_id uuid references recursos(id),
  linha_id uuid references linhas_servico(id),
  unidade text check (unidade in ('hora','dia')),
  custo numeric(10,2) not null,
  venda numeric(10,2) not null,
  venda_max numeric(10,2),
  vigencia_de date not null,
  vigencia_ate date,
  unique (recurso_id, linha_id, vigencia_de)
);

create table parametros_financeiros (
  id int primary key default 1,
  margem_padrao numeric(5,2) default 20,
  imposto_anexo3 numeric(5,2) default 6,
  imposto_anexo5 numeric(5,2) default 15.5,
  fator_r boolean default true,
  markup_material_min numeric(5,2) default 20,
  markup_material_max numeric(5,2) default 30,
  custo_fixo_mensal_min numeric(12,2) default 9000,
  custo_fixo_mensal_max numeric(12,2) default 13000,
  horas_uteis_mes numeric(8,2) default 320,
  km_min numeric(6,2) default 1.8,
  km_max numeric(6,2) default 2.5,
  alimentacao_dia numeric(8,2) default 70,
  saida_minima numeric(10,2) default 50,
  garantia_dias int default 90,
  art_padrao numeric(10,2) default 120,
  atualizado_em timestamptz default now()
);

create table adicionais (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nome text,
  tipo text check (tipo in ('percentual','fixo_dia','fixo_projeto')),
  valor numeric(10,2),
  ambito text check (ambito in ('custo','venda','ambos')),
  linha_id uuid references linhas_servico(id)
);

-- ORÇAMENTOS
create table orcamentos (
  id uuid primary key default gen_random_uuid(),
  codigo serial unique,
  cliente_id uuid references clientes(id),
  lead_id uuid references leads(id),
  linha_id uuid references linhas_servico(id),
  status text default 'rascunho' check (status in
    ('rascunho','revisao','aprovado_interno','enviado','aceito','recusado','expirado','convertido')),
  modo text default 'fechado' check (modo in ('fechado','aberto')),
  validade_dias int default 7,
  premissas text,
  exclusoes text,
  totais jsonb,
  versao int default 1,
  aprovado_por uuid references profiles(id),
  criado_em timestamptz default now()
);

create table orcamento_itens (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  tipo text check (tipo in ('servico','material','logistica','adicional','terceiro','taxa','bdi')),
  descricao text not null,
  recurso_id uuid references recursos(id),
  qtd numeric(10,2),
  unidade text,
  custo_unit numeric(12,2),
  venda_unit numeric(12,2),
  custo_total numeric(12,2),
  venda_total numeric(12,2),
  meta jsonb
);

create table templates_orcamento (
  id uuid primary key default gen_random_uuid(),
  linha_id uuid references linhas_servico(id),
  nome text,
  itens jsonb,
  faixa_ref jsonb
);

-- OS / CAMPO
create table ordens_servico (
  id uuid primary key default gen_random_uuid(),
  codigo serial unique,
  orcamento_id uuid references orcamentos(id),
  cliente_id uuid references clientes(id),
  linha_id uuid references linhas_servico(id),
  status text default 'criada' check (status in
    ('criada','agendada','em_execucao','aguardando_cliente','concluida','assinada',
     'faturada','encerrada','garantia','cancelada')),
  inicio_previsto date,
  fim_previsto date,
  endereco jsonb,
  responsavel_tecnico uuid references profiles(id),
  criado_em timestamptz default now()
);

create table os_equipe (
  os_id uuid references ordens_servico(id),
  recurso_id uuid references recursos(id),
  papel text,
  primary key (os_id, recurso_id)
);

create table apontamentos (
  id uuid primary key default gen_random_uuid(),
  sync_id uuid not null unique,
  os_id uuid references ordens_servico(id),
  recurso_id uuid references recursos(id),
  data date not null,
  inicio timestamptz,
  fim timestamptz,
  horas numeric(6,2),
  adicionais jsonb,
  geo jsonb,
  sync_status text default 'pendente'
);

create table os_eventos (
  id uuid primary key default gen_random_uuid(),
  sync_id uuid unique,
  os_id uuid references ordens_servico(id),
  tipo text,
  payload jsonb,
  criado_em timestamptz default now()
);

create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  sync_id uuid unique,
  os_id uuid references ordens_servico(id),
  signatario_nome text,
  signatario_doc text,
  imagem_path text,
  hash_documento text,
  ip inet,
  geo jsonb,
  user_agent text,
  termo_versao int,
  assinado_em timestamptz default now()
);

-- FINANCEIRO / FISCAL / SUPRIMENTOS
create table lancamentos_financeiros (
  id uuid primary key default gen_random_uuid(),
  os_id uuid references ordens_servico(id),
  tipo text check (tipo in ('receber','pagar')),
  categoria text,
  descricao text,
  valor numeric(12,2) not null,
  vencimento date,
  pago boolean default false,
  pago_em date,
  soft_delete boolean default false
);

create table notas_fiscais (
  id uuid primary key default gen_random_uuid(),
  os_id uuid references ordens_servico(id),
  numero text,
  chave text,
  status text check (status in ('fila','processando','autorizada','rejeitada','cancelada')),
  xml_path text,
  pdf_path text,
  erro text,
  tentativas int default 0
);

create table fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text,
  cnpj text,
  contato text
);

create table cotacoes (
  id uuid primary key default gen_random_uuid(),
  os_id uuid,
  fornecedor_id uuid references fornecedores(id),
  descricao text,
  valor numeric(12,2),
  frete numeric(12,2),
  prazo_dias int,
  condicao text,
  validade_dias int,
  anexo_path text,
  status text default 'recebida',
  melhor boolean default false
);

create table insumos (
  id uuid primary key default gen_random_uuid(),
  nome text,
  unidade text,
  estoque_min numeric,
  custo_medio numeric
);

create table estoque_mov (
  id uuid primary key default gen_random_uuid(),
  insumo_id uuid references insumos(id),
  os_id uuid,
  qtd numeric,
  tipo text check (tipo in ('entrada','saida','devolucao')),
  criado_em timestamptz default now()
);

create table documentos (
  id uuid primary key default gen_random_uuid(),
  owner_type text,
  owner_id uuid,
  tipo text,
  storage_path text,
  meta jsonb
);

create table auditoria (
  id bigserial primary key,
  user_id uuid,
  acao text,
  tabela text,
  registro_id uuid,
  antes jsonb,
  depois jsonb,
  ip inet,
  criado_em timestamptz default now()
);

-- RLS E POLÍTICAS
alter table profiles enable row level security;
alter table clientes enable row level security;
alter table leads enable row level security;
alter table midias enable row level security;
alter table orcamentos enable row level security;
alter table orcamento_itens enable row level security;
alter table ordens_servico enable row level security;
alter table apontamentos enable row level security;
alter table assinaturas enable row level security;
alter table lancamentos_financeiros enable row level security;
alter table notas_fiscais enable row level security;
alter table auditoria enable row level security;

-- Helper de role
create or replace function app_role() returns text language sql stable as $$
  select coalesce((select role::text from profiles where id = auth.uid()), 'publico');
$$;

-- Políticas base
create policy "admin all profiles" on profiles for all using (app_role() = 'admin');
create policy "admin all clientes" on clientes for all using (app_role() = 'admin');
create policy "admin all leads" on leads for all using (app_role() = 'admin');
create policy "admin all orcamentos" on orcamentos for all using (app_role() = 'admin');
create policy "admin all os" on ordens_servico for all using (app_role() = 'admin');
create policy "tecnico own os" on ordens_servico for select using (
  app_role() = 'tecnico' and responsavel_tecnico = auth.uid()
);
create policy "tecnico own apontamentos" on apontamentos for all using (
  app_role() = 'tecnico' and recurso_id in (select id from recursos where nome = (select nome from profiles where id = auth.uid()))
);
create policy "auditoria read only" on auditoria for select using (app_role() = 'admin');
create policy "no delete financeiro" on lancamentos_financeiros for delete using (false);
create policy "no delete fiscal" on notas_fiscais for delete using (false);

-- SEEDS INICIAIS
INSERT INTO parametros_financeiros (id, margem_padrao, imposto_anexo3, imposto_anexo5, fator_r, markup_material_min, markup_material_max, custo_fixo_mensal_min, custo_fixo_mensal_max, horas_uteis_mes, km_min, km_max, alimentacao_dia, saida_minima, garantia_dias, art_padrao)
VALUES (1, 20, 6, 15.5, true, 20, 30, 9000, 13000, 320, 1.8, 2.5, 70, 50, 90, 120)
ON CONFLICT (id) DO NOTHING;

-- Linhas de serviço
INSERT INTO linhas_servico (codigo, nome, anexo) VALUES
  ('NR12', 'NR12 Turnkey', 'III'),
  ('AUTO', 'Automação/Retrofit', 'V'),
  ('PARADA', 'Parada Programada', 'III'),
  ('MANUT', 'Manutenção Preventiva', 'III');

-- Recursos
INSERT INTO recursos (nome, tipo) VALUES
  ('Kiones', 'socio_senior'),
  ('Dioleno', 'socio_pleno'),
  ('Maike', 'engenheiro'),
  ('Eletricista Industrial', 'eletricista'),
  ('Ajudante', 'ajudante'),
  ('Freelancer', 'freelancer');

-- Adicionais industriais
INSERT INTO adicionais (codigo, nome, tipo, valor, ambito) VALUES
  ('PERICULOSIDADE', 'Periculosidade (linha viva/AT/MT)', 'percentual', 30, 'venda'),
  ('NOTURNO', 'Noturno (22h-05h)', 'percentual', 50, 'venda'),
  ('PARADA_FDS', 'Parada de fábrica / fim de semana', 'percentual', 50, 'venda'),
  ('NR33', 'NR-33 Espaço Confinado', 'fixo_dia', 80, 'custo'),
  ('NR35', 'NR-35 Altura', 'fixo_dia', 80, 'custo'),
  ('EXPLOSAO', 'Atmosfera explosiva / planta química', 'fixo_dia', 100, 'custo'),
  ('RUIDO', 'Ruído/poeira/peçonhentos', 'fixo_dia', 50, 'custo');
