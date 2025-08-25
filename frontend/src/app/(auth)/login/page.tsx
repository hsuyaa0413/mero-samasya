'use client';

import axios from 'axios';
import { MagicCard } from '@/components/magicui/magic-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { backendApi } from '@/lib/constant';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const { setUser } = useUserStore();
  const router = useRouter();

  const [formInputs, setFormInputs] = useState({
    email: '',
    password: '',
    terms: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    terms: '',
  });

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });

    let error = '';
    if (name === 'email') {
      const email = value.trim();
      error = !email
        ? 'Email is required'
        : !email.includes('@')
        ? 'Invalid email format'
        : '';
    } else if (name === 'password') {
      error = !value.trim() ? 'Password is required' : '';
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  async function formSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formInputs.terms) {
      setFormErrors(prev => ({
        ...prev,
        terms: 'You must agree to the terms and privacy policy.',
      }));
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      const res = await axios.post(`${backendApi}/auth/login`, formInputs, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const { user } = res.data;
        setUser(user);

        if (user.role === 'authority') {
          if (user.rejectedByAdmin) {
            setStatusMessage('Your request has been rejected by the admin.');
          } else if (!user.approved) {
            setStatusMessage('Your form is pending approval.');
          } else {
            setStatusMessage('Your request has been approved!');
            router.push('/authority-dashboard');
          }
        } else if (user.role === 'citizen') {
          router.push('/user-dashboard');
        } else {
          router.push(`/${user.role}-dashboard`);
        }
      }
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message || 'Login failed';

        if (message.toLowerCase().includes('email')) {
          setFormErrors(prev => ({ ...prev, email: 'Email not found!' }));
        } else if (message.toLowerCase().includes('password')) {
          setFormErrors(prev => ({ ...prev, password: 'Incorrect password!' }));
        } else {
          setFormErrors(prev => ({
            ...prev,
            email: '',
            password: 'Invalid email or password',
          }));
        }
      } else {
        console.error('Unexpected error:', error);
        setStatusMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const hasFormErrors = Object.values(formErrors).some(err => err !== '');
  const isFormIncomplete =
    !formInputs.email.trim() || !formInputs.password.trim();
  const isFormValid = !hasFormErrors && !isFormIncomplete && formInputs.terms;

  return (
    <div
      className="flex items-center justify-center mx-auto p-4 sm:p-6 bg-lightBlue rounded-lg border-t-1 border-gray-400 
    sm:h-[calc(100vh-72px)] h-[calc(100vh-64px)]"
    >
      <MagicCard gradientColor={'#D9D9D955'} className="px-4 py-6">
        <div className="bg-greyBlue text-darkBlue max-w-6xl sm:p-5 ">
          <div className="p-4 items-center flex flex-col text-center">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to
              <span className="text-skyBlue text-xl"> Mero समस्या</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-neutral-300">
              Login to report the local issues and reach out faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3 ">
              Welcome Back, Please Log In!
            </h1>
          </div>

          <form onSubmit={formSubmitHandler} className="space-y-4">
            {/* Status Message */}
            {statusMessage && (
              <p
                className={`text-sm text-center ${
                  statusMessage.includes('rejected')
                    ? 'text-red-500'
                    : statusMessage.includes('approved')
                    ? 'text-green-500'
                    : 'text-yellow-500'
                }`}
              >
                {statusMessage}
              </p>
            )}

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                onChange={changeEventHandler}
                value={formInputs.email}
                placeholder="example@email.com"
                className="mt-1 bg-lightBlue text-darkBlue"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={changeEventHandler}
                  value={formInputs.password}
                  className="pr-10 bg-lightBlue text-darkBlue"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex sm:items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formInputs.terms}
                onCheckedChange={checked => {
                  const isChecked = Boolean(checked);
                  setFormInputs(prev => ({ ...prev, terms: isChecked }));
                  setFormErrors(prevErrors => ({
                    ...prevErrors,
                    terms: isChecked
                      ? ''
                      : 'You must agree to the terms and privacy policy.',
                  }));
                }}
              />
              <Label
                htmlFor="terms"
                className="text-xs flex flex-row flex-wrap sm:text-sm"
              >
                I agree to the{' '}
                <span className="text-skyBlue hover:underline">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-skyBlue hover:underline">
                  Privacy Policy
                </span>
              </Label>
            </div>
            {formErrors.terms && (
              <p className="text-xs text-red-500">{formErrors.terms}</p>
            )}

            {/* Submit Button */}
            {isLoading ? (
              <Button disabled className="w-full mt-4 mb-4">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <PulsatingButton
                type="submit"
                className="mx-auto h-10 disabled:opacity-35"
                disabled={!isFormValid}
              >
                Login
              </PulsatingButton>
            )}

            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/role" className="text-skyBlue hover:underline">
                Register
              </Link>
            </div>
          </form>
        </div>
      </MagicCard>
    </div>
  );
}
