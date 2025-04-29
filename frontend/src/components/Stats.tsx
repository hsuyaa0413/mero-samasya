export default function Stats() {
  return (
    <div className="container mx-auto py-14 px-12 text-darkBlue">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-skyBlue">Mero समस्या</span> in Numbers
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover how our platform streamlines issue reporting, ensures
          transparent tracking, and facilitates direct communication with local
          authorities.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-skyBlue">1,200+</h2>
          <p className="text-gray-500 mt-2">Issues Reported</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-skyBlue">85%</h2>
          <p className="text-gray-500 mt-2">Resolution Rate</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-skyBlue">50+</h2>
          <p className="text-gray-500 mt-2">Local Authorities</p>
        </div>

        {/* Card 4 */}
        <div className="rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-skyBlue">4,500+</h2>
          <p className="text-gray-500 mt-2">Active Users</p>
        </div>
      </div>
    </div>
  );
}
