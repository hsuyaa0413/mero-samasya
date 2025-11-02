'use client';

import { useEffect, useState } from 'react';
import { User } from '@/store/userStore';
import axios from 'axios';
import { backendApi } from '@/lib/constant';
import { UserDetailsDialog } from './UserDetailsDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Search, ShieldCheck, Building } from 'lucide-react';

export function AuthorityAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendApi}/users`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const authorityUsers = res.data.users.filter(
          (user: User) => user.role === 'authority'
        );
        setUsers(authorityUsers);
        setFilteredUsers(authorityUsers);
      }
    } catch (e) {
      console.error('Error fetching authorities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        user =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.departments?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDepartment !== 'all') {
      filtered = filtered.filter(
        user => user.departments?.toLowerCase() === filterDepartment.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterDepartment, users]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const res = await axios.delete(`${backendApi}/users/${userToDelete._id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        await fetchUsers();
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      }
    } catch (e) {
      console.error('Error deleting authority:', e);
      alert('Failed to delete authority. Please try again.');
    }
  };

  const uniqueDepartments = Array.from(
    new Set(users.map(user => user.departments).filter(Boolean))
  ) as string[];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading authorities...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Authority Accounts</h2>
            <p className="text-gray-600">Manage all authority accounts</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold">{filteredUsers.length} Authorities</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-500" />
            <select
              value={filterDepartment}
              onChange={e => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || filterDepartment !== 'all'
                ? 'No authorities found matching your filters'
                : 'No authorities found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="https://avatar.iran.liara.run/public/job/operator/male" />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {user.fullName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-sm text-gray-900 capitalize">{user.departments}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700">Status:</p>
                    <Badge
                      className={
                        user.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {user.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(user)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(user)}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailsDialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          user={selectedUser}
        />
      )}

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Authority Account"
        description={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
      />
    </>
  );
}

