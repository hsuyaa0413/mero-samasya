'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { backendApi } from '@/lib/constant';
import { User } from '@/store/userStore';
import axios from 'axios';
import {
  Building,
  CheckCircle,
  CreditCard,
  Eye,
  Mail,
  MapPin,
  Phone,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import Image from 'next/image';

export function PendingApprovals() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAuthority, setSelectedAuthority] = useState<User | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendApi}/users`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUsers(res.data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await axios.get(`${backendApi}/users/approve/${id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setSelectedAuthority(null);
        setIsDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await axios.get(`${backendApi}/users/reject/${id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setSelectedAuthority(null);
        setIsDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedAuthority]);

  const handleViewDetails = (id: string) => {
    const authority = users.find(user => user._id === id);
    if (authority) {
      setSelectedAuthority(authority);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4 pt-2">
        {users
          ?.filter(
            user =>
              user?.role === 'authority' &&
              !user?.approved &&
              !user?.rejectedByAdmin
          )
          .map(user => (
            <div
              key={user?._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/${
                      Math.floor(Math.random() * 100) + 1
                    }`}
                    alt={user?.fullName}
                  />
                  <AvatarFallback className="bg-greyBlue text-darkBlue">
                    {user?.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-gray-500">{`${user?.address} - ${user?.departments}`}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  // size="sm"
                  onClick={() => handleViewDetails(user?._id)}
                  className="text-gray-600 hover:text-gray-700 cursor-pointer "
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Authority Details
            </DialogTitle>
          </DialogHeader>

          {selectedAuthority && (
            <div className="space-y-6">
              {/* Header with Avatar and Basic Info */}
              <div className="flex items-start space-x-4 pb-4 border-b">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/${
                      Math.floor(Math.random() * 100) + 1
                    }`}
                    alt={selectedAuthority?.fullName}
                  />
                  <AvatarFallback className="bg-greyBlue text-darkBlue">
                    {selectedAuthority?.fullName
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedAuthority.fullName}
                  </h3>
                  <p className="text-gray-600">
                    {`${selectedAuthority?.address} - ${selectedAuthority?.departments}`}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={
                        selectedAuthority.approved ? 'default' : 'secondary'
                      }
                      className={
                        selectedAuthority.approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {selectedAuthority.approved ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">{selectedAuthority.role}</Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedAuthority.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedAuthority.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedAuthority.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{selectedAuthority.departments}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    Account Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-2">
                        {selectedAuthority?.createdAt?.split('T')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Updated:</span>
                      <span className="ml-2">
                        {selectedAuthority?.updatedAt?.split('T')[0]}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ID:</span>
                      <span className="ml-2 font-mono text-xs">
                        {selectedAuthority._id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Card */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  ID Card
                </h4>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Image
                    src={
                      selectedAuthority?.idCard ||
                      'https://img.freepik.com/free-vector/page-found-concept-illustration_114360-1869.jpg?semt=ais_hybrid&w=740'
                    }
                    alt="ID Card"
                    className="max-w-full h-auto object-contain rounded border"
                    height={1080}
                    width={1920}
                    priority
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(selectedAuthority._id)}
                  className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 cursor-pointer"
                >
                  <CheckCircle className="size-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedAuthority._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 border-red-200 cursor-pointer"
                >
                  <XCircle className="size-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
