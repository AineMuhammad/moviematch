import { Skeleton } from '@/components/ui/skeleton';

export default function SwipeLoading() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center gap-6 px-4 py-8">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="aspect-[2/3] w-full max-w-xs rounded-2xl" />
      <div className="flex gap-6">
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="size-14 rounded-full" />
      </div>
    </div>
  );
}
