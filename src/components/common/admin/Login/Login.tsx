'use client'

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- import useRouter
import { SubmitButton } from "@/components/common/admin/Form/Button";
import FormInput from "@/components/common/admin/Form/FormInput";
import { LoginFormContainer } from "./LoginFormContainer";
import { loginAdminAction } from "@/utils/admin";

interface LoginProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginProps) => {
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);
  const router = useRouter(); // <-- ใช้ useRouter

  // กำหนด callback onSuccess สำหรับ redirect
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    router.push("/admin"); // <-- redirect ไป /admin
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Login
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showForm && (
          <LoginFormContainer
            action={loginAdminAction}
            onSuccess={handleSuccess} // <-- ใช้ handleSuccess
          >
            <div className="space-y-4">
              <FormInput name="email" label="Email" type="email" />
              <FormInput name="password" label="Password" type="password" />
            </div>
            <div className="mt-6">
              <SubmitButton text="Login" />
            </div>
          </LoginFormContainer>
        )}
      </div>
    </section>
  );
};

export default LoginForm;
