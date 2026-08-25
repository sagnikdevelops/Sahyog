import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseUserClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 401 });
  }

  const userClient = getSupabaseUserClient(token);
  const admin = getSupabaseAdmin();
  if (!userClient || !admin) {
    return NextResponse.json({ error: "Server missing Supabase configuration" }, { status: 500 });
  }

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { confirm?: string };
  if (body.confirm !== "DELETE") {
    return NextResponse.json({ error: "Confirmation required" }, { status: 400 });
  }

  await admin.storage.from("avatars").remove([
    `${user.id}/avatar.jpg`,
    `${user.id}/avatar.jpeg`,
    `${user.id}/avatar.png`,
    `${user.id}/avatar.webp`,
  ]);

  const { data: certFiles } = await admin.storage.from("certificates").list(user.id, { limit: 100 });
  if (certFiles?.length) {
    const paths = certFiles.flatMap((folder) =>
      folder.id ? [`${user.id}/${folder.name}/certificate.pdf`] : [`${user.id}/${folder.name}`]
    );
    await admin.storage.from("certificates").remove(paths);
  }

  await admin.from("profiles").delete().eq("id", user.id);

  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteAuthError) {
    return NextResponse.json({ error: deleteAuthError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
