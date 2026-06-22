import ScanPage from "@/features/attendance/ScanPage";

export const metadata = {
  title: "Scan QR — Attendance | CCS",
  description: "Scan the event QR code to mark your attendance.",
};

export default function Page() {
  return <ScanPage />;
}
