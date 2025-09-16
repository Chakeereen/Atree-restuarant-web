'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface ImageInputProps {
  name?: string;
  onChange?: (file: File | null) => void; // ส่ง file กลับ parent
}

const MAX_SIZE_MB = 1;

const ImageInput = ({ name = 'image', onChange }: ImageInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    if (selectedFile.size / 1024 / 1024 > MAX_SIZE_MB) {
      toast.error("ไฟล์ต้องมีขนาดไม่เกิน 1 MB");
      e.target.value = ""; // ล้าง input
      setFile(null);
      if (onChange) onChange(null);
      return;
    }

    setFile(selectedFile);
    if (onChange) onChange(selectedFile);
  };

  return (
    <div className="mb-3">
      <Label className="capitalize">{name}</Label>
      <Input
        id={name}
        name={name}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {file && <p className="text-sm text-gray-500 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
    </div>
  );
};

export default ImageInput;
