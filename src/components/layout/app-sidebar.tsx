'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Palette,
  Users,
  BarChart3,
  CalendarDays,
  LogOut,
  Zap,
  ChevronsUpDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/content', label: 'Conteudos', icon: FileText },
  { href: '/calendar', label: 'Calendario', icon: CalendarDays },
  { href: '/templates', label: 'Templates', icon: Palette },
  { href: '/accounts', label: 'Contas', icon: Users },
  { href: '/analytics', label: 'Analiticos', icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'BV'

  return (
    <Sidebar className="!border-r-0">
      {/* Logo area */}
      <SidebarHeader className="px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5572B] shadow-sm">
            <Zap className="h-[18px] w-[18px] text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-gray-900">
              Publisher
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              Bravy Maestria
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <Separator className="mx-5 w-auto bg-gray-100" />

      {/* Navigation */}
      <SidebarContent className="px-3 pt-5">
        <SidebarGroup className="p-0">
          <span className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </span>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group/nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-colors',
                          isActive
                            ? 'text-gray-900'
                            : 'text-gray-400 group-hover/nav-item:text-gray-500'
                        )}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User area */}
      <SidebarFooter className="p-3">
        <Separator className="mb-2 bg-gray-100" />
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 focus:outline-none"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#FEF2F0] text-xs font-semibold text-[#E5572B]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-gray-900">
                {user?.name || 'Usuario'}
              </span>
              <span className="truncate text-[11px] text-gray-400">
                {user?.email || ''}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
            <DropdownMenuItem disabled>
              <span className="text-xs text-gray-500">
                {user?.tenantName || 'Bravy'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
