# Cardápio Online

Um sistema de gerenciamento de pedidos para restaurantes, criado utilizando HTML, Tailwind CSS e JavaScript.

## Descrição

Este projeto permite que os usuários visualizem o cardápio, adicionem itens ao carrinho e finalizem pedidos. O sistema inclui funcionalidades como:

- Modal para visualização do carrinho.
- Validação de campos de endereço.
- Sistema de envio de pedidos para uma API REST ou WhatsApp.
- Notificações ao usuário com Toastify.
- Verificação de disponibilidade do restaurante baseado em horário.

## Tecnologias Utilizadas

- **HTML**: Estrutura principal do projeto.
- **Tailwind CSS**: Estilização e responsividade.
- **JavaScript**: Funcionalidades dinâmicas e interações.

## Funcionalidades Principais

### 1. Visualização do Cardápio

Os usuários podem navegar pelo cardápio e ver os itens disponíveis.

### 2. Adição ao Carrinho

Itens podem ser adicionados ao carrinho com quantidades dinâmicas e o sistema verifica se o item já existe no carrinho.

### 3. Gerenciamento do Carrinho

- Atualização automática da interface do carrinho.
- Remoção de itens ou diminuição de quantidade.

### 4. Validação de Endereço

O sistema verifica se todos os campos obrigatórios do endereço estão preenchidos antes de enviar o pedido.

### 5. Verificação de Horário de Funcionamento

Pedidos só podem ser feitos durante o horário de funcionamento do restaurante (10:00 - 22:00).

### 6. Envio de Pedidos

- Envia os pedidos via WhatsApp.
- Alternativamente, faz uma requisição POST para uma API REST.

## Estrutura de Arquivos

```
|-- assets
|   |-- bg.png
|   |-- hamb-1.png
|   |-- hamb-2.png
|   |-- hamb-3.png
|   |-- hamb-4.png
|   |-- hamb-5.png
|   |-- hamb-6.png
|   |-- hamb-7.png
|   |-- hamb-8.png
|   |-- refri-1.png
|   |-- refri-2.png
|-- styles
|   |-- output.css
|   |-- styles.css
|-- .gitignore
|-- index.html
|-- package-lock.json
|-- package.json
|-- script.js
|-- tailwind.config.js
```

## Dependências

Certifique-se de instalar as dependências antes de iniciar o projeto.

```bash
npm install
```

## Executando o Projeto

1. Inicie um servidor local para visualizar o projeto. Você pode usar a extensão Live Server no VS Code ou qualquer outro servidor local de sua escolha.

2. Abra o arquivo `index.html` no navegador.

## Configuração do Tailwind CSS

O projeto utiliza o Tailwind CSS para estilização. Certifique-se de que o arquivo `tailwind.config.js` esteja configurado corretamente e que o CSS gerado está sendo aplicado.

## Como Contribuir

1. Fork o repositório.
2. Crie uma nova branch para sua funcionalidade:
   ```bash
   git checkout -b minha-funcionalidade
   ```
3. Adicione suas alterações e faça commit:
   ```bash
   git commit -m "Adiciona nova funcionalidade"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-funcionalidade
   ```
5. Abra um Pull Request para revisão.

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.

