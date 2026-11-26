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

## Execução dos testes

(a preencher)
