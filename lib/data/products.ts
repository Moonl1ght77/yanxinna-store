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
