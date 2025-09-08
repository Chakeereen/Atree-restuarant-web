"use client";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* พื้นหลัง */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* กล่อง Modal */}
      <div className="relative bg-white rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 z-10">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-full"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
