import WaitingContent from "@/components/common/customer/Payments/WaitingContent";
import { Suspense } from "react";


export default function PaymentWaitingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WaitingContent />
        </Suspense>
    );
}
