import Link from 'next/link';
import Image from 'next/image';
import { ShimmerButton } from './magicui/shimmer-button';
import { InteractiveHoverButton } from './magicui/interactive-hover-button';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full min-h-11/12 py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute aspect-[16/9] w-full inset-0 z-0">
        <Image
          src="/hero-image.jpg"
          alt="City street view with buildings and people"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Card */}
      <div className="max-w-7xl container relative z-10 min-h-full md:p-8 lg:p-12 flex items-center justify-start mx-auto">
        <div className="max-w-2xl rounded-3xl bg-lightBlue p-6 m-3 md:p-10 shadow-lg">
          <p className="text-skyBlue font-medium mb-4">
            Mero समस्या : Your Voice, Our Action
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Connecting Citizens & Authorities for a Better Community
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Report local issues and connect directly with authorities to create
            a more responsive and effective community.
          </p>

          <div className="flex sm:flex-row items-center sm:items-center gap-4">
            <Link href="/role">
              <ShimmerButton
                shimmerSize="0.13em"
                background="rgb(14, 70, 163)"
                className="bg-skyBlue text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Get Started
              </ShimmerButton>
            </Link>

            <Link
              href="#features"
              scroll={true}
              className="font-medium transition-colors hidden sm:flex"
            >
              <InteractiveHoverButton className="py-3.5">
                Learn More
              </InteractiveHoverButton>
            </Link>

            <Link
              href="#features"
              scroll={true}
              className="font-medium transition-colors visible sm:hidden"
            >
              <Button className="bg-gray-50 text-darkBlue text-md font-medium py-6 rounded-full w-[9.5rem]">
                Learn More <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
