'use client';

interface CartFooterProps {
  totalItems: number;
  totalCost: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function CartFooter({
  totalItems,
  totalCost,
  onSubmit,
  isSubmitting,
}: CartFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-inner rounded-t-2xl transition-colors">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-300">
            {totalItems} รายการ
          </span>
          <span className="font-bold text-xl text-gray-800 dark:text-gray-100">
            รวม ฿{Number(totalCost).toFixed(2)}
          </span>
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 transition-colors"
        >
          {isSubmitting ? "กำลังส่ง..." : "ยืนยันการสั่งซื้อ"}
        </button>
      </div>
    </footer>
  );
}
