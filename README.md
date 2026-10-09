# Desafio Target

Solução em TypeScript para três operações comerciais:

- cálculo de comissão por vendedor;
- movimentação de entrada e saída de estoque;
- cálculo de juros simples de 2,5% ao dia.

O projeto usa os arquivos JSON fornecidos no desafio.

## Instalar Docker e Docker Compose

Escolha abaixo somente as instruções do seu sistema operacional. O Docker
Compose já vem incluído nas instalações indicadas.

### Windows

1. Acesse a página de instalação do
   [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/).
2. Clique em **Docker Desktop for Windows** para baixar o instalador.
3. Abra o arquivo baixado e mantenha marcada a opção para usar **WSL 2**.
4. Conclua a instalação e reinicie o computador, caso seja solicitado.
5. Abra o **Docker Desktop** pelo menu Iniciar.
6. Aguarde até o Docker Desktop informar que está em execução.
7. Abra o PowerShell e verifique a instalação:

```powershell
docker --version
docker compose version
docker run --rm hello-world
```

### macOS

1. No menu da Apple, abra **Sobre Este Mac** e verifique se o processador é
   Apple Silicon ou Intel.
2. Acesse a página de instalação do
   [Docker Desktop para macOS](https://docs.docker.com/desktop/setup/install/mac-install/).
3. Baixe a versão correspondente ao seu processador.
4. Abra o arquivo `.dmg` e arraste o Docker para a pasta **Applications**.
5. Abra o **Docker Desktop** e aceite as permissões solicitadas.
6. Aguarde até o Docker Desktop informar que está em execução.
7. Abra o Terminal e verifique a instalação:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

### Linux — Ubuntu

Execute cada bloco no terminal e aguarde a conclusão antes de continuar.

1. Atualize os pacotes e instale os utilitários necessários:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
```

2. Adicione a chave e o repositório oficial do Docker:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

3. Instale e inicie o Docker com o Docker Compose:

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

4. Permita que seu usuário execute Docker sem `sudo`:

```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

5. Verifique a instalação:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

Em qualquer sistema, a instalação estará funcionando quando o último comando
mostrar a mensagem `Hello from Docker!`.

## Executar o projeto

Depois de instalar o Docker, abra o terminal na pasta deste projeto e execute:

```bash
docker compose run --rm --build desafio-target
```

O comando prepara o ambiente, instala as dependências, compila o TypeScript e
abre o menu no próprio terminal. Para encerrar, escolha a opção `0`.

## Regras implementadas

### Comissões

- Venda abaixo de R$ 100,00: sem comissão.
- Venda de R$ 100,00 até R$ 499,99: comissão de 1%.
- Venda a partir de R$ 500,00: comissão de 5%.
- As comissões são agrupadas e somadas por vendedor.

### Estoque

- Permite registrar entrada e saída de produtos.
- Cada movimentação recebe um identificador numérico único e uma descrição.
- O estoque do produto é atualizado e o saldo final é retornado.
- Saídas maiores que o saldo disponível são rejeitadas.
- As movimentações e alterações ficam em memória durante a execução.

### Juros

- Calcula juros simples de 2,5% por dia de atraso.
- Não cobra juros antes ou no dia do vencimento.
- Usa a data atual como referência.

## Tecnologias

- Node.js 22
- TypeScript
- Vitest
- Docker e Docker Compose

## Estrutura

```text
data/                    Arquivos JSON do desafio
src/
  cli/menu.ts            Menu interativo
  comissoes/             Cálculo de comissões
  estoque/               Movimentações de estoque
  juros/                 Cálculo de juros
  index.ts               Ponto de entrada da aplicação
Dockerfile               Construção da imagem
docker-compose.yml       Execução com Docker Compose
```

## Usar o menu

Ao iniciar a aplicação, escolha uma das opções:

```text
1. Consultar comissões
2. Movimentar estoque
3. Calcular juros
4. Consultar estoque
5. Consultar histórico
0. Sair
```

Na movimentação de estoque, informe:

1. O código de um produto exibido na tabela.
2. `1` para entrada ou `2` para saída. Também são aceitos `entrada` e `saida`.
3. Uma quantidade inteira e positiva.
4. Uma descrição para a movimentação.

Exemplo de entrada de estoque:

```text
Escolha uma opção: 2
Código do produto: 101
Tipo da movimentação (1 - Entrada / 2 - Saída): 1
Quantidade: 20
Descrição: Reposição de canetas
```

## Desenvolvimento local (opcional)

Esta seção é apenas para quem quiser alterar ou executar diretamente o
`src/index.ts`. Nesse caso, use Node.js 22 ou superior:

```bash
npm ci
npm run dev
```

Para executar o JavaScript compilado:

```bash
npm run build
npm start
```

## Qualidade e testes

Execute os testes automatizados:

```bash
npm test
```

Valide os tipos sem gerar arquivos:

```bash
npm run typecheck
```

Execute todas as verificações principais:

```bash
npm run typecheck
npm test
npm run build
```

Os testes cobrem limites das faixas de comissão, validações e saldo de
estoque, unicidade das movimentações, datas inválidas e cálculo de juros.
