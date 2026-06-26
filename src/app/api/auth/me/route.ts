import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserById, updateUser } from "@/lib/users";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  const user = await getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

/** PATCH /api/auth/me — update profile */
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: { name?: string; email?: string; password?: string } = {};
    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.password) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters." },
          { status: 400 }
        );
      }
      updates.password = body.password;
    }

    const user = await updateUser(session.userId, updates);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
