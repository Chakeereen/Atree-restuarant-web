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
    <section className="text-gray-900 dark:text-gray-100 transition-colors">
      <h1 className="text-2xl font-semibold mb-8 capitalize">
        เหตุผลที่ยกเลิก
      </h1>

      <div className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 rounded-md max-w-lg shadow-sm">
        <FormContainer
          action={cancelOrder}
          onSuccess={() => {
            onSuccess?.();
            // ปิด modal หรือ callback อื่น ๆ
          }}
        >
          {/* hidden fields */}
          <input
            type="hidden"
            name="detailNo"
            value={CancelOrder.detailNo ?? ""}
          />
          <input
            type="hidden"
            name="orderNo"
            value={CancelOrder.orderNo ?? ""}
          />

          {/* checkboxes */}
          <CheckboxInput name="description" label="เลือกเมนูผิด" value="เลือกเมนูผิด" />
          <CheckboxInput name="description" label="เปลี่ยนใจอยากเลื่อกเมนูอื่น" value="เปลี่ยนใจอยากเลื่อกเมนูอื่น" />
          <CheckboxInput name="description" label="พนักงานทำงานช้า" value="พนักงานทำงานช้า" />
          <CheckboxInput name="description" label="ไม่บอก!!!" value="ไม่บอก!!!" />

          {/* textarea */}
          <TextareaInput
            name="description"
            label="เหตุผลอื่น *ไม่บังคับ"
            placeholder="เหตุผลที่ยกเลิก"
          />

          {/* submit button */}
          <SubmitButton text="ยืนยันการยกเลิก" className="mb-3" />
        </FormContainer>
      </div>
    </section>
  );
};
