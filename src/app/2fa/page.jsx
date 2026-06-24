import { Suspense } from "react";
import TwoFAPage from "@/features/auth-pages/TwoFAPage";
export const metadata = { title: "Two-factor auth — CCS", description: "Verify your identity with a one-time code." };
export default function Page() { return <Suspense><TwoFAPage /></Suspense>; }
