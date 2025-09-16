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
  LogOut,
  Menu,
  X,
  MapPin,
  Award,
  GraduationCap,
  CalendarCheck,
  Home,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Sliders,
  Tag,
  Lightbulb,
  Trophy,
  Handshake,
  Target,
  Route,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import Image from "next/image"

type NavigationItem = {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { name: "Blog", href: "/admin/posts", icon: FileText },
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Destinations", href: "/admin/destinations", icon: MapPin },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { 
    name: "Home Settings", 
    icon: Home,
    children: [
      { name: "Slider", href: "/admin/home-settings/slider", icon: Sliders },
      { name: "Insight Categories", href: "/admin/home-settings/insight-categories", icon: Tag },
      { name: "Insights", href: "/admin/home-settings/insights", icon: Lightbulb },
      { name: "Success Stories", href: "/admin/home-settings/success-stories", icon: Trophy },
      { name: "Partners", href: "/admin/home-settings/partners", icon: Handshake },
      { name: "Awards", href: "/admin/home-settings/awards", icon: Award },
      { name: "Why Choose Us Features", href: "/admin/home-settings/why-choose-us-features", icon: Target },
      { name: "Study Abroad Steps", href: "/admin/home-settings/study-abroad-steps", icon: Route },
      { name: "Stats", href: "/admin/home-settings/stats", icon: BarChart3 },
    ]
  },
  { 
    name: "Leads", 
    icon: Users,
    children: [
      { name: "Leads", href: "/admin/leads", icon: Users },
      { name: "Meeting Schedules", href: "/admin/meeting-schedules", icon: CalendarCheck },
    ]
  },
  { name: "Services", href: "/admin/services", icon: GraduationCap },
  { name: "Scholarships", href: "/admin/scholarships", icon: BookOpen },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare }
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
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white border-r border-slate-200 shadow-xl">
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
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
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
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([])

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const renderNavigationItem = (item: NavigationItem) => {
    if (item.children) {
      const isOpen = openDropdowns.includes(item.name)
      const hasActiveChild = item.children.some(child => pathname === child.href)
      
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleDropdown(item.name)}
            className={cn(
              "group flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-md transition-colors",
              hasActiveChild
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <div className="flex items-center">
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  hasActiveChild ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="font-medium">{item.name}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => {
                const isActive = pathname === child.href
                return (
                  <Link
                    key={child.name}
                    href={child.href!}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                    onClick={onClose}
                  >
                    <child.icon
                      className={cn(
                        "mr-3 h-4 w-4 flex-shrink-0",
                        isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                      )}
                    />
                    <span className="font-medium">{child.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    const isActive = pathname === item.href
    return (
      <Link
        key={item.name}
        href={item.href!}
        className={cn(
          "group flex items-center px-3 py-2.5 text-sm rounded-md transition-colors",
          isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
        onClick={onClose}
      >
        <item.icon
          className={cn(
            "mr-3 h-5 w-5 flex-shrink-0",
            isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
          )}
        />
        <span className="font-medium">{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <div className="flex items-center justify-center">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Image src="/logo.png" alt="Flyover Consultancy" width={120} height={120} />
          </Link>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-600 hover:bg-slate-100 rounded-md">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map(renderNavigationItem)}
        </nav>
        
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center mb-4 p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-sm font-semibold text-slate-700">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-slate-500 capitalize">{(session?.user as { role?: string } | undefined)?.role || "Admin"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md py-2.5"
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
