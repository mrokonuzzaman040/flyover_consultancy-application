"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 sticky top-0 z-30">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center flex-1">
          <div className="max-w-md w-full lg:max-w-sm">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              </div>
              <Input
                id="search"
                name="search"
                className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-all duration-300 hover:bg-white hover:shadow-md"
                placeholder="Search dashboard..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-6 flex items-center md:ml-8 space-x-4">
          <Button variant="ghost" size="sm" className="relative p-3 hover:bg-slate-100 rounded-2xl transition-all duration-300 hover:shadow-md group">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 text-slate-600 group-hover:text-brand-600 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white animate-pulse" />
          </Button>
          
          <div className="ml-4 relative">
            <div className="flex items-center bg-gradient-to-r from-slate-50/80 to-white rounded-2xl p-3 shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center shadow-lg ring-2 ring-brand-100">
                <span className="text-sm font-bold text-white">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-bold text-slate-900 tracking-wide">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-brand-600 capitalize font-semibold">
                  {session?.user?.role || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}