# Racha
Trabalho prático de Engenharia de Software 2.

Divide despesas entre amigos e mostra quem deve quanto pra quem. Roda direto no navegador, sem login e sem servidor.

## Integrantes

- Lean Henrique Pereira Miranda
- Luis Felipe Belasco Silva
- Pedro Henrique Egito Aguiar

## Sobre o sistema

O Racha resolve o "quem deve quanto pra quem" depois de um rolê. Você cadastra as pessoas, lança as despesas dizendo quem pagou e quem consumiu, e ele calcula o saldo de cada um e o menor jeito razoável de acertar as contas.

Funcionalidades:

- Cadastro de pessoas, com chave Pix opcional
- Despesas com valor, pagador e participantes, divididas igualmente ou por pesos
- Gorjeta em porcentagem, somada antes do rateio
- Rateio sempre fechando no centavo: R$ 100,00 entre 3 dá 33,34 + 33,33 + 33,33
- Saldo por pessoa e lista de quem paga quem
- Resumo pronto pra colar no WhatsApp
- Link de compartilhamento, com o racha inteiro dentro da própria URL
- Pix copia e cola e QR code para cada transferência

Os dados ficam no navegador (localStorage). Não tem backend, banco de dados nem login.

## Tecnologias

- **TypeScript**: tipagem nos cálculos de dinheiro, onde um erro de tipo vira centavo sumindo.
- **React**: a interface é só um conjunto de formulários e listas, e o React deixa isso simples de montar e testar.
- **Vite**: build rápido e servidor de desenvolvimento sem configuração.
- **Vitest + cobertura V8**: testes de unidade rodando no mesmo pipeline do Vite, com limite mínimo de 80% de cobertura.
- **Testing Library + jsdom**: testes dos componentes pelo que o usuário vê (rótulos e botões), não pela implementação.
- **Playwright**: testes de ponta a ponta no Chromium, contra o build de produção.
- **qrcode**: gera o QR code do Pix em SVG.
- **GitHub Actions**: roda typecheck, testes, cobertura e e2e em Linux, macOS e Windows a cada push.
- **Cloudflare Pages**: hospeda o site estático de graça e publica sozinho a cada merge na main.

A regra de negócio fica toda em `src/domain`, em funções puras que não conhecem React nem o navegador. A interface (`src/ui`) só desenha e repassa, o estado fica no hook `useRacha` (`src/state`) e o acesso ao navegador (localStorage, URL e clipboard) fica em `src/adapters`.

## Uso de IA

| Ferramenta | Onde foi usada | O que gerou | O que o grupo revisou ou mudou |
|---|---|---|---|
| Claude (chat) | Ajuda na definição de escopo | Gerou opções de caminho a seguir, sem fugir da ideia, mas também sem deixar simples demais | O grupo revisou o planejamento |
| Claude (code) | Revisão de código localmente | Qualidade de código e criação de guardrails e testes melhores na aplicação | Revisão de código |
| Claude (code) | Formatação de mensagens | Reescrita de mensagens de commit, PR, review para favorecer padronização e facilitar o entendimento | Muitas vezes o grupo criou mensagens grandes e complicadas, principalmente em peer review (fizemos em call). A IA ajudou a organizar e resumir sem perder informação
| Claude (chat) | Revisão do roteiro do vídeo | Ajuda na elaboração do roteiro para não passarmos do tempo mas também não deixar de apresentar toda a aplicação | Revisamos o tempo de fala e a navegação |
| Claude (code) | Revisão dos Actions e de deploy | Verificação dos workflows e da arquitetura planejada | Melhorias na CI e algumas configurações do CloudFlare que passaram despercebidas |

## Execução dos testes

Precisa do Node 22 ou mais novo. Na primeira vez, instale as dependências:

```bash
npm ci
```

### Testes de unidade

```bash
npm test
```

Roda com o Vitest os testes de `src/domain` (dinheiro, rateio, saldos, transferências, link, resumo do WhatsApp, validação e Pix), de `src/adapters`, do hook `useRacha` e dos componentes da interface (com Testing Library e jsdom).

### Cobertura

```bash
npm run coverage
```

Mostra a tabela de cobertura no terminal e gera o relatório em `coverage/lcov-report/index.html`. O comando falha se linhas, funções, branches ou statements ficarem abaixo de 80%.

### Testes de ponta a ponta

```bash
npm run e2e:install
npm run e2e
```

O primeiro comando baixa o Chromium do Playwright (só precisa uma vez). O segundo gera o build de produção, sobe o `vite preview` na porta 4173 e roda os testes de `e2e/`: o Jantar de sexta com as três transferências e o resumo, a divisão com pesos e gorjeta, a remoção de uma despesa, o racha mantido depois de recarregar a página e o link compartilhado aberto em outro navegador. Para ver o navegador abrindo, use `npx playwright test --headed`.

### Na CI

A cada push e pull request, o GitHub Actions roda `typecheck`, `coverage` e `e2e` em Ubuntu, macOS e Windows. Os relatórios de cobertura e do Playwright ficam como artefatos da execução por 7 dias.

## Vídeo

(link a inserir)
