import Link from 'next/link';
import { Icons } from './icons';

export default function Footer() {
  return (
    <footer className="bg-skyBlue text-lightBlue">
      <div className="max-w-7xl container mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">ABOUT</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:underline">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Team
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">RESOURCES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:underline">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">LEGAL</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">CONNECT</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gray-200">
                <Icons.facebook className="size-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Icons.x className="size-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Icons.instagram className="size-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Icons.linkedin className="size-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="hover:text-gray-200">
                <Icons.youtube className="size-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-lightBlue mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Mero समस्या. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <span className="text-sm">•</span>
              <Link href="#" className="text-sm hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
