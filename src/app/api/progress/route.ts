import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getProgress, saveProgress } from "@/lib/progress";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const progress = await getProgress(session.userId);
  return NextResponse.json({ progress });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  try {
    const { progress } = await request.json();
    await saveProgress(session.userId, progress);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }
}
