'use client';

import { Card, CardContent } from '@/components/ui/card';
import { backendApi } from '@/lib/constant';
import { User } from '@/store/userStore';
import axios from 'axios';
import { Users, Building2, FileText, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReportedIssue } from './IssuedCard';

export function StatsCards({
  reportedIssues,
}: {
  reportedIssues: ReportedIssue[];
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState<number>(0);

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

  const fetchTodayReports = async () => {
    try {
      const res = await axios.get(`${backendApi}/report/today-count`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setCount(res.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch today reports:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTodayReports();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="h-28">
        <CardContent className="h-full flex items-center justify-start">
          <div className="mr-4 rounded-full bg-blue-100 p-2">
            <Users className="size-10 text-blue-600" size={12} />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{users?.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-28">
        <CardContent className="h-full flex items-center justify-start">
          <div className="mr-4 rounded-full bg-green-100 p-2">
            <Building2 className="size-10 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Authorities</p>
            <p className="text-2xl font-bold">
              {users?.filter(user => user?.role === 'authority').length}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-28">
        <CardContent className="h-full flex items-center justify-start">
          <div className="mr-4 rounded-full bg-red-100 p-2">
            <FileText className="size-10 text-red-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Reports Today</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="h-28">
        <CardContent className="h-full flex items-center justify-start">
          <div className="mr-4 rounded-full bg-yellow-100 p-2">
            <Clock className="size-10 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Pending Actions</p>
            <p className="text-2xl font-bold">
              {
                reportedIssues?.filter(issue => issue.status === 'pending')
                  .length
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
