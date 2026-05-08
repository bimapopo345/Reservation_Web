import { Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

interface EmployeeData {
  no: number;
  employeeId: string;
  name: string;
  email: string;
  desk: string;
  floor: string;
  checkIn: string;
  checkOut: string;
  status: 'Reserved' | 'Checked In';
}

export function EmployeeListPage() {
  const [searchParams] = useSearchParams();
  const floorParam = searchParams.get('floor');
  const [selectedDate, setSelectedDate] = useState('10/03/2026');
  const [selectedFloor, setSelectedFloor] = useState(floorParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Update selectedFloor when URL param changes
  useEffect(() => {
    if (floorParam) {
      setSelectedFloor(floorParam);
    }
  }, [floorParam]);

  // Mock data untuk employees
  const employees: EmployeeData[] = [
    { no: 1, employeeId: '2012071', name: 'Aisyah Ratna Kinanti', email: 'aisyah.kinanti@company.com', desk: '6A', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 2, employeeId: '2012072', name: 'Fariz Ahmad Hidayat', email: 'fariz.hidayat@company.com', desk: '6A', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 3, employeeId: '2012073', name: 'Nabila Putri Maharani', email: 'nabila.maharani@company.com', desk: '6A', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 4, employeeId: '2012074', name: 'Rendra Kurniawan', email: 'rendra.kurniawan@company.com', desk: '6A', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 5, employeeId: '2012075', name: 'Dinda Safira', email: 'dinda.safira@company.com', desk: '6B', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 6, employeeId: '2012076', name: 'Arief Wicaksono', email: 'arief.wicaksono@company.com', desk: '6B', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 7, employeeId: '2012077', name: 'Zahra Amelia', email: 'zahra.amelia@company.com', desk: '6B', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 8, employeeId: '2012078', name: 'Bima Sakti Pratama', email: 'bima.pratama@company.com', desk: '6B', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 9, employeeId: '2012079', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@company.com', desk: '6B-Monitor', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 10, employeeId: '2012080', name: 'Rizky Fauzan', email: 'rizky.fauzan@company.com', desk: '6C', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 11, employeeId: '2012081', name: 'Laila Nur Azizah', email: 'laila.azizah@company.com', desk: '6C', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 12, employeeId: '2012082', name: 'Hendra Gunawan', email: 'hendra.gunawan@company.com', desk: '6C', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 13, employeeId: '2012083', name: 'Putri Ayu Lestari', email: 'putri.lestari@company.com', desk: '6C', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 14, employeeId: '2012084', name: 'Adi Nugroho', email: 'adi.nugroho@company.com', desk: '6C', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 15, employeeId: '2012085', name: 'Fitri Handayani', email: 'fitri.handayani@company.com', desk: '6C-Monitor', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 16, employeeId: '2012086', name: 'Galih Pratama', email: 'galih.pratama@company.com', desk: '6D', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 17, employeeId: '2012087', name: 'Indah Permatasari', email: 'indah.permatasari@company.com', desk: '6D', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 18, employeeId: '2012088', name: 'Joni Iskandar', email: 'joni.iskandar@company.com', desk: '6D', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 19, employeeId: '2012089', name: 'Kartika Dewi', email: 'kartika.dewi@company.com', desk: '6D', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 20, employeeId: '2012090', name: 'Lukman Hakim', email: 'lukman.hakim@company.com', desk: '6D', floor: 'Floor 6th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    // Floor 7 employees
    { no: 21, employeeId: '2012091', name: 'Yoga Pratama', email: 'yoga.pratama@company.com', desk: '7J', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 22, employeeId: '2012092', name: 'Laila Maharani', email: 'laila.maharani@company.com', desk: '7J', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 23, employeeId: '2012093', name: 'Arif Rahman', email: 'arif.rahman@company.com', desk: '7K', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 24, employeeId: '2012094', name: 'Cahya Nugraha', email: 'cahya.nugraha@company.com', desk: '7L', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 25, employeeId: '2012095', name: 'Vina Anggraini', email: 'vina.anggraini@company.com', desk: '7L', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 26, employeeId: '2012096', name: 'Irfan Hakim', email: 'irfan.hakim@company.com', desk: '7L', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 27, employeeId: '2012097', name: 'Ridwan Kamil', email: 'ridwan.kamil@company.com', desk: '7M', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 28, employeeId: '2012098', name: 'Kartika Putri', email: 'kartika.putri@company.com', desk: '7M', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
    { no: 29, employeeId: '2012099', name: 'Gilang Ramadhan', email: 'gilang.ramadhan@company.com', desk: '7N', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Reserved' },
    { no: 30, employeeId: '2012100', name: 'Kevin Julio', email: 'kevin.julio@company.com', desk: '7O', floor: 'Floor 7th floor', checkIn: '09:00', checkOut: '18:00', status: 'Checked In' },
  ];

  // Filter employees by floor
  const filteredEmployees = employees.filter(emp => {
    if (selectedFloor === 'all') return true;
    return emp.desk.startsWith(selectedFloor);
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Get floor label for display
  const getFloorLabel = () => {
    if (selectedFloor === 'all') return 'All Floors';
    return `Floor ${selectedFloor}`;
  };

  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Header */}
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-7xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Employee List</h1>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 mb-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10/03/2026"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Floor Select */}
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

          {/* Search Input */}
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

        {/* Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2 md:mb-0">
            Total employee reserved pada Tue Mar 10 2026 ({getFloorLabel()}): <span className="font-bold text-gray-900">{filteredEmployees.length}</span>
          </p>
          <button 
            onClick={() => navigate('/monitoring')}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Sembunyikan daftar
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-7 gap-4 pb-4 border-b-2 border-gray-200 mb-4">
          <div className="col-span-2 text-sm font-bold text-gray-700">Employee ID</div>
          <div className="col-span-3 text-sm font-bold text-gray-700">Name</div>
          <div className="col-span-1 text-sm font-bold text-gray-700">Desk</div>
          <div className="col-span-1 text-sm font-bold text-gray-700 text-center">Status</div>
        </div>

        {/* Employee Cards */}
        <div className="space-y-3">
          {currentEmployees.map((employee) => (
            <div 
              key={employee.no} 
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-4 items-center">
                {/* Employee ID */}
                <div className="md:col-span-2">
                  <span className="md:hidden text-xs font-semibold text-gray-500 mr-2">Employee ID:</span>
                  <span className="text-sm text-gray-900">{employee.employeeId}</span>
                </div>

                {/* Name & Email */}
                <div className="md:col-span-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{employee.name}</span>
                    <span className="text-xs text-gray-500">{employee.email}</span>
                  </div>
                </div>

                {/* Desk & Floor */}
                <div className="md:col-span-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{employee.desk}</span>
                    <span className="text-xs text-gray-500">{employee.floor}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-1 flex justify-start md:justify-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.status === 'Checked In' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}