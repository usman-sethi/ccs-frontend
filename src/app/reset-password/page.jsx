import { Suspense } from "react";
import ResetPasswordPage from "@/features/auth-pages/ResetPasswordPage";
export const metadata = { title: "Reset password — CCS", description: "Set a new password for your CCS member account." };
export default function Page() { return <Suspense><ResetPasswordPage /></Suspense>; }
