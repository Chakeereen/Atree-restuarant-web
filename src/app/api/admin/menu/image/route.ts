import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// ใช้ Edge Runtime เพื่อรองรับ req.formData()
export const config = { runtime: "edge" };

// POST - อัปโหลดรูปใหม่
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "MenuImage",
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - ลบรูป
export async function DELETE(req: Request) {
  try {
    const { fileId } = await req.json();
    if (!fileId) return NextResponse.json({ error: "fileId is required" }, { status: 400 });

    await imagekit.deleteFile(fileId);
    return NextResponse.json({ success: true, message: "File deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT - แก้ไขรูป (ลบเก่า + อัปโหลดใหม่)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldFileId = formData.get("oldFileId") as string;

    if (!file || !oldFileId)
      return NextResponse.json({ error: "file and oldFileId are required" }, { status: 400 });

    // ลบไฟล์เก่า
    await imagekit.deleteFile(oldFileId);

    // อัปโหลดไฟล์ใหม่
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "MenuImage",
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
