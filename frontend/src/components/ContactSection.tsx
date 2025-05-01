import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <div className="w-full bg-gray-50 py-16 scroll-mt-16" id="contacts">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Have Questions?
          </h2>
          <p className="text-gray-600">
            We&apos;re here to help. Contact our support team for assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Call Us Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-start">
              <div className="bg-lightBlue p-3 rounded-lg mb-4">
                <Phone className="h-5 w-5 text-skyBlue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-700 mb-1">+977 025-123456</p>
              <p className="text-gray-500 text-sm">
                Monday - Friday, 9am to 5pm
              </p>
            </div>
          </div>

          {/* Email Us Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-start">
              <div className="bg-lightBlue p-3 rounded-lg mb-4">
                <Mail className="h-5 w-5 text-skyBlue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-700 mb-1">support@merosamasya.com</p>
              <p className="text-gray-500 text-sm">
                Typically responds within 24 hours
              </p>
            </div>
          </div>

          {/* Visit Us Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-start">
              <div className="bg-lightBlue p-3 rounded-lg mb-4">
                <MapPin className="h-5 w-5 text-skyBlue" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-700 mb-1">Dharan, Nepal</p>
              <p className="text-gray-500 text-sm">By appointment only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
