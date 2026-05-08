import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { downloadFromApi, apiFetch } from '../lib/api';
import type { Reservation, WorkspaceSummary } from '../types';

type OccupancyPoint = {
  date: string;
  total: number;
};

type UsagePoint = {
  desk: string;
  reserved: number;
  capacity: number;
};

export function ReportAnalyticPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [summary, setSummary] = useState<WorkspaceSummary | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyPoint[]>([]);
  const [usageByAreaData, setUsageByAreaData] = useState<UsagePoint[]>([]);
  const [reservationData, setReservationData] = useState<Reservation[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<WorkspaceSummary>('/reports/summary'),
      apiFetch<OccupancyPoint[]>('/reports/occupancy-trend'),
      apiFetch<UsagePoint[]>('/reports/usage-by-area'),
      apiFetch<Reservation[]>('/reports/reservations'),
    ]).then(([summaryPayload, occupancyPayload, usagePayload, reservationPayload]) => {
      setSummary(summaryPayload);
      setOccupancyData(occupancyPayload);
      setUsageByAreaData(usagePayload);
      setReservationData(reservationPayload);
    });
  }, []);

  const handleDownloadExcel = async (section: string) => {
    await downloadFromApi(`/reports/export?section=${encodeURIComponent(section)}`, `${section}.csv`);
  };

  const panelClass = theme === 'dark' ? 'bg-gray-950 text-white border-gray-800' : 'bg-white text-gray-900 border-gray-200';
  const subtleText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Report Analytic</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className={`${panelClass} rounded-3xl p-8 shadow-lg border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg ${subtleText}`}>Analytics Dashboard</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-6">Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">{summary?.totalFloors ?? 0}</div>
                <div className={`${subtleText} font-semibold`}>Total Floor</div>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold mb-2">{summary?.totalDesks ?? 0}</div>
                <div className={`${subtleText} font-semibold`}>Total Desk</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-base font-semibold ${subtleText}`}>Occupancy Trend</h4>
                <button onClick={() => handleDownloadExcel('occupancy-trend')} className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                  Download
                  <br />
                  Excel
                </button>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`text-base font-semibold mb-2 ${subtleText}`}>Usage by Area</h4>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className={subtleText}>reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-400 rounded"></div>
                    <span className={subtleText}>capacity</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDownloadExcel('usage-by-area')} className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                Download
                <br />
                Excel
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={usageByAreaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="desk" tick={{ fontSize: 10 }} angle={-90} textAnchor="end" stroke="#6b7280" height={120} />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="reserved" fill="#ef4444" />
                  <Bar dataKey="capacity" fill="#2dd4bf" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-base font-semibold ${subtleText}`}>Reservation List</h4>
              <button onClick={() => handleDownloadExcel('reservation-list')} className="text-blue-500 hover:text-blue-600 font-semibold text-sm">
                Download
                <br />
                Excel
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={theme === 'dark' ? 'bg-gray-900 border-b border-gray-800' : 'bg-gray-50 border-b border-gray-200'}>
                      <th className="text-left py-3 px-4 text-sm font-semibold">desk</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">employee_code</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">employee_name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.slice(0, 25).map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-200 ${theme === 'dark' ? 'bg-gray-950' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-3 px-4 text-sm">{item.desk.name}</td>
                        <td className="py-3 px-4 text-sm">{item.date}</td>
                        <td className="py-3 px-4 text-sm">{item.user.employeeCode || item.user.nik}</td>
                        <td className="py-3 px-4 text-sm">{item.user.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`flex items-center justify-end py-3 px-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                <span className={`text-sm ${subtleText}`}>Rows 1-{Math.min(reservationData.length, 25)} of {reservationData.length}</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 text-sm ${subtleText}`}>
            <span>Powered by <span className="text-blue-500 font-semibold">Workspace+</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
