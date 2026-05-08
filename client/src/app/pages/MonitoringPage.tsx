import { MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { DeskCard } from '../components/DeskCard';
import { apiFetch } from '../lib/api';
import { todayInput } from '../lib/dates';
import type { MonitoringDesk } from '../types';

type MonitoringResponse = {
  date: string;
  desks: MonitoringDesk[];
  employees: MonitoringDesk['employees'];
  summary: {
    totalEmployees: number;
    totalDesks: number;
  };
};

export function MonitoringPage() {
  const [selectedDate, setSelectedDate] = useState(todayInput());
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesk, setSelectedDesk] = useState<MonitoringDesk | null>(null);
  const [data, setData] = useState<MonitoringResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({
      date: selectedDate,
      floor: selectedFloor,
      search: searchQuery,
    });
    apiFetch<MonitoringResponse>(`/monitoring?${params}`).then(setData).catch(() => setData(null));
  }, [selectedDate, selectedFloor, searchQuery]);

  const getFloorLabel = () => (selectedFloor === 'all' ? 'All Floors' : `Floor ${selectedFloor}`);
  const desks = data?.desks ?? [];
  const employees = data?.employees ?? [];

  const deskEmployees = useMemo(() => {
    const map = new Map<number, MonitoringDesk['employees']>();
    desks.forEach((desk) => map.set(desk.id, desk.employees));
    return map;
  }, [desks]);

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-6xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Desk Monitoring</h1>
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
              onChange={(e) => setSelectedFloor(e.target.value)}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ketik untuk mencari..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-200">
          {searchQuery.trim() ? (
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Found <span className="font-bold text-gray-900">{employees.length}</span> employee(s) matching your search ({getFloorLabel()})
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Total employee reserved ({getFloorLabel()}): <span className="font-bold text-gray-900">{data?.summary.totalEmployees ?? 0}</span> | Available desks:{' '}
              <span className="font-bold text-gray-900">{data?.summary.totalDesks ?? 0}</span>
            </p>
          )}
          <button
            onClick={() => navigate(`/employee-list?floor=${selectedFloor}&date=${selectedDate}`)}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Tampilkan daftar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="font-bold text-xl text-gray-900">{searchQuery.trim() ? 'Search Results' : 'Desk Status'}</h2>
        </div>

        {searchQuery.trim() ? (
          <EmployeeRows employees={employees} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {desks.map((desk) => (
              <div key={desk.id} onClick={() => setSelectedDesk(desk)} className="cursor-pointer">
                <DeskCard name={desk.name} floor={desk.floor} status={desk.status} occupied={desk.occupied} total={desk.capacity} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDesk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDesk(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Employees for {selectedDesk.name}</h2>
            <div className="space-y-3 mb-6">
              {(deskEmployees.get(selectedDesk.id) ?? []).length > 0 ? (
                (deskEmployees.get(selectedDesk.id) ?? []).map((employee) => (
                  <div key={employee.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900 font-medium">{employee.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${employee.status === 'Checked In' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {employee.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>ID: {employee.employeeCode || employee.nik}</div>
                      <div>{employee.email || '-'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No employees assigned to this desk</p>
              )}
            </div>
            <button onClick={() => setSelectedDesk(null)} className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmployeeRows({ employees }: { employees: MonitoringDesk['employees'] }) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No employees found</p>
        <p className="text-sm mt-2">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 rounded-xl font-semibold text-sm text-gray-700">
        <div>Name</div>
        <div>Employee ID</div>
        <div>Email</div>
        <div>Desk</div>
        <div>Status</div>
      </div>
      {employees.map((employee) => (
        <div key={`${employee.id}-${employee.desk}`} className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors items-center">
          <div className="text-gray-900 font-medium">{employee.name}</div>
          <div className="text-gray-700">{employee.employeeCode || employee.nik}</div>
          <div className="text-gray-700 text-sm">{employee.email || '-'}</div>
          <div className="text-gray-700 font-semibold">{employee.desk}</div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${employee.status === 'Checked In' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {employee.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
