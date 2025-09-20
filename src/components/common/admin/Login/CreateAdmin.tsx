'use client'

import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { FormContainer } from "@/components/common/admin/Form/FormContainer";
import { createAdminAction } from "@/action/admin/AdminAction";
import ImageStaffUploader from "../Staff/ImageStaffUploader";

interface CreateAdminProps {
  onSuccess?: () => void;
}

const CreateAdmin = ({ onSuccess }: CreateAdminProps) => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <section className="w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-8 capitalize text-center text-gray-800 dark:text-gray-100">
          Create Admin User
        </h1>
        <div className="border p-8 rounded-md max-w-lg bg-white dark:bg-gray-900 shadow-md">
          <FormContainer
            action={createAdminAction}
            onSuccess={onSuccess}
            refreshOnSuccess={false}
          >
            <FormInput name="email" label="Email" type="email" />
            <FormInput name="password" label="Password" type="password" />
            <FormInput name="confirmPassword" label="Confirm Password" type="password" />
            <FormInput name="name" label="Name" type="text" />
            <FormInput name="surname" label="Surname" type="text" />
            <ImageStaffUploader />
            <SubmitButton text="Create Admin" />
          </FormContainer>
        </div>
      </section>
    </div>
  );
};

export default CreateAdmin;
