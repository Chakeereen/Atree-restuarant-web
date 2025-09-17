'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

interface ImageUploaderProps {
  nameImage?: string;
  nameFileID?: string;
}

const MAX_SIZE_MB = 1;

export default function ImageUploader({ nameImage = "image", nameFileID = "fileID" }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileID, setFileID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    if (selectedFile.size / 1024 / 1024 > MAX_SIZE_MB) {
      toast.error("ไฟล์ต้องมีขนาดไม่เกิน 1 MB");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${baseUrl}/api/admin/menu/image`, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setImageUrl(data.url);
      setFileID(data.fileId);
      toast.success("Upload successful!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="block mb-1">Menu Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        type="button"
        disabled={!file || loading}
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* เก็บค่าใน hidden input เพื่อให้ FormContainer ส่งต่อ */}
      {imageUrl && <Input type="hidden" name={nameImage} value={imageUrl} />}
      {fileID && <Input type="hidden" name={nameFileID} value={fileID} />}

      {imageUrl && <p className="text-sm text-gray-500 mt-1">Uploaded: {imageUrl}</p>}
    </div>
  );
}
