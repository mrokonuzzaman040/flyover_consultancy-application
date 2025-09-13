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
      <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
        <AdminSidebar />
        <div className="flex flex-col flex-1 lg:ml-64">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-12rem)]">
                  <div className="p-6 lg:p-8">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </SessionProvider>
  )
}