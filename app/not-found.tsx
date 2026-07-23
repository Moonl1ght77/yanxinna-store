import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
      <div className="border border-borderSoft bg-white px-6 py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[0.04em] text-[#2C2825]">
          Product not found
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
          This product may have been removed or is no longer published.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[#5C4E43] bg-[#5C4E43] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-[#4A3D34]"
          >
            View products
          </Link>
        </div>
      </div>
    </div>
  );
}
