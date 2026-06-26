import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/users";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.userId = user.id;
    await session.save();

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
