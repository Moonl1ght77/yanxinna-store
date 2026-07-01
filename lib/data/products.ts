import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "ab-001",
    slug: "contour-sculpt-bodysuit",
    name: "Contour Sculpt Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    badge: "New",
    price: 88,
    compareAtPrice: 108,
    colors: [
      { name: "Cloud", hex: "#f2f5fb" },
      { name: "Stone", hex: "#d8d4cf" },
      { name: "Onyx", hex: "#1c2230" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/generated-products/shapewear-bodysuit-black.png",
    hoverImage: "/generated-products/shapewear-bodysuit-black.png",
    gallery: [
      "/generated-products/shapewear-bodysuit-black.png",
      "/generated-products/shapewear-bodysuit-black.png",
      "/generated-products/shapewear-bodysuit-black.png"
    ],
    shortDescription: "A smoothing bodysuit with sculpted support and a clean neckline.",
    description:
      "Designed as the anchor piece of the collection, this bodysuit balances smooth compression with flexible stretch for a polished under-layer or a standalone styling piece.",
    fabric: "72% recycled nylon, 28% elastane",
    care: "Machine wash cold, line dry, do not bleach.",
    compressionLevel: "Firm",
    benefits: ["Targeted waist support", "Clean bonded edges", "Breathable knit structure"],
    featured: true,
    bestSeller: true,
    completeTheLook: ["ab-101", "ab-201"]
  },
  {
    id: "ab-002",
    slug: "second-skin-shaping-top",
    name: "Second Skin Shaping Top",
    category: "shapewear",
    subcategory: "tops",
    price: 64,
    colors: [
      { name: "Powder Blue", hex: "#dce7f7" },
      { name: "Pearl", hex: "#f7f7f3" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "/generated-products/shapewear-top-nude.png",
    hoverImage: "/generated-products/shapewear-top-nude.png",
    gallery: [
      "/generated-products/shapewear-top-nude.png",
      "/generated-products/shapewear-top-nude.png",
      "/generated-products/shapewear-top-nude.png"
    ],
    shortDescription: "A refined shaping top that layers cleanly under tailoring.",
    description:
      "An everyday smoothing layer with a polished neckline, tonal finishing, and light contour control through the core.",
    fabric: "80% nylon, 20% elastane",
    care: "Machine wash cold, reshape while damp.",
    compressionLevel: "Medium",
    benefits: ["Light bust support", "Soft hand feel", "Smooth under blazers"],
    featured: true,
    bestSeller: true,
    completeTheLook: ["ab-003", "ab-101"]
  },
  {
    id: "ab-003",
    slug: "high-rise-sculpt-short",
    name: "High Rise Sculpt Short",
    category: "shapewear",
    subcategory: "bottoms",
    price: 58,
    colors: [
      { name: "Sand", hex: "#d6c9bd" },
      { name: "Espresso", hex: "#6f584d" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/generated-products/shapewear-short-nude.png",
    hoverImage: "/generated-products/shapewear-short-nude.png",
    gallery: [
      "/generated-products/shapewear-short-nude.png",
      "/generated-products/shapewear-short-nude.png",
      "/generated-products/shapewear-short-nude.png"
    ],
    shortDescription: "High-rise sculpting shorts with a seamless leg finish.",
    description:
      "A foundational shaping short created to smooth through the midsection and hips while remaining light enough for daily wear.",
    fabric: "74% nylon, 26% elastane",
    care: "Hand wash or gentle machine cycle.",
    compressionLevel: "Firm",
    benefits: ["Seam-light hem", "Core support", "Hidden under dresses"],
    featured: true,
    bestSeller: true,
    completeTheLook: ["ab-102", "ab-201"]
  },
  {
    id: "ab-101",
    slug: "soft-form-balconette-bra",
    name: "Soft Form Balconette Bra",
    category: "bras",
    price: 54,
    colors: [
      { name: "Ivory", hex: "#f7f3ef" },
      { name: "Slate Blue", hex: "#8ea5c7" }
    ],
    sizes: ["32A", "32B", "34B", "34C", "36C"],
    image: "/generated-products/bra-leopard-support.png",
    hoverImage: "/generated-products/bra-leopard-support.png",
    gallery: [
      "/generated-products/bra-leopard-support.png",
      "/generated-products/bra-leopard-support.png",
      "/generated-products/bra-leopard-support.png"
    ],
    shortDescription: "An everyday balconette with light structure and a smooth finish.",
    description:
      "A soft bra designed to pair with the shapewear range, offering flattering lift without visual bulk.",
    fabric: "79% nylon, 21% elastane",
    care: "Hand wash cold, dry flat.",
    compressionLevel: "Light",
    benefits: ["Soft cup support", "Adjustable straps", "Smooth under tees"],
    bestSeller: true,
    completeTheLook: ["ab-003", "ab-201"]
  },
  {
    id: "ab-102",
    slug: "support-scoop-bralette",
    name: "Support Scoop Bralette",
    category: "bras",
    price: 42,
    colors: [
      { name: "Cloud", hex: "#f3f7ff" },
      { name: "Nude Rose", hex: "#dec8c7" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/generated-products/bra-leopard-support.png",
    hoverImage: "/generated-products/bra-leopard-support.png",
    gallery: [
      "/generated-products/bra-leopard-support.png",
      "/generated-products/bra-leopard-support.png",
      "/generated-products/bra-leopard-support.png"
    ],
    shortDescription: "A scoop bralette with flexible support and a barely-there feel.",
    description:
      "Soft support for slower days, travel, and low-key layering. Designed to stay smooth without digging in.",
    fabric: "82% micro modal, 18% elastane",
    care: "Machine wash cold, delicate cycle.",
    compressionLevel: "Light",
    benefits: ["Feather-soft feel", "Flexible underband", "Easy layering"],
    completeTheLook: ["ab-002", "ab-202"]
  },
  {
    id: "ab-201",
    slug: "invisible-brief",
    name: "Invisible Brief",
    category: "underwear",
    price: 22,
    colors: [
      { name: "Mist", hex: "#e8edf4" },
      { name: "Cocoa", hex: "#907264" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "/generated-products/underwear-seamless-set.png",
    hoverImage: "/generated-products/underwear-seamless-set.png",
    gallery: [
      "/generated-products/underwear-seamless-set.png",
      "/generated-products/underwear-seamless-set.png",
      "/generated-products/underwear-seamless-set.png"
    ],
    shortDescription: "A smooth brief designed to disappear under close-fitting layers.",
    description:
      "Ultra-soft, low profile, and cut to sit flat against the skin for invisible coverage under shapewear and knitwear.",
    fabric: "85% nylon, 15% elastane",
    care: "Machine wash cold, line dry.",
    compressionLevel: "Light",
    benefits: ["Laser-clean edges", "Soft waist finish", "Daily comfort"],
    bestSeller: true,
    completeTheLook: ["ab-001", "ab-101"]
  },
  {
    id: "ab-202",
    slug: "feather-soft-thong",
    name: "Feather Soft Thong",
    category: "underwear",
    price: 20,
    colors: [
      { name: "Pearl", hex: "#f4f0eb" },
      { name: "Ink", hex: "#222833" }
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "/generated-products/underwear-seamless-set.png",
    hoverImage: "/generated-products/underwear-seamless-set.png",
    gallery: [
      "/generated-products/underwear-seamless-set.png",
      "/generated-products/underwear-seamless-set.png",
      "/generated-products/underwear-seamless-set.png"
    ],
    shortDescription: "A featherweight thong for the smoothest finish possible.",
    description:
      "Minimal lines, ultra-light fabric, and a seamless feel created for fitted dresses and soft tailoring.",
    fabric: "83% nylon, 17% elastane",
    care: "Machine wash cold, delicate cycle.",
    compressionLevel: "Light",
    benefits: ["Invisible under garments", "Featherweight fabric", "Clean finish"],
    completeTheLook: ["ab-001", "ab-102"]
  },
  {
    id: "ab-004",
    slug: "curve-balance-tank-bodysuit",
    name: "Curve Balance Tank Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    price: 82,
    colors: [
      { name: "Clay", hex: "#b79f90" },
      { name: "Frost", hex: "#ecf1fb" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/generated-products/shapewear-bodysuit-black.png",
    hoverImage: "/generated-products/shapewear-bodysuit-black.png",
    gallery: [
      "/generated-products/shapewear-bodysuit-black.png",
      "/generated-products/shapewear-bodysuit-black.png",
      "/generated-products/shapewear-bodysuit-black.png"
    ],
    shortDescription: "A tank-style bodysuit with smoothing support through the torso.",
    description:
      "A flattering tank silhouette made to refine the waist and create a clean base layer under open shirting or suiting.",
    fabric: "76% nylon, 24% elastane",
    care: "Machine wash cold, dry flat.",
    compressionLevel: "Medium",
    benefits: ["Smooth neckline", "Balanced support", "Easy day-to-night styling"],
    completeTheLook: ["ab-201", "ab-101"]
  },
  {
    id: "ab-005",
    slug: "studio-sculpt-legging",
    name: "Studio Sculpt Legging",
    category: "shapewear",
    subcategory: "bottoms",
    price: 76,
    colors: [
      { name: "Pale Blue", hex: "#d5e2f5" },
      { name: "Midnight", hex: "#202833" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "/generated-products/shapewear-short-nude.png",
    hoverImage: "/generated-products/shapewear-short-nude.png",
    gallery: [
      "/generated-products/shapewear-short-nude.png",
      "/generated-products/shapewear-short-nude.png",
      "/generated-products/shapewear-short-nude.png"
    ],
    shortDescription: "A sleek full-length legging with a smoothing, sculpted waistband.",
    description:
      "Studio-ready stretch meets clean shaping details for a legging that can move from travel to training to everyday layering.",
    fabric: "71% nylon, 29% elastane",
    care: "Machine wash cold, line dry.",
    compressionLevel: "Medium",
    benefits: ["High recovery stretch", "Sculpted waistband", "Soft matte finish"],
    completeTheLook: ["ab-102", "ab-202"]
  },
  {
    id: "yx-001",
    slug: "seamless-coverage-bodysuit",
    name: "Seamless Coverage Bodysuit",
    category: "shapewear",
    subcategory: "bodysuits",
    badge: "New",
    price: 98,
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Nude", hex: "#d4b896" },
      { name: "Brown", hex: "#8b6f47" },
      { name: "Grey", hex: "#9a9a9a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Pink", hex: "#e8c4c4" }
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
    shortDescription: "Full coverage seamless bodysuit with firm compression and comfortable fit.",
    description:
      "A premium seamless bodysuit designed for all-day comfort with firm compression. Features a smooth, bonded edge design that eliminates visible panty lines while providing targeted support to the waist, hips, and thighs.",
    fabric: "80% nylon, 20% elastane",
    care: "Hand wash cold, lay flat to dry. Do not bleach or iron.",
    compressionLevel: "Firm",
    benefits: ["Seamless construction", "Full coverage design", "Targeted compression zones", "Bonded edges", "Breathable fabric"],
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
      { name: "Black", hex: "#1a1a1a" },
      { name: "Nude", hex: "#d4b896" },
      { name: "Brown", hex: "#8b6f47" },
      { name: "White", hex: "#f5f5f5" }
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
    shortDescription: "Adjustable strap bodysuit with medium compression for everyday wear.",
    description:
      "A versatile bodysuit with adjustable straps for a customized fit. The medium compression level makes it perfect for everyday wear, while the seamless construction ensures a smooth look under any outfit.",
    fabric: "78% nylon, 22% elastane",
    care: "Machine wash cold, gentle cycle. Do not tumble dry.",
    compressionLevel: "Medium",
    benefits: ["Adjustable straps", "Medium compression", "Seamless design", "Versatile styling", "All-day comfort"],
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
      { name: "Black", hex: "#1a1a1a" },
      { name: "Nude", hex: "#d4b896" },
      { name: "Brown", hex: "#8b6f47" },
      { name: "Grey", hex: "#9a9a9a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Pink", hex: "#e8c4c4" }
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
    shortDescription: "High waist bodysuit with firm compression for ultimate body sculpting.",
    description:
      "Our best-selling high waist bodysuit features firm compression technology that smooths and sculpts your silhouette. The high waist design provides extra coverage and support for the midsection, while the breathable fabric keeps you comfortable all day.",
    fabric: "82% nylon, 18% elastane",
    care: "Hand wash cold, lay flat to dry. Do not bleach.",
    compressionLevel: "Firm",
    benefits: ["High waist design", "Firm compression", "Body sculpting", "Extra midsection support", "Breathable material"],
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
      { name: "Black", hex: "#1a1a1a" },
      { name: "Nude", hex: "#d4b896" },
      { name: "Brown", hex: "#8b6f47" },
      { name: "Grey", hex: "#9a9a9a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Pink", hex: "#e8c4c4" }
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
    description:
      "Designed for those who prioritize comfort without sacrificing style, this light compression bodysuit features a seamless construction that feels like a second skin. Perfect for everyday wear and layering under any outfit.",
    fabric: "75% nylon, 25% elastane",
    care: "Machine wash cold, gentle cycle. Do not bleach or iron.",
    compressionLevel: "Light",
    benefits: ["Light compression", "Seamless feel", "All-day comfort", "Breathable fabric", "Versatile styling"],
    completeTheLook: ["yx-002", "yx-003"]
  }
];

export const categoryEntries = [
  {
    label: "Shapewear",
    href: "/shop?category=shapewear",
    image: "/generated-products/shapewear-bodysuit-black.png"
  },
  {
    label: "Underwear",
    href: "/shop?category=underwear",
    image: "/generated-products/underwear-seamless-set.png"
  },
  {
    label: "Bras",
    href: "/shop?category=bras",
    image: "/generated-products/bra-leopard-support.png"
  },
  {
    label: "Bodysuits",
    href: "/shop?category=shapewear&subcategory=bodysuits",
    image: "/generated-products/shapewear-bodysuit-black.png"
  },
  {
    label: "Tops",
    href: "/shop?category=shapewear&subcategory=tops",
    image: "/generated-products/shapewear-top-nude.png"
  },
  {
    label: "Bottoms",
    href: "/shop?category=shapewear&subcategory=bottoms",
    image: "/generated-products/shapewear-short-nude.png"
  }
];
