'use client';
import axios, { AxiosError } from 'axios';
import { backendApi } from '@/lib/constant';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ChangeEvent, useRef, useState, FormEvent } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import LocationPicker from './LocationPicker';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues with Leaflet
const LocationPickerMapWithNoSSR = dynamic(
  () => import('@/components/LocationPickerMap'), // Adjust path if needed
  { ssr: false }
);

interface FormDataState {
  // ... your other form fields
  title: string; // Example field
  description: string; // Example field
  location: string; // Text address
  lat: number;
  lng: number;
  urgency: string;
  category: string;
  mediaUrls: string[];
}

interface FormErrorsState {
  // ... your other error fields
  title?: string;
  description?: string;
  location?: string;
  general?: string; // For general submission errors
  urgency?: string;
  category?: string;
  mediaUrls?: string;
}

export default function IssueReportForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    location: '',
    lat: 0,
    lng: 0,
    urgency: '',
    category: '',
    mediaUrls: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<FormErrorsState>({
    title: '',
    description: '',
    location: '',
    category: '',
    urgency: '',
    mediaUrls: '',
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [imageUploadError, setImageUploadError] = useState<string | false>(
    false
  );
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // This will hold the location text typed by the user, passed to the map
  const [typedLocationForMap, setTypedLocationForMap] = useState('');

  const handleLocationSelectFromMap = (
    lat: number,
    lng: number,
    address: string,
    autoFillInput: boolean = true // Flag to control if input field should be updated
  ) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      location: autoFillInput ? address : prev.location, // Update text input if autoFill is true
    }));
    if (!autoFillInput) {
      // If not auto-filling (e.g. geocoding from typed input),
      // ensure typedLocationForMap matches current form location
      setTypedLocationForMap(formData.location);
    } else {
      setTypedLocationForMap(address); // Keep typedLocation in sync if address came from map click/GPS
    }
    if (formErrors.location) {
      setFormErrors(prev => ({ ...prev, location: undefined }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Live validation
    let error = '';
    if (name === 'title') {
      error = !value.trim()
        ? 'Title is required.'
        : value.trim().length < 5
        ? 'Title must be at least 5 characters long.'
        : '';
    } else if (name === 'description') {
      error = !value.trim()
        ? 'Description is required.'
        : value.trim().length < 10
        ? 'Description must be at least 10 characters long.'
        : '';
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    const currentFiles = files;
    const uploadedCount = formData.mediaUrls.length;

    const totalAfterAdding =
      selectedFiles.length + currentFiles.length + uploadedCount;

    if (totalAfterAdding > 6) {
      setImageUploadError(
        `You can only select a maximum of 6 images in total (currently ${uploadedCount} uploaded, ${currentFiles.length} selected).`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImageUploadError(false);
    setFiles(prev => [...prev, ...selectedFiles]);
    if (e.target) e.target.value = '';
  };

  const handleUploadImages = async () => {
    if (files.length === 0) {
      setImageUploadError('Please select images to upload.');
      return;
    }

    if (files.length + formData.mediaUrls.length > 6) {
      setImageUploadError('Uploading these images exceeds the 6 image limit.');
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    const promises = files.map(file => storeImage(file));

    try {
      const urls = await Promise.all(promises);
      setFormData(prev => ({
        ...prev,
        mediaUrls: prev.mediaUrls.concat(urls),
      }));
      setFiles([]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
            err !== null &&
            'message' in err &&
            typeof (err as { message: unknown }).message === 'string'
          ? (err as { message: string }).message
          : 'Image upload failed';
      setImageUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'mero-samasya');
      uploadData.append('folder', 'mero-samasya');

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error(`${file.name} exceeds the 5MB limit.`));
        return;
      }

      fetch('https://api.cloudinary.com/v1_1/dziazpcgd/image/upload', {
        method: 'POST',
        body: uploadData,
      })
        .then(async res => {
          const data = await res.json();
          if (res.ok) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error?.message || 'Upload failed'));
          }
        })
        .catch(() => reject(new Error('Network error during upload.')));
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleUrgencyChange = (value: string) => {
    setFormData({ ...formData, urgency: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      title: !formData.title
        ? 'Title is required.'
        : formData.title.trim().length < 5
        ? 'Title must be at least 5 characters long.'
        : '',
      description: !formData.description
        ? 'Description is required.'
        : formData.description.trim().length < 10
        ? 'Description must be at least 10 characters long.'
        : '',
      location: !formData.location ? 'Location is required.' : '',
      urgency: !formData.urgency ? 'Issue Urgency is required.' : '',
      category: !formData.category ? 'Category is required.' : '',
      mediaUrls:
        formData.mediaUrls.length === 0
          ? 'At least one image is required.'
          : '',
    };

    setFormErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(msg => msg !== '');
    if (hasErrors) return;

    if (files.length > 0) {
      setImageUploadError(
        'Please upload the selected images before submitting the report.'
      );
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await axios.post(
        `${backendApi}/report/submit-report`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        setStatusMessage({
          type: 'success',
          text: 'Issue report submitted successfully!',
        });
        router.push('/user-dashboard');
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          location: '',
          lat: 0,
          lng: 0,
          urgency: '',
          category: '',
          mediaUrls: [],
        });
        setFiles([]);
      } else {
        setStatusMessage({
          type: 'error',
          text: `Submission failed: ${res.data?.message || 'Unknown error'}`,
        });
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setStatusMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          error.message ||
          'Submission failed unexpectedly.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isUploadDisabled =
    uploading ||
    files.length === 0 ||
    files.length + formData.mediaUrls.length > 6;
  const isSubmitDisabled = loading || uploading || files.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm md:max-w-xl lg:max-w-2xl max-h-[95vh] overflow-y-scroll text-darkBlue md:px-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center sm:text-xl">
            Report Issue
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {`Submit details about the issue you've encountered in your community.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {statusMessage && (
            <div
              className={`p-2 text-sm rounded ${
                statusMessage.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {statusMessage.text}
            </div>
          )}
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">
              Issue Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="E.g., Broken Street Light"
              required
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm">{formErrors.title}</p>
            )}
          </div>
          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide details about the issue"
              required
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>
          {/* Media Upload */}
          <div className="space-y-1">
            <Label htmlFor="media">
              Upload Media<span className="text-red-500">*</span>
            </Label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-md p-8 text-center bg-gray-100">
              <div
                className="flex flex-col items-center justify-center text-gray-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  type="file"
                  id="media"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  name="media"
                  multiple
                  onChange={handleFileChange}
                />
                <Upload className="size-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click here to select images (max 6 total)
                </p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 text-left text-sm text-gray-700">
                  Selected files:
                  <ul className="list-disc list-inside">
                    {files.map((file, index) => (
                      <li key={index}>
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {imageUploadError && (
                <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
              )}
              {files.length > 0 && (
                <Button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={isUploadDisabled}
                  className="mt-4 w-full cursor-pointer"
                >
                  {uploading
                    ? `Uploading...`
                    : `Upload ${files.length} Image(s)`}
                </Button>
              )}
              {formData.mediaUrls.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.mediaUrls.map((url, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <Image
                        src={url}
                        alt={`Uploaded image ${index + 1}`}
                        className="object-cover rounded"
                        fill
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-white text-red-700 rounded-full p-1 shadow-md cursor-pointer"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formErrors.mediaUrls && (
                <p className="text-red-500 text-sm mt-2">
                  {formErrors.mediaUrls}
                </p>
              )}
            </div>
          </div>
          {/* Location */}
          <div className="space-y-1">
            <Label htmlFor="location">
              Location<span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Type address or click on map below"
              required
            />
            {formErrors.location && (
              <p className="text-red-500 text-sm">{formErrors.location}</p>
            )}
          </div>

          {/* Map Placeholder Replaced by Actual Map */}
          <div className="space-y-1">
            <Label className="text-gray-700 font-medium mb-1 block">
              Pin Location on Map
            </Label>
            <LocationPickerMapWithNoSSR
              onLocationSelect={handleLocationSelectFromMap}
              typedLocation={typedLocationForMap} // Pass the typed location to the map
              initialCoordinates={
                formData.lat && formData.lng
                  ? { lat: formData.lat, lng: formData.lng }
                  : undefined
              }
            />
            {formData.lat && formData.lng && (
              <p className="text-xs text-gray-600 mt-2">
                Coordinates: Lat: {formData.lat.toFixed(5)}, Lng:{' '}
                {formData.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Urgency */}
          <div className="space-y-1">
            <Label htmlFor="category">
              Urgency<span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={handleUrgencyChange}
              value={formData.urgency}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.urgency && (
              <p className="text-red-500 text-sm">{formErrors.urgency}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label htmlFor="category">
              Category<span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={handleSelectChange}
              value={formData.category}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roads & Sidewalks">
                  Roads & Sidewalks
                </SelectItem>
                <SelectItem value="Public Utilities">
                  Public Utilities
                </SelectItem>
                <SelectItem value="Sanitation & Waste">
                  Sanitation & Waste
                </SelectItem>
                <SelectItem value="Public Safety">Public Safety</SelectItem>
                <SelectItem value="Street Lighting">Street Lighting</SelectItem>
                <SelectItem value="Parks & Recreation">
                  Parks & Recreation
                </SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-red-500 text-sm">{formErrors.category}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-red-500 text-white hover:bg-red-600 py-6"
              disabled={isSubmitDisabled}
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT REPORT'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
