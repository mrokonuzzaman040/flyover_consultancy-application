"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="Search..."
                type="search"
              />
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
          
          <div className="ml-3 relative">
            <div className="flex items-center bg-slate-50 rounded-lg p-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
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