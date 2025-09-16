'use client';

import { getPromptPayQRCode } from "@/action/customer/PaymentAction";
import Modal from "../../Modal";
import { useEffect, useState } from "react";
import { Download, BanknoteArrowUp, ScanQrCode } from "lucide-react";
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

    const goToWaitingPage = (method: "CASH" | "PROMPTPAY") => {
        onPay(method);
        router.push(
            `/customer/payment/waiting?orderNo=${orderNo}&amount=${totalPrice}&method=${method}&tableNo=${tableNo}`
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-sm mx-auto p-4">
                {step === "SELECT" && (
                    <div className="text-center space-y-4">
                        <h1 className="font-semibold text-gray-700">โต๊ะ No {tableNo}</h1>
                        <h2 className="text-2xl font-bold mb-2">เลือกวิธีชำระเงิน</h2>
                        <p className="text-gray-600">
                            จำนวนเงินที่ต้องชำระ:{" "}
                            <span className="font-semibold">{totalPrice} บาท</span>
                        </p>

                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                                onClick={() => goToWaitingPage("CASH")}
                            >
                                <BanknoteArrowUp className="w-5 h-5" />
                                เงินสด
                            </button>
                            <button
                                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                                onClick={() => setStep("QR")}
                            >
                                <ScanQrCode className="w-5 h-5" />
                                PromptPay
                            </button>
                        </div>
                    </div>
                )}

                {step === "QR" && (
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold mb-2">ชำระเงินด้วย PromptPay</h2>
                        <p className="text-gray-600">
                            จำนวนเงิน: <span className="font-semibold">{totalPrice} บาท</span>
                        </p>

                        {qr ? (
                            <div className="flex flex-col items-center gap-4 mt-4">
                                <img
                                    src={qr}
                                    alt="QR Code"
                                    className="mx-auto w-48 h-48 object-contain border rounded shadow-md"
                                />

                                <a
                                    href={qr}
                                    download={`PromptPay_${totalPrice}.png`}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
                                >
                                    <Download className="w-5 h-5" />
                                    ดาวน์โหลด QR
                                </a>

                                <button
                                    onClick={() => goToWaitingPage("PROMPTPAY")}
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                                >
                                    ถัดไป
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-4">กำลังโหลด QR Code...</p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}
