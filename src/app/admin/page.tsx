import type { Metadata } from "next";
import { getAdminSession, isUsingDefaultPassword } from "@/lib/auth";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Analytics & Security | HexDec",
  description: "Secure administrative dashboard for HexDec analytics, traffic metrics, and security controls.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await getAdminSession();
  const usingDefaultPass = isUsingDefaultPassword();

  return (
    <div className="w-full max-w-5xl mx-auto pt-2">
      <AdminDashboard
        initialIsAuthenticated={isAuthenticated}
        initialDefaultPassWarning={usingDefaultPass}
      />
    </div>
  );
}
