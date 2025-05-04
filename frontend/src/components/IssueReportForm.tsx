'use client';

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
import { ChangeEvent, useRef, useState } from 'react';
import { LocateFixed, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';

export default function IssueReportForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [location, setLocation] = useState('');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
        className="max-w-sm md:max-w-xl max-h-11/12 overflow-y-scroll text-darkBlue md:px-8"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center sm:text-xl">
            Report Issue
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            {`Submit details about the issue you've encountered in your
              community. We'll make sure it gets to the right authorities.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium text-sm">
            Issue Title<span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="E.g., Broken Street Light, Pothole, Illegal Dumping"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium text-sm">
            Description<span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            placeholder="Please provide details about the issue, including when you noticed it and any relevant information"
            className="w-full min-h-[100px]"
          />
        </div>

        {/* <div className="space-y-2">
          <label className="block font-medium text-sm">Upload Media</label>
          <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
            <div className="flex justify-center mb-2">
              <Upload className="size-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Upload photos or videos of the issue (max 5MB each)
            </p>
          </div>
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="media">Upload Media</Label>
          <div className="mt-1 border-2 border-dashed border-gray-200 rounded-md p-8 text-center bg-gray-100 cursor-pointer">
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
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block font-medium text-sm">
            Location<span className="text-red-500">*</span>
          </label>
          <Input
            id="location"
            placeholder="Enter address or location"
            className="w-full"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        <div className="bg-blue-50 rounded-md p-4 relative">
          <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
            Interactive map loading...
          </div>
          <div className="absolute bottom-2 left-0 right-0 px-4">
            <div className="bg-white text-xs p-2 rounded-md text-center shadow-sm">
              Click on the map to pin the exact location or use GPS to
              automatically detect your location
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <div className="bg-white p-1 rounded-full shadow-sm">
              <LocateFixed className="text-red-500 size-5" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block font-medium text-sm">
            Category<span className="text-red-500">*</span>
          </label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roads">Roads & Sidewalks</SelectItem>
              <SelectItem value="utilities">Public Utilities</SelectItem>
              <SelectItem value="waste">Sanitation & Waste</SelectItem>
              <SelectItem value="safety">Public Safety</SelectItem>
              <SelectItem value="lighting">Street Lighting</SelectItem>
              <SelectItem value="parks">Parks & Recreation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button className="w-full bg-red-500 text-white hover:bg-red-600 cursor-pointer py-6">
            SUBMIT REPORT
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
