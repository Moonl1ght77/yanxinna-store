import { RegionOption } from "@/types/locale";

export const regionOptions: RegionOption[] = [
  { region: "US", label: "United States", locale: "en-US", currency: "USD" },
  { region: "GB", label: "United Kingdom", locale: "en-GB", currency: "GBP" },
  { region: "FR", label: "France", locale: "fr-FR", currency: "EUR" },
  { region: "DE", label: "Germany", locale: "de-DE", currency: "EUR" }
];

export const copyByLocale = {
  "en-US": {
    promo: "Free shipping on orders over $120",
    heroTitle: "Shape your silhouette with calm confidence.",
    heroBody:
      "Modern shapewear, bras, and underwear designed to smooth, support, and move beautifully through the day.",
    heroCta: "Shop Shapewear",
    heroSecondary: "Explore Best Sellers",
    shapewearIntro: "Built around soft compression, smooth lines, and all-day comfort.",
    categoryLabel: "Shop by category",
    bestSellerTitle: "Best Sellers",
    philosophyTitle: "Made to feel sculpted, never restricted.",
    philosophyBody:
      "AURELLE BODY blends clean tailoring with technical fabrics so the fit feels polished, breathable, and quietly powerful.",
    fabricTitle: "Fabric and shaping benefits",
    fabricItems: ["Breathable stretch knit", "Targeted contour zones", "Seam-light finish", "Soft recovery support"],
    newsletterTitle: "Join the AURELLE list",
    newsletterBody: "Early access to launches, fit notes, and limited seasonal drops.",
    newsletterCta: "Subscribe",
    cartTitle: "Cart",
    checkoutTitle: "Checkout",
    completeLook: "Complete the Look",
    addToCart: "Add to Cart",
    mockPayment: "Pay with Mock Payment",
    stripePlaceholder: "Stripe Checkout endpoint reserved",
    loadMore: "Load More",
    reviews: "Reviews coming soon",
    sizeGuide: "Fits true to size. If between sizes, size up for easier entry."
  },
  "en-GB": {
    promo: "Complimentary shipping on orders over £120",
    heroTitle: "Shape your silhouette with calm confidence.",
    heroBody:
      "Modern shapewear, bras, and underwear designed to smooth, support, and move beautifully through the day.",
    heroCta: "Shop Shapewear",
    heroSecondary: "Explore Best Sellers",
    shapewearIntro: "Built around soft compression, smooth lines, and all-day comfort.",
    categoryLabel: "Shop by category",
    bestSellerTitle: "Best Sellers",
    philosophyTitle: "Made to feel sculpted, never restricted.",
    philosophyBody:
      "AURELLE BODY blends clean tailoring with technical fabrics so the fit feels polished, breathable, and quietly powerful.",
    fabricTitle: "Fabric and shaping benefits",
    fabricItems: ["Breathable stretch knit", "Targeted contour zones", "Seam-light finish", "Soft recovery support"],
    newsletterTitle: "Join the AURELLE list",
    newsletterBody: "Early access to launches, fit notes, and limited seasonal drops.",
    newsletterCta: "Subscribe",
    cartTitle: "Bag",
    checkoutTitle: "Checkout",
    completeLook: "Complete the Look",
    addToCart: "Add to Bag",
    mockPayment: "Pay with Mock Payment",
    stripePlaceholder: "Stripe Checkout endpoint reserved",
    loadMore: "Load More",
    reviews: "Reviews coming soon",
    sizeGuide: "Fits true to size. If between sizes, size up for easier entry."
  },
  "fr-FR": {
    promo: "Livraison offerte des 120 € d'achat",
    heroTitle: "Sculptez votre silhouette avec assurance.",
    heroBody:
      "Des pièces gainantes, soutiens-gorge et sous-vêtements pensés pour lisser, soutenir et accompagner chaque mouvement.",
    heroCta: "Découvrir le shapewear",
    heroSecondary: "Voir les best-sellers",
    shapewearIntro: "Conçus autour d'une compression douce, de lignes nettes et d'un confort durable.",
    categoryLabel: "Acheter par catégorie",
    bestSellerTitle: "Best-sellers",
    philosophyTitle: "Pensé pour sculpter, jamais contraindre.",
    philosophyBody:
      "AURELLE BODY associe lignes raffinées et matières techniques pour un tombé élégant, respirant et naturellement puissant.",
    fabricTitle: "Matières et bénéfices",
    fabricItems: ["Maille respirante", "Zones de contour ciblées", "Finition discrète", "Maintien souple"],
    newsletterTitle: "Rejoignez la liste AURELLE",
    newsletterBody: "Accès anticipé aux lancements, conseils de taille et capsules saisonnières.",
    newsletterCta: "S'inscrire",
    cartTitle: "Panier",
    checkoutTitle: "Paiement",
    completeLook: "Compléter le look",
    addToCart: "Ajouter au panier",
    mockPayment: "Payer avec Mock Payment",
    stripePlaceholder: "Point d'entrée Stripe Checkout réservé",
    loadMore: "Voir plus",
    reviews: "Avis à venir",
    sizeGuide: "Taille normalement. Entre deux tailles, prenez la taille au-dessus."
  },
  "de-DE": {
    promo: "Kostenloser Versand ab 120 €",
    heroTitle: "Forme deine Silhouette mit ruhiger Sicherheit.",
    heroBody:
      "Moderne Shapewear, Bras und Underwear, entwickelt für sanftes Glätten, Halt und angenehme Beweglichkeit.",
    heroCta: "Shapewear entdecken",
    heroSecondary: "Best Seller ansehen",
    shapewearIntro: "Entwickelt für weiche Kompression, klare Linien und ganztägigen Komfort.",
    categoryLabel: "Nach Kategorie shoppen",
    bestSellerTitle: "Best Seller",
    philosophyTitle: "Formend, nie einengend.",
    philosophyBody:
      "AURELLE BODY verbindet klare Linien mit technischen Stoffen für eine elegante, atmungsaktive und starke Passform.",
    fabricTitle: "Material und Formvorteile",
    fabricItems: ["Atmungsaktiver Stretch", "Gezielte Formzonen", "Nahtarmes Finish", "Sanfte Rückstellkraft"],
    newsletterTitle: "Zur AURELLE Liste anmelden",
    newsletterBody: "Früher Zugang zu Launches, Fit Notes und limitierten Drops.",
    newsletterCta: "Abonnieren",
    cartTitle: "Warenkorb",
    checkoutTitle: "Checkout",
    completeLook: "Look ergänzen",
    addToCart: "In den Warenkorb",
    mockPayment: "Mit Mock Payment bezahlen",
    stripePlaceholder: "Stripe Checkout Schnittstelle reserviert",
    loadMore: "Mehr laden",
    reviews: "Bewertungen folgen",
    sizeGuide: "Fällt regulär aus. Zwischen zwei Größen bitte größer wählen."
  }
} as const;
