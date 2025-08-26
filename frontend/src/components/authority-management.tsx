'use client';

import { useEffect, useState } from 'react';
import { backendApi } from '@/lib/constant';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Loader2, Mail, Phone } from 'lucide-react';

interface Authority {
  _id: string;
  name: string;
  category: string;
  email?: string;
  phoneNumber?: string;
}

export function AuthorityManagement() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [authorityToDelete, setAuthorityToDelete] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthorities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(`${backendApi}/authority/get-authorities`, {
        withCredentials: true,
      });
      if (res.data && Array.isArray(res.data.data)) {
        setAuthorities(res.data.data);
        console.log('Fetched authorities:', res.data.data);
      } else {
        setError('Invalid authority data received');
      }
    } catch (error) {
      console.error('Error fetching authorities:', error);
      setError('Failed to load authorities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      'AuthorityManagement mounted/updated at',
      new Date().toISOString()
    );
    fetchAuthorities();
    return () => {
      console.log('AuthorityManagement unmounted at', new Date().toISOString());
    };
  }, []);

  const handleViewDetails = (authority: Authority) => {
    setSelectedAuthority(authority);
    setIsDetailsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${backendApi}/authority/delete/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log('Authority deleted, fetching updated authorities');
        await fetchAuthorities();
        setIsDeleteConfirmOpen(false);
        setAuthorityToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting authority:', error);
      setError('Failed to delete authority');
    }
  };

  const openDeleteConfirm = (id: string) => {
    setAuthorityToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-85">
        <Loader2 className="animate-spin size-5 text-blue-500" />
        <span>Loading authorities...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Authority Management</h2>
      {authorities.length === 0 ? (
        <p className="text-gray-500">No authorities found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {authorities.map(authority => (
            <div
              key={authority._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{authority.name}</h3>
                  <p className="text-sm text-gray-500">{authority.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(authority)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteConfirm(authority._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Authority Details - {selectedAuthority?.name}
            </DialogTitle>
            <DialogDescription>
              View detailed information about this authority.
            </DialogDescription>
          </DialogHeader>
          {selectedAuthority && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.iran.liara.run/public/${
                      Math.floor(Math.random() * 100) + 1
                    }`}
                    alt={selectedAuthority.name}
                  />
                  <AvatarFallback>
                    {selectedAuthority.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedAuthority.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedAuthority.category}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>Category: {selectedAuthority.category}</span>
                </div>
                {selectedAuthority.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{selectedAuthority.email}</span>
                  </div>
                )}
                {selectedAuthority.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{selectedAuthority.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this authority? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                authorityToDelete && handleDelete(authorityToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
