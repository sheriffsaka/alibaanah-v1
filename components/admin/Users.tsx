
import React, { useState, useEffect } from 'react';
import { db } from '../../services/dbService';
import { AdminUser, UserRole } from '../../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>(db.getAdmins());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser> | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setLoggedInUser(db.getCurrentUser());
  }, []);

  const openModal = (user: Partial<AdminUser> | null = null) => {
    setCurrentUser(user ? { ...user } : { username: '', role: UserRole.FRONT_DESK, active: true });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (currentUser.id) {
      // Update
      db.updateAdmin(currentUser.id, currentUser);
    } else {
      // Create
      db.addAdmin({ 
        username: currentUser.username || '', 
        role: currentUser.role || UserRole.FRONT_DESK,
        active: currentUser.active || false
      });
    }
    setUsers([...db.getAdmins()]);
    closeModal();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;
    
    if (currentUser) {
      setCurrentUser({ ...currentUser, [name]: isCheckbox ? checked : value });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button onClick={() => openModal()} className="bg-ibaana-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-900 transition">
          <i className="fas fa-plus mr-2"></i> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-gray-400 border-b bg-gray-50">
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-6 py-4 font-medium flex items-center">
                    {user.username}
                    {loggedInUser?.id === user.id && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">You</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openModal(user)} 
                      className="text-ibaana-primary hover:underline font-semibold"
                      disabled={loggedInUser?.id === user.id && user.role === UserRole.SUPER_ADMIN}
                      title={loggedInUser?.id === user.id && user.role === UserRole.SUPER_ADMIN ? "Cannot edit own Super Admin account" : ""}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{currentUser.id ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input required name="username" value={currentUser.username} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select name="role" value={currentUser.role} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="flex items-center pt-2">
                  <input type="checkbox" name="active" id="active" checked={!!currentUser.active} onChange={handleInputChange} className="h-4 w-4 text-ibaana-primary border-gray-300 rounded" />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">User is Active</label>
                </div>
              </div>
              <div className="bg-gray-50 p-4 flex justify-end space-x-3 rounded-b-xl">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-ibaana-primary text-white rounded-md text-sm font-medium hover:bg-emerald-900">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
