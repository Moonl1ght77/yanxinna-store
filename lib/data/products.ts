import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "yx-001",
    slug: "seamless-coverage-bodysuit",
    name: "Seamless Coverage Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    badge: "New",
    price: 98,
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/products/shapewear-1/黑色白底.png", hoverImage: "/products/shapewear-1/黑色模特正面.png" },
      { name: "Nude", hex: "#d4b896", image: "/products/shapewear-1/肤色白底.png", hoverImage: "/products/shapewear-1/肤色模特正面.png" },
      { name: "Brown", hex: "#8b6f47", image: "/products/shapewear-1/棕色白底.png", hoverImage: "/products/shapewear-1/棕色模特正面.png" },
      { name: "Grey", hex: "#9a9a9a", image: "/products/shapewear-1/灰色白底.png", hoverImage: "/products/shapewear-1/灰色模特正面.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/shapewear-1/白色白底.png", hoverImage: "/products/shapewear-1/白色模特正面.png" },
      { name: "Pink", hex: "#e8c4c4", image: "/products/shapewear-1/粉色白底.png", hoverImage: "/products/shapewear-1/粉色模特正面.png" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/products/shapewear-1/黑色白底.png",
    hoverImage: "/products/shapewear-1/黑色模特正面.png",
    gallery: [
      "/products/shapewear-1/黑色白底.png",
      "/products/shapewear-1/黑色模特正面.png",
      "/products/shapewear-1/肤色白底.png",
      "/products/shapewear-1/肤色模特正面.png"
    ],
    shortDescription: "Full coverage seamless bodysuit with firm compression.",
    description: "A premium seamless bodysuit designed for all-day comfort with firm compression. Features a smooth, bonded edge design that eliminates visible panty lines.",
    fabric: "80% nylon, 20% elastane",
    care: "Hand wash cold, lay flat to dry.",
    compressionLevel: "Firm",
    benefits: ["Seamless construction", "Full coverage", "Targeted compression", "Bonded edges"],
    featured: true,
    bestSeller: true,
    completeTheLook: ["yx-002", "yx-003"]
  },
  {
    id: "yx-002",
    slug: "adjustable-strap-bodysuit",
    name: "Adjustable Strap Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    price: 85,
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/products/shapewear-2/黑色白底.png", hoverImage: "/products/shapewear-2/黑色模特正面.png" },
      { name: "Nude", hex: "#d4b896", image: "/products/shapewear-2/肤色白底.png", hoverImage: "/products/shapewear-2/肤色模特正面.png" },
      { name: "Brown", hex: "#8b6f47", image: "/products/shapewear-2/棕色白底.png", hoverImage: "/products/shapewear-2/棕色模特正面.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/shapewear-2/白色白底.png", hoverImage: "/products/shapewear-2/白色模特正面.png" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/products/shapewear-2/黑色白底.png",
    hoverImage: "/products/shapewear-2/黑色模特正面.png",
    gallery: [
      "/products/shapewear-2/黑色白底.png",
      "/products/shapewear-2/黑色模特正面.png",
      "/products/shapewear-2/肤色白底.png",
      "/products/shapewear-2/肤色模特正面.png"
    ],
    shortDescription: "Adjustable strap bodysuit with medium compression.",
    description: "A versatile bodysuit with adjustable straps for a customized fit. Perfect for everyday wear.",
    fabric: "78% nylon, 22% elastane",
    care: "Machine wash cold, gentle cycle.",
    compressionLevel: "Medium",
    benefits: ["Adjustable straps", "Medium compression", "Seamless design"],
    featured: true,
    completeTheLook: ["yx-001", "yx-004"]
  },
  {
    id: "yx-003",
    slug: "high-waist-shaping-bodysuit",
    name: "High Waist Shaping Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    badge: "Best Seller",
    price: 108,
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/products/shapewear-3/黑色白底.png", hoverImage: "/products/shapewear-3/黑色模特正面.png" },
      { name: "Nude", hex: "#d4b896", image: "/products/shapewear-3/肤色白底.png", hoverImage: "/products/shapewear-3/肤色模特正面.png" },
      { name: "Brown", hex: "#8b6f47", image: "/products/shapewear-3/棕色白底.png", hoverImage: "/products/shapewear-3/棕色模特正面.png" },
      { name: "Grey", hex: "#9a9a9a", image: "/products/shapewear-3/灰色白底.png", hoverImage: "/products/shapewear-3/灰色模特正面.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/shapewear-3/白色白底.png", hoverImage: "/products/shapewear-3/白色模特正面.png" },
      { name: "Pink", hex: "#e8c4c4", image: "/products/shapewear-3/粉色白底.png", hoverImage: "/products/shapewear-3/粉色模特正面.png" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/products/shapewear-3/黑色白底.png",
    hoverImage: "/products/shapewear-3/黑色模特正面.png",
    gallery: [
      "/products/shapewear-3/黑色白底.png",
      "/products/shapewear-3/黑色模特正面.png",
      "/products/shapewear-3/肤色白底.png",
      "/products/shapewear-3/肤色模特正面.png"
    ],
    shortDescription: "High waist bodysuit with firm compression for body sculpting.",
    description: "Our best-selling high waist bodysuit features firm compression technology that smooths and sculpts your silhouette.",
    fabric: "82% nylon, 18% elastane",
    care: "Hand wash cold, lay flat to dry.",
    compressionLevel: "Firm",
    benefits: ["High waist design", "Firm compression", "Body sculpting"],
    featured: true,
    bestSeller: true,
    completeTheLook: ["yx-001", "yx-002"]
  },
  {
    id: "yx-004",
    slug: "comfort-seamless-bodysuit",
    name: "Comfort Seamless Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    price: 78,
    colors: [
      { name: "Black", hex: "#1a1a1a", image: "/products/shapewear-4/黑色白底.png", hoverImage: "/products/shapewear-4/黑色模特正面.png" },
      { name: "Nude", hex: "#d4b896", image: "/products/shapewear-4/肤色白底.png", hoverImage: "/products/shapewear-4/肤色模特正面.png" },
      { name: "Brown", hex: "#8b6f47", image: "/products/shapewear-4/棕色白底.png", hoverImage: "/products/shapewear-4/棕色模特正面.png" },
      { name: "Grey", hex: "#9a9a9a", image: "/products/shapewear-4/灰色白底.png", hoverImage: "/products/shapewear-4/灰色模特正面.png" },
      { name: "White", hex: "#f5f5f5", image: "/products/shapewear-4/白色白底.png", hoverImage: "/products/shapewear-4/白色模特正面.png" },
      { name: "Pink", hex: "#e8c4c4", image: "/products/shapewear-4/粉色白底.png", hoverImage: "/products/shapewear-4/粉色模特正面.png" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/products/shapewear-4/黑色白底.png",
    hoverImage: "/products/shapewear-4/黑色模特正面.png",
    gallery: [
      "/products/shapewear-4/黑色白底.png",
      "/products/shapewear-4/黑色模特正面.png",
      "/products/shapewear-4/肤色白底.png",
      "/products/shapewear-4/肤色模特正面.png"
    ],
    shortDescription: "Light compression seamless bodysuit for ultimate comfort.",
    description: "Designed for comfort without sacrificing style, this light compression bodysuit feels like a second skin.",
    fabric: "75% nylon, 25% elastane",
    care: "Machine wash cold, gentle cycle.",
    compressionLevel: "Light",
    benefits: ["Light compression", "Seamless feel", "All-day comfort"],
    completeTheLook: ["yx-002", "yx-003"]
  }
];

export const categoryEntries = [
  {
    label: "Shapewear",
    href: "/shop?category=shapewear",
    image: "/products/shapewear-1/黑色白底.png"
  },
  {
    label: "Bodysuits",
    href: "/shop?category=shapewear&subcategory=bodysuits",
    image: "/products/shapewear-1/黑色白底.png"
  }
];
