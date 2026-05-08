import { Building2, Calendar, CheckCircle2, Clock, MapPin, User, Briefcase } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { formatDisplayDate } from '../lib/dates';
import type { Reservation, WorkspaceSummary } from '../types';
import { QuickActions } from './QuickActions';

export function MainContent() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeReservation = useMemo(() => reservations[0] ?? null, [reservations]);

  const loadDashboard = async () => {
    setIsLoading(true);
    const [summaryPayload, reservationPayload] = await Promise.all([
      apiFetch<WorkspaceSummary>('/workspace/summary'),
      apiFetch<Reservation[]>('/reservations/me'),
    ]);
    setSummary(summaryPayload);
    setReservations(reservationPayload);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboard().catch(() => setIsLoading(false));
  }, []);

  const updateReservation = async (action: 'check-in' | 'check-out' | 'complete') => {
    if (!activeReservation) return;
    const updated = await apiFetch<Reservation>(`/reservations/${activeReservation.id}/${action}`, {
      method: 'POST',
    });

    if (updated.status === 'COMPLETED') {
      setReservations((current) => current.filter((item) => item.id !== updated.id));
      return;
    }

    setReservations((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl p-4 md:p-8 mb-4 md:mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
              {user?.initials || 'U'}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              Good morning, {user?.name || 'User'}
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Employee Code</p>
                  <p className="text-sm font-semibold text-gray-900">{user?.employeeCode || user?.nik || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-semibold text-gray-900">{user?.position || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Total Workspace</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {summary?.totalFloors ?? 0} Floors - {summary?.totalDesks ?? 0} Desks
              </h2>
              <p className="text-sm text-gray-600">- {summary?.totalSeats ?? 0} Total Seats</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Available Seats</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{summary?.availableSeats ?? 0}</h2>
              <p className="text-sm text-gray-600">- {summary?.reservedSeats ?? 0} Reserved</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-xl text-center text-gray-600">
          Loading reservation...
        </div>
      )}

      {!isLoading && activeReservation && (
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-xl border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-gray-900">Today's Reservation</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Desk Number</p>
                    <p className="text-2xl font-bold text-gray-900">{activeReservation.desk.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Floor</p>
                  <p className="text-lg font-semibold text-gray-900">{activeReservation.desk.floor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDisplayDate(activeReservation.date)}</span>
              </div>
            </div>

            <div>
              {activeReservation.status === 'UPCOMING' && (
                <button
                  onClick={() => updateReservation('check-in')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                >
                  Check In
                </button>
              )}

              {activeReservation.status === 'ACTIVE' && (
                <button
                  onClick={() => updateReservation('check-out')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                >
                  Checkout
                </button>
              )}

              {activeReservation.status === 'CHECKED_OUT' && (
                <button
                  onClick={() => updateReservation('complete')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
                >
                  Mark as Completed
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeReservation.status === 'UPCOMING'
                    ? 'bg-yellow-500'
                    : activeReservation.status === 'ACTIVE'
                      ? 'bg-blue-500'
                      : 'bg-red-500'
                }`}
              />
              <span className="text-gray-600">
                {activeReservation.status === 'UPCOMING'
                  ? 'Waiting for Check-in'
                  : activeReservation.status === 'ACTIVE'
                    ? 'Currently Checked In'
                    : 'Checked Out'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
