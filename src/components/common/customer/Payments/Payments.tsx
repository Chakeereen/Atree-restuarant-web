"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";

import FormInput from "@/components/common/admin/Form/FormInput";
import ImageInput from "@/components/common/admin/Form/ImageInput";


import { useRouter } from "next/navigation";
import { Staff } from "@/utils/type";
import { editMenuAction } from "@/action/admin/MenuAction";
import { FormContainer } from "../../admin/Form/FormContainer";


interface EditStaffProps {
    staff: Staff;
    onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const EditStaff = ({ staff, onSuccess }: EditStaffProps) => {
    const router = useRouter();


    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">edit staff</h1>
            <div className="border p-8 rounded-md max-w-lg">
                <FormContainer
                    action={editMenuAction}
                    onSuccess={() => {
                        onSuccess?.();
                        // ปิด modal หรือ callback อื่น ๆ
                    }}
                >
                    <input type="hidden" name="staffID" value={staff.staffID ?? ""} />
                   
                    <SubmitButton text="update menu" />
                </FormContainer>
            </div>
        </section>
    );
};
