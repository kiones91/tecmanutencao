# SUPER SPEC V2 — TecManutenções ERP/PWA

Documento mestre com todas as regras de negócio, schema SQL, máquinas de estado e fases de entrega.

## Conteúdo do Documento

1. **Identidade Visual** — Paleta dark industrial obrigatória
2. **Estrutura do Repositório** — Organização em `/site`, `/docs`, `/app`
3. **Regras Anti-Alucinação (R1-R8)** — Restrições de implementação
4. **Regras de Negócio (Motor de Precificação)**
   - Markup Divisor (obrigatório)
   - Impostos por linha (Simples Nacional)
   - BDI (rateio custo fixo)
   - Custo × Venda (tabelas separadas)
   - Adicionais industriais
   - Logística
   - Três cenários de preço
   - Guardas financeiras
5. **Templates de Orçamento (Seeds)**
   - NR12 Turnkey
   - Automação/Retrofit
   - Parada Programada
   - Contrato Mensal
6. **Schema SQL** — migrations Supabase
7. **Máquinas de Estado** — Lead, Orçamento, OS, NF
8. **PWA Público — Captação com IA**
9. **Anti-Abuso do Canal Público**
10. **Painel Admin — Módulos**
11. **PWA Field (Técnico Offline)**
12. **Sync Offline (M3)**
13. **LGPD / Jurídico**
14. **Fases de Entrega (F1-F6)**
15. **Decisões Pendentes**

---

*Este documento é a fonte única da verdade. Informação ausente deve ser marcada com `// TODO-BUSINESS:` e listada em QUESTIONS.*
