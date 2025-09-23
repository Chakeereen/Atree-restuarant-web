"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { useRouter } from "next/navigation";
import { Admin } from "@/utils/type";
import { FormContainer } from "../../Form/FormContainer";
import ImageStaffUploader from "../../Staff/ImageStaffUploader";
import { editAdminAction } from "@/action/admin/AdminAction";


interface EditStaffProps {
    admin: Admin;
    onSuccess?: () => void; // optional callback หลังแก้ไขเสร็จ
}

export const EditAdmin = ({ admin, onSuccess }: EditStaffProps) => {
    const router = useRouter();


    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">edit staff</h1>
            <div className="border p-8 rounded-md max-w-lg">
                <FormContainer
                    action={editAdminAction}
                    onSuccess={() => {
                        onSuccess?.();
                        // ปิด modal หรือ callback อื่น ๆ
                    }}
                >
                    <input type="hidden" name="adminID" value={admin.adminID} />
                    <FormInput name="email" label="email" type="email" defaultValue={admin.email} />
                    <FormInput name="password" label="Password" type="password" />
                    <FormInput name="confirmPassword" label="Confirm Password" type="password" />
                    <FormInput name="name" label="Name" type="text" defaultValue={admin.name.toString() ?? ""} />
                    <FormInput name="surname" label="Surname" type="text" defaultValue={admin.surname.toString() ?? ""} />
                    <input type="hidden" name="oldFileID" value={admin.fileID ?? ""} />
                    <input type="hidden" name="oldImage" value={admin.image ?? ""} />
                    <ImageStaffUploader />
                    <SubmitButton text="update" />
                </FormContainer>
            </div>
        </section>
    );
};
