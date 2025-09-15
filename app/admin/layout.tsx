"use client"

import { SessionProvider } from "next-auth/react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex flex-col min-h-screen lg:ml-64">
          <AdminHeader />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SessionProvider>
  )
}
