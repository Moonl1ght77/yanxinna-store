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

  // 工厂介绍
  factoryHeroTitle: string;
  factoryHeroDesc: string;
  factoryRequestSample: string;
  factoryHowWeWork: string;

  // 索取样品表单
  sampleFormTitle: string;
  sampleFormName: string;
  sampleFormEmail: string;
  sampleFormPhone: string;
  sampleFormDetails: string;
  sampleFormSubmit: string;

  // 能力与服务
  capabilitiesTitle: string;
  capabilitiesSubtitle: string;
  cap01Title: string;
  cap01Item1: string;
  cap01Item1Desc: string;
  cap01Item2: string;
  cap01Item2Desc: string;
  cap01Item3: string;
  cap01Item3Desc: string;
  cap02Title: string;
  cap02Item1: string;
  cap02Item1Desc: string;
  cap02Item2: string;
  cap02Item2Desc: string;
  cap02Item3: string;
  cap02Item3Desc: string;
  cap03Title: string;
  cap03Item1: string;
  cap03Item1Desc: string;
  cap03Item2: string;
  cap03Item2Desc: string;
  cap03Item3: string;
  cap03Item3Desc: string;

  // 合作模式
  partnershipTitle: string;
  partnershipSubtitle: string;
  partnership01Title: string;
  partnership01Subtitle: string;
  partnership01Desc: string;
  partnership01Features: string[];
  partnership02Title: string;
  partnership02Subtitle: string;
  partnership02Desc: string;
  partnership02Features: string[];
  partnership03Title: string;
  partnership03Subtitle: string;
  partnership03Desc: string;
  partnership03Features: string[];

  // 合作优势
  advantagesTitle: string;
  advantagesSubtitle: string;
  advItem1: string;
  advItem1Desc: string;
  advItem2: string;
  advItem2Desc: string;
  advItem3: string;
  advItem3Desc: string;
  advItem4: string;
  advItem4Desc: string;
  advItem5: string;
  advItem5Desc: string;
  advItem6: string;
  advItem6Desc: string;

  // 高性能面料
  fabricsTitle: string;
  fabricsSubtitle: string;
  fabric1: string;
  fabric1Desc: string;
  fabric2: string;
  fabric2Desc: string;
  fabric3: string;
  fabric3Desc: string;
  fabric4: string;
  fabric4Desc: string;

  // 制造技术
  technologyTitle: string;
  techSubtitle: string;
  techItem1: string;
  techItem1Desc: string;
  techItem2: string;
  techItem2Desc: string;
  techItem3: string;
  techItem3Desc: string;
  techItem4: string;
  techItem4Desc: string;
  techCta: string;

  // 质量保证
  qualityTitle: string;
  qualitySubtitle: string;
  quality01: string;
  quality01Desc: string;
  quality01Tag: string;
  quality02: string;
  quality02Desc: string;
  quality02Tag: string;
  quality03: string;
  quality03Desc: string;
  quality03Tag: string;
  qualityPolicy: string;
  qualityPolicyDesc: string;

  // 关于我们
  aboutTitle: string;
  aboutDesc: string;
  aboutCta1: string;
  aboutCta2: string;

  // 工作流程
  workflowTitle: string;
  workflowSubtitle: string;
  workflowStep1: string;
  workflowStep1Desc: string;
  workflowStep2: string;
  workflowStep2Desc: string;
  workflowStep3: string;
  workflowStep3Desc: string;
  workflowStep4: string;
  workflowStep4Desc: string;
  workflowStep5: string;
  workflowStep5Desc: string;
  workflowStep6: string;
  workflowStep6Desc: string;

  // FAQ
  faqTitle: string;
  faqSubtitle: string;
  faq1: string;
  faq2: string;
  faq3: string;
  faq4: string;
  faq5: string;
  faq6: string;
  faq7: string;
};
