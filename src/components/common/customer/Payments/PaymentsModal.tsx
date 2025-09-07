'use client';

import Modal from "../../Modal";

// ใช้ Modal wrapper ของคุณ

interface PaymentModalProps {
    totalPrice: number;
    isOpen: boolean;
    onClose: () => void;
    onPay: (method: "CASH" | "PROMPTPAY") => void;
}

export default function PaymentModal({
    totalPrice,
    isOpen,
    onClose,
    onPay,
}: PaymentModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">เลือกวิธีชำระเงิน</h2>
            <p className="mb-4">
                จำนวนเงินที่ต้องชำระ:{" "}
                <span className="font-semibold">{totalPrice} บาท</span>
            </p>

            <div className="flex flex-col gap-3 items-center">
                <button
                    className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 w-auto"
                    onClick={() => onPay("CASH")}
                >
                    เงินสด
                </button>
                <button
                    className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 w-auto"
                    onClick={() => onPay("PROMPTPAY")}
                >
                    PromptPay
                </button>
            </div>

        </Modal>
    );
}
