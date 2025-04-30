import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Who are you?</h1>
          <p className="text-gray-600">
            Select your role to continue to the appropriate area of the platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* User Card */}
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow h-80">
            <Image
              src="/user.png"
              alt="User"
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="relative z-10 p-4 flex flex-col justify-between h-full">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1 text-white">User</h2>
                <p className="text-white text-sm">
                  Join as User and report issues, provide feedback, and help
                  authority to develop your city.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <InteractiveHoverButton className="w-fit">
                  <Link href="/register" className="text-sm px-4 py-2">
                    Continue as User
                  </Link>
                </InteractiveHoverButton>
              </div>
            </div>
          </div>

          {/* Authority Card */}
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow h-80">
            <Image
              src="/authority.png"
              alt="Authority"
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="relative z-10 p-4 flex flex-col justify-between h-full">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1 text-white">
                  Authority
                </h2>
                <p className="text-white text-sm">
                  Join as Authority and manage the city, oversee projects, and
                  ensure the well-being of citizens.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <InteractiveHoverButton className="w-fit">
                  <Link
                    href="/dashboard/authority"
                    className="text-sm px-4 py-2"
                  >
                    Continue as Authority
                  </Link>
                </InteractiveHoverButton>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
