export default function Loading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 md:px-8"
      role="status"
      aria-label="Loading products"
    >
      <div className="h-36 animate-pulse border border-borderSoft bg-white" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="aspect-[3/4] animate-pulse border border-borderSoft bg-[#F5F1ED]"
          />
        ))}
      </div>
    </div>
  );
}
