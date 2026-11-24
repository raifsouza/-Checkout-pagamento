# Desafio Frontend — Checkout em Angular

Aplicação frontend de checkout desenvolvida com a versão estável mais recente do **Angular** e estilizada com **Bootstrap** (junto com **Bootstrap Icons**), contemplando o fluxo de pagamento com três telas principais (**Pagamento**, **Sucesso** e **Erro**), além dos estados complementares de validação de cartão, Pix e processamento simulado.

## Framework de Estilo Utilizado

Este projeto utiliza **Bootstrap** para o layout e a responsividade em dispositivos mobile e desktop.

## Como Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio-publico>
   cd <pasta-do-projeto>
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   *(Ou `ng serve`)*

4. **Acesse no navegador:**
   Abra `http://localhost:4200/`.

5. **Build de produção:**
   ```bash
   npm run build
   ```

## Funcionalidades e Telas

* **Pagamento (`/pagamento`):**
  * Exibe o resumo do produto mockado (**Nexo Pro**, resumo curto e valor).
  * Permite alternar entre **Cartão de crédito**, **Cartão de débito** e **Pix**.
  * Nos cartões, valida **número do cartão**, **nome no cartão**, **validade (`MM/AA`)** e **CVV** antes do envio, com feedback visual nos campos.
  * No Pix, apresenta QR Code simulado (identificado sem valor real), código Pix copia-e-cola com botão de copiar e ação para concluir o pagamento.
  * Durante o envio, exibe o estado de **processamento simulado** antes de direcionar para sucesso ou erro.
  * Inclui seletor de simulação (`Aleatório`, `Forçar Sucesso` e `Forçar Erro`) para facilitar os testes do fluxo.
* **Sucesso (`/sucesso`):**
  * Confirma a conclusão do pagamento e exibe os dados do produto e o meio de pagamento utilizado.
  * Protegida por *route guard*: acesso direto pela URL ou atualização de página (*refresh*) sem pagamento concluído redireciona para `/pagamento`.
* **Erro (`/erro`):**
  * Exibe o motivo da falha com mensagem clara e ações para **tentar novamente** ou **escolher outro meio de pagamento**.
  * Protegida por *route guard* para evitar exibição inconsistente em acesso direto ou *refresh* sem contexto de erro.

## Decisões Técnicas e O Que Ficou de Fora

* **Estado compartilhado com Angular Signals:** o `CheckoutStateService` centraliza o produto, o meio selecionado, o status do fluxo, o comprovante e os detalhes de erro, mantendo a sincronia entre componentes e rotas sem necessidade de biblioteca externa.
* **Validação reativa:** o formulário de cartão utiliza *Reactive Forms* com formatação de entrada e validadores síncronos (incluindo verificação de formato e cartão vencido na validade) antes de disparar o processamento.
* **O que ficou de fora e por quê:**
  * **Integração com gateway de pagamento real e backend/persistência:** o