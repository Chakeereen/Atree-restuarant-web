import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { token, title, body } = await req.json();

    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("FCM error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
