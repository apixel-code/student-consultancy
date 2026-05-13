const Pulse = ({ className }) => (
  <div className={`bg-gray-100 rounded animate-pulse ${className}`} />
);

export const LineChartSkeleton = () => (
  <div className="p-5">
    <Pulse className="h-4 w-40 mb-5" />
    <div className="flex items-end gap-1 h-44">
      {Array.from({ length: 12 }, (_, i) => (
        <Pulse
          key={i}
          className="flex-1"
          style={{ height: `${30 + Math.random() * 70}%` }}
        />
      ))}
    </div>
    <div className="flex gap-4 mt-3">
      {Array.from({ length: 6 }, (_, i) => <Pulse key={i} className="h-3 flex-1" />)}
    </div>
  </div>
);

export const PieChartSkeleton = () => (
  <div className="p-5 flex flex-col items-center">
    <Pulse className="h-4 w-32 mb-5" />
    <div className="relative">
      <Pulse className="h-36 w-36 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white" />
      </div>
    </div>
    <div className="mt-4 space-y-2 w-full">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Pulse className="h-3 w-3 rounded-full flex-shrink-0" />
          <Pulse className="h-3 flex-1" />
        </div>
      ))}
    </div>
  </div>
);

export const BarChartSkeleton = () => (
  <div className="p-5">
    <Pulse className="h-4 w-36 mb-5" />
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Pulse className="h-3 w-24 flex-shrink-0" />
          <Pulse className="h-6 flex-1" style={{ maxWidth: `${30 + i * 14}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Pulse className="h-10 w-10 rounded-xl" />
      <Pulse className="h-4 w-16" />
    </div>
    <Pulse className="h-8 w-20" />
    <Pulse className="h-3 w-28" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-3 p-3">
        <Pulse className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Pulse className="h-3 w-3/4" />
          <Pulse className="h-3 w-1/2" />
        </div>
        <Pulse className="h-6 w-20 rounded-full flex-shrink-0" />
      </div>
    ))}
  </div>
);
