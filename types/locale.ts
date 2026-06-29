export type LocaleCode = "ru-RU" | "en-US" | "fr-FR" | "de-DE" | "en-GB";

export type RegionOption = {
  region: string;
  label: string;
  locale: LocaleCode;
  currency: "RUB" | "USD" | "EUR" | "GBP";
};

export type CopyKeys = {
  // 通用
  promo: string;
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  heroSecondary: string;
  shapewearIntro: string;
  categoryLabel: string;
  bestSellerTitle: string;
  philosophyTitle: string;
  philosophyBody: string;
  fabricTitle: string;
  fabricItems: readonly string[];
  newsletterTitle: string;
  newsletterBody: string;
  newsletterCta: string;
  cartTitle: string;
  checkoutTitle: string;
  completeLook: string;
  addToCart: string;
  mockPayment: string;
  stripePlaceholder: string;
  loadMore: string;
  reviews: string;
  sizeGuide: string;

  // 导航
  navShapewear: string;
  navUnderwear: string;
  navBras: string;
  navNew: string;
  navBestsellers: string;
  navAllShapewear: string;
  navBodysuits: string;
  navTops: string;
  navBottoms: string;

  // 首页新增
  shapewearCategory: string;
  underwearCategory: string;
  brasCategory: string;
  bestsellersCategory: string;
  "new arrivalsCategory": string;
  shapewearDescription: string;
  underwearDescription: string;
  brasDescription: string;
  bestsellersDescription: string;
  studioTitle: string;
  studioDescription: string;
  watchCta: string;
  trendingTitle: string;
  brandStatement: string;

  // 服务特色
  serviceFastDelivery: string;
  serviceFastDeliveryBody: string;
  serviceEarlyAccess: string;
  serviceEarlyAccessBody: string;
  serviceContour: string;
  serviceContourBody: string;
  serviceReturns: string;
  serviceReturnsBody: string;
  serviceSoftCorrection: string;
  serviceSoftCorrectionBody: string;

  // 商店页面
  shopTitle: string;
  categoryShapewear: string;
  categoryUnderwear: string;
  categoryBras: string;
  categoryAll: string;
  subcategoryAll: string;
  subcategoryBodysuits: string;
  subcategoryTops: string;
  subcategoryBottoms: string;
  breadcrumbHome: string;
  breadcrumbShop: string;
  sortFeatured: string;
  sortBest: string;
  sortNew: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  itemsCount: string;
  noProducts: string;
  noProductsHint: string;
  resetFilters: string;

  // 购物车
  breadcrumbCart: string;
  cartEmpty: string;
  continueShopping: string;
  orderSummary: string;
  products: string;
  shipping: string;
  total: string;
  cartNote: string;
  checkout: string;

  // 页脚
  footerHelp: string;
  footerReturns: string;
  footerTrackOrder: string;
  footerSizeGuide: string;
  footerShipping: string;
  footerFaq: string;
  footerContact: string;
  footerStayUpdated: string;
  footerStayUpdatedBody: string;
  footerEmailPlaceholder: string;
  footerSubscribe: string;
  footerLegalNotice: string;
  footerMore: string;
  footerAbout: string;
  footerRewards: string;
  footerGiftCards: string;
  footerStores: string;
  footerPartners: string;
  footerCareers: string;
  footerJournal: string;
  footerCountry: string;

  // 结账页
  checkoutShippingLabel: string;
  checkoutPaymentLabel: string;

  // 结账成功页
  orderConfirmed: string;
  orderThankYou: string;
  orderReference: string;
  orderConfirmationNote: string;
  orderMockFlowNote: string;

  // 商品详情页
  color: string;
  size: string;
  quantityLabel: string;
  compressionLevel: string;
  series: string;
  materialCare: string;

  // Meta
  metaDescription: string;

  // 品牌故事
  brandStoryTitle: string;
  brandStorySubtitle: string;
  brandStoryCta: string;
  brandStoryFactoryTitle: string;
  brandStoryFactoryDesc: string;
  brandStoryPhilosophyTitle: string;
  brandStoryPhilosophyDesc: string;
  brandStoryQualityTitle: string;
  brandStoryQualityDesc: string;
};
