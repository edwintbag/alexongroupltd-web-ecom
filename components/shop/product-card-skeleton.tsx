export function ProductCardSkeleton() {
  return (
    <div className="border border-line">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-2 w-16" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex justify-between pt-3">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-9 w-16" />
        </div>
      </div>
    </div>
  );
}
