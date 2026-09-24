import { createClient } from "redis";
import { EXEMPLOS } from "./exemplos";

// Os roteiros ficam num banco Redis gratuito (Upstash ou Redis Cloud),
// criado sozinho pelo botão "Deploy" da Vercel. Ele cria a variável REDIS_URL.
const CHAVE = "painel:cards"; // hash: id do roteiro -> JSON do roteiro
const SEMENTE = "painel:semeado";
const CONTADOR = "painel:contador-n";

let clientePromise = null;
async function redis() {
  const url = process.env.REDIS_URL || process.env.KV_URL;
  if (!url) throw new Error("Banco não conectado. Na Vercel, abra o projeto > Storage > crie um banco Redis (Upstash) e conecte a este projeto. Depois faça Redeploy.");
  if (!clientePromise) {
    const c = createClient({ url });
    c.on("error", () => {});
    clientePromise = c.connect().then(() => c).catch((e) => { clientePromise = null; throw e; });
  }
  return clientePromise;
}

async function semear(r) {
  // só na primeira vez: cria os roteiros de exemplo
  const primeira = await r.set(SEMENTE, "1", { NX: true });
  if (!primeira) return;
  const agora = new Date().toISOString();
  const campos = {};
  EXEMPLOS.forEach((c, i) => {
    campos[c.id] = JSON.stringify({ ...c, sort_order: i + 1, status: "a_gravar", take_notes: "", created_at: agora, updated_at: agora, deleted_at: null });
  });
  if (Object.keys(campos).length) await r.hSet(CHAVE, campos);
}

export async function listar() {
  const r = await redis();
  await semear(r);
  const tudo = await r.hGetAll(CHAVE);
  return Object.values(tudo).map((v) => JSON.parse(v));
}

export async function pegar(id) {
  const r = await redis();
  const v = await r.hGet(CHAVE, id);
  return v ? JSON.parse(v) : null;
}

export async function salvar(card) {
  const r = await redis();
  await r.hSet(CHAVE, card.id, JSON.stringify(card));
  return card;
}

/** Próximo id livre: N1, N2, N3... */
export async function proximoId() {
  const r = await redis();
  for (let i = 0; i < 20; i++) {
    const n = await r.incr(CONTADOR);
    const id = `N${n}`;
    if (!(await r.hExists(CHAVE, id))) return { id, ordem: Date.now() };
  }
  throw new Error("Não consegui gerar um id, tenta de novo");
}
