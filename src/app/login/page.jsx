import { Suspense } from "react";
import LoginPage from "@/features/auth-pages/LoginPage";
export const metadata = { title: "Sign in — CCS", description: "Sign in to your Core Computing Society member account." };
export default function Page() { return <Suspense><LoginPage /></Suspense>; }
