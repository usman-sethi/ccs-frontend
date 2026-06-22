import { Suspense } from "react";
import ResetPasswordPage from "@/features/reset-password/ResetPasswordPage";

export const metadata = {
  title: "Reset password — CCS",
  description: "Set a new password for your Core Computing Society account.",
};

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
