# CRAS Acolhe — MVP 1.0

Portal demonstrativo de pré-atendimento e orientação socioassistencial para o piloto de Piripiri–PI.

> **IMPORTANTE — SOMENTE DEMONSTRAÇÃO:** o portal usa dados fictícios armazenados no `localStorage` do navegador. Não é um canal oficial da Prefeitura, não transmite solicitações ao CRAS e não deve receber dados pessoais verdadeiros. Não utilizar em produção sem autorização institucional e homologação jurídica, de segurança e de proteção de dados.

## Escopo desta entrega

- Portal responsivo do cidadão.
- Catálogo inicial de serviços socioassistenciais.
- Pré-triagem demonstrativa sem CPF, NIS ou Gov.br.
- Protocolo fictício gerado localmente.
- Consulta do protocolo no mesmo navegador.
- Orientações gerais, sem decisão automática de elegibilidade.
- Estrutura inicial de banco Supabase/PostgreSQL com RLS.

O painel de servidores, agendamento real, notificações, integração oficial com Cadastro Único/Gov.br e relatórios ainda não estão implementados.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm 10+

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra o endereço local informado pelo Vite (normalmente `http://localhost:5173`). O modo de demonstração funciona sem projeto Supabase e sem credenciais.

Para validar a compilação:

```bash
npm run build
npm run preview
```

## Estrutura

```text
src/
  data/services.ts       Catálogo demonstrativo
  lib/demoStore.ts       Persistência local fictícia
  lib/supabase.ts        Cliente Supabase opcional
  types/                 Tipos TypeScript
  App.tsx                Portal e fluxos do cidadão
  styles.css             Interface responsiva
supabase/
  migrations/            Schema inicial e políticas RLS
```

## Supabase — preparação, não produção

1. Criar um projeto Supabase institucional aprovado.
2. Revisar região de hospedagem, contrato, subprocessadores, transferências internacionais, retenção, backup e controles de acesso.
3. Executar a migration `supabase/migrations/202611100001_initial_schema.sql` somente em ambiente de desenvolvimento/homologação.
4. Criar contas de servidores por convite administrativo; nunca habilitar auto cadastro público de servidores.
5. Configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local` apenas se necessário para catálogo público.
6. **Nunca** colocar `service_role` no frontend ou em variáveis `VITE_*`.

A migration não cria solicitações de cidadãos. Não há política de `INSERT` público em `service_requests`: o envio público em produção deverá ser implementado por Edge Function, após aprovação, com validação no servidor, rate limit, proteção anti-abuso, registro de consentimento/aviso quando aplicável e regras de base legal definidas pelo controlador.

## Decisões de privacidade já adotadas

- Não solicitar CPF, NIS, documento, laudo, diagnóstico ou relato livre sensível no fluxo inicial.
- Não exigir Cadastro Único para iniciar acolhimento.
- Não consultar bases governamentais.
- Não tomar decisões automatizadas sobre concessão de benefícios.
- Dados fictícios no navegador, sem transmissão ao Supabase.
- A migration restringe solicitações por RLS e unidade para usuários autenticados.

## Antes de qualquer piloto com dados reais

- Formalizar parceria e autorização da Prefeitura/Secretaria responsável.
- Definir controlador, operadores, encarregado e responsabilidades contratuais.
- Mapear finalidade e base legal de cada dado e cada serviço.
- Avaliar necessidade de RIPD e realizar análise de risco.
- Aprovar aviso de privacidade em linguagem simples e canais para exercício de direitos.
- Definir retenção, descarte, backup, resposta a incidentes e atendimento aos titulares.
- Homologar regras municipais de benefícios eventuais e fluxos com equipes SUAS.
- Testar acessibilidade, segurança, autorização por unidade e trilhas de auditoria.
- Estabelecer alternativa presencial e assistida para pessoas sem internet ou documentos disponíveis.

## Próximos incrementos sugeridos

1. Validar catálogo e textos com a gestão municipal e profissionais SUAS.
2. Implementar painel interno autenticado e controle de acesso por unidade.
3. Criar Edge Function protegida para criação de pré-solicitações, sem campos desnecessários.
4. Adicionar fluxo de agendamento somente após integração com agenda institucional.
5. Criar indicadores agregados, sem exposição de dados pessoais.

## Licença e uso

Código inicial preparado para avaliação e desenvolvimento do projeto. A adoção institucional exige revisão técnica, jurídica e administrativa.
