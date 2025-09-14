import { NextResponse } from "next/server";
import { admin } from "@/lib/firebaseAdmin";

export async function GET() {
    try {
        const projectId = admin.app().options.projectId;
        return NextResponse.json({ success: true, projectId });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
