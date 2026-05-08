import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

// Mock data for Occupancy Trend
const occupancyData = [
  { date: '2026-2-15', total: 171 },
  { date: '2026-2-22', total: 164 },
  { date: '2026-3-1', total: 161 },
  { date: '2026-3-8', total: 164 },
  { date: '2026-3-15', total: 122 },
  { date: '2026-3-22', total: 5 },
  { date: '2026-3-29', total: 0 },
  { date: '2026-4-5', total: 159 },
  { date: '2026-4-12', total: 165 },
  { date: '2026-4-19', total: 135 },
  { date: '2026-4-26', total: 149 },
  { date: '2026-5-3', total: 113 },
  { date: '2026-5-10', total: 0 },
  { date: '2026-5-17', total: 115 },
  { date: '2026-5-24', total: 107 },
  { date: '2026-5-31', total: 40 },
  { date: '2026-6-7', total: 2 },
];

// Mock data for Usage by Area
const usageByAreaData = [
  { desk: '7C', reserved: 60, capacity: 10 },
  { desk: '8K', reserved: 60, capacity: 7 },
  { desk: '7H', reserved: 59, capacity: 7 },
  { desk: '7A', reserved: 58, capacity: 6 },
  { desk: '7N', reserved: 57, capacity: 9 },
  { desk: '7D', reserved: 56, capacity: 7 },
  { desk: '7K', reserved: 55, capacity: 6 },
  { desk: '7O', reserved: 54, capacity: 8 },
  { desk: '7J', reserved: 53, capacity: 6 },
  { desk: '7I', reserved: 52, capacity: 7 },
  { desk: '7B', reserved: 51, capacity: 6 },
  { desk: '7G', reserved: 51, capacity: 6 },
  { desk: '7L', reserved: 50, capacity: 8 },
  { desk: '7M', reserved: 50, capacity: 6 },
  { desk: '7E', reserved: 49, capacity: 6 },
  { desk: '8C', reserved: 49, capacity: 7 },
  { desk: '7F', reserved: 48, capacity: 6 },
  { desk: '8J', reserved: 48, capacity: 6 },
  { desk: '8F', reserved: 47, capacity: 6 },
  { desk: '6F', reserved: 46, capacity: 5 },
  { desk: '8B', reserved: 46, capacity: 5 },
  { desk: '8I', reserved: 45, capacity: 6 },
  { desk: '6A', reserved: 44, capacity: 5 },
  { desk: '8H', reserved: 44, capacity: 6 },
  { desk: '6C', reserved: 43, capacity: 5 },
  { desk: '8E', reserved: 43, capacity: 5 },
  { desk: '8G', reserved: 43, capacity: 6 },
  { desk: '6D', reserved: 42, capacity: 5 },
  { desk: '8D', reserved: 42, capacity: 5 },
  { desk: '6B', reserved: 41, capacity: 5 },
  { desk: '6E', reserved: 39, capacity: 6 },
  { desk: '8A', reserved: 39, capacity: 6 },
  { desk: '7K-Monitor', reserved: 10, capacity: 3 },
  { desk: '7J-Monitor', reserved: 10, capacity: 3 },
  { desk: '7F-Monitor', reserved: 10, capacity: 3 },
  { desk: '7I-Monitor', reserved: 10, capacity: 3 },
  { desk: '7B-Monitor', reserved: 9, capacity: 3 },
  { desk: '7G-Monitor', reserved: 9, capacity: 3 },
  { desk: '7H-Monitor', reserved: 9, capacity: 3 },
  { desk: '7D-Monitor', reserved: 9, capacity: 3 },
  { desk: '7E-Monitor', reserved: 9, capacity: 3 },
  { desk: '7A-Monitor', reserved: 9, capacity: 3 },
  { desk: '6D-Monitor', reserved: 8, capacity: 3 },
  { desk: '6E-Monitor', reserved: 8, capacity: 3 },
  { desk: '7C-Monitor', reserved: 8, capacity: 3 },
  { desk: '6B-Monitor', reserved: 8, capacity: 3 },
  { desk: '8B-Monitor', reserved: 8, capacity: 3 },
  { desk: '7O-Monitor', reserved: 8, capacity: 3 },
  { desk: '8K-Monitor', reserved: 8, capacity: 3 },
  { desk: '7M-Monitor', reserved: 8, capacity: 3 },
  { desk: '6C-Monitor', reserved: 8, capacity: 3 },
  { desk: '7N-Monitor', reserved: 8, capacity: 3 },
  { desk: '7L-Monitor', reserved: 8, capacity: 3 },
  { desk: '6A-Monitor', reserved: 7, capacity: 3 },
  { desk: '6F-Monitor', reserved: 7, capacity: 3 },
  { desk: '8A-Monitor', reserved: 7, capacity: 3 },
  { desk: '8E-Monitor', reserved: 7, capacity: 3 },
  { desk: '8C-Monitor', reserved: 7, capacity: 3 },
  { desk: '8D-Monitor', reserved: 7, capacity: 3 },
  { desk: '8F-Monitor', reserved: 7, capacity: 3 },
  { desk: '8G-Monitor', reserved: 7, capacity: 3 },
  { desk: '8I-Monitor', reserved: 7, capacity: 3 },
  { desk: '8H-Monitor', reserved: 6, capacity: 3 },
  { desk: '8J-Monitor', reserved: 6, capacity: 3 },
  { desk: '7J-Monitor', reserved: 5, capacity: 3 },
];

// Mock data for Reservation List
const reservationData = [
  { desk: '7V', date: '2026-3-19', employeeCode: '00735', employeeName: 'Microdoft Simanjuntak' },
  { desk: '7U', date: '2026-3-19', employeeCode: '04633', employeeName: 'Timotius Miguel' },
  { desk: '6G', date: '2026-3-18', employeeCode: '02189', employeeName: 'Eka Putri Listiawati' },
  { desk: '6D', date: '2026-3-18', employeeCode: '00735', employeeName: 'Microdoft Simanjuntak' },
  { desk: '7K', date: '2026-3-18', employeeCode: '04319', employeeName: 'Ghita Syahwini Lestari' },
  { desk: '8H', date: '2026-3-18', employeeCode: '04685', employeeName: 'Yudie A Siswanto' },
  { desk: '7G-Monitor', date: '2026-3-18', employeeCode: '04141', employeeName: 'Sheyla Ayu Putri' },
  { desk: '7B', date: '2026-3-18', employeeCode: '04684', employeeName: 'Diora Halim' },
  { desk: '7H', date: '2026-3-18', employeeCode: '04536', employeeName: 'Claratius Anastado Silaban' },
  { desk: '7M', date: '2026-3-18', employeeCode: '03863', employeeName: 'Jackson Kornelius' },
  { desk: '7O', date: '2026-3-18', employeeCode: '04375', employeeName: 'Aditya Mohamad' },
  { desk: '7S', date: '2026-3-18', employeeCode: '03227', employeeName: 'Innocentio Boawharta' },
  { desk: '7J', date: '2026-3-18', employeeCode: '04715', employeeName: 'Fabieza Nur Hafida' },
  { desk: '7G', date: '2026-3-18', employeeCode: '00919', employeeName: 'Andy Kurniadi Suryanto' },
];

export function ReportAnalyticPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleDownloadExcel = (section: string) => {
    alert(`Downloading ${section} data as Excel...`);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Report Analytic</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Header with title and theme toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg text-gray-600">Analytics Dashboard</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  theme === 'light'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Dashboard Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard</h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">2</div>
                <div className="text-gray-600 font-semibold">Total Floor</div>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8 text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">59</div>
                <div className="text-gray-600 font-semibold">Total Desk</div>
              </div>
            </div>

            {/* Occupancy Trend Chart */}
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base text-gray-700 font-semibold">Occupancy Trend</h4>
                <button
                  onClick={() => handleDownloadExcel('Occupancy Trend')}
                  className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
                >
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
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    label={{ value: 'date', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    label={{ value: 'Total', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorTotal)"
                    label={{ position: 'top', fontSize: 11 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Usage by Area Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base text-gray-700 font-semibold mb-2">Usage by Area</h4>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600">reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-400 rounded"></div>
                    <span className="text-gray-600">capacity</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDownloadExcel('Usage by Area')}
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
              >
                Download
                <br />
                Excel
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={usageByAreaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="desk"
                    tick={{ fontSize: 10, angle: -90, textAnchor: 'end' }}
                    stroke="#6b7280"
                    height={120}
                    label={{ value: 'desk', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="reserved" fill="#ef4444" />
                  <Bar dataKey="capacity" fill="#2dd4bf" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reservation List Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base text-gray-700 font-semibold">Reservation List</h4>
              <button
                onClick={() => handleDownloadExcel('Reservation List')}
                className="text-blue-500 hover:text-blue-600 font-semibold text-sm flex items-center gap-1"
              >
                Download
                <br />
                Excel
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">desk</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">employee_code</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">employee_name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationData.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">{item.desk}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.employeeCode}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.employeeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end py-3 px-4 border-t border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-600 mr-4">Rows 1-14 of 1779</span>
                <button className="text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" fill="currentColor" />
              <rect x="14" y="3" width="7" height="7" fill="currentColor" />
              <rect x="3" y="14" width="7" height="7" fill="currentColor" />
              <rect x="14" y="14" width="7" height="7" fill="currentColor" />
            </svg>
            <span>Powered by <span className="text-blue-500 font-semibold">Metabase</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
