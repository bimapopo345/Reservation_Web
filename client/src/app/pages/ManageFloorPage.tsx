import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { Floor } from '../types';

export function ManageFloorPage() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [newFloorName, setNewFloorName] = useState('');
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);

  const loadFloors = () => apiFetch<Floor[]>('/floors').then(setFloors);

  useEffect(() => {
    loadFloors();
  }, []);

  const resetForm = () => {
    setEditingFloor(null);
    setNewFloorName('');
  };

  const handleCreate = async () => {
    if (!newFloorName.trim()) return;
    await apiFetch('/floors', { method: 'POST', body: { name: newFloorName } });
    resetForm();
    await loadFloors();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this floor?')) {
      await apiFetch(`/floors/${id}`, { method: 'DELETE' });
      await loadFloors();
    }
  };

  const handleEdit = (floor: Floor) => {
    setEditingFloor(floor);
    setNewFloorName(floor.name);
  };

  const handleUpdate = async () => {
    if (!editingFloor || !newFloorName.trim()) return;
    await apiFetch(`/floors/${editingFloor.id}`, { method: 'PUT', body: { name: newFloorName } });
    resetForm();
    await loadFloors();
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Manage Floor</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingFloor ? 'Edit Floor' : 'Add New Floor'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Name</label>
                <input
                  type="text"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter floor name (e.g., 6th floor)"
                />
              </div>

              <div className="flex gap-3">
                {editingFloor ? (
                  <>
                    <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Update
                    </button>
                    <button onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={handleCreate} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Floor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Desks Count</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {floors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      No floors available. Add a new floor to get started.
                    </td>
                  </tr>
                ) : (
                  floors.map((floor, index) => (
                    <tr key={floor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 text-gray-900">{floor.name}</td>
                      <td className="py-4 px-6 text-gray-900">{floor.desksCount}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(floor)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button onClick={() => handleDelete(floor.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
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
        </div>
      </div>
    </div>
  );
}
