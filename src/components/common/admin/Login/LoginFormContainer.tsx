"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  action: (formData: FormData) => Promise<{ success: boolean; message: string }>;
  children: React.ReactNode;
  redirectTo?: string;
}

export const LoginFormContainer = ({ action, children, redirectTo = "/admin" }: Props) => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await action(formData);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => router.push(redirectTo), 100); // redirect หลัง toast
    } else {
      toast.error(result.message);
    }
  };

  return <form onSubmit={handleSubmit}>{children}</form>;
};
