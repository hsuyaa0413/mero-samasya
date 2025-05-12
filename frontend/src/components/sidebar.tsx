'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { backendApi } from '@/lib/constant';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const { user, logout } = useUserStore();
  const router = useRouter();

  async function handleLogOut() {
    try {
      const res = await axios.get(`${backendApi}/auth/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        logout();
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex h-screen fixed w-2/12 bg-skyBlue text-white flex-col z-20">
      <div className="h-18 border-b border-lightBlue-75 p-4">
        <h1 className="text-xl font-bold ">Mero Samasya</h1>
        <p className="text-sm text-lightBlue-75">Admin Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 p-2 py-4">
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          Dashboard
        </Link>
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          User Management
        </Link>
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          Authority Accounts
        </Link>
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          Reported Issues
        </Link>
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          Analytics
        </Link>
        <Link
          href="#"
          className="block rounded-md px-4 py-2 text-white hover:bg-blue-950"
        >
          Settings
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-lightBlue-75 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://avatar.iran.liara.run/public/job/operator/male" />
              <AvatarFallback className="bg-greyBlue text-darkBlue">
                {user?.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <div className="font-medium text-sm">{user?.fullName}</div>
            <div className="text-xs text-lightBlue-75">Super Admin</div>
          </div>
        </div>

        <button onClick={handleLogOut} className="cursor-pointer">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
