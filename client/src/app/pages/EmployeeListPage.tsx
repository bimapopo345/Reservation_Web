import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { apiFetch } from '../lib/api';
import { todayInput } from '../lib/dates';
import type { MonitoringDesk } from '../types';

type MonitoringResponse = {
  desks: MonitoringDesk[];
  summary: {
    totalEmployees: number;
    totalDesks: number;
  };
};

export function EmployeeListPage() {
  const [searchParams] = useSearchParams();
  const floorParam = searchParams.get('floor');
  const dateParam = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(dateParam || todayInput());
  const [selectedFloor, setSelectedFloor] = useState(floorParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (floorParam) setSelectedFloor(floorParam);
    if (dateParam) setSelectedDate(dateParam);
  }, [dateParam, floorParam]);

  useEffect(() => {
    const params = new URLSearchParams({
      date: selectedDate,
      floor: selectedFloor,
      search: '',
    });
    apiFetch<MonitoringResponse>(`/monitoring?${params}`).then(setData).catch(() => setData(null));
  }, [selectedDate, selectedFloor]);

  const employees = useMemo(() => {
    const allEmployees = (data?.desks ?? []).flatMap((desk) => desk.employees.map((employee) => ({ ...employee, floor: desk.floor })));
    if (!searchQuery.trim()) return allEmployees;
    const query = searchQuery.toLowerCase();
    return allEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.employeeCode?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query),
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);
  const getFloorLabel = () => (selectedFloor === 'all' ? 'All Floors' : `Floor ${selectedFloor}`);

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-6xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Employee List</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 mb-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
            <select
              value={selectedFloor}
              onChange={(e) => {
                setSelectedFloor(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Floors</option>
              <option value="6">Floor 6</option>
              <option value="7">Floor 7</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Employee (name, employee ID, email)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ketik untuk mencari..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total employee reserved ({getFloorLabel()}): <span className="font-bold text-gray-900">{employees.length}</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 rounded-xl mb-3">
          <div className="col-span-2 text-sm font-bold text-gray-700">Employee ID</div>
          <div className="col-span-4 text-sm font-bold text-gray-700">Name</div>
          <div className="col-span-2 text-sm font-bold text-gray-700">Desk</div>
          <div className="col-span-2 text-sm font-bold text-gray-700">Status</div>
          <div className="col-span-2 text-sm font-bold text-gray-700">Floor</div>
        </div>

        <div className="space-y-2">
          {currentEmployees.map((employee) => (
            <div key={`${employee.id}-${employee.desk}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors items-center">
              <div className="md:col-span-2">
                <span className="md:hidden text-xs font-semibold text-gray-500 mr-2">Employee ID:</span>
                <span className="text-sm text-gray-900">{employee.employeeCode || employee.nik}</span>
              </div>
              <div className="md:col-span-4 flex flex-col">
                <span className="text-sm font-semibold text-gray-900">{employee.name}</span>
                <span className="text-xs text-gray-500">{employee.email || '-'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-semibold text-gray-900">{employee.desk}</span>
              </div>
              <div className="md:col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${employee.status === 'Checked In' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {employee.status}
                </span>
              </div>
              <div className="md:col-span-2 text-sm text-gray-600">{employee.floor}</div>
            </div>
          ))}
        </div>

        {employees.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, employees.length)} of {employees.length} entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
