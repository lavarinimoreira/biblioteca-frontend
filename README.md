# Projeto Frontend Next.js

Frontend responsável por consumir a API de gerenciamento de biblioteca.
Você pode instalar o backend seguindo as instruções em [https://github.com/lavarinimoreira/api-biblioteca-microservices](https://github.com/lavarinimoreira/api-biblioteca-microservices)

## Pré-requisitos

- Node.js
- npm ou yarn
- [API backend em execução](https://github.com/lavarinimoreira/api-biblioteca-microservices)

## Configuração do Ambiente

1. Crie um arquivo **.env.local** na raiz do projeto.
2. Adicione as seguintes variáveis de ambiente ao arquivo:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   API_URL=http://localhost:8000
   ```

## Instalação
1. Clone o repositório:

    ```bash
    git clone https://github.com/lavarinimoreira/biblioteca-frontend
    ```
2. Entre no diretório:
    ```bash
    cd biblioteca-frontend
    ```
3. Instale as dependências:

    ```bash
    npm install
    ```

4. Para rodar o projeto, execute:
    ```bash
    npm run dev
    ```
Abra http://localhost:3000 no seu navegador para visualizar a aplicação.