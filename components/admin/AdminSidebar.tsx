"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Upload,
  MapPin,
  Award,
  GraduationCap,
  CalendarCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import Image from "next/image"

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
  { name: "Meeting Schedules", href: "/admin/meeting-schedules", icon: CalendarCheck },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Services", href: "/admin/services", icon: GraduationCap },
  { name: "Offices", href: "/admin/offices", icon: Award },
  { name: "File Uploads", href: "/admin/uploads", icon: Upload },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
          <SidebarContent 
            navigation={navigation} 
            pathname={pathname} 
            session={session} 
            onSignOut={handleSignOut}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-40">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200 shadow-lg">
          <SidebarContent 
            navigation={navigation} 
            pathname={pathname} 
            session={session} 
            onSignOut={handleSignOut}
          />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-40"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

function SidebarContent({ 
  navigation, 
  pathname, 
  session, 
  onSignOut, 
  onClose 
}: {
  navigation: NavigationItem[]
  pathname: string
  session: Session | null
  onSignOut: () => void
  onClose?: () => void
}) {
  return (
    <>
      <div className="flex items-center justify-center h-20 px-6 border-b border-slate-200/50 shadow-lg">
        <div className="flex items-center space-x-3">
          <div>
            <Image src="/logo.png" alt="Flyover Consultancy" width={128} height={128} />
            <p className="text-xs text-white/70 font-medium">Admin Dashboard</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white">
        <nav className="flex-1 px-4 py-8 space-y-1">
          {navigation.map((item: NavigationItem) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ease-out relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-brand-50 to-brand-100/50 text-brand-700 shadow-md border border-brand-200/50 transform scale-[1.02]"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-sm hover:transform hover:scale-[1.01]"
                )}
                onClick={onClose}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-brand-600 rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "mr-4 h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-brand-600 scale-110" : "text-slate-400 group-hover:text-slate-600 group-hover:scale-105"
                  )}
                />
                <span className="font-semibold tracking-wide">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>
        
        <div className="flex-shrink-0 p-6 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-white">
          <div className="flex items-center mb-6 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center shadow-lg ring-2 ring-brand-100">
                <span className="text-base font-bold text-white">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate tracking-wide">{session?.user?.name || "User"}</p>
              <p className="text-xs text-brand-600 capitalize font-semibold bg-brand-50 px-2 py-1 rounded-full inline-block mt-1">{session?.user?.role || "Admin"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 transition-all duration-300 rounded-xl py-3 font-semibold"
            onClick={onSignOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}