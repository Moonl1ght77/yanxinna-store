"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { products } from "@/lib/data/products";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SearchResult = {
  id: string;
  name: string;
  category: string;
  href: string;
  type: "product" | "page";
};

const staticPages = [
  { name: "Home", href: "/", type: "page" as const },
  { name: "Shop All", href: "/shop", type: "page" as const },
  { name: "Shapewear", href: "/shop?category=shapewear", type: "page" as const },
  { name: "Underwear", href: "/shop?category=underwear", type: "page" as const },
  { name: "Bras", href: "/shop?category=bras", type: "page" as const },
  { name: "New Arrivals", href: "/shop?sort=new", type: "page" as const },
  { name: "Best Sellers", href: "/shop?sort=best", type: "page" as const },
  { name: "Brand Story", href: "/pages/brand-story", type: "page" as const },
  { name: "Contact Us", href: "/pages/contact-us", type: "page" as const },
  { name: "FAQs", href: "/pages/faqs", type: "page" as const },
  { name: "Cart", href: "/cart", type: "page" as const },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();

    // Search products
    const productResults: SearchResult[] = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
      )
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        href: `/product/${p.slug}`,
        type: "product" as const,
      }));

    // Search pages
    const pageResults: SearchResult[] = staticPages
      .filter((page) => page.name.toLowerCase().includes(searchQuery))
      .map((page) => ({
        id: page.href,
        name: page.name,
        category: "Page",
        href: page.href,
        type: "page" as const,
      }));

    setResults([...productResults, ...pageResults].slice(0, 10));
  }, [query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[10vh]" onClick={onClose}>
      <div
        className="w-full max-w-[600px] rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, pages..."
            className="flex-1 text-[15px] text-[#2C2825] outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 transition hover:bg-gray-50"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#2C2825]">{result.name}</p>
                    <p className="text-[11px] text-gray-500 capitalize">{result.category}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          )}

          {!query.trim() && (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              Start typing to search...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
