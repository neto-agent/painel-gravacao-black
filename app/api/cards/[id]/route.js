import { NextResponse } from "next/server";
import { pegar, salvar, listarColunas } from "../../../../lib/store";
import { EDITAVEIS, isData, dayLabel } from "../../../../lib/campos";
import { FASES } from "../../../../lib/fases";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body = {};
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const update = {};
  if (typeof body.status === "string") {
    if (!(await listarColunas()).some((c) => c.id === body.status)) return NextResponse.json({ error: "status inválido" }, { status: 400 });
    update.status = body.status;
  }
  if (typeof body.take_notes === "string") update.take_notes = body.take_notes;
  if (body.restore === true) update.deleted_at = null; // desfazer exclusão

  for (const k of EDITAVEIS) {
    if (typeof body[k] !== "string") continue;
    const v = body[k];
    if (k === "title") {
      if (!v.trim()) return NextResponse.json({ error: "O título não pode ficar vazio" }, { status: 400 });
      update.title = v;
    } else if (k === "phase") {
      if (!FASES.includes(v)) return NextResponse.json({ error: "fase inválida" }, { status: 400 });
      update.phase = v;
    } else if (k === "day") {
      if (v !== "" && !isData(v)) return NextResponse.json({ error: "data inválida" }, { status: 400 });
      update.day = v || null;
      update.day_label = dayLabel(v);
    } else {
      update[k] = v === "" ? null : v;
    }
  }

  if (Object.keys(update).length === 0) return NextResponse.json({ error: "nada para atualizar" }, { status: 400 });
  update.updated_at = new Date().toISOString();
  try {
    const c = await pegar(id);
    if (!c) return NextResponse.json({ error: "roteiro não encontrado" }, { status: 404 });
    const card = await salvar({ ...c, ...update });
    return NextResponse.json({ card });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}

/** Apagar = fica escondido e dá pra desfazer. */
export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const c = await pegar(id);
    if (!c) return NextResponse.json({ error: "roteiro não encontrado" }, { status: 404 });
    await salvar({ ...c, deleted_at: new Date().toISOString() });
    return NextResponse.json({ ok: true, card: { id: c.id, title: c.title } });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
