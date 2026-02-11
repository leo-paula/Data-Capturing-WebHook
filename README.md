

# Data Capturing WebHook

Este projeto é uma aplicação web de captura de dados que salva informações em um banco de dados local e envia os dados para uma planilha do Google Sheets através de um WebHook.

## Histórico do Projeto

Este projeto foi desenvolvido como uma solução para capturar registros de um formulário, armazená-los localmente e também em uma planilha do Google para fácil acesso e gerenciamento. A aplicação é construída com Next.js e utiliza um `json-server` para simular um banco de dados local.

## Pré-requisitos

Antes de começar, você precisará ter o seguinte software instalado em sua máquina:

-   [Node.js](https://nodejs.org/) (que inclui o npm)
-   [Git](https://git-scm.com/)

### Guia de Instalação

#### Windows

Você pode instalar o Node.js e o Git usando o gerenciador de pacotes `winget`, que já vem com o Windows.

1.  **Instale o Git:**
    ```bash
    winget install -e --id Git.Git
    ```

2.  **Instale o Node.js (LTS):**
    ```bash
    winget install -e --id OpenJS.NodeJS.LTS
    ```

Após a instalação, feche e reabra o terminal (PowerShell ou Prompt de Comando) para que os comandos `git` e `npm` fiquem disponíveis.

#### Linux (Sistemas baseados em Debian/Ubuntu)

1.  **Atualize seu gerenciador de pacotes:**
    ```bash
    sudo apt update
    ```

2.  **Instale o Git:**
    ```bash
    sudo apt install git
    ```

3.  **Instale o Node.js e o npm:**
    ```bash
    sudo apt install nodejs npm
    ```

## Configuração do Projeto

Siga as instruções abaixo para configurar o ambiente de desenvolvimento em seu sistema operacional.

### Windows

1.  **Abra o PowerShell ou o Prompt de Comando.**

2.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd Data-Capturing-WebHook
    ```

3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

### Linux

1.  **Abra o terminal.**

2.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd Data-Capturing-WebHook
    ```

3.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

## Configuração do Google Sheets e Apps Script

Para que o WebHook funcione, você precisa configurar uma planilha no Google Sheets e um script do Google Apps.

1.  **Crie uma nova planilha no [Google Sheets](https://sheets.new).**

2.  Com a planilha aberta, vá em **Extensões > Apps Script**.

3.  **Copie o código** do arquivo `google/sheet_handlers.js` que está neste projeto e cole no editor do Apps Script, substituindo qualquer código que já esteja lá.

4.  **Salve o projeto** do script (dê um nome a ele, como "WebHook").

5.  **Implemente o script como um aplicativo da web:**
    -   Clique em **Implantar > Nova implantação**.
    -   Selecione o tipo de implantação como **"App da Web"**.
    -   Em "Configuração", preencha:
        -   **Descrição:** "WebHook para captura de dados"
        -   **Executar como:** "Eu"
        -   **Quem pode acessar:** "Qualquer pessoa" (Isso é importante para que a aplicação possa enviar dados).
    -   Clique em **Implantar**.

6.  **Autorize o script** a acessar sua conta do Google quando solicitado.

7.  **Copie a URL do aplicativo da web** fornecida após a implantação. Você precisará dela no próximo passo.

8.  **Compartilhe a planilha:**
    -   Volte para a sua planilha.
    -   Clique em **Compartilhar** no canto superior direito.
    -   Em "Acesso geral", mude para **"Qualquer pessoa com o link"** e defina a permissão como **"Editor"**.
    -   Copie o link de compartilhamento.

9.  **Atualize o código da aplicação:**
    -   Você precisará substituir a URL do WebHook no código da aplicação pela URL que você copiou no passo 7. Procure nos arquivos da pasta `app/api/` pelas URLs do `fetch` que apontam para `script.google.com` e substitua-as.

## Executando o Projeto

Para executar a aplicação, você precisará de dois terminais abertos: um para o banco de dados e outro para a aplicação Next.js.

1.  **Inicie o servidor do banco de dados:**
    No primeiro terminal, execute:
    ```bash
    npm run dev:db
    ```
    Isso iniciará o `json-server` na porta 3001.

2.  **Inicie a aplicação Next.js:**
    No segundo terminal, execute:
    ```bash
    npm run dev
    ```
    Isso iniciará a aplicação na porta 3000.

### Executando com um único comando

Você também pode iniciar ambos os servidores com um único comando:

```bash
npm run begin
```

Agora você pode abrir [http://localhost:3000](http://localhost:3000) em seu navegador para ver a aplicação funcionando.


