import { useState } from 'react';
import { Pencil, Trash2, Plus, Users, Search, X, UserPlus, ArrowLeft } from 'lucide-react';

interface DeskType {
  id: string;
  name: string;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  nik: string;
  position: string;
}

interface AssignedEmployee {
  deskTypeId: string;
  employees: Employee[];
}

export function ManageDeskTypePage() {
  const [deskTypes, setDeskTypes] = useState<DeskType[]>([
    { id: '1', name: 'MONITOR', description: 'Desk equipped with external monitors for enhanced productivity' },
    { id: '2', name: 'TELP.CORCOM', description: 'Dedicated desk with telephone for corporate communications' },
    { id: '3', name: 'STANDING_DESK', description: 'Adjustable height desk for standing/sitting work positions' },
    { id: '4', name: 'PC DESIGN_DESK', description: 'High-performance PC workstation for design and creative work' },
  ]);

  // Mock employee data
  const allEmployees: Employee[] = [
    { id: '1', name: 'Ari Dian Prstyo', nik: 'E03249', position: 'Software Engineer' },
    { id: '2', name: 'John Doe', nik: 'E03250', position: 'Product Manager' },
    { id: '3', name: 'Jane Smith', nik: 'E03251', position: 'UI/UX Designer' },
    { id: '4', name: 'Michael Brown', nik: 'E03252', position: 'Data Analyst' },
    { id: '5', name: 'Sarah Wilson', nik: 'E03253', position: 'DevOps Engineer' },
    { id: '6', name: 'David Lee', nik: 'E03254', position: 'QA Engineer' },
    { id: '7', name: 'Emily Chen', nik: 'E03255', position: 'Project Manager' },
    { id: '8', name: 'Robert Taylor', nik: 'E03256', position: 'Backend Developer' },
  ];

  const [assignedEmployees, setAssignedEmployees] = useState<AssignedEmployee[]>([
    { deskTypeId: '1', employees: [] },
    { deskTypeId: '2', employees: [] },
    { deskTypeId: '3', employees: [] },
    { deskTypeId: '4', employees: [] },
  ]);

  const [selectedDeskType, setSelectedDeskType] = useState<DeskType | null>(null);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAssignView, setShowAssignView] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [editingDeskType, setEditingDeskType] = useState<DeskType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get assigned employees for selected desk type
  const getAssignedEmployees = (deskTypeId: string) => {
    const assignment = assignedEmployees.find(a => a.deskTypeId === deskTypeId);
    return assignment ? assignment.employees : [];
  };

  // Get available employees (not assigned to current desk type)
  const getAvailableEmployees = () => {
    if (!selectedDeskType) return [];
    const assigned = getAssignedEmployees(selectedDeskType.id);
    return allEmployees.filter(emp =>
      !assigned.some(a => a.id === emp.id)
    );
  };

  // Filter available employees based on search
  const filteredAvailableEmployees = getAvailableEmployees().filter(emp =>
    emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.nik.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(employeeSearchQuery.toLowerCase())
  );

  // Assign employee to desk type
  const handleAssignEmployee = (employee: Employee) => {
    if (!selectedDeskType) return;

    setAssignedEmployees(prev => prev.map(assignment => {
      if (assignment.deskTypeId === selectedDeskType.id) {
        return {
          ...assignment,
          employees: [...assignment.employees, employee]
        };
      }
      return assignment;
    }));

    setEmployeeSearchQuery('');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Unassign employee from desk type
  const handleUnassignEmployee = (employeeId: string) => {
    if (!selectedDeskType) return;

    setAssignedEmployees(prev => prev.map(assignment => {
      if (assignment.deskTypeId === selectedDeskType.id) {
        return {
          ...assignment,
          employees: assignment.employees.filter(emp => emp.id !== employeeId)
        };
      }
      return assignment;
    }));
  };

  // Clear all assigned employees
  const handleClearAll = () => {
    if (!selectedDeskType) return;

    if (confirm('Are you sure you want to remove all employees from this desk type?')) {
      setAssignedEmployees(prev => prev.map(assignment => {
        if (assignment.deskTypeId === selectedDeskType.id) {
          return {
            ...assignment,
            employees: []
          };
        }
        return assignment;
      }));
    }
  };

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    const newDeskType: DeskType = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
    };

    setDeskTypes([...deskTypes, newDeskType]);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this desk type?')) {
      setDeskTypes(deskTypes.filter(type => type.id !== id));
    }
  };

  const handleEdit = (deskType: DeskType) => {
    setEditingDeskType(deskType);
    setFormData({
      name: deskType.name,
      description: deskType.description,
    });
  };

  const handleUpdate = () => {
    if (!editingDeskType || !formData.name.trim() || !formData.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    setDeskTypes(deskTypes.map(type =>
      type.id === editingDeskType.id
        ? { ...type, name: formData.name, description: formData.description }
        : type
    ));
    setEditingDeskType(null);
    setFormData({ name: '', description: '' });
  };

  const handleCancel = () => {
    setEditingDeskType(null);
    setFormData({ name: '', description: '' });
  };

  // Navigate to Assign Employee View
  const handleAssignClick = (deskType: DeskType) => {
    setSelectedDeskType(deskType);
    setShowAssignView(true);
  };

  // Back to CRUD View
  const handleBackToCrud = () => {
    setShowAssignView(false);
    setSelectedDeskType(null);
    setEmployeeSearchQuery('');
  };

  // Filter desk types based on search query
  const filteredDeskTypes = deskTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredDeskTypes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedDeskTypes = filteredDeskTypes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-4 md:p-8 overflow-auto pt-20 md:pt-8">
      {/* Page Title */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-3xl py-4 px-6 shadow-lg">
          <div className="flex items-center justify-between">
            {showAssignView && (
              <button
                onClick={handleBackToCrud}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <h1 className={`text-2xl font-bold text-gray-900 ${showAssignView ? '' : 'mx-auto'}`}>
              {showAssignView ? 'Assign Employees' : 'Manage Desk Type'}
            </h1>
            {showAssignView && <div className="w-20"></div>}
          </div>
        </div>
      </div>

      {/* Conditional View */}
      {!showAssignView ? (
        /* CRUD View */
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {/* Add New Desk Type Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingDeskType ? 'Edit Desk Type' : 'Add New Desk Type'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Desk Type Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Desk Type Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., MONITOR"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe the desk type..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {editingDeskType ? (
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
                placeholder="Search desk types by name or description..."
              />
            </div>

            {/* Desk Types Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Desk Type</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Employees</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDeskTypes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        No desk types found. Add a new desk type to get started.
                      </td>
                    </tr>
                  ) : (
                    paginatedDeskTypes.map((type, index) => (
                      <tr
                        key={type.id}
                        className={`border-t border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900 font-semibold">{type.name}</td>
                        <td className="py-4 px-6 text-gray-900">{type.description}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{getAssignedEmployees(type.id).length}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(type)}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(type.id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <button
                              onClick={() => handleAssignClick(type)}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Users className="w-4 h-4" />
                              Assign
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
            {filteredDeskTypes.length > 0 && (
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
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredDeskTypes.length)} of {filteredDeskTypes.length}
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
      ) : (
        /* Assign Employee View - Split Screen */
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Desk Types List */}
        <div className="bg-white rounded-3xl p-6 shadow-lg h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Desk Types</h2>

          {/* Desk Types List */}
          <div className="space-y-3">
            {deskTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedDeskType(type)}
                className={`w-full text-left p-4 rounded-2xl transition-all cursor-pointer ${
                  selectedDeskType?.id === type.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
              >
                <h3 className="font-bold text-base mb-1">{type.name}</h3>
                <p className={`text-sm ${
                  selectedDeskType?.id === type.id ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {type.description}
                </p>
                <div className={`flex items-center gap-2 mt-2 text-xs ${
                  selectedDeskType?.id === type.id ? 'text-white/80' : 'text-gray-500'
                }`}>
                  <Users className="w-4 h-4" />
                  <span>
                    {getAssignedEmployees(type.id).length} employee(s) assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Assign Employee */}
        <div className="bg-white rounded-3xl p-6 shadow-lg h-[calc(100vh-200px)] overflow-y-auto">
          {selectedDeskType ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Assign Employee</h2>
                <p className="text-sm text-gray-600">
                  Desk Type: <span className="font-semibold text-gray-900">{selectedDeskType.name}</span>
                </p>
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-4 bg-green-50 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-green-700 font-semibold">Employee assigned successfully.</p>
                </div>
              )}

              {/* Search Employee */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Employee
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={employeeSearchQuery}
                    onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name, NIK, or position..."
                  />
                </div>

                {/* Available Employees Dropdown */}
                {employeeSearchQuery && filteredAvailableEmployees.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-white shadow-lg">
                    {filteredAvailableEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => handleAssignEmployee(emp)}
                        className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-600">{emp.nik} • {emp.position}</p>
                        </div>
                        <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                      </button>
                    ))}
                  </div>
                )}

                {employeeSearchQuery && filteredAvailableEmployees.length === 0 && (
                  <div className="mt-2 p-3 border border-gray-200 rounded-xl bg-gray-50 text-center text-sm text-gray-500">
                    No employees found
                  </div>
                )}
              </div>

              {/* Assigned Employees Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Assigned Employees ({getAssignedEmployees(selectedDeskType.id).length})
                  </h3>
                  {getAssignedEmployees(selectedDeskType.id).length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>

                {getAssignedEmployees(selectedDeskType.id).length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No employees assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getAssignedEmployees(selectedDeskType.id).map((emp) => (
                      <div
                        key={emp.id}
                        className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-600">{emp.nik} • {emp.position}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnassignEmployee(emp.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Unassign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a desk type to assign employees</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
