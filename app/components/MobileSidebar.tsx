import { Home, Clock, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xs text-gray-900">Workspace+</h1>
            <p className="text-[8px] text-blue-600 font-semibold">DESK RESERVATION</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-64 bg-gradient-to-b from-indigo-100 to-indigo-200 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-4">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button 
              onClick={closeMenu}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Logo */}
          <div className="mb-6">
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
                AP
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Ari Dian Prstyo</p>
                <p className="text-xs text-gray-500">User</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            <Link 
              to="/"
              onClick={closeMenu}
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
              onClick={closeMenu}
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
              onClick={closeMenu}
              className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-semibold text-sm">Profile</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <button className="w-full bg-white text-gray-700 rounded-xl py-3 px-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
