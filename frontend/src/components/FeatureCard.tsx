import {
  Megaphone,
  MapPin,
  ListChecks,
  MessageSquare,
  BarChart2,
  Smartphone,
} from 'lucide-react';

export default function FeatureCard() {
  return (
    <section className="py-16 bg-lightBlue text-darkBlue">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Key Features of <span className="text-skyBlue">Mero समस्या</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover how our platform streamlines issue reporting, ensures
            transparent tracking, and facilitates direct communication with
            local authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Megaphone className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Issue Reporting</h3>
            <p className="text-gray-600">
              Report local problems in minutes with photos, location, and
              detailed descriptions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              GPS Location Tracking
            </h3>
            <p className="text-gray-600">
              Pinpoint exact locations of issues for faster response and
              resolution.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ListChecks className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Follow your reported issues from submission to resolution with
              real-time updates.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
            <p className="text-gray-600">
              Message authorities directly for clarifications and updates.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Community Prioritization
            </h3>
            <p className="text-gray-600">
              Upvote important issues to help authorities prioritize community
              needs.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-lightBlue w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="text-skyBlue w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Notifications</h3>
            <p className="text-gray-600">
              Get instant updates about your reports and community issues.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
