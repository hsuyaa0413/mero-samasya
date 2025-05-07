'use client';
import Link from 'next/link';
import Image from 'next/image';

import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
} from '@/components/ui/resizable-navbar';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { backendApi } from '@/lib/constant';

export default function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="w-full h-16 sm:h-18 bg-lightBlue flex items-center justify-between">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo className="pl-0" />
          <div className="flex items-center gap-2">
            {user ? (
              <Popover>
                <PopoverTrigger className="flex items-center justify-center gap-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`${
                        user?.role === 'citizen'
                          ? 'https://avatar.iran.liara.run/public/boy'
                          : 'https://avatar.iran.liara.run/public/job/operator/male'
                      }`}
                    />
                    <AvatarFallback className="bg-greyBlue text-darkBlue">
                      {user?.fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-skyBlue text-sm cursor-pointer">
                    {user?.fullName}
                  </p>
                </PopoverTrigger>

                <PopoverContent className="flex justify-around items-center gap-2 w-fit">
                  <div className="flex flex-col space-y-3">
                    <div className="border-b-2 pb-3 border-gray-200">
                      <h4 className="font-medium text-skyBlue text-sm">
                        {user?.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>

                    <button
                      onClick={handleLogOut}
                      className="flex items-center justify-center gap-2 text-sm text-darkBlue cursor-pointer"
                    >
                      Log Out
                      <LogOut size={16} />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div>
                <NavbarButton
                  href="/login"
                  variant="secondary"
                  className=" text-darkBlue"
                >
                  Login
                </NavbarButton>

                <NavbarButton
                  href="/role"
                  variant="primary"
                  className=" text-darkBlue"
                >
                  Register
                </NavbarButton>
              </div>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader className="h-12">
            <Link href="/" className="text-4xl">
              <Image src="/logo.png" alt="logo" width={90} height={20} />
            </Link>
            {!user ? (
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            ) : (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`${
                        user?.role === 'citizen'
                          ? 'https://avatar.iran.liara.run/public/boy'
                          : 'https://avatar.iran.liara.run/public/job/operator/male'
                      }`}
                    />
                    <AvatarFallback className="bg-greyBlue text-darkBlue">
                      {user?.fullName
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="flex justify-around items-center gap-2 w-fit mr-2">
                  <div className="flex flex-col space-y-3">
                    <div className="border-b-2 pb-3 border-gray-200">
                      <h4 className="font-medium text-skyBlue text-sm">
                        {user?.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>

                    <button
                      onClick={handleLogOut}
                      className="flex items-center justify-center gap-2 text-sm text-darkBlue cursor-pointer"
                    >
                      Log Out
                      <LogOut size={16} />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </MobileNavHeader>

          {!user && (
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full text-darkBlue bg-lightBlue"
                  href="/login"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full bg-darkBlue text-lightBlue"
                  href="/role"
                >
                  Register
                </NavbarButton>
              </div>
            </MobileNavMenu>
          )}
        </MobileNav>
      </Navbar>
    </nav>
  );
}
