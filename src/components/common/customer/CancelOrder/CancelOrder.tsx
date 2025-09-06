"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { FormContainer } from "../../admin/Form/FormContainer";
import { cancelOrder } from "@/action/customer/OrderAction";
import { OrderDetail } from "@/utils/type";

interface CancelMenuProps {
  CancelOrder: OrderDetail;
  onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const CancelOrder = ({ CancelOrder, onSuccess }: CancelMenuProps) => {


  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">edit menu</h1>
      <div className="border p-8 rounded-md max-w-lg">
        <FormContainer
          action={cancelOrder}
          onSuccess={() => {
            onSuccess?.();
              // ปิด modal หรือ callback อื่น ๆ
          }}
        >
          <input type="hidden" name="detailNo" value={CancelOrder.detailNo ?? ""} />
           <input type="hidden" name="orderNo" value={CancelOrder.orderNo ?? ""} />
          <FormInput name="name" label="Menu Type Name" type="text" defaultValue={CancelOrder.description} />       
          <SubmitButton text="update menuType" />
        </FormContainer>
      </div>
    </section>
  );
};
