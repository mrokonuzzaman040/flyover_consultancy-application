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
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leads", href: "/admin/leads", icon: Users },
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
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">Flyover Admin</h1>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navigation.map((item: NavigationItem) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-sm"
                )}
                onClick={onClose}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-slate-500 capitalize">{session?.user?.role || "Admin"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}