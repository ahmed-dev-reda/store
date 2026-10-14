import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Lang = "en" | "ar";

export type Dict = {
  store: string;
  products: string;
  myOrders: string;
  login: string;
  logout: string;
  cart: string;
  searchPlaceholder: string;
  allCategories: string;
  loading: string;
  noProducts: string;
  noProductsHint: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  shopNow: string;
  browseCatalog: string;
  featuredProducts: string;
  viewAll: string;
  noProductsAvailable: string;
  noProductsAvailableHint: string;
  welcome: string;
  welcomeDesc: string;
  fastShipping: string;
  fastShippingDesc: string;
  securePayment: string;
  securePaymentDesc: string;
  easyReturns: string;
  easyReturnsDesc: string;
  emptyCart: string;
  emptyCartHint: string;
  browseProducts: string;
  welcomeBack: string;
  signInToAccount: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  signIn: string;
  signingIn: string;
  invalidCredentials: string;
  noAccount: string;
  signUp: string;
  createAccount: string;
  signUpToStart: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  passwordMinLength: string;
  createAccountBtn: string;
  creating: string;
  passwordsDoNotMatch: string;
  registrationFailed: string;
  haveAccount: string;
  signInLink: string;
  // Checkout
  checkout: string;
  reviewOrder: string;
  orderItems: string;
  quantityShort: string;
  summary: string;
  itemsLabel: string;
  shipping: string;
  free: string;
  total: string;
  placeOrder: string;
  placingOrder: string;
  failedToPlaceOrder: string;
  addProductsBeforeCheckout: string;
  discountCode: string;
  discountPlaceholder: string;
  apply: string;
  applying: string;
  remove: string;
  discount: string;
  invalidDiscount: string;
  // Orders
  order: string;
  items: string;
  failedToLoadOrders: string;
  pleaseSignIn: string;
  signInToViewOrders: string;
  trackOrders: string;
  loadingOrders: string;
  noOrdersYet: string;
  ordersEmptyHint: string;
  startShopping: string;
  orderPlacedSuccess: string;
  thankYouForPurchase: string;
  placedOn: string;
  backToOrders: string;
  orderNumber: string;
  statusLabel: string;
  // Statuses
  PENDING: string;
  PROCESSING: string;
  DELIVERED: string;
  CANCELLED: string;
};

const dict: Record<Lang, Dict> = {
  en: {
    store: "Store",
    products: "Products",
    myOrders: "My Orders",
    login: "Login",
    logout: "Logout",
    cart: "Cart",
    searchPlaceholder: "Search products...",
    allCategories: "All Categories",
    loading: "Loading products...",
    noProducts: "No products found",
    noProductsHint: "Try a different search or category",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    shopNow: "Shop Now",
    browseCatalog: "Browse Catalog",
    featuredProducts: "Featured Products",
    viewAll: "View all",
    noProductsAvailable: "No products available yet",
    noProductsAvailableHint: "Check back soon for new arrivals.",
    welcome: "Welcome to our Store",
    welcomeDesc:
      "Discover amazing products at great prices. Shop with confidence with our secure checkout and fast shipping.",
    fastShipping: "Fast Shipping",
    fastShippingDesc: "Free delivery on all orders",
    securePayment: "Secure Payment",
    securePaymentDesc: "Your data is always protected",
    easyReturns: "Easy Returns",
    easyReturnsDesc: "30-day return policy",
    emptyCart: "Your cart is empty",
    emptyCartHint: "Looks like you haven't added anything yet.",
    browseProducts: "Browse Products",
    welcomeBack: "Welcome back",
    signInToAccount: "Sign in to your account",
    username: "Username",
    usernamePlaceholder: "Your username",
    password: "Password",
    passwordPlaceholder: "Your password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    invalidCredentials: "Invalid username or password",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    createAccount: "Create an account",
    signUpToStart: "Sign up to start shopping",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Repeat your password",
    passwordMinLength: "Minimum 8 characters",
    createAccountBtn: "Create Account",
    creating: "Creating...",
    passwordsDoNotMatch: "Passwords do not match",
    registrationFailed: "Registration failed",
    haveAccount: "Already have an account?",
    signInLink: "Sign in",
    checkout: "Checkout",
    reviewOrder: "Review your order and complete the purchase",
    orderItems: "Order Items",
    quantityShort: "Qty",
    summary: "Summary",
    itemsLabel: "Items",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    placeOrder: "Place Order",
    placingOrder: "Placing Order...",
    failedToPlaceOrder: "Failed to place order. Please try again.",
    addProductsBeforeCheckout: "Add some products before checking out.",
    discountCode: "Discount code",
    discountPlaceholder: "Enter promo code",
    apply: "Apply",
    applying: "Applying...",
    remove: "Remove",
    discount: "Discount",
    invalidDiscount: "Invalid or expired discount code",
    order: "Order",
    items: "items",
    failedToLoadOrders: "Failed to load orders",
    pleaseSignIn: "Please sign in",
    signInToViewOrders: "You need an account to view your orders.",
    trackOrders: "Track your order status and history",
    loadingOrders: "Loading orders...",
    noOrdersYet: "No orders yet",
    ordersEmptyHint: "When you place an order, it will show up here.",
    startShopping: "Start Shopping",
    orderPlacedSuccess: "Order placed successfully!",
    thankYouForPurchase: "Thank you for your purchase.",
    placedOn: "Placed on",
    backToOrders: "Back to orders",
    orderNumber: "Order",
    statusLabel: "Status",
    PENDING: "Pending",
    PROCESSING: "Processing",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  },
  ar: {
    store: "المتجر",
    products: "المنتجات",
    myOrders: "طلباتي",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    cart: "السلة",
    searchPlaceholder: "ابحث عن المنتجات...",
    allCategories: "كل التصنيفات",
    loading: "جاري تحميل المنتجات...",
    noProducts: "لا توجد منتجات",
    noProductsHint: "جرب بحث أو تصنيف مختلف",
    addToCart: "أضف للسلة",
    outOfStock: "نفذ",
    inStock: "متوفر",
    shopNow: "تسوق الآن",
    browseCatalog: "تصفح المنتجات",
    featuredProducts: "منتجات مميزة",
    viewAll: "عرض الكل",
    noProductsAvailable: "لا توجد منتجات متاحة حالياً",
    noProductsAvailableHint: "تابع قريباً للوصولات الجديدة.",
    welcome: "مرحباً بكم في متجرنا",
    welcomeDesc:
      "اكتشف منتجات رائعة بأسعار ممتازة. تسوق بثقة مع دفع آمن وشحن سريع.",
    fastShipping: "شحن سريع",
    fastShippingDesc: "توصيل مجاني لجميع الطلبات",
    securePayment: "دفع آمن",
    securePaymentDesc: "بياناتك محمية دائماً",
    easyReturns: "إرجاع سهل",
    easyReturnsDesc: "سياسة إرجاع 30 يوم",
    emptyCart: "سلتك فارغة",
    emptyCartHint: "يبدو أنك لم تضف أي شيء بعد.",
    browseProducts: "تصفح المنتجات",
    welcomeBack: "مرحباً بعودتك",
    signInToAccount: "سجل الدخول إلى حسابك",
    username: "اسم المستخدم",
    usernamePlaceholder: "اسم المستخدم الخاص بك",
    password: "كلمة المرور",
    passwordPlaceholder: "كلمة المرور الخاصة بك",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    createAccount: "إنشاء حساب",
    signUpToStart: "أنشئ حساباً لبدء التسوق",
    name: "الاسم",
    namePlaceholder: "اسمك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    confirmPassword: "تأكيد كلمة المرور",
    confirmPasswordPlaceholder: "أعد كتابة كلمة المرور",
    passwordMinLength: "8 أحرف على الأقل",
    createAccountBtn: "إنشاء الحساب",
    creating: "جاري الإنشاء...",
    passwordsDoNotMatch: "كلمتا المرور غير متطابقتين",
    registrationFailed: "فشل إنشاء الحساب",
    haveAccount: "لديك حساب بالفعل؟",
    signInLink: "تسجيل الدخول",
    checkout: "إتمام الشراء",
    reviewOrder: "راجع طلبك وأكمل الشراء",
    orderItems: "عناصر الطلب",
    quantityShort: "الكمية",
    summary: "الملخص",
    itemsLabel: "المنتجات",
    shipping: "الشحن",
    free: "مجاني",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    placingOrder: "جاري تأكيد الطلب...",
    failedToPlaceOrder: "فشل تأكيد الطلب. حاول مرة أخرى.",
    addProductsBeforeCheckout: "أضف بعض المنتجات قبل إتمام الشراء.",
    discountCode: "كود الخصم",
    discountPlaceholder: "أدخل كود الخصم",
    apply: "تطبيق",
    applying: "جاري التطبيق...",
    remove: "إزالة",
    discount: "الخصم",
    invalidDiscount: "كود خصم غير صالح أو منتهي",
    order: "طلب",
    items: "منتجات",
    failedToLoadOrders: "فشل تحميل الطلبات",
    pleaseSignIn: "يرجى تسجيل الدخول",
    signInToViewOrders: "تحتاج حساب لعرض طلباتك.",
    trackOrders: "تتبع حالة طلباتك",
    loadingOrders: "جاري تحميل الطلبات...",
    noOrdersYet: "لا توجد طلبات بعد",
    ordersEmptyHint: "عندما تطلب منتجات ستظهر هنا.",
    startShopping: "ابدأ التسوق",
    orderPlacedSuccess: "تم تأكيد الطلب بنجاح!",
    thankYouForPurchase: "شكراً لشرائك.",
    placedOn: "تاريخ الطلب",
    backToOrders: "العودة للطلبات",
    orderNumber: "طلب",
    statusLabel: "الحالة",
    PENDING: "قيد الانتظار",
    PROCESSING: "جاري التجهيز",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغي",
  },
};

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("store-lang");
  return stored === "ar" || stored === "en" ? stored : "en";
}

type LanguageState = {
  lang: Lang;
};

const initialState: LanguageState = {
  lang: getInitialLang(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<Lang>) {
      state.lang = action.payload;
    },
  },
});

export const { setLang } = languageSlice.actions;
export const getDict = (lang: Lang): Dict => dict[lang];
export default languageSlice.reducer;
