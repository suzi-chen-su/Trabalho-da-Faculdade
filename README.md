# Delícia de Cupcakes

## Sobre o projeto

Delícia de Cupcakes é um sistema web para vendas de cupcakes e trata-se do Projeto Integrador Transdisciplinar em Engenharia de Software II, da Universidade Cruzeiro do Sul, também conhecida como UNICID.

O site funciona tanto no formato web quanto no formato mobile, e possibilita que o cliente consulte os produtos, realize o cadastro e login, consulte e edite seus dados, gerencie o carrinho de compras, realize pedidos e avalie as compras.

Também foi desenvolvido uma área do administrador para que o vendedor consiga gerenciar e consultar ou atualizar dados básicos como Usuários cadastrados, Produtos, Pedidos e Vendas.

Por se tratar de um projeto acadêmico, esse site de vendas não é um projeto real para o mercado, ou seja, o objetivo desse site foi aplicar os conhecimentos adquiridos durante o curso e testa-los na pratica.

## Objetivo

Esse projeto acadêmico tem como objetivo apresentar um sistema de vendas responsiva para visualização de produtos, cadastro de usuários, realização de pedidos e gerenciamento administrativo.

O projeto foi pensado e desenvolvido tendo em mente uma aplicação web funcional para uma loja virtual e fictícia de cupcakes, que pudesse proporcionar uma experiencia simples e intuitiva para o cliente e para o administrador.

Da perspectiva acadêmica, o objetivo foi alcançado, pois foram aplicaddos vários conceitos aprendidos durante o curso de Engenharia de Software para esse projeto, como conhecimento de desenvolvimento web, integração entre frontend e backend, banco de dados e organização de software utilizando o padrão arquitetural MVC e conceitos de metodologias ágeis.

## Documentação

A documentação e os testes do projeto estão disponíveis na pasta **docs**, e possui os seguintes documentos em pdf:

- Documentação do banco de dados;
- Testes de verificação e validação;
- Testes realizados com usuários.

## Funcionalidades
### Área do Cliente
- Cadastro de usuários
- Login de usuários
- Visualização e edição dos dados da conta
- Visualização da página inicial
- Visualização do cardápio
- Visualização de avaliações
- Visualização das minhas compras
- Adição de produtos ao carrinho
- Alteração da quantidade de produtos
- Remoção de produtos do carrinho
- Finalização de pedidos


### Carrinho e checkout

- Adição de produtos ao carrinho
- Controle de quantidade
- Cálculo do subtotal
- Cálculo do frete
- Cálculo do valor total
- Resumo do pedido antes da confirmação
- Formulário de dados para o pedido
- Cadastro do pedido no banco de dados
- Escolha da forma de pagamento
- Opção de parcelamento para pagamentos com cartão
- Visualização dos dados do pedido

### Área administrativa

- Login administrativo
- Visualização dos usuários cadastrados
- Visualização de produtos
- Visualização de pedidos
- Visualização das vendas
- Cadastro e edição de produtos
- Ativação e desativação de produtos
- Upload de imagens dos produtos
- Alteração do status do pedido
- Visualização dos produtos mais vendidos


## Tecnologias utilizadas
### Frontend
- HTML5
- CSS3
- JavaScript
- jQuery
- Font Awesome

### Backend
- Python
- Flask
- Flask-CORS
- SQLite
- Arquitetura MVC

### Ferramentas
- Visual Studio Code (VSCode)
- Git
- GitHub
- Jira
- Live Server

## Arquitetura

O backend do sistema foi desenvolvido utilizando o padrão arquitetural
**MVC (Model-View-Controller)**.

A aplicação foi dividida em diferentes responsabilidades:

- **Model:** responsável pelo acesso e manipulação dos dados no banco de dados.
- **Controller:** responsável pelas regras de negócio e pelo processamento das
  requisições.
- **View:** representada pela interface frontend da aplicação.

Essa organização facilita a manutenção, a organização e a evolução do sistema.

## Banco de dados

O projeto utiliza o **SQLite** como banco de dados.

Entre as principais informações armazenadas estão:

- Usuários
- Produtos
- Pedidos
- Dados relacionados às vendas

## Como executar

Para executar o sistema web, será necessário instalar:
- Visual Studio Code (VSCode);
- Extensão Live Server para o Visual Studio Code
- Python 3;
- Git

### 1. Clonar o repositório

Clone este repositório utilizando o Git:

```bash
git clone https://github.com/suzi-chen-su/Trabalho-da-Faculdade.git
```

Depois, acesse a pasta do projeto:
cd Delicia-de-Cupcakes

### 2. Executar o backend
Abra o projeto no Visual Studio Code.
Em seguida, abra o terminal integrado do VSCode e acesse a pasta do backend digitando o comando:
```bash
cd backend
```
Instale as dependências necessárias com o comando:
```bash
pip install flask flask-cors
```

Depois, execute o arquivo principal da aplicação com o comando:
```bash
python app.py
```

Se o servidor for iniciado corretamente, a API estará disponível em:
http://127.0.0.1:5000

**Importante:** mantenha o backend em execução enquanto estiver utilizando o sistema, pois o frontend depende da API Flask para acessar e manipular os dados do banco de dados.

### 3. Configurar o Live Server

Para executar o frontend utilizando o Live Server, é necessário configurar o Host como `127.0.0.2`, então abra o Visual Studio Code e:
- Abra Configurações (Ctrl + ,).
- Pesquise por Live Server Settings: Host
- Altere o seu valor para `127.0.0.2`

### 4. Executar o frontend com Live Server

No Visual Studio Code, localize os arquivos:
- Trabalho-PIT-II\index.html
- Trabalho-PIT-II\admin-login.html

Clique com o botão direito sobre o arquivo e selecione:
- Open with Live Server

Ou selecione o arquivo e clique no botão **Go Live** que aparece no canto inferior direito da tela.

O site será aberto automaticamente no navegador.

**Importante:** mantenha o backend em execução enquanto estiver utilizando
o sistema, pois o frontend depende da API Flask para acessar os dados do
banco de dados. Caso contrário, funcionalidades que dependem do backend podem apresentar erro ou não mostrar os dados atualizados.