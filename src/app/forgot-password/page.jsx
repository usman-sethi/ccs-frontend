import { Suspense } from "react";
import ForgotPasswordPage from "@/features/auth-pages/ForgotPasswordPage";
export const metadata = { title: "Forgot password — CCS", description: "Reset your CCS member account password." };
export default function Page() { return <Suspense><ForgotPasswordPage /></Suspense>; }
