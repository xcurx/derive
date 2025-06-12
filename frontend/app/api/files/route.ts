import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/pinata.config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, fileName } = body;

    // Basic validation
    if (!content) {
      return NextResponse.json(
        { error: "Content field is required" },
        { status: 400 }
      );
    }

    const { cid } = await pinata.upload.public.json(
      {
        encryptedFile: content,
        name: fileName || "Untitled",
      },
      {
        metadata: {
          name: fileName || "Untitled",
        }
      }
    );

    return NextResponse.json(cid, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}