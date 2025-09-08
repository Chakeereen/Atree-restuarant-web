import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// ✅ อัปโหลดรูป
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder:"PromptPaySlip"
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ❌ ลบรูป
export async function DELETE(req: Request) {
  try {
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json({ error: "fileId is required" }, { status: 400 });
    }

    await imagekit.deleteFile(fileId);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✏️ อัปเดตรูป (ลบเก่า + อัปโหลดใหม่)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldFileId = formData.get("oldFileId") as string;

    if (!file || !oldFileId) {
      return NextResponse.json({ error: "file and oldFileId are required" }, { status: 400 });
    }

    // 1. ลบไฟล์เก่า
    await imagekit.deleteFile(oldFileId);

    // 2. อัปโหลดไฟล์ใหม่
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder:"PromptPaySlip"
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}