import { BarChart3, Building2, Calendar, Clipboard, Dice5, Map, MapPin, Monitor, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { formatDisplayDate } from '../lib/dates';
import type { Reservation, WorkspaceSummary } from '../types';

export function AdminHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    Promise.all([apiFetch<WorkspaceSummary>('/workspace/summary'), apiFetch<Reservation[]>('/reservations/me')])
      .then(([summaryPayload, reservations]) => {
        setSummary(summaryPayload);
        setReservation(reservations[0] ?? null);
      })
      .catch(() => {
        setSummary(null);
        setReservation(null);
      });
  }, []);

  const updateReservation = async (action: 'check-in' | 'check-out' | 'complete') => {
    if (!reservation) return;
    const updated = await apiFetch<Reservation>(`/reservations/${reservation.id}/${action}`, { method: 'POST' });
    setReservation(updated.status === 'COMPLETED' ? null : updated);
  };

  const quickActions = [
    { label: 'Shuffle Tables', helper: 'Get a random table...', icon: Dice5, to: '/shuffle', color: 'bg-purple-100 text-purple-600' },
    { label: 'Monitoring', helper: 'Monitor desk status in...', icon: Monitor, to: '/monitoring', color: 'bg-green-100 text-green-600' },
    { label: 'View Map', helper: 'View the map of your...', icon: Map, to: '/floor-map', color: 'bg-blue-100 text-blue-600' },
  ];

  const adminActions = [
    { label: 'Admin Reporting', helper: 'Usage reports & analytics', icon: BarChart3, to: '/report-analytic', color: 'bg-blue-100 text-blue-600' },
    { label: 'Manage Desk', helper: 'Add, edit, or remove desks', icon: Clipboard, to: '/manage-desk', color: 'bg-red-100 text-red-600' },
    { label: 'Manage Desk Type', helper: 'Assign desk capabilities', icon: Clipboard, to: '/manage-desk-type', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Manage Floor', helper: 'Manage workspace floors', icon: Building2, to: '/manage-floor', color: 'bg-purple-100 text-purple-600' },
    { label: 'Manage User', helper: 'User management', icon: Users, to: '/manage-user', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
                  {user?.initials || 'A'}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Good afternoon, {user?.name}</h1>
                <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-600 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Employee Code</p>
                    <p className="font-semibold text-gray-900">{user?.employeeCode || user?.nik}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="font-semibold text-gray-900">{user?.position || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">TOTAL WORKSPACE</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {summary?.totalFloors ?? 0} Floors - {summary?.totalDesks ?? 0} Desks
                  </h2>
                  <p className="text-sm text-gray-500">- {summary?.totalSeats ?? 0} Total Seats</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">AVAILABLE SEATS</p>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{summary?.availableSeats ?? 0}</h2>
                  <p className="text-sm text-gray-500">- {summary?.reservedSeats ?? 0} Reserved</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold">
                  OK
                </div>
              </div>
            </div>
          </div>

          {reservation && (
            <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-lg text-gray-900">Today's Reservation</h3>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Desk Number</p>
                      <p className="text-2xl font-bold text-gray-900">{reservation.desk.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Floor</p>
                    <p className="text-lg font-semibold text-gray-900">{reservation.desk.floor}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{formatDisplayDate(reservation.date)}</p>
              </div>
              {reservation.status === 'UPCOMING' && (
                <button onClick={() => updateReservation('check-in')} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl">
                  Check In
                </button>
              )}
              {reservation.status === 'ACTIVE' && (
                <button onClick={() => updateReservation('check-out')} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl">
                  Checkout
                </button>
              )}
              {reservation.status === 'CHECKED_OUT' && (
                <button onClick={() => updateReservation('complete')} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl">
                  Mark as Completed
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ActionPanel title="Quick Actions" actions={quickActions} onNavigate={navigate} />
          <ActionPanel title="Admin Section" actions={adminActions} onNavigate={navigate} showAdminBadge />
        </div>
      </div>
    </div>
  );
}

type PanelAction = {
  label: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
  to: string;
  color: string;
};

function ActionPanel({
  title,
  actions,
  onNavigate,
  showAdminBadge = false,
}: {
  title: string;
  actions: PanelAction[];
  onNavigate: (path: string) => void;
  showAdminBadge?: boolean;
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h2 className="font-bold text-lg text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.to}
              onClick={() => onNavigate(action.to)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500 truncate">{action.helper}</p>
              </div>
              {showAdminBadge && <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">Admin Only</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
