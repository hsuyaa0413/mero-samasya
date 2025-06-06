'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  onModalStateChange?: (isOpen: boolean) => void;
}

export default function ImageGallery({
  images,
  onModalStateChange,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    if (onModalStateChange) {
      onModalStateChange(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (onModalStateChange) {
      onModalStateChange(false);
    }
  };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-md overflow-hidden cursor-pointer group"
            onClick={() => openModal(index)}
          >
            <Image
              src={image || '/placeholder.svg'}
              alt={`Issue image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white z-10 bg-black/50 hover:bg-black/70"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>

            <div className="relative aspect-video">
              <Image
                src={images[currentIndex] || '/placeholder.svg'}
                alt={`Issue image ${currentIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/70 rounded-full ml-2"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
                <span className="sr-only">Previous image</span>
              </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/70 rounded-full mr-2"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
