// Roteiros de exemplo que aparecem na primeira vez que o painel abre.
// Pode apagar todos pelo próprio painel (abre o card > Editar > Apagar roteiro).
export const EXEMPLOS = [
  {
    id: "A1", title: "Exemplo: a pergunta que teu cliente faz toda semana", phase: "Antecipação", day: "2026-10-02",
    hook: "Todo mundo me pergunta isso, então vou responder de uma vez.",
    script: "Abre com a dúvida mais comum do teu público, em forma de pergunta.\n\n(pausa)\n\nMostra que é normal ter essa dúvida.\n\nDá um passo prático e explica o porquê.\n\nPra resumir: [resumo em uma frase].\n\nFecha com a ação: \"a Black tá chegando, fica de olho aqui\".",
    screen_text: "A dúvida nº 1 de quem [teu público]", caption: "Salva esse vídeo pra lembrar depois 👇", cta: "Fica de olho que a Black tá chegando",
    setting: "Escritório", outfit: "Look 1 · camiseta lisa", format: "Reels vertical",
  },
  {
    id: "A2", title: "Exemplo: convite pro evento", phase: "Captação", day: "2026-10-02",
    hook: "Dia [data] eu vou abrir uma coisa que nunca mostrei aqui.",
    script: "Fala da dor que o evento resolve.\n\nConta o que a pessoa vai aprender, em 3 pontos curtos.\n\nFecha com o convite: \"o link pra se inscrever tá na bio\".",
    screen_text: "Evento gratuito · dia [data]", caption: "Inscrição gratuita no link da bio.", cta: "Link na bio",
    setting: "Escritório", outfit: "Look 1 · camiseta lisa", format: "Reels vertical",
  },
  {
    id: "A3", title: "Exemplo: trend adaptada pro teu nicho", phase: "Aquecimento", day: "2026-10-03",
    hook: "(usa o áudio da trend do momento)",
    script: "Pega uma trend que está bombando em outro nicho e adapta pra tua realidade.\n\nDica: procura referências na Biblioteca de Anúncios da Meta e em perfis grandes de outros nichos.",
    screen_text: "Quando o cliente fala \"[frase típica]\"", caption: "Marca aquele amigo que faz isso 😂",
    setting: "Sala", outfit: "Look 2 · roupa do dia a dia", format: "Reels vertical",
  },
  {
    id: "A4", title: "Exemplo: carrinho aberto", phase: "Carrinho aberto", day: "2026-10-03",
    hook: "Tá aberto. E é a única vez no ano com essa condição.",
    script: "Anuncia que abriu.\n\nLista o que a pessoa leva.\n\nReforça o prazo.\n\nFecha com a ação: \"clica no link e garante a tua vaga\".",
    screen_text: "ABRIU · só até [data]", caption: "Link na bio. Só até [data].", cta: "Garante no link",
    setting: "Escritório", outfit: "Look 1 · camiseta lisa", format: "Reels vertical",
  },
  {
    id: "A5", title: "Exemplo: última chamada", phase: "Última chamada", day: "2026-10-03",
    hook: "Fecha hoje à meia-noite.",
    script: "Fala direto: é a última chance.\n\nResponde a objeção mais comum.\n\nFecha com a ação e o horário.",
    screen_text: "Últimas horas", caption: "Fecha hoje, meia-noite.", cta: "Link na bio",
    setting: "Sala", outfit: "Look 2 · roupa do dia a dia", format: "Stories",
  },
];
