import { Calendar, Search } from 'lucide-react';
import { DeskCard } from '../components/DeskCard';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface Employee {
  name: string;
  employeeId: string;
  email: string;
  status: 'Reserved' | 'Checked In';
}

export function MonitoringPage() {
  const [selectedDate, setSelectedDate] = useState('10/03/2026');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock data untuk employee assignments per desk
  const deskEmployees: Record<string, Employee[]> = {
    '6A': [
      { name: 'Amelia Utari', employeeId: 'E001', email: 'amelia.utari@example.com', status: 'Checked In' },
      { name: 'Microdolt Simanjuntak', employeeId: 'E002', email: 'microdolt.simanjuntak@example.com', status: 'Checked In' },
      { name: 'Diora Halim', employeeId: 'E003', email: 'diora.halim@example.com', status: 'Reserved' },
      { name: 'ARDEVA RESKY FORTUNA', employeeId: 'E004', email: 'ardeva.resky.fortuna@example.com', status: 'Reserved' },
    ],
    '6B': [
      { name: 'Budi Santoso', employeeId: 'E005', email: 'budi.santoso@example.com', status: 'Checked In' },
      { name: 'Siti Rahmawati', employeeId: 'E006', email: 'siti.rahmawati@example.com', status: 'Reserved' },
      { name: 'Andi Wijaya', employeeId: 'E007', email: 'andi.wijaya@example.com', status: 'Checked In' },
      { name: 'Dewi Lestari', employeeId: 'E008', email: 'dewi.lestari@example.com', status: 'Reserved' },
    ],
    '6B-Monitor': [
      { name: 'Rini Kusuma', employeeId: 'E009', email: 'rini.kusuma@example.com', status: 'Checked In' },
    ],
    '6C': [
      { name: 'Agus Setiawan', employeeId: 'E010', email: 'agus.setiawan@example.com', status: 'Reserved' },
      { name: 'Linda Purnama', employeeId: 'E011', email: 'linda.purnama@example.com', status: 'Checked In' },
      { name: 'Hadi Prasetyo', employeeId: 'E012', email: 'hadi.prasetyo@example.com', status: 'Reserved' },
      { name: 'Maya Sari', employeeId: 'E013', email: 'maya.sari@example.com', status: 'Checked In' },
      { name: 'Rizal Fauzi', employeeId: 'E014', email: 'rizal.fauzi@example.com', status: 'Reserved' },
    ],
    '6C-Monitor': [
      { name: 'Tono Suryadi', employeeId: 'E015', email: 'tono.suryadi@example.com', status: 'Checked In' },
    ],
    '6D': [
      { name: 'Yuni Astuti', employeeId: 'E016', email: 'yuni.astuti@example.com', status: 'Reserved' },
      { name: 'Eko Nugroho', employeeId: 'E017', email: 'eko.nugroho@example.com', status: 'Checked In' },
      { name: 'Fitri Handayani', employeeId: 'E018', email: 'fitri.handayani@example.com', status: 'Reserved' },
      { name: 'Dedi Kurniawan', employeeId: 'E019', email: 'dedi.kurniawan@example.com', status: 'Checked In' },
      { name: 'Nina Wulandari', employeeId: 'E020', email: 'nina.wulandari@example.com', status: 'Reserved' },
    ],
    '6D-Monitor': [],
    '6E': [
      { name: 'Joko Widodo', employeeId: 'E021', email: 'joko.widodo@example.com', status: 'Checked In' },
      { name: 'Sri Mulyani', employeeId: 'E022', email: 'sri.mulyani@example.com', status: 'Reserved' },
      { name: 'Bambang Tri', employeeId: 'E023', email: 'bambang.tri@example.com', status: 'Checked In' },
      { name: 'Wati Susilowati', employeeId: 'E024', email: 'wati.susilowati@example.com', status: 'Reserved' },
      { name: 'Putra Mahendra', employeeId: 'E025', email: 'putra.mahendra@example.com', status: 'Checked In' },
      { name: 'Sari Indah', employeeId: 'E026', email: 'sari.indah@example.com', status: 'Reserved' },
    ],
    '6F': [
      { name: 'Ahmad Fauzi', employeeId: 'E027', email: 'ahmad.fauzi@example.com', status: 'Checked In' },
      { name: 'Rina Melati', employeeId: 'E028', email: 'rina.melati@example.com', status: 'Reserved' },
      { name: 'Hendra Gunawan', employeeId: 'E029', email: 'hendra.gunawan@example.com', status: 'Checked In' },
      { name: 'Siska Wulan', employeeId: 'E030', email: 'siska.wulan@example.com', status: 'Reserved' },
    ],
    '6F-Monitor': [
      { name: 'Dimas Prasetya', employeeId: 'E031', email: 'dimas.prasetya@example.com', status: 'Checked In' },
    ],
    '6G': [
      { name: 'Farhan Maulana', employeeId: 'E032', email: 'farhan.maulana@example.com', status: 'Reserved' },
      { name: 'Indah Permata', employeeId: 'E033', email: 'indah.permata@example.com', status: 'Checked In' },
      { name: 'Galih Ramadhan', employeeId: 'E034', email: 'galih.ramadhan@example.com', status: 'Reserved' },
      { name: 'Nita Safitri', employeeId: 'E035', email: 'nita.safitri@example.com', status: 'Checked In' },
    ],
    '6G-Monitor': [
      { name: 'Rendra Kusuma', employeeId: 'E036', email: 'rendra.kusuma@example.com', status: 'Checked In' },
    ],
    '7I-PC Design': [],
    '7J': [
      { name: 'Yoga Pratama', employeeId: 'E037', email: 'yoga.pratama@example.com', status: 'Checked In' },
      { name: 'Laila Maharani', employeeId: 'E038', email: 'laila.maharani@example.com', status: 'Reserved' },
      { name: 'Fajar Sidiq', employeeId: 'E039', email: 'fajar.sidiq@example.com', status: 'Checked In' },
      { name: 'Putri Ayu', employeeId: 'E040', email: 'putri.ayu@example.com', status: 'Reserved' },
    ],
    '7J-Monitor': [
      { name: 'Hasan Basri', employeeId: 'E041', email: 'hasan.basri@example.com', status: 'Checked In' },
    ],
    '7K': [
      { name: 'Arif Rahman', employeeId: 'E042', email: 'arif.rahman@example.com', status: 'Reserved' },
      { name: 'Mira Lestari', employeeId: 'E043', email: 'mira.lestari@example.com', status: 'Checked In' },
      { name: 'Doni Firmansyah', employeeId: 'E044', email: 'doni.firmansyah@example.com', status: 'Reserved' },
    ],
    '7K-Monitor': [
      { name: 'Taufik Hidayat', employeeId: 'E045', email: 'taufik.hidayat@example.com', status: 'Checked In' },
    ],
    '7L': [
      { name: 'Cahya Nugraha', employeeId: 'E046', email: 'cahya.nugraha@example.com', status: 'Checked In' },
      { name: 'Vina Anggraini', employeeId: 'E047', email: 'vina.anggraini@example.com', status: 'Reserved' },
      { name: 'Irfan Hakim', employeeId: 'E048', email: 'irfan.hakim@example.com', status: 'Checked In' },
      { name: 'Lilis Suryani', employeeId: 'E049', email: 'lilis.suryani@example.com', status: 'Reserved' },
      { name: 'Bayu Setiawan', employeeId: 'E050', email: 'bayu.setiawan@example.com', status: 'Checked In' },
    ],
    '7L-Monitor': [
      { name: 'Aldi Taher', employeeId: 'E051', email: 'aldi.taher@example.com', status: 'Checked In' },
    ],
    '7M': [
      { name: 'Ridwan Kamil', employeeId: 'E052', email: 'ridwan.kamil@example.com', status: 'Reserved' },
      { name: 'Kartika Putri', employeeId: 'E053', email: 'kartika.putri@example.com', status: 'Checked In' },
      { name: 'Zaki Amali', employeeId: 'E054', email: 'zaki.amali@example.com', status: 'Reserved' },
      { name: 'Ratna Sari', employeeId: 'E055', email: 'ratna.sari@example.com', status: 'Checked In' },
    ],
    '7M-Monitor': [
      { name: 'Firman Utina', employeeId: 'E056', email: 'firman.utina@example.com', status: 'Checked In' },
    ],
    '7N': [
      { name: 'Gilang Ramadhan', employeeId: 'E057', email: 'gilang.ramadhan@example.com', status: 'Reserved' },
      { name: 'Melati Kusuma', employeeId: 'E058', email: 'melati.kusuma@example.com', status: 'Checked In' },
    ],
    '7N-Monitor': [
      { name: 'Aditya Warman', employeeId: 'E059', email: 'aditya.warman@example.com', status: 'Checked In' },
    ],
    '7O': [
      { name: 'Kevin Julio', employeeId: 'E060', email: 'kevin.julio@example.com', status: 'Checked In' },
      { name: 'Nabila Syakieb', employeeId: 'E061', email: 'nabila.syakieb@example.com', status: 'Reserved' },
      { name: 'Raffi Ahmad', employeeId: 'E062', email: 'raffi.ahmad@example.com', status: 'Checked In' },
      { name: 'Nagita Slavina', employeeId: 'E063', email: 'nagita.slavina@example.com', status: 'Reserved' },
    ],
    '7O-Monitor': [
      { name: 'Deddy Corbuzier', employeeId: 'E064', email: 'deddy.corbuzier@example.com', status: 'Checked In' },
    ],
    '7P': [
      { name: 'Prilly Latuconsina', employeeId: 'E065', email: 'prilly.latuconsina@example.com', status: 'Checked In' },
      { name: 'Iqbaal Ramadhan', employeeId: 'E066', email: 'iqbaal.ramadhan@example.com', status: 'Reserved' },
      { name: 'Vanesha Prescilla', employeeId: 'E067', email: 'vanesha.prescilla@example.com', status: 'Checked In' },
      { name: 'Angga Yunanda', employeeId: 'E068', email: 'angga.yunanda@example.com', status: 'Reserved' },
      { name: 'Amanda Rawles', employeeId: 'E069', email: 'amanda.rawles@example.com', status: 'Checked In' },
      { name: 'Bryan Domani', employeeId: 'E070', email: 'bryan.domani@example.com', status: 'Reserved' },
      { name: 'Jefri Nichol', employeeId: 'E071', email: 'jefri.nichol@example.com', status: 'Checked In' },
    ],
    '7P-Monitor': [],
    '7Q': [
      { name: 'Cut Syifa', employeeId: 'E072', email: 'cut.syifa@example.com', status: 'Reserved' },
      { name: 'Reza Rahadian', employeeId: 'E073', email: 'reza.rahadian@example.com', status: 'Checked In' },
      { name: 'Dian Sastro', employeeId: 'E074', email: 'dian.sastro@example.com', status: 'Reserved' },
    ],
    '7R': [
      { name: 'Cinta Laura', employeeId: 'E075', email: 'cinta.laura@example.com', status: 'Checked In' },
      { name: 'Hamish Daud', employeeId: 'E076', email: 'hamish.daud@example.com', status: 'Reserved' },
      { name: 'Raisa Andriana', employeeId: 'E077', email: 'raisa.andriana@example.com', status: 'Checked In' },
      { name: 'Hamish Daud', employeeId: 'E078', email: 'hamish.daud@example.com', status: 'Reserved' },
      { name: 'Isyana Sarasvati', employeeId: 'E079', email: 'isyana.sarasvati@example.com', status: 'Checked In' },
      { name: 'Rayhan Maditra', employeeId: 'E080', email: 'rayhan.maditra@example.com', status: 'Reserved' },
    ],
    '7R-Monitor': [
      { name: 'Afgan Syahreza', employeeId: 'E081', email: 'afgan.syahreza@example.com', status: 'Checked In' },
    ],
    '7S': [
      { name: 'Maudy Ayunda', employeeId: 'E082', email: 'maudy.ayunda@example.com', status: 'Checked In' },
      { name: 'Jesse Choi', employeeId: 'E083', email: 'jesse.choi@example.com', status: 'Reserved' },
      { name: 'Chelsea Islan', employeeId: 'E084', email: 'chelsea.islan@example.com', status: 'Checked In' },
      { name: 'Rob Clinton', employeeId: 'E085', email: 'rob.clinton@example.com', status: 'Reserved' },
    ],
    '7T': [
      { name: 'Nicholas Saputra', employeeId: 'E086', email: 'nicholas.saputra@example.com', status: 'Reserved' },
      { name: 'Marsha Timothy', employeeId: 'E087', email: 'marsha.timothy@example.com', status: 'Checked In' },
      { name: 'Lukman Sardi', employeeId: 'E088', email: 'lukman.sardi@example.com', status: 'Reserved' },
      { name: 'Tara Basro', employeeId: 'E089', email: 'tara.basro@example.com', status: 'Checked In' },
    ],
    '7U': [
      { name: 'Rio Dewanto', employeeId: 'E090', email: 'rio.dewanto@example.com', status: 'Checked In' },
      { name: 'Sheila Dara', employeeId: 'E091', email: 'sheila.dara@example.com', status: 'Reserved' },
      { name: 'Adipati Dolken', employeeId: 'E092', email: 'adipati.dolken@example.com', status: 'Checked In' },
      { name: 'Vanesha Prescilla', employeeId: 'E093', email: 'vanesha.prescilla@example.com', status: 'Reserved' },
    ],
    '7V': [
      { name: 'Morgan Oey', employeeId: 'E094', email: 'morgan.oey@example.com', status: 'Reserved' },
      { name: 'Tatjana Saphira', employeeId: 'E095', email: 'tatjana.saphira@example.com', status: 'Checked In' },
      { name: 'Chicco Jerikho', employeeId: 'E096', email: 'chicco.jerikho@example.com', status: 'Reserved' },
      { name: 'Putri Marino', employeeId: 'E097', email: 'putri.marino@example.com', status: 'Checked In' },
    ],
    '7V-Monitor': [
      { name: 'Reza Rahadian', employeeId: 'E098', email: 'reza.rahadian@example.com', status: 'Checked In' },
    ],
  };

  // Mock data for desks
  const desks = [
    { name: '6A', floor: 'Floor 6th floor', status: 'Penuh', occupied: 4, total: 4 },
    { name: '6B', floor: 'Floor 6th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '6B-Monitor', floor: 'Floor 6th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '6C', floor: 'Floor 6th floor', status: 'Terisi', occupied: 2, total: 5 },
    { name: '6C-Monitor', floor: 'Floor 6th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '6D', floor: 'Floor 6th floor', status: 'Terisi', occupied: 2, total: 5 },
    { name: '6D-Monitor', floor: 'Floor 6th floor', status: 'Kosong', occupied: 0, total: 0 },
    { name: '6E', floor: 'Floor 6th floor', status: 'Terisi', occupied: 3, total: 6 },
    { name: '6F', floor: 'Floor 6th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '6F-Monitor', floor: 'Floor 6th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '6G', floor: 'Floor 6th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '6G-Monitor', floor: 'Floor 6th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7I-PC Design', floor: 'Floor 7th floor', status: 'Kosong', occupied: 0, total: 0 },
    { name: '7J', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7J-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7K', floor: 'Floor 7th floor', status: 'Terisi', occupied: 1, total: 3 },
    { name: '7K-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7L', floor: 'Floor 7th floor', status: 'Terisi', occupied: 3, total: 5 },
    { name: '7L-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7M', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7M-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7N', floor: 'Floor 7th floor', status: 'Terisi', occupied: 1, total: 2 },
    { name: '7N-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7O', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7O-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7P', floor: 'Floor 7th floor', status: 'Terisi', occupied: 4, total: 7 },
    { name: '7P-Monitor', floor: 'Floor 7th floor', status: 'Kosong', occupied: 0, total: 0 },
    { name: '7Q', floor: 'Floor 7th floor', status: 'Terisi', occupied: 1, total: 3 },
    { name: '7R', floor: 'Floor 7th floor', status: 'Terisi', occupied: 3, total: 6 },
    { name: '7R-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    { name: '7S', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7T', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7U', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7V', floor: 'Floor 7th floor', status: 'Terisi', occupied: 2, total: 4 },
    { name: '7V-Monitor', floor: 'Floor 7th floor', status: 'Penuh', occupied: 1, total: 1 },
    // Add more desks as needed
  ];

  // Filter desks based on selected floor and search query
  const filteredDesks = desks.filter(desk => {
    // Filter by floor
    const floorMatch = selectedFloor === 'all' || desk.name.startsWith(selectedFloor);
    
    return floorMatch;
  });

  // Get filtered employees based on search query
  const getFilteredEmployees = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<Employee & { desk: string }> = [];

    // Filter by floor first
    const desksToSearch = selectedFloor === 'all' 
      ? desks 
      : desks.filter(desk => desk.name.startsWith(selectedFloor));

    desksToSearch.forEach(desk => {
      const employees = deskEmployees[desk.name] || [];
      employees.forEach(employee => {
        if (
          employee.name.toLowerCase().includes(query) ||
          employee.employeeId.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query)
        ) {
          results.push({ ...employee, desk: desk.name });
        }
      });
    });

    return results;
  };

  const filteredEmployees = getFilteredEmployees();

  // Calculate total employees based on filtered desks
  const totalEmployees = filteredDesks.reduce((sum, desk) => sum + desk.occupied, 0);
  
  // Calculate total available desks
  const totalDesks = filteredDesks.length;

  // Get floor label for display
  const getFloorLabel = () => {
    if (selectedFloor === 'all') return 'All Floors';
    return `Floor ${selectedFloor}`;
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Header */}
      <div className="bg-white rounded-3xl py-4 px-8 mb-6 shadow-lg max-w-6xl mx-auto text-center">
        <h1 className="font-bold text-xl text-gray-900">Desk Monitoring</h1>
      </div>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 mb-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          {searchQuery.trim() ? (
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Found <span className="font-bold text-gray-900">{filteredEmployees.length}</span> employee(s) matching your search ({getFloorLabel()})
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-2 md:mb-0">
              Total employee reserved pada Tue Mar 10 2026 ({getFloorLabel()}): <span className="font-bold text-gray-900">{totalEmployees}</span> | Available desks: <span className="font-bold text-gray-900">{totalDesks}</span>
            </p>
          )}
          <button 
            onClick={() => navigate(`/employee-list?floor=${selectedFloor}`)}
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Tampilkan daftar
          </button>
        </div>
      </div>

      {/* Desk Status Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📌</span>
          <h2 className="font-bold text-xl text-gray-900">
            {searchQuery.trim() ? 'Search Results' : 'Desk Status'}
          </h2>
        </div>

        {/* Conditional Rendering: Employee List or Desk Grid */}
        {searchQuery.trim() ? (
          // Employee List View
          <div className="space-y-2">
            {filteredEmployees.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-100 rounded-xl font-semibold text-sm text-gray-700">
                  <div>Name</div>
                  <div>Employee ID</div>
                  <div>Email</div>
                  <div>Desk</div>
                  <div>Status</div>
                </div>
                
                {/* Table Rows */}
                {filteredEmployees.map((employee, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors items-center"
                  >
                    <div className="text-gray-900 font-medium">{employee.name}</div>
                    <div className="text-gray-700">{employee.employeeId}</div>
                    <div className="text-gray-700 text-sm">{employee.email}</div>
                    <div className="text-gray-700 font-semibold">{employee.desk}</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                        employee.status === 'Checked In'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No employees found</p>
                <p className="text-sm mt-2">Try adjusting your search query</p>
              </div>
            )}
          </div>
        ) : (
          // Desk Grid View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredDesks.map((desk, index) => (
              <div key={index} onClick={() => setSelectedDesk(desk.name)} className="cursor-pointer">
                <DeskCard
                  name={desk.name}
                  floor={desk.floor}
                  status={desk.status}
                  occupied={desk.occupied}
                  total={desk.total}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Employee List */}
      {selectedDesk && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDesk(null)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Employees for {selectedDesk}
            </h2>
            
            <div className="space-y-3 mb-6">
              {deskEmployees[selectedDesk] ? (
                deskEmployees[selectedDesk].map((employee, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900 font-medium">{employee.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        employee.status === 'Checked In'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>ID: {employee.employeeId}</div>
                      <div>{employee.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No employees assigned to this desk</p>
              )}
            </div>
            
            <button
              onClick={() => setSelectedDesk(null)}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}