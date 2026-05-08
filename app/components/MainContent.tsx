import { User, Briefcase, Building2, CheckCircle2, Calendar, MapPin, Clock } from 'lucide-react';
import { QuickActions } from './QuickActions';
import { useState, useEffect } from 'react';

export function MainContent() {
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

  // Check if there's a reservation from shuffle
  useEffect(() => {
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
      setTimeout(() => {
        sessionStorage.removeItem('shuffledDesk');
        setReservation(null);
      }, 2000);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-3xl p-4 md:p-8 mb-4 md:mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
              AP
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Good morning, Ari Dian Prstyo</h1>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Employee Code</p>
                  <p className="text-sm font-semibold text-gray-900">E03249</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-semibold text-gray-900">N/A</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Total Workspace Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Total Workspace</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">2 Floors · 59 Desks</h2>
              <p className="text-sm text-gray-600">· 256 Total Seats</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Available Seats Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Available Seats</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">149</h2>
              <p className="text-sm text-gray-600">· 107 Reserved</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="md:col-span-2 lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Today's Reservation Card */}
      {reservation && (
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-200">
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
  );
}