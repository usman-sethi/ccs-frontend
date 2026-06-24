import { Suspense } from "react";
import SignupPage from "@/features/auth-pages/SignupPage";
export const metadata = { title: "Create account — CCS", description: "Join Core Computing Society and get access to clubs, events, and resources." };
export default function Page() { return <Suspense><SignupPage /></Suspense>; }
