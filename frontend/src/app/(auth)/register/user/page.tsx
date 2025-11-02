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
import axios, { AxiosError } from 'axios';
import { backendApi } from '@/lib/constant';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    terms: false,
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    terms: '',
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    let error = '';

    if (name === 'fullName') {
      const trimmed = value.trim();
      const isValidChars = /^[A-Za-z\s]*$/.test(value);

      if (!isValidChars) {
        error = 'Full name can only contain letters and spaces';
      } else {
        const isEachWordCapitalized = trimmed
          .split(' ')
          .filter(word => word)
          .every(
            word =>
              word[0] === word[0]?.toUpperCase() &&
              word.slice(1) === word.slice(1).toLowerCase()
          );

        error = !trimmed
          ? 'Full name is required'
          : trimmed.length < 3
          ? 'Full name must be at least 3 characters long'
          : !isEachWordCapitalized
          ? 'Each word must start with an uppercase letter'
          : '';
      }
    } else if (name === 'email') {
      const email = value.trim();
      error = !email
        ? 'Email is required'
        : !email.includes('@')
        ? 'Email must include @'
        : !email.endsWith('@gmail.com')
        ? 'Email must end with @gmail.com'
        : '';
    } else if (name === 'phoneNumber') {
      error = !value.trim()
        ? 'Phone number is required'
        : value.length !== 10
        ? 'Phone number must be 10 digits long'
        : '';
    } else if (name === 'password') {
      const password = value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

      error = !password
        ? 'Password is required'
        : password.length < 8
        ? 'Password must be at least 8 characters long'
        : !hasUpperCase
        ? 'Must include uppercase letter'
        : !hasLowerCase
        ? 'Must include lowercase letter'
        : !hasNumber
        ? 'Must include a number'
        : !hasSpecialChar
        ? 'Must include a special character'
        : '';
    } else if (name === 'confirmPassword') {
      error = value !== formData.password ? 'Passwords do not match' : '';
    } else if (name === 'address') {
      error = !value.trim()
        ? 'Address is required'
        : value.length < 5
        ? 'Address must be at least 5 characters'
        : '';
    }

    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.terms) {
      setFormErrors(prev => ({
        ...prev,
        terms: 'You must agree to the terms and privacy policy.',
      }));
      return;
    }

    const formattedData = {
      ...formData,
      phoneNumber: formData.phoneNumber.toString(),
    };

    if (!/^\d{10}$/.test(formattedData.phoneNumber)) {
      toast.error('Please enter a valid phone number with 10 digits.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendApi}/auth/register`,
        formattedData,
        { withCredentials: true }
      );

      if (res.status >= 200 && res.status < 300) {
        router.push('/user-dashboard');
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      // If backend sends an error like "Email already exists"
      const message = error.response?.data?.message || 'Registration failed';

      // Show error below email field if message includes "email"
      if (message.toLowerCase().includes('email')) {
        setFormErrors(prev => ({
          ...prev,
          email: message,
        }));
      } else if (message.toLowerCase().includes('phone')) {
        setFormErrors(prev => ({
          ...prev,
          phoneNumber: message,
        }));
      } else {
        toast.error(message); // fallback
      }

      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasFormErrors = Object.values(formErrors).some(error => error !== '');
  const isFormIncomplete = Object.values(formData).some(value =>
    typeof value === 'string' ? value.trim() === '' : false
  );
  const isFormValid = !hasFormErrors && !isFormIncomplete && formData.terms;
  return (
    <div className="flex items-center justify-center min-h-screen mx-auto p-4 sm:p-6 bg-lightBlue rounded-lg border-t-1 border-gray-400">
      <MagicCard
        gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
        className="px-4 py-6"
      >
        <div className="bg-greyBlue text-darkBlue max-w-6xl sm:p-5">
          <div className="p-4 items-center flex flex-col text-center">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to{' '}
              <span className="text-skyBlue text-xl">Mero समस्या</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Register to report the local issues and help authorities to reach
              out to you faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3">
              Create Your Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                className="mt-1 bg-lightBlue text-darkBlue"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                className="mt-1 bg-lightBlue text-darkBlue"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex mt-1">
                <div className="bg-gray-100 flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md">
                  +977
                </div>
                <Input
                  type="tel"
                  id="phoneNumber"
                  className="rounded-l-none bg-lightBlue text-darkBlue"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pr-10 bg-lightBlue text-darkBlue"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pr-10 bg-lightBlue text-darkBlue"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>{' '}
              </div>
              {formErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                className="mt-1 bg-lightBlue text-darkBlue"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              {formErrors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>

            <div className="flex sm:items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={checked => {
                  const isChecked = Boolean(checked);
                  setFormData(prev => ({ ...prev, terms: isChecked }));
                  setFormErrors(prevErrors => ({
                    ...prevErrors,
                    terms: isChecked
                      ? ''
                      : 'You must agree to the terms and privacy policy.',
                  }));
                }}
              />
              <Label htmlFor="terms" className="text-xs sm:text-sm">
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

            <PulsatingButton
              className="mx-auto h-10 disabled:opacity-35"
              disabled={!isFormValid}
            >
              {loading ? 'Registering...' : 'Register'}
            </PulsatingButton>

            <div className="text-center text-sm">
              Already have an account?
              <Link href="/login" className="text-skyBlue hover:underline">
                {' '}
                Login
              </Link>
            </div>
          </form>
        </div>
      </MagicCard>
    </div>
  );
}
