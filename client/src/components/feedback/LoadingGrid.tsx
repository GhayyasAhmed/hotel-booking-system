export const LoadingGrid = () => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div className="animate-pulse rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-3" key={index}>
        <div className="aspect-[4/3] rounded-md bg-[#eadcc6]" />
        <div className="mt-4 h-4 w-2/3 rounded bg-[#eadcc6]" />
        <div className="mt-3 h-3 w-1/2 rounded bg-[#eadcc6]" />
      </div>
    ))}
  </div>
);
