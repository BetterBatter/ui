import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  Bell,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react'

type AdminGuardProps = {
  authenticated: boolean
  authorized: boolean
  children: ReactNode
}

export function AdminGuard({ authenticated, authorized, children }: AdminGuardProps) {
  if (!authenticated) return <Navigate to="/live" replace />
  if (!authorized) return <Navigate to="/mypage" replace />
  return children
}

type AdminLayoutProps = {
  onExit: () => void
  onLogout: () => void
}

const adminNavigation = [
  { to: '/admin', label: '운영 개요', end: true, icon: LayoutDashboard },
  { to: '/admin/reports', label: '신고 관리', end: false, icon: Flag, count: 12 },
  { to: '/admin/users', label: '사용자 관리', end: false, icon: UsersRound },
  { to: '/admin/operations', label: '서비스 운영', end: false, icon: Activity },
]

const pageMeta = [
  { prefix: '/admin/reports', eyebrow: 'MODERATION', title: '신고 관리' },
  { prefix: '/admin/users', eyebrow: 'MEMBERS', title: '사용자 관리' },
  { prefix: '/admin/operations', eyebrow: 'OPERATIONS', title: '서비스 운영' },
  { prefix: '/admin', eyebrow: 'OVERVIEW', title: '운영 개요' },
]

export function AdminLayout({ onExit, onLogout }: AdminLayoutProps) {
  const location = useLocation()
  const [navigationOpen, setNavigationOpen] = useState(false)
  const currentPage = pageMeta.find((item) => location.pathname.startsWith(item.prefix)) ?? pageMeta[3]

  useEffect(() => setNavigationOpen(false), [location.pathname])

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-content">관리 본문으로 건너뛰기</a>
      <button
        className={`admin-navigation-scrim ${navigationOpen ? 'open' : ''}`}
        type="button"
        aria-label="관리 메뉴 닫기"
        tabIndex={navigationOpen ? 0 : -1}
        onClick={() => setNavigationOpen(false)}
      />

      <aside className={`admin-sidebar ${navigationOpen ? 'open' : ''}`} aria-label="관리자 메뉴">
        <header className="admin-brand-row">
          <button className="admin-mobile-close" type="button" aria-label="관리 메뉴 닫기" onClick={() => setNavigationOpen(false)}><X size={18} /></button>
          <span className="admin-brand-mark" aria-hidden="true"><ShieldCheck size={19} /></span>
          <span><strong>BetterBatter</strong><small>ADMIN CONSOLE</small></span>
        </header>

        <nav className="admin-navigation" aria-label="관리 기능">
          <span className="admin-navigation-label">WORKSPACE</span>
          {adminNavigation.map(({ to, label, end, icon: Icon, count }) => (
            <NavLink to={to} end={end} className={({ isActive }) => isActive ? 'active' : undefined} key={to}>
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
              {count && <b aria-label={`${count}건 대기`}>{count}</b>}
            </NavLink>
          ))}
        </nav>

        <footer className="admin-sidebar-footer">
          <div><span aria-hidden="true">BB</span><p><strong>BetterBatter</strong><small>슈퍼 관리자</small></p></div>
          <button type="button" onClick={onLogout} aria-label="관리자 로그아웃"><LogOut size={16} /></button>
        </footer>
      </aside>

      <section className="admin-surface">
        <header className="admin-topbar">
          <button className="admin-menu-trigger" type="button" aria-label="관리 메뉴 열기" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(true)}><Menu size={19} /></button>
          <div className="admin-current-page"><span>{currentPage.eyebrow}</span><strong>{currentPage.title}</strong></div>
          <div className="admin-topbar-actions">
            <span className="admin-system-status"><i aria-hidden="true" />운영 상태 정상</span>
            <button className="admin-notification" type="button" aria-label="새 운영 알림 3개"><Bell size={17} /><b>3</b></button>
            <button className="admin-exit" type="button" onClick={onExit}><ArrowLeft size={15} />서비스로 돌아가기</button>
          </div>
        </header>

        <main className="admin-content" id="admin-content" tabIndex={-1}>
          <Outlet />
        </main>
      </section>
    </div>
  )
}
