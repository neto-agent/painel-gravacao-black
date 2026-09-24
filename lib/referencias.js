// Biblioteca de referências: formatos que costumam funcionar na Black Friday.
// Cada um vira um card com um clique (botão "Usar como roteiro").
// Pode editar, apagar ou adicionar à vontade.

export const REFERENCIAS = [
  // ---------- Antecipação ----------
  {
    id: "ref-data", fase: "Antecipação", titulo: "Guarde essa data", formato: "Reels vertical · 20-30s",
    descricao: "Você anuncia só a data e o que vai acontecer, sem contar tudo.",
    porque: "Curiosidade + data fixa. A pessoa salva o vídeo e já fica esperando.",
    hook: "Anota essa data: [dia/mês].",
    script: "Anota essa data: [dia/mês].\n\nNesse dia eu vou abrir [o que você vai lançar], a maior condição que eu já fiz aqui.\n\nNão vou contar tudo agora.\n\nSó te digo uma coisa: [benefício principal em uma frase].\n\nSalva esse vídeo e ativa o sininho.",
    screen_text: "[DIA/MÊS] · guarda essa data", busca: "black friday guarde essa data",
  },
  {
    id: "ref-postit", fase: "Antecipação", titulo: "Post-it no lugar do dia a dia", formato: "Reels ou imagem · sem fala",
    descricao: "Um post-it com a data ou a promessa colado em algum lugar da tua rotina (espelho, geladeira, notebook).",
    porque: "Simples, parece orgânico e para o scroll. Em imagem estática costuma performar muito bem em anúncio.",
    hook: "(mão colando o post-it)",
    script: "Cena 1: mão colando um post-it escrito \"[DATA] · [PROMESSA CURTA]\".\n\nCena 2: close no post-it.\n\nTexto na tela no fim: \"Link na bio\".",
    screen_text: "[DATA] · [promessa em 4 palavras]", busca: "post-it black friday",
  },
  {
    id: "ref-nunca-fiz", fase: "Antecipação", titulo: "A Black que eu nunca fiz", formato: "Reels vertical · 40-60s",
    descricao: "Você explica por que este ano vai ser diferente de tudo que já fez.",
    porque: "Quebra a expectativa de \"mais uma promoção\" e cria evento.",
    hook: "Eu nunca fiz Black Friday. Esse ano vai ser diferente.",
    script: "Eu nunca fiz Black Friday. [ou: nunca fiz uma Black assim]\n\nSabe por quê? [teu motivo real].\n\nEsse ano eu decidi fazer uma coisa que nunca fiz: [o que muda].\n\nDia [data] eu conto tudo.",
    screen_text: "Esse ano vai ser diferente", busca: "primeira black friday",
  },

  // ---------- Captação ----------
  {
    id: "ref-convite", fase: "Captação", titulo: "Convite direto (selfie)", formato: "Reels / anúncio · 20-40s",
    descricao: "Você, olhando pra câmera, convida pro evento ou pra lista de espera.",
    porque: "Simples de gravar e costuma ser o anúncio mais barato por lead. Gente fala com gente.",
    hook: "Você já pensou em [desejo do teu público] pagando uma vez só?",
    script: "Você já pensou em [desejo] pagando uma vez só?\n\nÉ isso que eu vou abrir no dia [data], às [hora], ao vivo.\n\nMas só quem estiver no grupo VIP vai ver a condição primeiro.\n\nClica em saiba mais e entra no grupo.",
    screen_text: "Dia [data] · [hora] · ao vivo", busca: "entre no grupo vip black friday",
  },
  {
    id: "ref-nao-compre", fase: "Captação", titulo: "Não compre nada nessa Black", formato: "Reels / anúncio · 40-60s",
    descricao: "Você pede pra pessoa não comprar nada antes de ouvir a tua oferta.",
    porque: "Hook contraintuitivo prende nos 3 primeiros segundos e posiciona tua oferta como a que vale esperar.",
    hook: "Não compra nada nessa Black Friday.",
    script: "Não compra nada nessa Black Friday.\n\nPelo menos não até ouvir o que eu tenho pra te dizer.\n\nTodo ano é igual: a pessoa compra por impulso, aparece coisa melhor e se arrepende.\n\nDia [data] eu vou abrir [tua oferta].\n\nAntes de gastar com qualquer coisa, entra no grupo VIP e espera.",
    screen_text: "Não compre NADA (ainda)", busca: "não compre nada nessa black friday",
  },
  {
    id: "ref-boa-ma", fase: "Captação", titulo: "Uma boa e uma má notícia", formato: "Reels · só mãos + voz",
    descricao: "Dois post-its: a má notícia (a dor) e a boa notícia (tua oferta).",
    porque: "Estrutura de contraste que todo mundo entende na hora. Não precisa aparecer o rosto.",
    hook: "Tenho uma boa e uma má notícia.",
    script: "Tenho uma boa e uma má notícia.\n\nA má: [dor do público].\n\nA boa: dia [data] eu vou abrir [oferta] e isso muda.\n\nEntra no grupo pra saber primeiro.",
    screen_text: "má notícia / boa notícia", busca: "boa notícia má notícia",
  },
  {
    id: "ref-voltar", fase: "Captação", titulo: "Se eu pudesse voltar no tempo", formato: "Reels · 40-60s",
    descricao: "Você conta o conselho que daria pra você no começo da carreira.",
    porque: "História pessoal gera conexão e mostra autoridade sem se gabar.",
    hook: "Se eu pudesse voltar pro meu primeiro ano, eu diria 3 coisas.",
    script: "Se eu pudesse voltar pro meu primeiro ano, eu diria 3 coisas:\n\n1. [conselho]\n2. [conselho]\n3. [conselho]\n\nFoi isso que eu coloquei em [tua oferta], e dia [data] eu vou abrir.",
    screen_text: "O que eu diria pro meu eu de [ano]", busca: "se eu pudesse voltar",
  },
  {
    id: "ref-depoimento", fase: "Captação", titulo: "Depoimento + ponte", formato: "Reels / anúncio · 30-60s",
    descricao: "Um trecho de depoimento de cliente e você fazendo a ponte pra oferta.",
    porque: "Prova social vende mais que qualquer promessa tua.",
    hook: "Olha o que a [nome] me mandou.",
    script: "Olha o que a [nome] me mandou.\n\n(depoimento: 10-20s)\n\nEla começou com [situação antes] e hoje [resultado].\n\nSe você quer o mesmo caminho, dia [data] eu abro [oferta]. Entra no grupo.",
    screen_text: "[resultado da cliente]", busca: "depoimento aluno black friday",
  },

  // ---------- Aquecimento ----------
  {
    id: "ref-erro", fase: "Aquecimento", titulo: "O erro que quase todo mundo comete", formato: "Reels · 45-75s",
    descricao: "Conteúdo de valor: um erro comum e como corrigir.",
    porque: "Gera salvamento e compartilhamento, e aquece quem vai ver a oferta depois.",
    hook: "Quem nunca [erro comum]?",
    script: "Quem nunca [erro comum]?\n\nO problema é que [consequência].\n\nFaz assim: [passo prático] porque [o porquê].\n\nPra resumir: [frase curta].\n\nSalva pra não esquecer.",
    screen_text: "O erro nº 1 de quem [público]", busca: "erro que todo mundo comete",
  },
  {
    id: "ref-tela-dividida", fase: "Aquecimento", titulo: "Tela dividida: antes x depois", formato: "Reels · sem fala ou com legenda",
    descricao: "Mesma cena lado a lado: o jeito errado e o jeito certo.",
    porque: "Contraste visual entende-se sem som (a maioria assiste mudo).",
    hook: "(duas cenas lado a lado)",
    script: "Esquerda: [jeito errado]. Direita: [jeito certo].\n\nRepete em 3 situações do dia a dia.\n\nTexto final: \"qual lado é você?\"",
    screen_text: "Sem [método] / Com [método]", busca: "split screen antes e depois",
  },
  {
    id: "ref-caixinha", fase: "Aquecimento", titulo: "Caixinha de perguntas", formato: "Stories",
    descricao: "Você abre a caixinha e responde as dúvidas em vídeo.",
    porque: "Mostra o que o público quer e vira pauta pros vídeos da oferta.",
    hook: "Qual a tua maior dificuldade com [tema]?",
    script: "Story 1: caixinha \"qual a tua maior dificuldade com [tema]?\".\n\nStories seguintes: responde 3-5 perguntas em vídeo curto.\n\nÚltimo: \"dia [data] tem novidade sobre isso\".",
    screen_text: "Me conta 👇", busca: "caixinha de perguntas",
  },

  // ---------- Carrinho aberto ----------
  {
    id: "ref-abriu", fase: "Carrinho aberto", titulo: "Abriu! (confete)", formato: "Reels / anúncio · 15-30s",
    descricao: "Anúncio de abertura com energia: confete, grito, celebração.",
    porque: "Marca o momento e avisa quem estava esperando.",
    hook: "ABRIU!",
    script: "ABRIU! (confete)\n\nA [nome da oferta] está no ar.\n\nVocê leva: [item 1], [item 2], [item 3].\n\nSó até [data]. Link na bio.",
    screen_text: "ABRIU · só até [data]", busca: "abriu inscrições black friday",
  },
  {
    id: "ref-comparativo", fase: "Carrinho aberto", titulo: "Comparativo (tabela)", formato: "Imagem / carrossel",
    descricao: "Tabela: comprar tudo separado x a tua oferta.",
    porque: "Deixa o valor óbvio sem precisar convencer.",
    hook: "Separado vs. na Black",
    script: "Coluna 1: cada item com o preço separado.\nColuna 2: tudo junto na oferta.\n\nÚltima linha: a economia.\n\nCTA: link na bio.",
    screen_text: "Separado: R$[x] · Na Black: R$[y]", busca: "comparativo black friday",
  },
  {
    id: "ref-objecao", fase: "Carrinho aberto", titulo: "Resposta a objeção", formato: "Reels · 30-45s",
    descricao: "Um vídeo pra cada dúvida que trava a compra (tempo, dinheiro, \"é pra mim?\").",
    porque: "Quem está em dúvida precisa ouvir a resposta da tua boca.",
    hook: "\"Mas eu não tenho tempo.\"",
    script: "\"[Objeção]\"\n\nEu entendo. [valida a dúvida].\n\nMas olha: [resposta prática].\n\nE ainda [garantia ou facilidade].\n\nLink na bio até [data].",
    screen_text: "\"[objeção]\"", busca: "não tenho tempo curso",
  },
  {
    id: "ref-tour", fase: "Carrinho aberto", titulo: "Tour por dentro", formato: "Gravação de tela + voz",
    descricao: "Você mostra por dentro o que a pessoa vai receber.",
    porque: "Tira o medo de comprar \"no escuro\".",
    hook: "Deixa eu te mostrar por dentro.",
    script: "Deixa eu te mostrar por dentro.\n\nAqui fica [parte 1]. Aqui [parte 2]. E aqui [bônus].\n\nTudo isso por [condição] só até [data].",
    screen_text: "Por dentro da [oferta]", busca: "tour pela plataforma",
  },

  // ---------- Última chamada ----------
  {
    id: "ref-contagem", fase: "Última chamada", titulo: "Contagem regressiva", formato: "Stories / Reels · 10-15s cada",
    descricao: "Vídeos curtos: faltam 3 dias, 2 dias, últimas horas.",
    porque: "Urgência real. Grave todos no mesmo dia e só troque o número.",
    hook: "Faltam [X] [dias/horas].",
    script: "Faltam [X] [dias/horas] pra fechar.\n\nDepois disso, [o que acontece].\n\nLink na bio.",
    screen_text: "Faltam [X]", busca: "últimas horas black friday",
  },
  {
    id: "ref-fecha-hoje", fase: "Última chamada", titulo: "Fecha hoje", formato: "Reels / Stories · 20-30s",
    descricao: "Direto ao ponto: é hoje, com o horário.",
    porque: "Muita gente só compra no último dia. Esse vídeo pega essa turma.",
    hook: "Fecha hoje, [hora].",
    script: "Fecha hoje, [hora].\n\nSe você ficou na dúvida, [responde a maior objeção].\n\nDepois de [hora] volta pro preço normal.\n\nLink na bio.",
    screen_text: "ÚLTIMO DIA · até [hora]", busca: "encerra hoje",
  },
];
