// Links públicos enviados pelo dono do painel. Sem roteiros, copies ou dados privados.
// O embed é servido pelo Instagram; se o autor bloquear incorporação, o link abre o original.
export const INSTAGRAM = [
  { code: "Ddm2z90RUjE", tipo: "reel", titulo: "Pergunta na geladeira", categoria: "Reels", nota: "Pergunta curta, silêncio e corte seco" },
  { code: "DbBfYxahdLy", tipo: "reel", titulo: "Passei meu WhatsApp pros pacientes", categoria: "Reels", nota: "Humor com corte e áudio" },
  { code: "DdaVKWFv0Oi", tipo: "reel", titulo: "Esperando o primeiro paciente", categoria: "Reels", nota: "Cena de espera em cortes rápidos" },
  { code: "DcPNDPJjw9U", tipo: "p", titulo: "Identidade visual de carrossel", categoria: "Carrosséis", nota: "Traço manual, cores e tipografia" },
  { code: "DU_OYmyjo6Q", tipo: "p", titulo: "Referência de post", categoria: "Posts", nota: "Post compartilhado como referência" },
  { code: "DYF9_E0lZL0", tipo: "p", titulo: "Frase preta sobre fundo branco", categoria: "Carrosséis", nota: "Texto grande e contraste" },
  { code: "DchNO-klYeN", tipo: "p", titulo: "Desenho minimalista", categoria: "Carrosséis", nota: "Fonte com aparência de letra à mão" },
  { code: "Da5hGnxKCd8", tipo: "p", titulo: "Rabisco no bloco de notas", categoria: "Carrosséis", nota: "Caneta azul e letra cursiva" },
  { code: "DaEBu-BlVlf", tipo: "p", titulo: "Bloco de notas do iPhone", categoria: "Carrosséis", nota: "Interface de notas como formato" },
  { code: "DY8GJEhlf8y", tipo: "p", titulo: "Comparativo visual", categoria: "Carrosséis", nota: "Duas ideias lado a lado" },
  { code: "DYhlgm4KwKY", tipo: "p", titulo: "Fonte nativa do Instagram", categoria: "Carrosséis", nota: "Fundo simples com texto preto" },
];

export function instagramUrl(r) { return `https://www.instagram.com/${r.tipo}/${r.code}/`; }
export function instagramEmbed(r) { return `https://www.instagram.com/${r.tipo}/${r.code}/embed/`; }
