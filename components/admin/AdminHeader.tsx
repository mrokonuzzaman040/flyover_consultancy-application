"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between pl-12 pr-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center flex-1">
          <div className="max-w-md w-full lg:max-w-sm">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>
              <Input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="Search dashboard..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-2 sm:space-x-3">
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-600 rounded-full border-2 border-white" />
          </Button>
          
          <div className="ml-4 relative">
            <div className="flex items-center rounded-lg p-2 border border-slate-200 bg-white">
              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-semibold text-slate-900 tracking-wide">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {(session?.user as { role?: string } | undefined)?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
