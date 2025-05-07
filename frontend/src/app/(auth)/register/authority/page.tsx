'use client';
import Link from 'next/link';
import { ChangeEvent, useRef, useState, useMemo } from 'react';
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
import { Eye, EyeOff, Upload } from 'lucide-react';
import { MagicCard } from '@/components/magicui/magic-card';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axios from 'axios';
import { backendApi } from '@/lib/constant';
import { useRouter } from 'next/navigation';

export default function AuthorityRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    localBody: '',
    role: 'authority',
    idCard: '',
    terms: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | boolean>(
    false
  );
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    localBody: '',
    idCard: '',
    terms: '',
  });

  const [uploading, setUploading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme } = useTheme();

  const validateField = (name: string, value: string | boolean): string => {
    let error = '';
    if (name === 'fullName') {
      const trimmed = String(value).trim();
      if (!trimmed) {
        error = 'Full name is required';
      } else if (trimmed.length < 3) {
        error = 'Full name must be at least 3 characters long';
      } else {
        const isEachWordCapitalized = trimmed
          .split(' ')
          .filter(word => word)
          .every(
            word =>
              word[0] === word[0]?.toUpperCase() &&
              word.slice(1) === word.slice(1).toLowerCase()
          );
        if (!isEachWordCapitalized) {
          error = 'Each word must start with an uppercase letter';
        }
      }
    } else if (name === 'email') {
      const email = String(value).trim();
      if (!email) {
        error = 'Email is required';
      } else if (!email.includes('@')) {
        error = 'Email must include @';
      } else if (!email.endsWith('@gmail.com')) {
        error = 'Email must end with @gmail.com';
      }
    } else if (name === 'phoneNumber') {
      const phone = String(value).trim();
      if (!phone) {
        error = 'Phone number is required';
      } else if (!/^\d{10}$/.test(phone)) {
        error = 'Phone number must be 10 digits long and contain only digits';
      }
    } else if (name === 'password') {
      const password = String(value);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      if (!password) {
        error = 'Password is required';
      } else if (password.length < 8) {
        error = 'Password must be at least 8 characters long';
      } else if (!hasUpperCase) {
        error = 'Must include uppercase letter';
      } else if (!hasLowerCase) {
        error = 'Must include lowercase letter';
      } else if (!hasNumber) {
        error = 'Must include a number';
      } else if (!hasSpecialChar) {
        error = 'Must include a special character';
      }
    } else if (name === 'confirmPassword') {
      const confirmPassword = String(value);
      if (!confirmPassword) {
        error = 'Confirm password is required';
      } else if (confirmPassword !== formData.password) {
        error = 'Passwords do not match';
      }
    } else if (name === 'address') {
      const trimmed = String(value).trim();
      if (!trimmed) {
        error = 'Address is required';
      } else if (trimmed.length < 5) {
        error = 'Address must be at least 5 characters';
      }
    } else if (name === 'localBody') {
      if (!value) {
        error = 'Local body is required';
      }
    } else if (name === 'idCard') {
      if (!value) {
        error = 'ID Card upload is required';
      }
    } else if (name === 'terms') {
      if (value === false) {
        error = 'You must agree to the terms and privacy policy.';
      }
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    const error = validateField(name, value);
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, localBody: value });
    const error = validateField('localBody', value);
    setFormErrors(prevErrors => ({
      ...prevErrors,
      localBody: error,
    }));
  };

  const handleTermsChange = (checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      terms: checked,
    }));
    const error = validateField('terms', checked);
    setFormErrors(prevErrors => ({
      ...prevErrors,
      terms: error,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFormData(prev => ({ ...prev, idCard: '' }));
    setFormErrors(prevErrors => ({ ...prevErrors, idCard: '' }));
    setImageUploadError(false);

    if (!selectedFile.type.startsWith('image/')) {
      setImageUploadError('Only image files are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFiles([]);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setImageUploadError(`${selectedFile.name} exceeds the 5MB limit.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFiles([]);
      return;
    }

    setFiles([selectedFile]);
    if (e.target) e.target.value = '';
  };

  const handleUploadIdCard = async () => {
    if (files.length === 0) {
      setImageUploadError('Please select an image to upload.');
      return;
    }

    if (formErrors.idCard === '' && formData.idCard !== '') {
      setImageUploadError(
        'An ID card image has already been successfully uploaded.'
      );
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const file = files[0];

    try {
      const imageUrl = await storeImage(file);
      setFormData(prev => ({
        ...prev,
        idCard: imageUrl,
      }));
      setFiles([]);
      setImageUploadError(false);
      setFormErrors(prevErrors => ({
        ...prevErrors,
        idCard: '',
      }));
    } catch (err: unknown) {
      // Catch unknown error
      const errorMessage =
        err instanceof Error ? err.message : 'Image upload failed';
      setImageUploadError(errorMessage);
      setFormErrors(prevErrors => ({
        ...prevErrors,
        idCard: errorMessage,
      }));
      setFormData(prev => ({
        ...prev,
        idCard: '',
      }));
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name} exceeds the 5MB limit.`);
    }

    return new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'mero-samasya');
      uploadData.append('folder', 'mero-samasya');

      fetch('https://api.cloudinary.com/v1_1/dziazpcgd/image/upload', {
        method: 'POST',
        body: uploadData,
      })
        .then(async res => {
          const data = await res.json();
          if (res.ok) {
            resolve(data.secure_url);
          } else {
            reject(
              new Error(data.error?.message || 'Upload failed on Cloudinary')
            );
          }
        })
        .catch((err: unknown) => {
          // Catch unknown error
          const errorMessage =
            err instanceof Error ? err.message : 'Network error during upload.';
          reject(new Error(errorMessage));
        });
    });
  };

  const isFormValid = useMemo(() => {
    const hasRequiredValues =
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
      formData.address.trim() !== '' &&
      formData.localBody !== '' &&
      formData.idCard !== '' &&
      formData.terms === true;

    const hasNoErrors = Object.values(formErrors).every(error => error === '');

    return hasRequiredValues && hasNoErrors;
  }, [formData, formErrors]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      password: validateField('password', formData.password),
      confirmPassword: validateField(
        'confirmPassword',
        formData.confirmPassword
      ),
      address: validateField('address', formData.address),
      localBody: validateField('localBody', formData.localBody),
      idCard: validateField('idCard', formData.idCard),
      terms: validateField('terms', formData.terms),
    };

    setFormErrors(currentErrors);

    const hasErrors = Object.values(currentErrors).some(error => error !== '');

    if (hasErrors) {
      return;
    }

    const formattedData = {
      ...formData,
      phoneNumber: formData.phoneNumber.toString(),
    };

    setLoading(true);
    try {
      const res = await axios.post(
        `${backendApi}/auth/register`,
        formattedData,
        {
          withCredentials: true,
        }
      );
      if (res.status >= 200 && res.status < 300) {
        alert('Registration successful! Please wait for admin approval.');
        router.push('/login');
      } else {
        alert(`Registration failed: ${res.data?.message || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      // Catch unknown error
      let errorMessage = 'Registration failed';

      if (axios.isAxiosError(error)) {
        // Use Axios type guard
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // Handle standard Error objects
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto p-4 sm:p-6 bg-lightBlue rounded-lg border-t-1 border-gray-400">
      <MagicCard
        gradientColor={theme === 'dark' ? '#262626' : '#D9D9D955'}
        className="px-4 py-6"
      >
        <div className="bg-greyBlue text-darkBlue max-w-6xl sm:p-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to{' '}
              <span className="text-skyBlue text-xl">Mero समस्या</span>
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mx-auto">
              Register as an authority to resolve local issues and reach out
              faster.
            </p>
            <h1 className="text-2xl font-bold mt-6 mb-3 text-darkBlue">
              Register Your Account (Authority)
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-darkBlue">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="mt-1 bg-lightBlue text-darkBlue"
              />{' '}
              {formErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.fullName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-darkBlue">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="mt-1 bg-lightBlue text-darkBlue"
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="text-darkBlue">
                Phone Number
              </Label>
              <div className="flex mt-1">
                <span className="bg-gray-200 px-3 border rounded-l-md text-gray-700 flex items-center">
                  +977
                </span>
                <Input
                  id="phone"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="98XXXXXXXX"
                  className="rounded-l-none bg-lightBlue text-darkBlue flex-1"
                />
              </div>
              {formErrors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-darkBlue">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pr-10 bg-lightBlue text-darkBlue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
              <Label htmlFor="confirmPassword" className="text-darkBlue">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pr-10 bg-lightBlue text-darkBlue"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                {formErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-darkBlue">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your address"
                className="mt-1 bg-lightBlue text-darkBlue"
              />
              {formErrors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.address}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="localBody" className="text-darkBlue">
                Local Body
              </Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.localBody}
              >
                <SelectTrigger className="mt-1 bg-lightBlue text-darkBlue">
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
              {formErrors.localBody && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.localBody}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="idCard" className="text-darkBlue">
                ID Card Upload
              </Label>
              <div className="mt-1 border border-gray-300 rounded-md p-4 text-center bg-lightBlue hover:border-gray-400 cursor-pointer overflow-hidden">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center text-gray-600 "
                >
                  <Input
                    type="file"
                    name="idCard"
                    id="file-input"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    hidden
                  />
                  <Upload className="size-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click here to select your ID card (Max 5MB, 1 image only)
                  </p>
                </div>
                {files.length > 0 && (
                  <div className="mt-2 text-sm text-left text-gray-700 flex gap-1 items-center max-w-full overflow-hidden">
                    <span className="whitespace-nowrap">Selected file:</span>
                    <span
                      className="font-medium truncate"
                      title={files[0].name}
                      style={{ maxWidth: '200px' }}
                    >
                      {files[0].name}
                    </span>
                    <span className="whitespace-nowrap">
                      ({Math.round(files[0].size / 1024)} KB)
                    </span>
                  </div>
                )}
                {imageUploadError && typeof imageUploadError === 'string' && (
                  <p className="text-red-500 text-sm mt-2">
                    {imageUploadError}
                  </p>
                )}
                {files.length > 0 && !formData.idCard && (
                  <Button
                    onClick={handleUploadIdCard}
                    disabled={uploading}
                    className="mt-4 w-full"
                  >
                    {uploading ? 'Uploading...' : 'Upload ID Card'}
                  </Button>
                )}
                {formData.idCard && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-green-600 text-sm mb-2">
                      ID Card uploaded successfully!
                    </p>
                    <Image
                      src={formData.idCard}
                      alt="Uploaded ID Card"
                      width={150}
                      height={100}
                      className="rounded shadow-sm object-cover"
                    />
                  </div>
                )}
                {formErrors.idCard && formData.idCard === '' && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.idCard}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={handleTermsChange}
                className="border-gray-400 data-[state=checked]:bg-darkBlue data-[state=checked]:text-lightBlue"
              />
              <Label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-700 dark:text-gray-300"
              >
                I agree to the{' '}
                <Link href="#" className="text-skyBlue hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-skyBlue hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {formErrors.terms && (
              <p className="text-xs text-red-500">{formErrors.terms}</p>
            )}

            <PulsatingButton
              className="w-full h-10 text-base disabled:opacity-40"
              type="submit"
              disabled={!isFormValid || loading || uploading}
            >
              {loading ? 'Registering...' : 'Register'}
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
