import { Home, Clock, User, LogOut, Building2, Clipboard, Users, BarChart3, Monitor } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="w-56 bg-gradient-to-b from-indigo-100 to-indigo-200 h-screen flex flex-col p-4 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-gray-900">Workspace+</h1>
              <p className="text-xs text-blue-600 font-semibold">DESK RESERVATION</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-6 bg-white rounded-2xl p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.initials || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2">
        {user?.role === 'admin' ? (
          <>
            {/* Admin Home */}
            <Link 
              to="/admin-home"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 shadow-md transition-colors ${
                isActive('/admin-home') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold text-sm">Home</span>
            </Link>

            {/* History */}
            <Link 
              to="/history"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/history') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-sm">History</span>
            </Link>

            {/* Profile */}
            <Link 
              to="/profile"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold text-sm">Profile</span>
            </Link>

            {/* Admin Section Header */}
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-600 px-2">ADMIN</p>
            </div>

            {/* Manage Floor */}
            <Link
              to="/manage-floor"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/manage-floor') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold text-sm">Manage Floor</span>
            </Link>

            {/* Manage Desk */}
            <Link
              to="/manage-desk"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/manage-desk') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clipboard className="w-5 h-5" />
              <span className="font-semibold text-sm">Manage Desk</span>
            </Link>

            {/* Manage Desk Type */}
            <Link
              to="/manage-desk-type"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/manage-desk-type') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clipboard className="w-5 h-5" />
              <span className="font-semibold text-sm">Manage Desk Type</span>
            </Link>

            {/* Manage User */}
            <Link
              to="/manage-user"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/manage-user') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-semibold text-sm">Manage User</span>
            </Link>

            {/* Monitor */}
            <Link 
              to="/monitoring"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/monitoring') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="font-semibold text-sm">Monitor</span>
            </Link>

            {/* Reports */}
            <Link
              to="/report-analytic"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/report-analytic') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold text-sm">Reports</span>
            </Link>
          </>
        ) : (
          <>
            {/* User Menu */}
            <Link 
              to="/"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 shadow-md transition-colors ${
                isActive('/') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold text-sm">Home</span>
            </Link>
            <Link 
              to="/history"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/history') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-sm">History</span>
            </Link>
            <Link 
              to="/profile"
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold text-sm">Profile</span>
            </Link>
          </>
        )}
      </nav>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white text-gray-700 rounded-xl py-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-semibold text-sm">Logout</span>
      </button>
    </div>
  );
}
