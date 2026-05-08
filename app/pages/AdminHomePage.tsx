import { useAuth } from '../context/AuthContext';
import { Dice5, Monitor, Map, BarChart3, Users, Building2, Clipboard, Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import imgProfile from 'figma:asset/8358592ba537c5b99f1c634f03e26352da7905bb.png';

export function AdminHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<{
    id: string;
    deskNumber: string;
    floor: string;
    date: string;
    status: 'pending' | 'checked-in' | 'checked-out' | 'completed';
  } | null>(null);

  // Save/update history in localStorage
  const saveToHistory = (reservationData: any, status: 'upcoming' | 'active' | 'completed', checkInTime?: string, checkOutTime?: string) => {
    const history = JSON.parse(localStorage.getItem('reservationHistory') || '[]');

    const existingIndex = history.findIndex((item: any) => item.id === reservationData.id);

    const historyItem = {
      id: reservationData.id,
      deskNumber: reservationData.deskNumber,
      floor: reservationData.floor,
      date: reservationData.date,
      status: status,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      createdAt: existingIndex >= 0 ? history[existingIndex].createdAt : new Date().toISOString()
    };

    if (existingIndex >= 0) {
      history[existingIndex] = historyItem;
    } else {
      history.push(historyItem);
    }

    localStorage.setItem('reservationHistory', JSON.stringify(history));
  };

  // Simulate getting reservation from shuffle (in real app, this would come from shuffle page via state or API)
  useEffect(() => {
    // Check if there's a reservation from shuffle in sessionStorage
    const shuffledDesk = sessionStorage.getItem('shuffledDesk');
    if (shuffledDesk) {
      const deskData = JSON.parse(shuffledDesk);
      const reservationId = deskData.id || `res-${Date.now()}`;

      const newReservation = {
        id: reservationId,
        deskNumber: deskData.deskNumber,
        floor: deskData.floor,
        date: deskData.date,
        status: 'pending' as const
      };

      setReservation(newReservation);

      // Save to history with status "upcoming"
      saveToHistory(newReservation, 'upcoming');
    }
  }, []);

  const handleCheckIn = () => {
    if (reservation) {
      const checkInTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const updatedReservation = { ...reservation, status: 'checked-in' as const };
      setReservation(updatedReservation);

      // Update history with status "active" and check-in time
      saveToHistory(updatedReservation, 'active', checkInTime);
    }
  };

  const handleCheckOut = () => {
    if (reservation) {
      const checkOutTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const updatedReservation = { ...reservation, status: 'checked-out' as const };
      setReservation(updatedReservation);

      // Get existing check-in time from history
      const history = JSON.parse(localStorage.getItem('reservationHistory') || '[]');
      const existingItem = history.find((item: any) => item.id === reservation.id);
      const checkInTime = existingItem?.checkInTime;

      // Update history with status "completed" and check-out time
      saveToHistory(updatedReservation, 'completed', checkInTime, checkOutTime);
    }
  };

  const handleComplete = () => {
    if (reservation) {
      setReservation({ ...reservation, status: 'completed' });
      // Clear the reservation after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('shuffledDesk');
        setReservation(null);
      }, 2000);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile and Stats (2 columns width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={imgProfile}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Good afternoon, {user.name}
                </h1>
                <div className="flex items-center gap-8 text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👤</span>
                    <div>
                      <p className="text-xs text-gray-500">Employee Code</p>
                      <p className="font-semibold text-gray-900">{user.employeeCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💼</span>
                    <div>
                      <p className="text-xs text-gray-500">Position</p>
                      <p className="font-semibold text-gray-900">{user.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Workspace Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">TOTAL WORKSPACE</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">2 Floors • 59 Desks</h2>
                  <p className="text-sm text-gray-500">• 256 Total Seats</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Available Seats Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">AVAILABLE SEATS</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">144</h2>
                  <p className="text-sm text-gray-500">• 112 Reserved</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reservation Card */}
          {reservation && (
            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-gray-900">Today's Reservation</h3>
              </div>

              <div className="space-y-4">
                {/* Desk Information */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Desk Number</p>
                        <p className="text-2xl font-bold text-gray-900">{reservation.deskNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Floor</p>
                      <p className="text-lg font-semibold text-gray-900">{reservation.floor}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  {reservation.status === 'pending' && (
                    <button
                      onClick={handleCheckIn}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                    >
                      Check In
                    </button>
                  )}

                  {reservation.status === 'checked-in' && (
                    <button
                      onClick={handleCheckOut}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                    >
                      Checkout
                    </button>
                  )}

                  {reservation.status === 'checked-out' && (
                    <button
                      onClick={handleComplete}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {reservation.status === 'completed' && (
                    <div className="w-full bg-gray-100 text-gray-600 font-semibold py-3 px-6 rounded-xl text-center flex items-center justify-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      Completed
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    reservation.status === 'pending' ? 'bg-yellow-500' :
                    reservation.status === 'checked-in' ? 'bg-blue-500' :
                    reservation.status === 'checked-out' ? 'bg-red-500' :
                    'bg-green-500'
                  }`}></span>
                  <span className="text-gray-600 capitalize">
                    {reservation.status === 'pending' ? 'Waiting for Check-in' :
                     reservation.status === 'checked-in' ? 'Currently Checked In' :
                     reservation.status === 'checked-out' ? 'Checked Out' :
                     'Session Completed'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions and Admin Section */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⚡</span>
              <h2 className="font-bold text-lg text-gray-900">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              {/* Shuffle Tables */}
              <button
                onClick={() => navigate('/shuffle')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Dice5 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">Shuffle Tables</p>
                  <p className="text-xs text-gray-500">Get a random table...</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              {/* Monitoring */}
              <button
                onClick={() => navigate('/monitoring')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">Monitoring</p>
                  <p className="text-xs text-gray-500">Monitor desk status in...</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              {/* View Map */}
              <button
                onClick={() => navigate('/floor-map')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Map className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">View Map</p>
                  <p className="text-xs text-gray-500">View the map of your...</p>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔐</span>
              <h2 className="font-bold text-lg text-gray-900">Admin Section</h2>
            </div>

            <div className="space-y-3">
              {/* Admin Reporting */}
              <button 
                onClick={() => navigate('/report-analytic')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-900">Admin Reporting</p>
                  <p className="text-xs text-gray-500">Usage reports &...</p>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                  Admin Only
                </span>
              </button>

              {/* Manage Desk */}
              <button 
                onClick={() => navigate('/manage-desk')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clipboard className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-900">Manage Desk</p>
                  <p className="text-xs text-gray-500">Add, edit, or remove...</p>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                  Admin Only
                </span>
              </button>

              {/* Manage Desk Type */}
              <button 
                onClick={() => navigate('/manage-desk-type')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clipboard className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-900">Manage Desk Type</p>
                  <p className="text-xs text-gray-500">Add, edit, or remove...</p>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                  Admin Only
                </span>
              </button>

              {/* Manage Floor */}
              <button 
                onClick={() => navigate('/manage-floor')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-900">Manage Floor</p>
                  <p className="text-xs text-gray-500">Manage floor...</p>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                  Admin Only
                </span>
              </button>

              {/* Manage User */}
              <button 
                onClick={() => navigate('/manage-user')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-900">Manage User</p>
                  <p className="text-xs text-gray-500">User management</p>
                </div>
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                  Admin Only
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}