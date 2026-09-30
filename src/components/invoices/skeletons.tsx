import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="h-28 p-5">
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="mt-5 h-8 w-16 rounded bg-gray-200" />
          </Card>
        ))}
      </div>
      <div className="h-12 rounded bg-gray-100" />
      <Card className="overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-gray-100 px-4 py-4 last:border-0"
          >
            <div className="h-4 w-full rounded bg-gray-100" />
          </div>
        ))}
      </Card>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-36 rounded bg-gray-100" />
      <div className="flex justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-100" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 rounded-lg bg-gray-100" />
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          <Card className="h-72 p-5" />
          <Card className="h-64 p-5" />
        </div>
        <div className="space-y-6">
          <Card className="h-56 p-5" />
          <Card className="h-48 p-5" />
        </div>
      </div>
    </div>
  );
}
