import { BarChart3, Building2, Clock, Clipboard, Home, LogOut, Menu, Monitor, User, Users, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OtsukaLogo } from './OtsukaLogo';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  const links =
    user?.role === 'admin'
      ? [
          { to: '/admin-home', label: 'Home', icon: Home },
          { to: '/history', label: 'History', icon: Clock },
          { to: '/profile', label: 'Profile', icon: User },
          { to: '/manage-floor', label: 'Manage Floor', icon: Building2 },
          { to: '/manage-desk', label: 'Manage Desk', icon: Clipboard },
          { to: '/manage-desk-type', label: 'Manage Desk Type', icon: Clipboard },
          { to: '/manage-user', label: 'Manage User', icon: Users },
          { to: '/monitoring', label: 'Monitor', icon: Monitor },
          { to: '/report-analytic', label: 'Reports', icon: BarChart3 },
        ]
      : [
          { to: '/', label: 'Home', icon: Home },
          { to: '/history', label: 'History', icon: Clock },
          { to: '/profile', label: 'Profile', icon: User },
        ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <OtsukaLogo compact />
          <div className="text-xs font-bold text-[#0b4ea2]">OTSUKA</div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />}

      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-indigo-100 to-indigo-200 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-end mb-4">
            <button onClick={closeMenu} className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="mb-6 bg-white rounded-2xl p-3 shadow-sm">
            <OtsukaLogo />
          </div>

          <div className="mb-6 bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.initials || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                    isActive(item.to) ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-gray-700 rounded-xl py-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
