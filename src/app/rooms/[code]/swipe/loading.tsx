import { Skeleton } from '@/components/ui/skeleton';

export default function SwipeLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
        <div className="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center gap-6 lg:mx-0 lg:max-w-md">
          <Skeleton className="h-5 w-40 lg:hidden" />
          <Skeleton className="aspect-[2/3] w-full max-w-xs rounded-2xl lg:max-w-sm" />
          <div className="flex gap-6">
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="size-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
