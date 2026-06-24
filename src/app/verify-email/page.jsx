import { Suspense } from "react";
import VerifyEmailPage from "@/features/auth-pages/VerifyEmailPage";
export const metadata = { title: "Verify email — CCS", description: "Check your email to activate your CCS account." };
export default function Page() { return <Suspense><VerifyEmailPage /></Suspense>; }
