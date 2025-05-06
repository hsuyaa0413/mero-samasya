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
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { MagicCard } from '@/components/magicui/magic-card';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function AuthorityRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null as File | null);

  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen mx-auto p-4 sm:p-6 bg-lightBlue rounded-lg border-t-1 border-gray-400">
      <MagicCard
        gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
        className="px-4 py-6"
      >
        <div className="bg-greyBlue text-darkBlue max-w-6xl sm:p-5 ">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to
              <span className="text-skyBlue text-xl"> Mero समस्या</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mx-auto">
              Register to resolve the local issues and reach out faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3 text-darkBlue">
              Register Your Account
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
              {!selectedFile ? (
                <div className="mt-1 border-2 border-dashed border-gray-200 rounded-md p-8 text-center bg-lightBlue cursor-pointer">
                  <div
                    className="flex flex-col items-center justify-center text-gray-500"
                    onClick={handleDivClick}
                  >
                    <Input
                      type="file"
                      id="media"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Upload className="size-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drag and drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload photos of the issue (max 5MB each)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 border border-gray-200 rounded-md p-4 flex items-center justify-between bg-lightBlue">
                  <p
                    className="text-sm font-medium text-gray-800 flex-wrap"
                    title={selectedFile.name}
                  >
                    {selectedFile.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={handleRemoveFile}
                  >
                    <X className="size-5 " />
                  </Button>
                </div>
              )}
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
                I agree to the
                <Link href="#" className="text-skyBlue hover:underline">
                  Terms of Service
                </Link>
                and
                <Link href="#" className="text-skyBlue hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <PulsatingButton className="w-full h-10 text-base">
              Register
            </PulsatingButton>
            <PulsatingButton className="flex justify-center h-10">
              <Icons.google className="size-5" />
              <span className="text-sm text-lightBlue">
                Continue with Google
              </span>
            </PulsatingButton>
            <div className="text-center text-sm text-darkBlue">
              Already have an account?{' '}
              <Link href="/login" className="text-skyBlue hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </MagicCard>
    </div>
  );
}
