'use client';

import { MagicCard } from '@/components/magicui/magic-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { IconBrandGoogle } from '@tabler/icons-react';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  return (
    <div className=" flex items-center justify-center mx-auto rounded-lg border-t-1 min-h-[calc(100vh-72px)] border-gray-400 bg-lightBlue h-[calc(100vh-72px)]">
      <MagicCard
        gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
        className="p-0 "
      >
        <div className="bg-greyBlue text-darkBlue max-w-6xl p-5">
          <div className="p-4 items-center flex flex-col text-center">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to Mero
              <span className="text-lightBlue text-2xl">!</span>
              समस्या
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Login to report the local issues and help authorities to reach out
              to you faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3 ">
              Welcome Back! Please Sign In
            </h1>
          </div>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1  bg-lightBlue text-darkBlue"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pr-10  bg-lightBlue text-darkBlue"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex sm:items-center space-x-2  ">
              <Checkbox id="terms" />
              <Label
                htmlFor="terms"
                className="text-xs flex flex-row flex-wrap sm:text-sm"
              >
                I agree to the
                <span className="text-indigo-600 hover:underline">
                  Terms of Service
                </span>
                and
                <span className="text-indigo-600 hover:underline">
                  Privacy Policy
                </span>
              </Label>
            </div>

            <PulsatingButton className="mx-auto h-10">Login</PulsatingButton>

            <PulsatingButton className="flex justify-center h-10">
              <IconBrandGoogle className="h-4 w-4 text-lightBlue  " />
              <span className="text-sm text-lightBlue">
                Continue with Google
              </span>
            </PulsatingButton>

            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-indigo-700 hover:underline font-semibold"
              >
                Register
              </Link>
            </div>
          </form>{' '}
        </div>
      </MagicCard>
    </div>
  );
}
