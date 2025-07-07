'use client';

import { Card, CardContent } from '@/components/ui/card';
import { backendApi } from '@/lib/constant';
import axios from 'axios';
import { Users, Building2, FileText, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatsCards() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendApi}/users`, {
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
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
            {/* <p className="text-2xl font-bold">1,248</p> */}
            <p className="text-2xl font-bold">{users?.length}</p>
            {/* <div className="flex items-center text-xs gap-1 text-green-500">
              <ChevronUp size={12} /> 12.5% from last month
            </div> */}
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
            <p className="text-2xl font-bold">86</p>
            {/* <div className="flex items-center text-xs gap-1 text-green-500">
              <ChevronUp size={12} /> 3.2% from last month
            </div> */}
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
            <p className="text-2xl font-bold">27</p>
            {/* <div className="flex items-center text-xs gap-1 text-red-500">
              <ChevronDown size={12} /> 2.4% from last month
            </div> */}
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
            <p className="text-2xl font-bold">15</p>
            {/* <div className="flex items-center text-xs gap-1 text-green-500">
              <ChevronUp size={12} /> 5.8% from yesterday
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
