import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  ChevronsUpDown,
  Home,
  Landmark,
  LogOut,
  MapPin,
  Tag,
  Timer,
  Users,
  PiggyBank,
  LayoutDashboard,
  Search,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { storage } from '../../lib/storage'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

interface NavSection {
  title: string
  items: {
    to: string
    label: string
    icon: React.ElementType
    exact?: boolean
  }[]
}

const navSections: NavSection[] = [
  {
    title: 'Main Menu',
    items: [
      { to: '/admin', label: 'admin.dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: 'Konten & Peta',
    items: [
      { to: '/admin/locations', label: 'admin.locations', icon: MapPin },
      { to: '/admin/categories', label: 'admin.categories', icon: Tag },
      { to: '/admin/profile', label: 'admin.profile', icon: Landmark },
    ],
  },
  {
    title: 'Keuangan & Warga',
    items: [
      { to: '/admin/demographics', label: 'admin.demographics', icon: Users },
      { to: '/admin/apbd', label: 'admin.apbd', icon: PiggyBank },
      { to: '/admin/periods', label: 'admin.periods', icon: Timer },
    ],
  },
]

export function AdminLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAdminAuth()

  const username = storage.getUsername() ?? 'Admin'
  const initials = username.slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  // Compute breadcrumb trail text
  const getBreadcrumb = () => {
    if (location.pathname === '/admin') return 'Dashboard > Overview'
    if (location.pathname.includes('/locations')) return 'Dashboard > Lokasi'
    if (location.pathname.includes('/categories')) return 'Dashboard > Kategori'
    if (location.pathname.includes('/profile')) return 'Dashboard > Profil Desa'
    if (location.pathname.includes('/demographics')) return 'Dashboard > Demografi'
    if (location.pathname.includes('/apbd')) return 'Dashboard > APBDesa'
    if (location.pathname.includes('/periods')) return 'Dashboard > Periode Kades'
    return 'Dashboard > Overview'
  }

  const AccountMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t('admin.account')}
          className="flex items-center gap-3 rounded-2xl p-2 w-full text-sm font-medium text-neutral-600 hover:bg-neutral-200/50 transition-colors cursor-pointer"
        >
          <Avatar className="w-9 h-9 border border-neutral-200">
            <AvatarFallback className="bg-neutral-900 text-white font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left truncate hidden sm:block">
            <div className="text-xs font-semibold text-neutral-900 truncate">{username}</div>
            <div className="text-[10px] text-neutral-400 font-medium">Administrator</div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56 rounded-2xl p-2 shadow-lg">
        <DropdownMenuLabel className="text-xs font-bold text-neutral-900">{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
          <Link to="/" className="flex items-center gap-2 text-xs">
            <Home className="w-4 h-4" />
            {t('admin.view_site')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
          <Link to="/admin/profile" className="flex items-center gap-2 text-xs">
            <Landmark className="w-4 h-4" />
            {t('admin.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2 text-xs"
        >
          <LogOut className="w-4 h-4" />
          {t('admin.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen flex bg-[#F4F4F3] text-neutral-900 antialiased">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#F4F4F3] sticky top-0 h-screen p-4 border-r border-neutral-200/50">
        {/* Workspace Card Header */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 shadow-xs flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-xs text-neutral-900 truncate">
                Desa Mekarjaya
              </div>
              <div className="text-[10px] text-neutral-400 font-medium truncate">
                Admin Portal
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-neutral-400 shrink-0 cursor-pointer hover:text-neutral-600" />
        </div>

        {/* Categorized Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto pr-1 scrollbar-hide">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-3 mb-2">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.to, item.exact)
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200',
                        active
                          ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/70'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-4 h-4 shrink-0',
                          active ? 'text-neutral-900' : 'text-neutral-400'
                        )}
                      />
                      <span className="truncate">{t(item.label)}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Account Card */}
        <div className="pt-4 border-t border-neutral-200/60">
          <AccountMenu />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-[#F4F4F3]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between gap-4 border-b border-neutral-200/40">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span>{getBreadcrumb()}</span>
          </div>

          {/* Top Right Tools: Search Bar & Account Menu for Mobile */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari data lokasi / warga..."
                className="w-full bg-neutral-200/60 hover:bg-neutral-200/80 focus:bg-white text-xs text-neutral-800 placeholder:text-neutral-400 pl-8 pr-4 py-2 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all"
              />
            </div>

            <div className="md:hidden">
              <AccountMenu />
            </div>
          </div>
        </header>

        {/* Main Outlet */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
