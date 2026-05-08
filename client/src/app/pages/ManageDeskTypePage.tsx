import { ArrowLeft, Pencil, Plus, Search, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { AppUser, DeskType } from '../types';

type DeskTypeForm = {
  name: string;
  description: string;
};

const emptyForm: DeskTypeForm = { name: '', description: '' };

export function ManageDeskTypePage() {
  const [deskTypes, setDeskTypes] = useState<DeskType[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedDeskType, setSelectedDeskType] = useState<DeskType | null>(null);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAssignView, setShowAssignView] = useState(false);
  const [formData, setFormData] = useState<DeskTypeForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDeskType, setEditingDeskType] = useState<DeskType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadData = async () => {
    const [typePayload, userPayload] = await Promise.all([
      apiFetch<DeskType[]>('/desk-types'),
      apiFetch<AppUser[]>('/users'),
    ]);
    setDeskTypes(typePayload);
    setUsers(userPayload.filter((user) => user.role === 'user'));
    if (selectedDeskType) {
      setSelectedDeskType(typePayload.find((type) => type.id === selectedDeskType.id) ?? null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignedEmployees = selectedDeskType?.employees ?? [];
  const assignedIds = new Set(assignedEmployees.map((employee) => employee.id));
  const filteredAvailableEmployees = users.filter(
    (user) =>
      !assignedIds.has(user.id) &&
      (user.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
        (user.employeeCode || user.nik).toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
        (user.position || '').toLowerCase().includes(employeeSearchQuery.toLowerCase())),
  );

  const handleAssignEmployee = async (employee: AppUser) => {
    if (!selectedDeskType) return;
    await apiFetch(`/desk-types/${selectedDeskType.id}/assignments`, {
      method: 'POST',
      body: { userId: employee.id },
    });
    setEmployeeSearchQuery('');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    await loadData();
  };

  const handleUnassignEmployee = async (employeeId: number) => {
    if (!selectedDeskType) return;
    await apiFetch(`/desk-types/${selectedDeskType.id}/assignments/${employeeId}`, { method: 'DELETE' });
    await loadData();
  };

  const handleClearAll = async () => {
    if (!selectedDeskType) return;
    if (confirm('Are you sure you want to remove all employees from this desk type?')) {
      await apiFetch(`/desk-types/${selectedDeskType.id}/assignments`, { method: 'DELETE' });
      await loadData();
    }
  };

  const resetForm = () => {
    setEditingDeskType(null);
    setFormData(emptyForm);
  };

  const validateForm = () => formData.name.trim() && formData.description.trim();

  const handleCreate = async () => {
    if (!validateForm()) {
      alert('Please fill all fields');
      return;
    }
    await apiFetch('/desk-types', { method: 'POST', body: formData });
    resetForm();
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this desk type?')) {
      await apiFetch(`/desk-types/${id}`, { method: 'DELETE' });
      await loadData();
    }
  };

  const handleEdit = (deskType: DeskType) => {
    setEditingDeskType(deskType);
    setFormData({ name: deskType.name, description: deskType.description });
  };

  const handleUpdate = async () => {
    if (!editingDeskType || !validateForm()) {
      alert('Please fill all fields');
      return;
    }
    await apiFetch(`/desk-types/${editingDeskType.id}`, { method: 'PUT', body: formData });
    resetForm();
    await loadData();
  };

  const handleAssignClick = (deskType: DeskType) => {
    setSelectedDeskType(deskType);
    setShowAssignView(true);
  };

  const handleBackToCrud = () => {
    setShowAssignView(false);
    setSelectedDeskType(null);
    setEmployeeSearchQuery('');
  };

  const filteredDeskTypes = useMemo(
    () =>
      deskTypes.filter(
        (type) =>
          type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          type.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [deskTypes, searchQuery],
  );

  const totalPages = Math.ceil(filteredDeskTypes.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDeskTypes = filteredDeskTypes.slice(startIndex, endIndex);

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">{showAssignView ? 'Assign Employees' : 'Manage Desk Type'}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {showAssignView && selectedDeskType ? (
          <AssignView
            selectedDeskType={selectedDeskType}
            assignedEmployees={assignedEmployees}
            filteredAvailableEmployees={filteredAvailableEmployees}
            employeeSearchQuery={employeeSearchQuery}
            setEmployeeSearchQuery={setEmployeeSearchQuery}
            showSuccessMessage={showSuccessMessage}
            onBack={handleBackToCrud}
            onAssign={handleAssignEmployee}
            onUnassign={handleUnassignEmployee}
            onClearAll={handleClearAll}
          />
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{editingDeskType ? 'Edit Desk Type' : 'Add New Desk Type'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Desk Type Name" value={formData.name} placeholder="e.g., MONITOR" onChange={(value) => setFormData({ ...formData, name: value })} />
                <FormInput label="Description" value={formData.description} placeholder="Describe the desk type..." onChange={(value) => setFormData({ ...formData, description: value })} />
              </div>
              <div className="flex gap-3 mt-4">
                {editingDeskType ? (
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
                  placeholder="Search desk types by name or description..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Desk Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Assigned</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeskTypes.map((type, index) => (
                    <tr key={type.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 text-gray-900 font-semibold">{type.name}</td>
                      <td className="py-4 px-6 text-gray-900">{type.description}</td>
                      <td className="py-4 px-6 text-gray-900">{type.employees.length}</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button onClick={() => handleAssignClick(type)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                            <Users className="w-4 h-4" />
                            Assign
                          </button>
                          <button onClick={() => handleEdit(type)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button onClick={() => handleDelete(type.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
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

            {filteredDeskTypes.length > 0 && (
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
                  <span className="text-sm text-gray-600">Showing {startIndex + 1}-{Math.min(endIndex, filteredDeskTypes.length)} of {filteredDeskTypes.length}</span>
                  <button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Prev</button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignView({
  selectedDeskType,
  assignedEmployees,
  filteredAvailableEmployees,
  employeeSearchQuery,
  setEmployeeSearchQuery,
  showSuccessMessage,
  onBack,
  onAssign,
  onUnassign,
  onClearAll,
}: {
  selectedDeskType: DeskType;
  assignedEmployees: AppUser[];
  filteredAvailableEmployees: AppUser[];
  employeeSearchQuery: string;
  setEmployeeSearchQuery: (value: string) => void;
  showSuccessMessage: boolean;
  onBack: () => void;
  onAssign: (employee: AppUser) => void;
  onUnassign: (employeeId: number) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onClearAll} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Clear All
        </button>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Assigned Employees - {selectedDeskType.name}</h2>
      <p className="text-sm text-gray-600 mb-6">Assign employee to {selectedDeskType.name}</p>

      {showSuccessMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
          Employee assigned successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search Employee</label>
          <div className="relative mb-4">
            <input
              type="text"
              value={employeeSearchQuery}
              onChange={(e) => setEmployeeSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee name or NIK"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {filteredAvailableEmployees.map((employee) => (
              <div key={employee.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{employee.name}</p>
                  <p className="text-xs text-gray-500">NIK: {employee.employeeCode || employee.nik}</p>
                  <p className="text-xs text-gray-500">{employee.position || '-'}</p>
                </div>
                <button onClick={() => onAssign(employee)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-4">Employees ({assignedEmployees.length})</h3>
          <div className="space-y-3 max-h-[470px] overflow-y-auto">
            {assignedEmployees.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">No employees assigned.</div>
            ) : (
              assignedEmployees.map((employee) => (
                <div key={employee.id} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.employeeCode || employee.nik}</p>
                  </div>
                  <button onClick={() => onUnassign(employee.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1">
                    <X className="w-4 h-4" />
                    Unassign
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}
