import { User, Briefcase, Building2, Mail, Phone, Monitor, LogOut } from 'lucide-react';

export function ProfilePage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Header */}
      <div className="bg-white rounded-3xl py-3 md:py-4 px-6 md:px-8 mb-4 md:mb-6 shadow-lg max-w-4xl mx-auto text-center">
        <h1 className="font-bold text-base md:text-lg text-gray-900">Profile</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Left Card - Profile Avatar */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col items-center justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            AP
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Ari Dian Prstyo</h2>
          <p className="text-sm text-gray-600">User</p>
        </div>

        {/* Right Card - Account Details */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="font-bold text-base md:text-lg text-gray-900 mb-4 md:mb-6">Account Details</h2>
          
          <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee Code</p>
                  <p className="text-sm font-semibold text-gray-900">E03249</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee Name</p>
                  <p className="text-sm font-semibold text-gray-900">Ari Dian Prstyo</p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-sm font-semibold text-gray-900">User</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Monitor className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Desk type</p>
                  <p className="text-sm font-semibold text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button className="w-full bg-red-600 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors font-semibold text-sm md:text-base">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}