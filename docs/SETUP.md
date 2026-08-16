# 🚀 GUIA DE SETUP E IMPLANTAÇÃO — TecManutenções ERP

Este guia contém as instruções passo a passo para configurar o Supabase, criar o usuário Administrador inicial e habilitar os recursos em tempo real e storage.

---

## 1. Criar o Primeiro Usuário Administrador (Supabase Auth)

1. Acesse o painel do seu projeto no Supabase: [https://app.supabase.com](https://app.supabase.com)
2. No menu lateral esquerdo, vá em **Authentication** → **Users**.
3. Clique no botão **Add user** → **Create user**.
4. Preencha:
   * **Email:** `admin@tecmanutencao.com.br` (ou seu e-mail de preferência)
   * **Password:** Defina uma senha segura.
   * **Auto Confirm User:** Marque como **SIM** (para não precisar confirmar por e-mail).
5. Clique em **Create user** e copie o **User UID** gerado (exemplo: `a1b2c3d4-e5f6-...`).

---

## 2. Vincular o Perfil como Administrador (`profiles`)

Vá no menu **SQL Editor** do Supabase e execute o seguinte comando, substituindo pelo UID do usuário criado acima:

```sql
insert into profiles (id, role, nome)
values (
  'SEU_USER_UID_AQUI'::uuid,
  'admin',
  'Kiones Peregrino - Administrador'
)
on conflict (id) do update set role = 'admin';
```

Agora você já pode fazer login na rota `/login` com esse e-mail e senha!

---

## 3. Habilitar o Supabase Realtime para a tabela `leads`

Para que os leads apareçam ao vivo na tela do CRM sem precisar dar F5:

1. No painel do Supabase, vá em **Database** → **Replication** (ou **Publications**).
2. Clique na publicação `supabase_realtime`.
3. Certifique-se de que a tabela **`leads`** está marcada com o toggle ativado.
4. Caso prefira via SQL, execute no **SQL Editor**:
   ```sql
   alter publication supabase_realtime add table leads;
   ```

---

## 4. Criar os Buckets de Armazenamento (Storage)

No menu **Storage** do Supabase, crie os seguintes buckets:

1. **`temp-public`** (Público: SIM) — Usado para receber fotos e áudios de clientes no `/atendimento`.
2. **`clientes`** (Público: NÃO) — Documentos e cadastros de clientes.
3. **`os`** (Público: NÃO) — Fotos antes/depois de vistorias técnicas e assinaturas de OS.
4. **`docs`** (Público: NÃO) — Laudos técnicos, APRs e termos de garantia.
5. **`fiscal`** (Público: NÃO) — XMLs e PDFs de notas fiscais.

---

## 5. Variáveis de Ambiente no Vercel

No painel do projeto na Vercel (**Settings** → **Environment Variables**), adicione:

* `NEXT_PUBLIC_SUPABASE_URL`: `https://kbcsuexsunxehcswxule.supabase.co`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
* `NEXT_PUBLIC_APP_URL`: `https://tecmanutencao.vercel.app`
