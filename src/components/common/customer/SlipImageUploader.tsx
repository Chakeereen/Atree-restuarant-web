'use client';

import { useState } from "react";
import { toast } from "sonner";

const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

interface SlipImageUploaderProps {
  onUpload?: (file: File, fileId: string, url: string) => void;
}

export default function SlipImageUploader({ onUpload }: SlipImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    if (selectedFile.size / 1024 / 1024 > 1) {
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
      const res = await fetch(`${baseUrl}/api/customer/payment/slipUpload/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");

      setUploadedUrl(data.url);
      toast.success("Upload successful!");

      if (onUpload) onUpload(file, data.fileId, data.url);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 w-full">
      <label className="block mb-2 font-semibold text-gray-700">อัปโหลดสลิปชำระเงิน</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-400 file:text-white hover:file:bg-gray-500 cursor-pointer"
        />
        {file && <p className="text-gray-700 text-sm mb-2">Selected: {file.name}</p>}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}
        </button>
        {uploadedUrl && <p className="text-green-600 text-sm mt-2 break-words">Uploaded URL: {uploadedUrl}</p>}
      </div>
    </div>
  );
}
