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
  searchModalPlaceholder: string;
  searchPrompt: string;
  noMatchingPieces: string;
  topicsAnswered: string;
  faqOrdersDelivery: string;
  faqReturnsExchange: string;
  faqSizingGuide: string;
  faqCraftsmanshipFabrics: string;
  contactConciergeTitle: string;
  contactConciergeDesc: string;
  inquiryReceived: string;
  inquiryReceivedDesc: string;
  messageLabel: string;
  transmitInquiry: string;
  startLiveChat: string;
  liveChatTitle: string;
  liveChatStatus: string;
  liveChatWelcome: string;
  liveChatResponse: string;
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
  footerZiftaBranch: string;
  footerNahtayBranch: string;
  footerGharbiaEgypt: string;
  footerCopyright: string;
  privacyPolicy: string;
  termsOfSale: string;
  accessibility: string;
  sustainability: string;

  // Common UI Actions & Controls
  cancel: string;
  save: string;
  saveChanges: string;
  edit: string;
  close: string;
  search: string;
  actions: string;
  status: string;
  loading: string;
  saving: string;
  updating: string;
  all: string;
  members: string;
  vipMembers: string;
  standardMembers: string;
  standardMember: string;
  vip: string;
  points: string;
  orders: string;
  totalSpend: string;
  customer: string;
  adjustPoints: string;
  pointsAmount: string;
  addPoints: string;
  deductPoints: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  yes: string;
  no: string;
  items: string;
  item: string;
  quantity: string;
  qty: string;
  defaultBadgeText: string;
  pinnedOnMap: string;
  homeType: string;
  workType: string;
  otherType: string;
  saveCard: string;
  changeEmail: string;
  passwordStrength: string;
  strengthWeak: string;
  strengthFair: string;
  strengthGood: string;
  strengthStrong: string;
  redirectingToLogin: string;
  operationSuccessful: string;
  required: string;
  optional: string;
  valid: string;
  complete: string;
  selected: string;
  whatsapp: string;
  facebook: string;
  add: string;
  copied: string;
  copy: string;
  shopNow: string;

  // Auth & Activation Extensions
  emailOrPhone: string;
  registeredEmailOrPhone: string;
  activateAccount: string;
  activateNewAccount: string;
  enterSixDigitOtp: string;
  otpCode: string;
  resendCode: string;
  resendAvailableIn: string;
  verifyAndActivate: string;
  accountActivatedSuccess: string;
  invalidOrExpiredOtp: string;
  enterFullSixDigits: string;
  newActivationCodeSent: string;

  // Home & Promo Extensions
  loadingBespokeCollection: string;
  loadingLatestReleases: string;
  noNewArrivals: string;
  newArrivalsComingSoon: string;
  piecesInThisLook: string;
  exclusivePromoCode: string;
  dontShowAgainToday: string;

  // Account & VIP Extensions
  vipMembershipTitle: string;
  standardMembershipTitle: string;
  redeemablePointsBalance: string;
  availablePointsDiscount: string;
  loyaltyExplanation: string;
  vipQualification: string;
  doublePointsMultiplier: string;
  redeemPointsAtCheckout: string;
  expressCourierDelivery: string;
  noSavedAddresses: string;
  membershipTierLevel: string;
  vipExclusiveClient: string;
  availableLoyaltyPoints: string;
  exclusivePrivilegesDesc: string;

  // Cart & Shipping Extensions
  freeShippingAcrossEgypt: string;
  addForFreeShippingEgypt: string;
  emptyBag: string;
  giftNotePlaceholder: string;

  // Checkout & Maps Extensions
  chooseSavedAddressOrNew: string;
  detectGps: string;
  mapPicker: string;
  selectDeliveryAddress: string;
  savedAddressesCount: string;
  useDifferentOrNewAddress: string;
  enterNewAddressManualOrMap: string;
  gpsCoordinatesLinked: string;
  governorateCity: string;
  streetDetailedPlaceholder: string;
  streetDetailedLabel: string;
  lastPieceLeft: string;
  onlyLeftInStock: string;
  redeemLoyaltyPoints: string;
  pointsDiscountApplied: string;
  pointsToEarnOnOrder: string;
  paymentMethodTitle: string;
  selectPaymentOption: string;
  cashOnDelivery: string;
  availableAcrossEgypt: string;
  payWithPoints: string;
  insufficientPoints: string;
  fullPointsCoverage: string;
  directDeliveryEgypt: string;
  directDeliveryEgyptDesc: string;

  // Map & Help keys
  helpCenterDesc: string;
  startLiveChatAction: string;
  conciergeMessagePlaceholder: string;
  passwordMinLength: string;
  invalidEmail: string;
  shopTheLook: string;
  curatedEnsemble: string;

  // Map Picker Modal
  mapPickerModalTitle: string;
  mapPickerModalDesc: string;
  mapPickerPcNote: string;
  mapQuickRegions: string;
  mapSearchStreet: string;
  mapGoogleMapsLink: string;
  mapPasteLinkPrompt: string;
  mapSearchPlaceholder: string;
  mapConfirmedDetails: string;
  mapSelectedGovernorate: string;
  mapStreetDetailsLabel: string;
  mapConfirmLocation: string;
  
  // Reviews & Ratings
  clientReviews: string;
  ratingsAndReviews: string;
  writeReview: string;
  verifiedBuyer: string;
  recommendationRate: string;
  ratingBreakdown: string;
  clearFilter: string;
  noReviewsFound: string;
  noReviewsFoundDesc: string;
  firstReviewPrompt: string;
  writeFirstReview: string;
  overallRating: string;
  yourName: string;
  reviewTitle: string;
  reviewComment: string;
  submitReview: string;
  submittingReview: string;
  
  // Pagination
  showingResults: string;
  page: string;
  of: string;
  itemsPerPage: string;
  previousPage: string;
  nextPage: string;
}
