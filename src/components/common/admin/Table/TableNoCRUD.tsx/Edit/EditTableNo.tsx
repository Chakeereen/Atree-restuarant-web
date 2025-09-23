"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";

import FormInput from "@/components/common/admin/Form/FormInput";

import { FormContainer } from "../../../Form/FormContainer";
import { editTableNoAction } from "@/action/admin/TableNoAction";
import { TableNo } from "@/utils/type";


interface EditTableNoProps {
  tableNo: TableNo;
  onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const EditTableNo = ({ tableNo, onSuccess }: EditTableNoProps) => {

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">edit menu</h1>
      <div className="border p-8 rounded-md max-w-lg">
        <FormContainer
          action={editTableNoAction}
          onSuccess={() => {
            onSuccess?.();
              // ปิด modal หรือ callback อื่น ๆ
          }}
        >
          <input type="hidden" name="tableNo" value={tableNo.tableNo ?? ""} />
          <FormInput name="locationDetail" label="Menu Type Name" type="text" defaultValue={tableNo.locationDetail} />       
          <SubmitButton text="update" />
        </FormContainer>
      </div>
    </section>
  );
};
