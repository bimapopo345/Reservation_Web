import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Desk {
  id: string;
  name: string;
  floor: string;
  type: string;
  capacity: number;
}

const DESK_TYPES = ['MONITOR', 'TELP.CORCOM', 'STANDING_DESK', 'PC DESIGN_DESK'];

export function ManageDeskPage() {
  const [desks, setDesks] = useState<Desk[]>([
    { id: '1', name: '6A', floor: '6th floor', type: '-', capacity: 4 },
    { id: '2', name: '6B', floor: '6th floor', type: '-', capacity: 9 },
    { id: '3', name: '6B-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
    { id: '4', name: '6C', floor: '6th floor', type: '-', capacity: 7 },
    { id: '5', name: '6C-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
    { id: '6', name: '6D', floor: '6th floor', type: '-', capacity: 7 },
    { id: '7', name: '6D-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
    { id: '8', name: '6E', floor: '6th floor', type: '-', capacity: 6 },
    { id: '9', name: '6F', floor: '6th floor', type: '-', capacity: 7 },
    { id: '10', name: '6F-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  ]);

  const [floors] = useState(['6th floor', '7th floor']);
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    floor: '',
    type: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.capacity || !formData.floor || !formData.type) {
      alert('Please fill all fields');
      return;
    }

    const newDesk: Desk = {
      id: Date.now().toString(),
      name: formData.name,
      floor: formData.floor,
      type: formData.type,
      capacity: parseInt(formData.capacity),
    };

    setDesks([...desks, newDesk]);
    setFormData({ name: '', capacity: '', floor: '', type: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this desk?')) {
      setDesks(desks.filter(desk => desk.id !== id));
    }
  };

  const handleEdit = (desk: Desk) => {
    setEditingDesk(desk);
    setFormData({
      name: desk.name,
      capacity: desk.capacity.toString(),
      floor: desk.floor,
      type: desk.type,
    });
  };

  const handleUpdate = () => {
    if (!editingDesk || !formData.name.trim() || !formData.capacity || !formData.floor || !formData.type) {
      alert('Please fill all fields');
      return;
    }

    setDesks(desks.map(desk =>
      desk.id === editingDesk.id
        ? { ...desk, name: formData.name, capacity: parseInt(formData.capacity), floor: formData.floor, type: formData.type }
        : desk
    ));
    setEditingDesk(null);
    setFormData({ name: '', capacity: '', floor: '', type: '' });
  };

  const handleCancel = () => {
    setEditingDesk(null);
    setFormData({ name: '', capacity: '', floor: '', type: '' });
  };

  // Filter desks based on search query
  const filteredDesks = desks.filter(desk =>
    desk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desk.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    desk.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDesks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDesks = filteredDesks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Page Title */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Manage Desk</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Add New Desk Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingDesk ? 'Edit Desk' : 'Add New Desk'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Desk Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Desk Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 6A"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 4"
                  min="1"
                />
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Floor
                </label>
                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Floor</option>
                  {floors.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Type</option>
                  <option value="-">-</option>
                  {DESK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              {editingDesk ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Update
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search desks by name, floor, or type..."
            />
          </div>

          {/* Desks Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Desk</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Floor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Capacity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDesks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No desks found. Add a new desk to get started.
                    </td>
                  </tr>
                ) : (
                  paginatedDesks.map((desk, index) => (
                    <tr
                      key={desk.id}
                      className={`border-t border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-900">{desk.name}</td>
                      <td className="py-4 px-6 text-gray-900">{desk.floor}</td>
                      <td className="py-4 px-6 text-gray-900">{desk.type}</td>
                      <td className="py-4 px-6 text-gray-900">{desk.capacity}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(desk)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(desk.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredDesks.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDesks.length)} of {filteredDesks.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  « First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
