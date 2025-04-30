'use client';
import Link from 'next/link';
import { ChangeEvent, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { MagicCard } from '@/components/magicui/magic-card';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { IconBrandGoogle } from '@tabler/icons-react';

export default function AuthorityRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };
  return (
    <div className=" flex items-center justify-center min-h-screen mx-auto p-4 sm:p-6 bg-lightBlue">
      <MagicCard
        gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
        className="p-0 "
      >
        <div className="bg-greyBlue text-darkBlue p-6 max-w-6xl rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to Mero<span className="text-lightBlue text-2xl">!</span>{' '}
              समस्या
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mx-auto">
              Register to know the local issues and reach out faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3 text-darkBlue">
              Create Your Account
            </h1>
          </div>
          <form className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-darkBlue">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                className="mt-1 bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-darkBlue">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-1 bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-darkBlue">
                Phone Number
              </Label>
              <div className="flex mt-1">
                <div className="bg-gray-200 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-md text-gray-700">
                  +977
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  className="rounded-l-none bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="text-darkBlue">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pr-10 bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must contain at least 8 characters, including uppercase,
                lowercase, number and special character
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-darkBlue">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pr-10 bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-darkBlue">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Your address"
                className="mt-1 bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              />
            </div>
            <div>
              <Label htmlFor="localBody" className="text-darkBlue">
                Local Body
              </Label>
              <Select>
                <SelectTrigger className="mt-1 w-full bg-lightBlue text-darkBlue border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                  <SelectValue placeholder="Select your local body" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="municipality1">Municipality 1</SelectItem>
                  <SelectItem value="municipality2">Municipality 2</SelectItem>
                  <SelectItem value="ruralMunicipality1">
                    Rural Municipality 1
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="idCard" className="text-darkBlue">
                ID Card Upload
              </Label>
              <div className="mt-1 border border-gray-300 rounded-md p-4 text-center bg-lightBlue hover:border-gray-400 cursor-pointer">
                <div
                  className="flex flex-col items-center justify-center text-gray-600  "
                  onClick={handleDivClick}
                >
                  <Input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="text-sm text-gray-700">
                    Upload a file or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (PNG, JPG, PDF up to 10MB)
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                className="border-gray-400 data-[state=checked]:bg-darkBlue data-[state=checked]:text-lightBlue"
              />
              <Label
                htmlFor="terms"
                className="text-xs sm:text-sm font-normal text-gray-700 dark:text-gray-300"
              >
                I agree to the{' '}
                <Link href="#" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <PulsatingButton className="w-full h-10 text-base">
              Register
            </PulsatingButton>
            <PulsatingButton className="flex justify-center h-10">
              <IconBrandGoogle className="h-4 w-4 text-lightBlue  " />
              <span className="text-sm text-lightBlue">
                Continue with Google
              </span>
            </PulsatingButton>
            <div className="text-center text-sm text-darkBlue">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-indigo-600 hover:underline font-semibold"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </MagicCard>
    </div>
  );
}
