import { NextResponse } from "next/server";
import { listar, salvar, proximoId } from "../../../lib/store";
import { EDITAVEIS, DIA_IDS, dayLabel } from "../../../lib/campos";
import { FASES } from "../../../lib/fases";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cards = (await listar()).filter((c) => !c.deleted_at).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return NextResponse.json({ cards });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

/** Cria um roteiro novo. Só o título é obrigatório; o id segue N1, N2, N3... */
export async function POST(request) {
  let body = {};
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Dá um título pro roteiro" }, { status: 400 });

  const row = {};
  for (const k of EDITAVEIS) {
    if (typeof body[k] === "string" && body[k].trim() !== "") row[k] = body[k].trim();
  }
  row.title = title;
  if (!row.phase || !FASES.includes(row.phase)) row.phase = "A definir";
  if (row.day && !DIA_IDS.includes(row.day)) delete row.day;
  row.day_label = dayLabel(row.day);
  row.status = "a_gravar";
  row.take_notes = "";

  try {
    const { id, ordem } = await proximoId();
    const agora = new Date().toISOString();
    const card = await salvar({ ...row, id, sort_order: ordem, created_at: agora, updated_at: agora, deleted_at: null });
    return NextResponse.json({ card }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
