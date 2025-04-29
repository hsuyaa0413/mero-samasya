import Link from 'next/link';
import Image from 'next/image';
import { ShimmerButton } from './magicui/shimmer-button';
import { InteractiveHoverButton } from './magicui/interactive-hover-button';

export default function Hero() {
  return (
    <div className="relative w-full min-h-11/12 pt-24 pb-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-image.jpg"
          alt="City street view with buildings and people"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
      </div>

      {/* Content Card */}
      <div className="max-w-7xl relative z-10 min-h-full md:p-8 lg:p-12 flex items-center justify-start mx-auto">
        <div className="max-w-2xl rounded-3xl bg-lightBlue md:p-10 shadow-lg">
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

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ShimmerButton
              shimmerSize="0.13em"
              background="rgb(14, 70, 163)"
              className="bg-skyBlue text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Get Started
            </ShimmerButton>

            <Link
              href="#"
              className="flex items-center font-medium transition-colors"
            >
              <InteractiveHoverButton>Learn More</InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
