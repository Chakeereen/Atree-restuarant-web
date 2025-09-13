'use client';

import { getPromptPayQRCode } from "@/action/customer/PaymentAction";
import Modal from "../../Modal";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
    totalPrice: number;
    orderNo: number;
    tableNo: number;
    isOpen: boolean;
    onClose: () => void;
    onPay: (method: "CASH" | "PROMPTPAY") => void;
}

export default function PaymentModal({
    totalPrice,
    orderNo,
    tableNo,
    isOpen,
    onClose,
    onPay,
}: PaymentModalProps) {
    const [step, setStep] = useState<"SELECT" | "QR">("SELECT");
    const [qr, setQr] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (step === "QR") {
            getPromptPayQRCode(totalPrice)
                .then(result => {
                    if (result.success) setQr(result.data.qrCodeDataURL);
                })
                .catch(err => console.error(err));
        }
    }, [step, totalPrice]);

    // ฟังก์ชันไปหน้ารอการชำระเงิน
    const goToWaitingPage = (method: "CASH" | "PROMPTPAY") => {
        onPay(method); // เรียก callback ให้ parent handle ด้วย
        router.push(
            `/customer/payment/waiting?orderNo=${orderNo}&amount=${totalPrice}&method=${method}&tableNo=${tableNo}`
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            {step === "SELECT" && (
                <div className="text-center">
                    <h1>table No {tableNo}</h1>
                    <h2 className="text-xl font-bold mb-4">เลือกวิธีชำระเงิน</h2>
                    <p className="mb-4">
                        จำนวนเงินที่ต้องชำระ:{" "}
                        <span className="font-semibold">{totalPrice} บาท</span>
                    </p>

                    <div className="flex flex-col gap-3 items-center">
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 w-auto"
                            onClick={() => goToWaitingPage("CASH")}
                        >
                            เงินสด
                        </button>
                        <button
                            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 w-auto"
                            onClick={() => setStep("QR")}
                        >
                            PromptPay
                        </button>
                    </div>
                </div>
            )}

            {step === "QR" && (
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">ชำระเงินด้วย PromptPay</h2>
                    <p className="mb-4">
                        จำนวนเงิน:{" "}
                        <span className="font-semibold">{totalPrice} บาท</span>
                    </p>
                    {qr ? (
                        <div className="flex flex-col items-center gap-4">
                            {/* QR CODE */}
                            <img
                                src={qr}
                                alt="QR Code"
                                className="mx-auto border rounded shadow-md mb-4"
                            />

                            {/* ปุ่มดาวน์โหลด */}
                            <a
                                href={qr}
                                download={`PromptPay_${totalPrice}.png`}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                ดาวน์โหลด QR
                            </a>

                            {/* ปุ่มถัดไป */}
                            <button
                                onClick={() => goToWaitingPage("PROMPTPAY")}
                                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 w-full max-w-[200px]"
                            >
                                ถัดไป
                            </button>
                        </div>
                    ) : (
                        <p>กำลังโหลด QR Code...</p>
                    )}
                </div>
            )}
        </Modal>
    );
}
