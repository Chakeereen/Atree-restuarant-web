"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";
import { FormContainer } from "../../admin/Form/FormContainer";
import { cancelOrder } from "@/action/customer/OrderAction";
import { OrderDetail } from "@/utils/type";
import { TextareaInput } from "../../admin/Form/TextArea";
import { CheckboxInput } from "../../admin/Form/CheckBox";

interface CancelMenuProps {
  CancelOrder: OrderDetail;
  onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const CancelOrder = ({ CancelOrder, onSuccess }: CancelMenuProps) => {


  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">เหตผลที่ยกเลิก</h1>
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
          <CheckboxInput name="description" label="เลือกเมนูผิด" value="เลือกเมนูผิด"/>
          <CheckboxInput name="description" label="เสือก" value="เสือก"/>
          <CheckboxInput name="description" label="พนักงานทำงานช้า" value="พนักงานทำงานช้า"/>
          <CheckboxInput name="description" label="บริการโคตรกาก" value="บริการโคตรกาก"/>
          <TextareaInput name="description" label="เหตผลอื่น *ไม่บังคับ" placeholder="เหตผลที่ยกเลิก" />
          <SubmitButton text="ยืนยันการยกเลิก" className="mb-3"/>
        </FormContainer>
      </div>
    </section>
  );
};
