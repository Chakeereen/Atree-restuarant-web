import { ListOrdered } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DropdownProps {
    orderNo: number;
}

const Dropdown = ({ orderNo }: DropdownProps) => {
    const router = useRouter();

    return (
        <div className="flex items-center gap-2">


            {/* ปุ่ม dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="bg-orange-300 dark:bg-orange-700 hover:bg-orange-400 dark:hover:bg-gray-600 text-orange-800 dark:text-gray-100 px-4 py-2 rounded-lg h-10 flex items-center justify-center transition-colors"
                    >
                        <ListOrdered className="w-5 h-5" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    side="bottom"
                    align="start"
                    alignOffset={8}
                    className="w-40"
                >
                    <DropdownMenuLabel className="bg-orange-600 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                        <ListOrdered className="w-4 h-4" />
                        ออร์เดอร์ของฉัน
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            onClick={() => router.push(`/customer/order/${orderNo}`)}
                            className="w-full text-left px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-700 rounded-lg"
                        >
                            รายการที่สั่ง
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            onClick={() => router.push(`/customer/payment/${orderNo}`)}
                            className="w-full text-left px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-700 rounded-lg"
                        >
                            ชำระเงิน
                        </button>
                    </DropdownMenuItem>


                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            onClick={() => router.push(`/customer/order/${orderNo}/cancelled`)}
                            className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-700"
                        >
                            รายการที่ถูกยกเลิก
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

    );
};

export default Dropdown;
