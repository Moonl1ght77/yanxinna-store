const translations = {
  "ru-RU": {
    name: "Бесшовное боди",
    short_description: "Краткое описание",
    description: "Полное описание",
    badge: "Новинка",
    fabric: "80% нейлон, 20% эластан",
    care: "Ручная стирка",
    benefits: ["Бесшовная конструкция"],
    seo_title: "Бесшовное боди YANXINNA",
    seo_description: "Описание для поиска"
  },
  "en-US": {
    name: "Seamless Bodysuit",
    short_description: "Short description",
    description: "Full description",
    badge: "New",
    fabric: "80% nylon, 20% elastane",
    care: "Hand wash",
    benefits: ["Seamless construction"],
    seo_title: "YANXINNA Seamless Bodysuit",
    seo_description: "Search description"
  },
  "en-GB": {
    name: "Seamless Bodysuit",
    short_description: "Short description",
    description: "Full description",
    badge: "New",
    fabric: "80% nylon, 20% elastane",
    care: "Hand wash",
    benefits: ["Seamless construction"],
    seo_title: "YANXINNA Seamless Bodysuit",
    seo_description: "Search description"
  },
  "fr-FR": {
    name: "Body sans coutures",
    short_description: "Description courte",
    description: "Description complète",
    badge: "Nouveau",
    fabric: "80 % nylon, 20 % élasthanne",
    care: "Lavage à la main",
    benefits: ["Construction sans coutures"],
    seo_title: "Body sans coutures YANXINNA",
    seo_description: "Description pour la recherche"
  },
  "de-DE": {
    name: "Nahtloser Body",
    short_description: "Kurzbeschreibung",
    description: "Vollständige Beschreibung",
    badge: "Neu",
    fabric: "80 % Nylon, 20 % Elasthan",
    care: "Handwäsche",
    benefits: ["Nahtlose Konstruktion"],
    seo_title: "Nahtloser Body von YANXINNA",
    seo_description: "Beschreibung für die Suche"
  }
} as const;

export const validWordPressProduct = {
  id: 101,
  slug: "seamless-bodysuit",
  product_number: "YX-001",
  category: { id: 1, slug: "shapewear", name: "Shapewear" },
  subcategory: { id: 2, slug: "bodysuits", name: "Bodysuits" },
  main_image: {
    id: 201,
    url: "https://cms.example.com/uploads/main.webp",
    alt: "Seamless bodysuit"
  },
  hover_image: {
    id: 202,
    url: "https://cms.example.com/uploads/model.webp",
    alt: "Seamless bodysuit on model"
  },
  gallery: [
    {
      id: 201,
      url: "https://cms.example.com/uploads/main.webp",
      alt: "Seamless bodysuit"
    }
  ],
  sizes: [{ value: "XS" }, { value: "S" }],
  colors: [
    {
      hex: "#1a1a1a",
      image: {
        id: 201,
        url: "https://cms.example.com/uploads/main.webp",
        alt: "Black bodysuit"
      },
      hover_image: {
        id: 202,
        url: "https://cms.example.com/uploads/model.webp",
        alt: "Black bodysuit on model"
      },
      names: {
        "ru-RU": "Чёрный",
        "en-US": "Black",
        "en-GB": "Black",
        "fr-FR": "Noir",
        "de-DE": "Schwarz"
      }
    }
  ],
  parameters: [
    {
      labels: {
        "ru-RU": "Состав",
        "en-US": "Material",
        "en-GB": "Material",
        "fr-FR": "Matière",
        "de-DE": "Material"
      },
      values: {
        "ru-RU": "Нейлон",
        "en-US": "Nylon",
        "en-GB": "Nylon",
        "fr-FR": "Nylon",
        "de-DE": "Nylon"
      }
    }
  ],
  attachments: [
    {
      id: 301,
      url: "https://cms.example.com/uploads/specification.pdf",
      mime_type: "application/pdf",
      labels: {
        "ru-RU": "Спецификация",
        "en-US": "Specification",
        "en-GB": "Specification",
        "fr-FR": "Spécification",
        "de-DE": "Spezifikation"
      }
    }
  ],
  compression_level: "Firm",
  featured: true,
  best_seller: true,
  sort_order: 10,
  complete_the_look: ["YX-002"],
  translations
};

export const productWithoutMainImage = {
  ...validWordPressProduct,
  main_image: null
};
