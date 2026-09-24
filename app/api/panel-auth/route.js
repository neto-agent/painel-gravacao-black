import { NextResponse } from "next/server";
import { hashSenha, COOKIE } from "../../../lib/senha";

export async function POST(request) {
  const password = process.env.PANEL_PASSWORD;
  if (!password) return NextResponse.json({ ok: true });
  let body = {};
  try { body = await request.json(); } catch {}
  if (typeof body.password !== "string" || body.password !== password) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await hashSenha(password), {
    httpOnly: true, sameSite: "lax", secure: true, path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
