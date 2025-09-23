"use client";

import { SubmitButton } from "@/components/common/admin/Form/Button";

import FormInput from "@/components/common/admin/Form/FormInput";
import ImageInput from "@/components/common/admin/Form/ImageInput";

import { FormContainer } from "../../../Form/FormContainer";
import { useRouter } from "next/navigation";
import { Staff } from "@/utils/type";
import { editMenuAction } from "@/action/admin/MenuAction";
import ImageStaffUploader from "../../../Staff/ImageStaffUploader";
import { editStaffAction } from "@/action/admin/StaffAction";


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
                    action={editStaffAction}
                    onSuccess={() => {
                        onSuccess?.();
                        // ปิด modal หรือ callback อื่น ๆ
                    }}
                >
                    <input type="hidden" name="staffID" value={staff.staffID ?? ""} />
                    <FormInput name="email" label="email" type="email" defaultValue={staff.email} />
                    <FormInput name="password" label="Password" type="password" />
                    <FormInput name="confirmPassword" label="Confirm Password" type="password" />
                    <FormInput name="name" label="Name" type="text" defaultValue={staff.name.toString() ?? ""} />
                    <FormInput name="surname" label="Surname" type="text" defaultValue={staff.surname.toString() ?? ""} />
                    <FormInput name="telNo" label="เบอร์โทร" type="text" defaultValue={staff.telNo}/>
                    <input type="hidden" name="oldFileID" value={staff.fileID ?? ""} />
                    <input type="hidden" name="oldImage" value={staff.image ?? ""} />
                    <ImageStaffUploader />
                    <SubmitButton text="update" />
                </FormContainer>
            </div>
        </section>
    );
};
