# Painel de Gravação · Black Friday

Painel pra organizar a produção de criativos da Black Friday. Cada criativo vira um card com roteiro, texto na tela, legenda, cenário e figurino, e o card anda pelas colunas **A gravar → Gravando → Gravado → Regravar**.

Funciona no celular (dá pra usar como teleprompter) e no computador.

**Ver funcionando antes de instalar:** https://painel-gravacao.vercel.app (demonstração: pode mexer, mas nada é salvo)

## Colocar no ar (uns 5 minutos, tudo grátis)

**O que você precisa:** uma conta no GitHub e uma na Vercel. Não precisa saber programar nem ter cartão de crédito.

1. **Crie sua conta no GitHub** (se ainda não tiver): entre em https://github.com/signup, coloque e-mail, senha e nome de usuário e confirme o código que chega no e-mail.
2. **Crie sua conta na Vercel com o GitHub:** entre em https://vercel.com/signup, escolha o plano **Hobby** (grátis), clique em **Continue with GitHub** e autorize.
3. **Clique no botão abaixo:**

[![Deploy com a Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fneto-agent%2Fpainel-gravacao-black&project-name=painel-gravacao&repository-name=painel-gravacao&env=PANEL_PASSWORD&envDescription=Senha%20pra%20entrar%20no%20painel.%20Escolha%20uma%20e%20passe%20s%C3%B3%20pro%20seu%20time.&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22redis%22%7D%5D)

4. A Vercel abre a tela de criar o projeto. Se pedir pra escolher onde salvar no GitHub, deixe o nome sugerido e clique em **Create**.
   - *Primeira vez na Vercel?* Ela pode pedir pra **instalar o app da Vercel no GitHub** e o GitHub pede tua senha de novo. É normal: clique em **Install** e confirme.
5. Quando aparecer o banco **Redis**, escolha o **Upstash** e depois clique no plano **Free** (ele **não vem marcado**, tem que clicar). Depois **Create / Connect**. É ali que os cards ficam salvos.
   - *Já tem um banco no Upstash?* A conta grátis deixa ter só 1. Escolha o banco que você já tem em vez de criar outro.
6. Em **PANEL_PASSWORD**, digite a senha que você e seu time vão usar pra entrar no painel.
7. Clique em **Deploy** e espere uns 2 minutos.
8. Quando aparecer "Congratulations", clique na imagem do site (ou em **Continue to Dashboard > Visit**). Esse é o link do seu painel: salve nos favoritos e mande pro time.
9. Abra o link, digite a senha e pronto. No celular, dá pra usar "Adicionar à tela de início" pra abrir como app.

Na primeira vez o painel abre com 5 roteiros de exemplo, um por fase. Dá pra editar ou apagar (é só tocar no 🗑 do card).

**Deu tela de "Falta conectar o banco de dados"?** O passo 5 ficou pra trás. O próprio painel mostra o passo a passo pra conectar.

**Esqueceu a senha ou quer trocar?** Na Vercel: seu projeto > Settings > Environment Variables > PANEL_PASSWORD > Edit. Depois vá em Deployments > ... > Redeploy.

## O que tem

- Fases da Black: Antecipação, Captação, Aquecimento, Carrinho aberto e Última chamada
- Filtros por dia de gravação, cenário, figurino e fase, pra gravar em lote
- Busca por título, roteiro ou legenda
- Teleprompter com rolagem automática e tamanho de letra ajustável
- Arrastar e soltar os cards entre as colunas (segura o ⠿ do card), ou tocar em "Marcar como..."
- Apagar com um toque no 🗑, com botão de desfazer
- **Biblioteca de referências**: formatos que funcionam em cada fase (post-it, convite direto, tela dividida, depoimento + ponte, comparativo, contagem regressiva e mais), com o porquê de cada um, esqueleto de roteiro e link pra ver exemplos reais na Biblioteca de Anúncios da Meta. Um toque e vira card
- Anotação do melhor take em cada card
- Senha única pro time todo

## Personalizar

- Fases: `lib/fases.js`
- Dias de gravação (ex: "Sexta 28/11"): `lib/campos.js`
- Roteiros de exemplo: `lib/exemplos.js`
- Formatos da Biblioteca: `lib/referencias.js`

Depois de editar no GitHub, a Vercel publica a mudança sozinha.

## Rodar no computador (opcional)

```bash
npm install
REDIS_URL=redis://localhost:6379 npm run dev
```

Sem `PANEL_PASSWORD`, o painel abre sem senha (e mostra um aviso). Com `DEMO=1`, vira demonstração: todo mundo vê, ninguém salva.
