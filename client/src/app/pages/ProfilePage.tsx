import { Briefcase, Building2, LogOut, Mail, Monitor, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const details = [
    { label: 'Employee Code', value: user?.employeeCode || user?.nik || '-', icon: User },
    { label: 'Employee Name', value: user?.name || '-', icon: User },
    { label: 'Department', value: user?.department || '-', icon: Building2 },
    { label: 'Position', value: user?.position || '-', icon: Briefcase },
    { label: 'Role', value: user?.role || '-', icon: User },
    { label: 'Email', value: user?.email || '-', icon: Mail },
    { label: 'Phone', value: user?.phone || '-', icon: Phone },
    { label: 'Desk type', value: '-', icon: Monitor },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-5xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Profile</h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center text-center min-h-[360px]">
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-6">
            {user?.initials || 'U'}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'User'}</h2>
          <p className="text-sm text-gray-600 capitalize">{user?.role || 'user'}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                    <p className="text-sm font-semibold text-gray-900 break-words capitalize">{detail.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
