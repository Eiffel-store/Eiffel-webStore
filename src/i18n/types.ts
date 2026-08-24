export type Language = 'en' | 'ar';

export interface TranslationDictionary {
  // Auth & Client Portal
  signIn: string;
  register: string;
  signOut: string;
  fullName: string;
  password: string;
  phone: string;
  clientSignIn: string;
  createAccount: string;
  authSubtitle: string;
  demoAccounts: string;
  clientRole: string;
  staffRole: string;
  adminRole: string;
  adminLoginPrompt: string;
  adminPanel: string;
  adminPrivileges: string;
  openAdminPanel: string;
  verifying: string;
  accountCreatedSuccess: string;
  instantLogin: string;
  confirmRegister: string;
  forgotPasswordPrompt: string;
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  enterOtpTitle: string;
  enterOtpSubtitle: string;
  newPasswordTitle: string;
  newPasswordSubtitle: string;
  sendOtp: string;
  verifyOtp: string;
  resetPasswordButton: string;
  resendOtp: string;
  resendOtpIn: string;
  otpSentSuccess: string;
  otpVerifiedSuccess: string;
  passwordResetSuccess: string;
  confirmNewPassword: string;
  passwordMismatch: string;
  backToLogin: string;

  // Top Banner & Header
  topBannerPromo: string;
  topBannerLocations: string;
  help: string;
  atelier: string;
  
  // Navigation
  navMen: string;
  navKids: string;
  navAccessories: string;
  navCollection04: string;
  navJournal: string;
  navStores: string;
  navAccount: string;
  navWishlist: string;
  navBag: string;
  
  // Common Actions & Badges
  quickAdd: string;
  addToBag: string;
  addedToBag: string;
  expressCheckout: string;
  proceedToCheckout: string;
  viewAll: string;
  exploreCollection: string;
  viewLookbook: string;
  discover: string;
  newBadge: string;
  exclusiveBadge: string;
  selectSize: string;
  selectColor: string;
  colorway: string;
  size: string;
  sizeGuide: string;
  inStockNotice: string;
  reviews: string;
  
  // Homepage Sections
  heroSeason: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCampaign: string;
  heroLocation: string;
  heroFabrication: string;
  
  categoriesTitle: string;
  categoriesSubtitle: string;
  categoriesPieces: string;
  
  promoCapsule: string;
  promoTitle: string;
  promoDesc: string;
  promoTailoringNotice: string;
  acquirePiece: string;
  
  newArrivalsTitle: string;
  newArrivalsSubtitle: string;
  
  shopTheLookTitle: string;
  shopTheLookSubtitle: string;
  shopTheLookDesc: string;
  piecesInLook: string;
  
  philosophyTag: string;
  philosophyTitle: string;
  philosophyDesc: string;
  readJournal: string;
  
  kidsHighlightTag: string;
  kidsHighlightTitle: string;
  kidsHighlightDesc: string;
  exploreKids: string;
  
  // Catalog & Collections
  refineCollection: string;
  filters: string;
  subCategory: string;
  colorPalette: string;
  sortFeatured: string;
  sortPriceLow: string;
  sortPriceHigh: string;
  sortTopRated: string;
  showingSilhouettes: string;
  curatedCollection: string;
  clearAll: string;
  resetFilters: string;
  noPiecesFound: string;
  noPiecesFoundDesc: string;
  applyFilters: string;
  
  // Product Detail Page
  refNumber: string;
  madeInItaly: string;
  specsCraftsmanship: string;
  specsFabric: string;
  specsFit: string;
  composition: string;
  dyeingProcess: string;
  garmentCare: string;
  modelDimensions: string;
  stylistRecommendations: string;
  completeTheLook: string;
  measurementMatrix: string;
  measurementsFlatNotice: string;
  
  // Cart & Drawer
  shoppingBag: string;
  itemsReserved: string;
  freeShippingUnlocked: string;
  addForFreeShipping: string;
  emptyBagTitle: string;
  emptyBagDesc: string;
  exploreNewArrivals: string;
  promoCodePlaceholder: string;
  apply: string;
  remove: string;
  subtotal: string;
  privilegeDiscount: string;
  estimatedShipping: string;
  complimentary: string;
  estimatedTotal: string;
  viewFullBag: string;
  encryptionNotice: string;
  returnsNotice: string;
  giftBoxAdd: string;
  specialInstructions: string;
  
  // Checkout
  checkoutSecurityNotice: string;
  expressCheckoutTitle: string;
  orCompleteForm: string;
  stepContact: string;
  stepDelivery: string;
  stepShipping: string;
  stepPayment: string;
  emailLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  streetLabel: string;
  cityLabel: string;
  postalCodeLabel: string;
  countryLabel: string;
  phoneLabel: string;
  shippingPriorityTitle: string;
  shippingPriorityDesc: string;
  shippingWhiteGloveTitle: string;
  shippingWhiteGloveDesc: string;
  paymentCreditCard: string;
  paymentCOD: string;
  cardNumberLabel: string;
  cardExpiryLabel: string;
  cardCvcLabel: string;
  cardNameLabel: string;
  authorizeOrder: string;
  authenticating: string;
  bagSummary: string;
  taxesIncludedNotice: string;
  
  // Order Confirmation
  acquisitionConfirmed: string;
  orderThankYou: string;
  orderRef: string;
  estimatedDelivery: string;
  trackingId: string;
  totalCharged: string;
  destination: string;
  receiptNotice: string;
  viewInClientPortal: string;
  continueShopping: string;
  
  // Wishlist
  wishlistTitle: string;
  savedSilhouettes: string;
  noSavedPieces: string;
  noSavedPiecesDesc: string;
  moveToBag: string;
  clearAllSaved: string;
  
  // Account Portal
  welcomeClient: string;
  clientDashboard: string;
  membershipTier: string;
  privePoints: string;
  tabOverview: string;
  tabOrders: string;
  tabAddresses: string;
  tabPayments: string;
  recentOrders: string;
  viewAllOrders: string;
  noOrdersYet: string;
  clientProfile: string;
  memberSince: string;
  exclusivePrivileges: string;
  priveBenefitsTitle: string;
  savedAddressesTitle: string;
  addNewAddress: string;
  savedCardsTitle: string;
  addNewCard: string;
  defaultBadge: string;
  setDefault: string;
  delete: string;
  
  // Store Locator
  storeLocatorTitle: string;
  globalFlagships: string;
  storeLocatorDesc: string;
  bookAppointment: string;
  getDirections: string;
  activeSelection: string;
  scheduleFitting: string;
  appointmentModalTitle: string;
  appointmentBookedTitle: string;
  appointmentBookedDesc: string;
  preferredDate: string;
  timeSlot: string;
  confirmBooking: string;
  
  // Help Center
  helpCenterTitle: string;
  helpCenterSubtitle: string;
  searchFaqPlaceholder: string;
  topicsAnswered: string;
  contactConciergeTitle: string;
  contactConciergeDesc: string;
  inquiryReceived: string;
  inquiryReceivedDesc: string;
  messageLabel: string;
  transmitInquiry: string;
  startLiveChat: string;
  liveChatTitle: string;
  liveChatStatus: string;
  typeMessagePlaceholder: string;
  send: string;
  
  // Footer
  footerTrustShippingTitle: string;
  footerTrustShippingDesc: string;
  footerTrustReturnsTitle: string;
  footerTrustReturnsDesc: string;
  footerTrustCraftTitle: string;
  footerTrustCraftDesc: string;
  footerTrustSecurityTitle: string;
  footerTrustSecurityDesc: string;
  footerManifesto: string;
  footerJoinRegistry: string;
  footerJoinDesc: string;
  footerEmailPlaceholder: string;
  footerRegisteredSuccess: string;
  footerCollections: string;
  footerClientServices: string;
  footerMaisons: string;
  footerCopyright: string;
  privacyPolicy: string;
  termsOfSale: string;
  accessibility: string;
  sustainability: string;
}
