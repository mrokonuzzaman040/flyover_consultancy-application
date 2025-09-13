"use client"

import { usePathname } from "next/navigation"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // Admin routes: render children without SiteHeader and SiteFooter
    return <>{children}</>
  }

  // Public routes: render with SiteHeader and SiteFooter
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh] bg-white">{children}</main>
      <SiteFooter />
    </>
  )
}