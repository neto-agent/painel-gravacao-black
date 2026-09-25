import { NextResponse } from "next/server";
import { listarColunas, adicionarColuna } from "../../../lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try { return NextResponse.json({ colunas: await listarColunas() }); }
  catch (e) { return NextResponse.json({ error: String(e.message || e) }, { status: 500 }); }
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  if (typeof body.label !== "string") return NextResponse.json({ error: "Informe o nome da etapa" }, { status: 400 });
  const label = body.label.trim().replace(/\s+/g, " ");
  if (label.length < 2 || label.length > 40) return NextResponse.json({ error: "Use entre 2 e 40 caracteres" }, { status: 400 });
  try { return NextResponse.json({ coluna: await adicionarColuna(label) }, { status: 201 }); }
  catch (e) { return NextResponse.json({ error: String(e.message || e) }, { status: 400 }); }
}
