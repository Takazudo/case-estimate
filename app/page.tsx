import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Takazudo Modular
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
              Premium handcrafted modular synthesizer cases designed for Eurorack enthusiasts.
              Choose from our Block series with customizable panels and professional-grade rails.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Configure Your Case */}
          <Link
            href="/m/"
            className="group relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              Configure Your Case
            </h3>
            <p className="text-gray-500">
              Design your perfect modular case with our interactive configurator. Choose models,
              colors, and rail types with real-time pricing.
            </p>
            <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">Start Configuring</span>
              <svg
                className="ml-2 h-4 w-4 transition group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Panel Materials */}
          <Link
            href="/panel"
            className="group relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-green-600">
              Panel Materials
            </h3>
            <p className="text-gray-500">
              Explore our selection of premium panel materials including acrylic and 3D printed
              options in various colors.
            </p>
            <div className="mt-4 flex items-center text-green-600 group-hover:text-green-700">
              <span className="text-sm font-medium">View Materials</span>
              <svg
                className="ml-2 h-4 w-4 transition group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Module Library */}
          <Link
            href="/modules"
            className="group relative rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-purple-600">
              Module Library
            </h3>
            <p className="text-gray-500">
              Browse our curated collection of compatible Eurorack modules and plan your perfect
              synthesizer setup.
            </p>
            <div className="mt-4 flex items-center text-purple-600 group-hover:text-purple-700">
              <span className="text-sm font-medium">Explore Modules</span>
              <svg
                className="ml-2 h-4 w-4 transition group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Handcrafted Quality for Your Modular System
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our Block series cases are meticulously designed to provide the perfect home for your
              Eurorack modules. Available in 40HP and 60HP sizes with both acrylic and 3D printed
              variants, each case features precision-engineered mounting rails and customizable
              panels to match your aesthetic.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/m/"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Start Configuring
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
