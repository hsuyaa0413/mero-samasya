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
import { Eye, Trash2, Search, Users } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
        const citizenUsers = res.data.users.filter(
          (user: User) => user.role === 'citizen'
        );
        setUsers(citizenUsers);
        setFilteredUsers(citizenUsers);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

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
      console.error('Error deleting user:', e);
      alert('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage all citizen accounts</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-semibold">{filteredUsers.length} Users</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users by name, email, or address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
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
                      <AvatarImage src="https://avatar.iran.liara.run/public/job/user/male" />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
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

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{user.address}</p>
                  <p className="text-sm text-gray-600">{user.phoneNumber}</p>
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
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
      />
    </>
  );
}

