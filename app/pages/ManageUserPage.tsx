import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface User {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  position: string;
  role: 'admin' | 'user';
}

export function ManageUserPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', employeeCode: '456', name: 'Fransiska Marsela', email: 'fransiska@company.com', position: 'Software Engineer', role: 'user' },
    { id: '2', employeeCode: '567', name: 'Admin User', email: 'admin@company.com', position: 'System Administrator', role: 'admin' },
    { id: '3', employeeCode: '789', name: 'John Doe', email: 'john@company.com', position: 'Product Manager', role: 'user' },
    { id: '4', employeeCode: '101', name: 'Jane Smith', email: 'jane@company.com', position: 'UX Designer', role: 'user' },
  ]);

  const [formData, setFormData] = useState({
    employeeCode: '',
    name: '',
    email: '',
    position: '',
    role: 'user' as 'admin' | 'user',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleCreate = () => {
    if (!formData.employeeCode.trim() || !formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
      alert('Please fill all fields');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      employeeCode: formData.employeeCode,
      name: formData.name,
      email: formData.email,
      position: formData.position,
      role: formData.role,
    };

    setUsers([...users, newUser]);
    setFormData({ employeeCode: '', name: '', email: '', position: '', role: 'user' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      position: user.position,
      role: user.role,
    });
  };

  const handleUpdate = () => {
    if (!editingUser || !formData.employeeCode.trim() || !formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
      alert('Please fill all fields');
      return;
    }

    setUsers(users.map(user =>
      user.id === editingUser.id
        ? { ...user, employeeCode: formData.employeeCode, name: formData.name, email: formData.email, position: formData.position, role: formData.role }
        : user
    ));
    setEditingUser(null);
    setFormData({ employeeCode: '', name: '', email: '', position: '', role: 'user' });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ employeeCode: '', name: '', email: '', position: '', role: 'user' });
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
          <h1 className="text-2xl font-bold text-gray-900 text-center">Manage User</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* Add New User Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Employee Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Code
                </label>
                <input
                  type="text"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 456"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., john@company.com"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              {editingUser ? (
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
              placeholder="Search users by employee code, name, email, position, or role..."
            />
          </div>

          {/* User List Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Employee Code</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Position</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No users found. Add a new user to get started.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-t border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-6 text-gray-900 font-semibold">{user.employeeCode}</td>
                      <td className="py-4 px-6 text-gray-900">{user.name}</td>
                      <td className="py-4 px-6 text-gray-900">{user.email}</td>
                      <td className="py-4 px-6 text-gray-900">{user.position}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-orange-100 text-orange-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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
          {filteredUsers.length > 0 && (
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
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}
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
