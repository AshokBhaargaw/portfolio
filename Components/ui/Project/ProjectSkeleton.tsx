"use client";

export default function ProjectSkeleton() {
  return (
    <div className="flex flex-col items-center gap-12 xl:gap-20 lg:flex-row justify-between animate-pulse">
      
      {/* Left: Laptop Skeleton */}
      <div className="w-full md:w-1/2 xl:w-3/5 flex justify-center">
        <div className="relative w-full max-w-200">
          {/* Laptop frame */}
          <div className="w-full aspect-16/10 rounded-xl bg-gray-800 shadow-2xl" />

          {/* Screen */}
          <div className="absolute top-[6%] left-[11%] w-[78%] h-[80%] rounded bg-gray-700" />
        </div>
      </div>

      {/* Right: Content Skeleton */}
      <div className="w-full lg:w-2/5 md:w-1/2 flex flex-col gap-6">
        
        {/* Title */}
        <div className="h-10 w-3/4 rounded bg-gray-700" />

        {/* Description */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-gray-700" />
          <div className="h-4 w-11/12 rounded bg-gray-700" />
          <div className="h-4 w-10/12 rounded bg-gray-700" />
        </div>

        {/* Tech Stack */}
        <div>
          <div className="h-4 w-32 rounded bg-gray-700 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-20 rounded-full bg-gray-700"
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="h-4 w-32 rounded bg-gray-700 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-full rounded bg-gray-700"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-32 rounded bg-gray-700" />
          <div className="h-10 w-40 rounded bg-gray-700" />
        </div>

        {/* Mobile Pagination */}
        <div className="flex sm:hidden justify-center gap-3 pt-6">
          <div className="h-2 w-6 rounded bg-gray-700" />
          <div className="h-2 w-2 rounded bg-gray-700" />
          <div className="h-2 w-2 rounded bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
