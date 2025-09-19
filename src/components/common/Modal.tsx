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
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 transition-colors"
        onClick={onClose}
      />

      {/* กล่อง Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 z-10 transition-colors">
        {/* ปุ่มปิด */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white px-3 py-1 rounded-full transition-colors"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
