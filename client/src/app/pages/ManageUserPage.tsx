import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { apiFetch } from '../lib/api';
import type { AppUser, Role } from '../types';

type UserForm = {
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  role: Role;
};

const emptyForm: UserForm = {
  employeeCode: '',
  name: '',
  email: '',
  position: '',
  role: 'user',
};

export function ManageUserPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [formData, setFormData] = useState<UserForm>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = () => apiFetch<AppUser[]>('/users').then(setUsers);

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setEditingUser(null);
    setFormData(emptyForm);
  };

  const validateForm = () => formData.employeeCode.trim() && formData.name.trim() && formData.email.trim() && formData.position.trim();

  const handleCreate = async () => {
    if (!validateForm()) {
      toast.error('Please fill all fields.');
      return;
    }
    await apiFetch('/users', { method: 'POST', body: formData });
    resetForm();
    await loadUsers();
    toast.success('User created successfully.');
  };

  const handleUpdate = async () => {
    if (!editingUser || !validateForm()) {
      toast.error('Please fill all fields.');
      return;
    }
    await apiFetch(`/users/${editingUser.id}`, { method: 'PUT', body: formData });
    resetForm();
    await loadUsers();
    toast.success('User updated successfully.');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await apiFetch(`/users/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await loadUsers();
    toast.success('User deleted successfully.');
  };

  const handleEdit = (user: AppUser) => {
    setEditingUser(user);
    setFormData({
      employeeCode: user.employeeCode || user.nik,
      name: user.name,
      email: user.email || '',
      position: user.position || '',
      role: user.role,
    });
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          (user.employeeCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.position || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, users],
  );

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Manage User</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <FormInput label="Employee Code" value={formData.employeeCode} placeholder="e.g., 456" onChange={(value) => setFormData({ ...formData, employeeCode: value })} />
              <FormInput label="Full Name" value={formData.name} placeholder="e.g., John Doe" onChange={(value) => setFormData({ ...formData, name: value })} />
              <FormInput label="Email" value={formData.email} placeholder="e.g., john@company.com" onChange={(value) => setFormData({ ...formData, email: value })} />
              <FormInput label="Position" value={formData.position} placeholder="e.g., Software Engineer" onChange={(value) => setFormData({ ...formData, position: value })} />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {editingUser ? (
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
                placeholder="Search users by employee code, name, email, position, or role..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee Code</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 text-gray-900 font-semibold">{user.employeeCode || user.nik}</td>
                    <td className="py-4 px-6 text-gray-900">{user.name}</td>
                    <td className="py-4 px-6 text-gray-900">{user.email}</td>
                    <td className="py-4 px-6 text-gray-900">{user.position}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(user)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold transition-colors">
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

          {filteredUsers.length > 0 && (
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
                <span className="text-sm text-gray-600">Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}</span>
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
        title="Delete user?"
        description={`Are you sure you want to delete ${deleteTarget?.name ?? 'this user'}? This action cannot be undone.`}
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
