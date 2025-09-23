'use client'

import { useEffect } from "react";
import { toast } from "sonner";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  message: '',
  success: false
};

type LoginActionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string; success: boolean }>;

interface LoginFormContainerProps {
  action: LoginActionFunction;
  children: React.ReactNode;
  onSuccess?: () => void;
  redirectTo?: string; // path สำหรับ redirect หลัง login
}

export const LoginFormContainer = ({
  action,
  children,
  onSuccess,
  redirectTo = "/admin",
}: LoginFormContainerProps) => {
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      router.push(redirectTo); // redirect client-side
      onSuccess?.();
    } else {
      toast.error(state.message);
    }
  }, [state.message, state.success, onSuccess, redirectTo, router]);

  return <form action={formAction}>{children}</form>;
};
