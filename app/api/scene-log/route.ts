import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content } = (await request.json()) as { content?: string };

  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const directory = path.join(
    process.cwd(),
    "app",
    "Components",
    "CH3_SitePlan",
    "ActivityMap",
    "Scenelogs",
  );

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "scene-hierarchy.txt"), content, "utf8");

  return NextResponse.json({ ok: true });
}
