import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { apiFetch } from '../lib/api';
import type { Desk, DeskType, Floor } from '../types';

type DeskForm = {
  name: string;
  capacity: string;
  floorId: string;
  deskTypeId: string;
};

const emptyForm: DeskForm = { name: '', capacity: '', floorId: '', deskTypeId: '' };

export function ManageDeskPage() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [deskTypes, setDeskTypes] = useState<DeskType[]>([]);
  const [formData, setFormData] = useState<DeskForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Desk | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadData = async () => {
    const [deskPayload, floorPayload, typePayload] = await Promise.all([
      apiFetch<Desk[]>('/desks'),
      apiFetch<Floor[]>('/floors'),
      apiFetch<DeskType[]>('/desk-types'),
    ]);
    setDesks(deskPayload);
    setFloors(floorPayload);
    setDeskTypes(typePayload);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingDesk(null);
    setFormData(emptyForm);
  };

  const payloadFromForm = () => ({
    name: formData.name,
    capacity: Number(formData.capacity),
    floorId: Number(formData.floorId),
    deskTypeId: formData.deskTypeId ? Number(formData.deskTypeId) : null,
  });

  const validateForm = () => formData.name.trim() && formData.capacity && formData.floorId;

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields.');
      return;
    }
    await apiFetch('/desks', { method: 'POST', body: payloadFromForm() });
    resetForm();
    await loadData();
    toast.success('Desk created successfully.');
  };

  const handleUpdate = async () => {
    if (!editingDesk || !validateForm()) {
      toast.error('Please fill all required fields.');
      return;
    }
    await apiFetch(`/desks/${editingDesk.id}`, { method: 'PUT', body: payloadFromForm() });
    resetForm();
    await loadData();
    toast.success('Desk updated successfully.');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiFetch(`/desks/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await loadData();
    toast.success('Desk deleted successfully.');
  };

  const handleEdit = (desk: Desk) => {
    setEditingDesk(desk);
    setFormData({
      name: desk.name,
      capacity: String(desk.capacity),
      floorId: String(desk.floorId),
      deskTypeId: desk.deskTypeId ? String(desk.deskTypeId) : '',
    });
  };

  const filteredDesks = useMemo(
    () =>
      desks.filter(
        (desk) =>
          desk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          desk.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          desk.type.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [desks, searchQuery],
  );

  const totalPages = Math.ceil(filteredDesks.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDesks = filteredDesks.slice(startIndex, endIndex);

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Manage Desk</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingDesk ? 'Edit Desk' : 'Add New Desk'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormInput label="Desk Name" value={formData.name} placeholder="e.g., 6A" onChange={(value) => setFormData({ ...formData, name: value })} />
              <FormInput label="Capacity" value={formData.capacity} placeholder="e.g., 4" type="number" onChange={(value) => setFormData({ ...formData, capacity: value })} />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                <select
                  value={formData.floorId}
                  onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Floor</option>
                  {floors.map((floor) => (
                    <option key={floor.id} value={floor.id}>{floor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  value={formData.deskTypeId}
                  onChange={(e) => setFormData({ ...formData, deskTypeId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-</option>
                  {deskTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {editingDesk ? (
                <>
                  <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Update
                  </button>
                  <button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">Cancel</button>
                </>
              ) : (
                <button onClick={handleCreate} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search desks by name, floor, or type..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Desk</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Floor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Capacity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDesks.map((desk, index) => (
                  <tr key={desk.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 text-gray-900">{desk.name}</td>
                    <td className="py-4 px-6 text-gray-900">{desk.floor}</td>
                    <td className="py-4 px-6 text-gray-900">{desk.type}</td>
                    <td className="py-4 px-6 text-gray-900">{desk.capacity}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(desk)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(desk)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDesks.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Showing {startIndex + 1}-{Math.min(endIndex, filteredDesks.length)} of {filteredDesks.length}</span>
                <button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Prev</button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete desk?"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? 'this desk'}? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
