import { NextRequest, NextResponse } from 'next/server';
import { pinata } from "@/pinata.config"

export async function POST(req: NextRequest) {
  const { cid } = await req.json();

  if (!cid) {
    return NextResponse.json({ error: 'CID is required' }, { status: 400 });
  }

  try {
    const { data } = await pinata.gateways.public.get(cid);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unpin', details: String(error) }, { status: 500 });
  }
}
