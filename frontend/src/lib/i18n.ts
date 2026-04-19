export type Locale = 'en' | 'mr' | 'hi';
export type TranslationKey =
  | 'appTitle'
  | 'appTagline'
  | 'languageLabel'
  | 'welcomeBackTitle'
  | 'welcomeBackSubtitle'
  | 'loginButton'
  | 'loggingIn'
  | 'registerNow'
  | 'loginWithVendorId'
  | 'loginErrorFillFields'
  | 'loginErrorCredentials'
  | 'uniqueVendorId'
  | 'password'
  | 'passwordPlaceholder'
  | 'registerHeader'
  | 'registerSubtitle'
  | 'registerButton'
  | 'registering'
  | 'registerSuccessTitle'
  | 'registerSuccessSubtitle'
  | 'uniqueVendorIdGenerated'
  | 'copyUniqueId'
  | 'pleaseSaveUniqueId'
  | 'alreadyRegistered'
  | 'switchToLogin'
  | 'fullName'
  | 'age'
  | 'email'
  | 'mobile'
  | 'shopName'
  | 'gstNo'
  | 'address'
  | 'city'
  | 'district'
  | 'state'
  | 'passwordConfirm'
  | 'shopDetailsHeading'
  | 'setPasswordHeading'
  | 'saveChanges'
  | 'logout'
  | 'exportExcel'
  | 'createYourBill'
  | 'inventoryTitle'
  | 'inventoryItems'
  | 'searchProducts'
  | 'addProduct'
  | 'cancel'
  | 'productName'
  | 'price'
  | 'quantity'
  | 'unit'
  | 'hsnCode'
  | 'actions'
  | 'noProductsYet'
  | 'noProductsMatch'
  | 'makeYourBill'
  | 'clearBill'
  | 'customerDetails'
  | 'phoneNumber'
  | 'addressLabel'
  | 'cgst'
  | 'sgst'
  | 'subTotal'
  | 'grandTotal'
  | 'generateInvoice'
  | 'invoiceGenerated'
  | 'addToBillPlaceholder'
  | 'invoiceDownloadSuccess'
  | 'billSavedError'
  | 'generating'
  | 'loadingProducts'
  | 'clearBillConfirm'
  | 'yesClearBill'
  | 'noProductsFoundAddInventory'
  | 'searchAndSelectProducts'
  | 'personalInformation'
  | 'shopInformation'
  | 'changePasswordOptional'
  | 'newPassword'
  | 'saveSuccess'
  | 'profileTitle'
  | 'profileShopName'
  | 'profileUniqueIdReadOnly'
  | 'languageSelectionHint'
  | 'totalProductsLabel'
  | 'todaysSalesLabel'
  | 'todaysBillsLabel'
  | 'totalBillsLabel';

export const DEFAULT_LOCALE: Locale = 'mr';
export const SUPPORTED_LOCALES: Locale[] = ['mr', 'en', 'hi'];

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    appTitle: 'BillCraft',
    appTagline: 'Professional Billing & Invoice Software',
    languageLabel: 'Language',
    welcomeBackTitle: 'Welcome Back',
    welcomeBackSubtitle: 'Login with your Unique Vendor ID',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    registerNow: 'Register Now',
    loginWithVendorId: 'Login with your Unique Vendor ID',
    loginErrorFillFields: 'Please fill in all fields.',
    loginErrorCredentials: 'Please enter the correct credentials.',
    uniqueVendorId: 'Unique Vendor ID',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    registerHeader: 'Register Your Shop',
    registerSubtitle: 'Fill in your details to get started',
    registerButton: 'Register & Get Vendor ID',
    registering: 'Registering...',
    registerSuccessTitle: 'Registration Successful!',
    registerSuccessSubtitle: 'Your unique Vendor ID has been generated. Save it — you\'ll need it to login.',
    uniqueVendorIdGenerated: 'Your Unique Vendor ID',
    copyUniqueId: 'Copy Vendor ID',
    pleaseSaveUniqueId: 'Please save this ID. You will need it to login. It cannot be recovered.',
    alreadyRegistered: 'Already registered?',
    switchToLogin: 'Login',
    fullName: 'Full Name',
    age: 'Age',
    email: 'Email',
    mobile: 'Mobile No.',
    shopName: 'Shop Name',
    gstNo: 'GST No.',
    address: 'Address',
    city: 'City',
    district: 'District',
    state: 'State',
    passwordConfirm: 'Confirm Password',
    shopDetailsHeading: 'Shop Details',
    setPasswordHeading: 'Set Password',
    saveChanges: 'Save Changes',
    logout: 'Logout',
    exportExcel: 'Export Excel',
    createYourBill: '✨ Create Your Bill',
    inventoryTitle: 'Inventory',
    inventoryItems: 'items',
    searchProducts: 'Search products...',
    addProduct: 'Add Product',
    cancel: 'Cancel',
    productName: 'Product Name',
    price: 'Price',
    quantity: 'Qty',
    unit: 'Unit',
    hsnCode: 'HSN Code',
    actions: 'Actions',
    noProductsYet: 'No products yet. Add your first product above!',
    noProductsMatch: 'No products match your search.',
    makeYourBill: 'Make Your Bill',
    clearBill: 'Clear Bill',
    customerDetails: 'Customer Details',
    phoneNumber: 'Phone Number',
    addressLabel: 'Address',
    cgst: 'CGST %',
    sgst: 'SGST %',
    subTotal: 'Sub Total',
    grandTotal: 'Grand Total',
    generateInvoice: 'Generate Invoice',
    invoiceGenerated: 'Invoice generated and downloaded!',
    addToBillPlaceholder: 'Search products to add to bill...',
    invoiceDownloadSuccess: 'Invoice generated and downloaded!',
    billSavedError: 'Failed to save bill. Please try again.',
    generating: 'Generating...',
    loadingProducts: 'Loading products...',
    clearBillConfirm: 'Are you sure you want to clear the current bill?',
    yesClearBill: 'Yes, Clear',
    noProductsFoundAddInventory: 'No products found. Add them to inventory first.',
    searchAndSelectProducts: 'Search and select products above to start billing',
    personalInformation: 'Personal Information',
    shopInformation: 'Shop Information',
    changePasswordOptional: 'Change Password (optional)',
    newPassword: 'New Password',
    saveSuccess: 'Saved ✓',
    profileTitle: 'Profile',
    profileShopName: 'Shop Name',
    profileUniqueIdReadOnly: 'Your Unique Vendor ID (cannot be changed)',
    languageSelectionHint: 'Set your preferred language inside profile',
    totalProductsLabel: 'Total Products',
    todaysSalesLabel: "Today's Sales",
    todaysBillsLabel: "Today's Bills",
    totalBillsLabel: 'Total Bills',
  },
  mr: {
    appTitle: 'बिलक्राफ्ट',
    appTagline: 'व्यावसायिक बिलिंग आणि चलन सॉफ्टवेअर',
    languageLabel: 'भाषा',
    welcomeBackTitle: 'परत स्वागत आहे',
    welcomeBackSubtitle: 'तुमच्या अद्वितीय विक्रेता आयडीने लॉगिन करा',
    loginButton: 'लॉगिन',
    loggingIn: 'लॉगिन करत आहे...',
    registerNow: 'आता नोंदणी करा',
    loginWithVendorId: 'तुमच्या अद्वितीय विक्रेता आयडीने लॉगिन करा',
    loginErrorFillFields: 'कृपया सर्व फील्ड भरा.',
    loginErrorCredentials: 'कृपया योग्य क्रेडेन्शियल प्रविष्ट करा.',
    uniqueVendorId: 'अद्वितीय विक्रेता आयडी',
    password: 'पासवर्ड',
    passwordPlaceholder: 'तुमचा पासवर्ड प्रविष्ट करा',
    registerHeader: 'तुमचा दुकान नोंदवा',
    registerSubtitle: 'सुरू करण्यासाठी तुमची माहिती भरा',
    registerButton: 'नोंदणी करा व विक्रेता आयडी मिळवा',
    registering: 'नोंदणी करत आहे...',
    registerSuccessTitle: 'नोंदणी यशस्वी झाली!',
    registerSuccessSubtitle: 'तुमचा अद्वितीय विक्रेता आयडी तयार झाला आहे. ते जतन करा — लॉगिनसाठी गरजेचे आहे.',
    uniqueVendorIdGenerated: 'तुमचा अद्वितीय विक्रेता आयडी',
    copyUniqueId: 'विक्रेता आयडी कॉपी करा',
    pleaseSaveUniqueId: 'कृपया हा आयडी जतन करा. लॉगिनसाठी हवे असेल. तो पुन्हा मिळणार नाही.',
    alreadyRegistered: 'आधीपासून नोंदणीकृत?',
    switchToLogin: 'लॉगिन',
    fullName: 'पूर्ण नाव',
    age: 'वय',
    email: 'ईमेल',
    mobile: 'मोबाइल क्रमांक',
    shopName: 'दुकानाचे नाव',
    gstNo: 'GST क्र.',
    address: 'पत्ता',
    city: 'शहर',
    district: 'जिल्हा',
    state: 'राज्य',
    passwordConfirm: 'पासवर्ड पुन्हा टाका',
    shopDetailsHeading: 'दुकानाची माहिती',
    setPasswordHeading: 'पासवर्ड सेट करा',
    saveChanges: 'बदल जतन करा',
    logout: 'बाहेर पडा',
    exportExcel: 'एक्सेल निर्यात करा',
    createYourBill: '✨ तुमचा बिल तयार करा',
    inventoryTitle: 'इन्व्हेंटरी',
    inventoryItems: 'आयटम्स',
    searchProducts: 'उत्पादने शोधा...',
    addProduct: 'उत्पादन जोडा',
    cancel: 'रद्द करा',
    productName: 'उत्पादनाचे नाव',
    price: 'किंमत',
    quantity: 'मात्रा',
    unit: 'युनिट',
    hsnCode: 'HSN कोड',
    actions: 'क्रिया',
    noProductsYet: 'अद्याप कोणतीही उत्पादने नाहीत. वर आपले पहिले उत्पादन जोडा!',
    noProductsMatch: 'तुमच्या शोधाशी कोणतीही उत्पादने जुळत नाहीत.',
    makeYourBill: 'बिल तयार करा',
    clearBill: 'बिल साफ करा',
    customerDetails: 'ग्राहक तपशील',
    phoneNumber: 'फोन नंबर',
    addressLabel: 'पत्ता',
    cgst: 'CGST %',
    sgst: 'SGST %',
    subTotal: 'उप एकूण',
    grandTotal: 'एकूण रक्कम',
    generateInvoice: 'चलन तयार करा',
    invoiceGenerated: 'चलन तयार झाले आणि डाउनलोड झाले!',
    addToBillPlaceholder: 'बिलमध्ये जोडण्यासाठी उत्पादने शोधा...',
    invoiceDownloadSuccess: 'चलन तयार झाले आणि डाउनलोड झाले!',
    billSavedError: 'बिल जतन करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
    generating: 'तयार केले जात आहे...',
    loadingProducts: 'उत्पादने लोड करत आहे...',
    clearBillConfirm: 'आपण सद्य बिल साफ करणार आहात का?',
    yesClearBill: 'होय, साफ करा',
    noProductsFoundAddInventory: 'कोणतीही उत्पादने सापडली नाहीत. कृपया आधी इन्व्हेंटरीमध्ये जोडा.',
    searchAndSelectProducts: 'बिलिंग सुरू करण्यासाठी वरील उत्पादन शोधा आणि निवडा',
    personalInformation: 'वैयक्तिक माहिती',
    shopInformation: 'दुकानाची माहिती',
    changePasswordOptional: 'पासवर्ड बदला (ऐच्छिक)',
    newPassword: 'नवा पासवर्ड',
    saveSuccess: 'जतन झाले ✓',
    profileTitle: 'प्रोफाइल',
    profileShopName: 'दुकानाचे नाव',
    profileUniqueIdReadOnly: 'तुमचा अद्वितीय विक्रेता आयडी (बदल केला जाऊ शकत नाही)',
    languageSelectionHint: 'प्रोफाइलमध्ये आपली पसंतीची भाषा सेट करा',
    totalProductsLabel: 'एकूण उत्पादने',
    todaysSalesLabel: 'आजचे विक्री',
    todaysBillsLabel: 'आजचे बिल',
    totalBillsLabel: 'एकूण बिल',
  },
  hi: {
    appTitle: 'बिलक्राफ्ट',
    appTagline: 'प्रोफ़ेशनल बिलिंग और इनवॉइस सॉफ़्टवेयर',
    languageLabel: 'भाषा',
    welcomeBackTitle: 'वापसी पर स्वागत है',
    welcomeBackSubtitle: 'अपने विशेष विक्रेता आईडी से लॉगिन करें',
    loginButton: 'लॉगिन',
    loggingIn: 'लॉगिन हो रहा है...',
    registerNow: 'अब रजिस्टर करें',
    loginWithVendorId: 'अपने विशेष विक्रेता आईडी से लॉगिन करें',
    loginErrorFillFields: 'कृपया सभी फ़ील्ड भरें।',
    loginErrorCredentials: 'कृपया सही क्रेडेंशियल दर्ज करें।',
    uniqueVendorId: 'विशिष्ट विक्रेता आईडी',
    password: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    registerHeader: 'अपनी दुकान रजिस्टर करें',
    registerSubtitle: 'शुरू करने के लिए अपनी जानकारी भरें',
    registerButton: 'रजिस्टर करें और विक्रेता आईडी प्राप्त करें',
    registering: 'रजिस्टर किया जा रहा है...',
    registerSuccessTitle: 'पंजीकरण सफल हुआ!',
    registerSuccessSubtitle: 'आपका विशिष्ट विक्रेता आईडी जनरेट हो गया है। इसे सेव करें — आपको लॉगिन के लिए इसकी ज़रूरत होगी।',
    uniqueVendorIdGenerated: 'आपका विशिष्ट विक्रेता आईडी',
    copyUniqueId: 'विक्रेता आईडी कॉपी करें',
    pleaseSaveUniqueId: 'कृपया इस आईडी को सेव करें। आपको लॉगिन के लिए इसकी ज़रूरत होगी। यह पुनर्प्राप्त नहीं किया जा सकता।',
    alreadyRegistered: 'पहले से पंजीकृत?',
    switchToLogin: 'लॉगिन',
    fullName: 'पूरा नाम',
    age: 'आयु',
    email: 'ईमेल',
    mobile: 'मोबाइल नंबर',
    shopName: 'दुकान का नाम',
    gstNo: 'GST क्र.',
    address: 'पता',
    city: 'शहर',
    district: 'जिला',
    state: 'राज्य',
    passwordConfirm: 'पासवर्ड की पुष्टि करें',
    shopDetailsHeading: 'दुकान का विवरण',
    setPasswordHeading: 'पासवर्ड सेट करें',
    saveChanges: 'बदलाव सहेजें',
    logout: 'लॉगआउट',
    exportExcel: 'एक्सेल निर्यात करें',
    createYourBill: '✨ अपना बिल बनाएं',
    inventoryTitle: 'इन्वेंटरी',
    inventoryItems: 'आइटम',
    searchProducts: 'उत्पाद खोजें...',
    addProduct: 'उत्पाद जोड़ें',
    cancel: 'रद्द करें',
    productName: 'उत्पाद का नाम',
    price: 'कीमत',
    quantity: 'मात्रा',
    unit: 'इकाई',
    hsnCode: 'HSN कोड',
    actions: 'क्रियाएँ',
    noProductsYet: 'कोई उत्पाद अभी तक नहीं। ऊपर अपना पहला उत्पाद जोड़ें!',
    noProductsMatch: 'आपकी खोज से कोई उत्पाद मेल नहीं खाता।',
    makeYourBill: 'अपना बिल बनाएं',
    clearBill: 'बिल साफ करें',
    customerDetails: 'ग्राहक विवरण',
    phoneNumber: 'फोन नंबर',
    addressLabel: 'पता',
    cgst: 'CGST %',
    sgst: 'SGST %',
    subTotal: 'उप कुल',
    grandTotal: 'कुल राशि',
    generateInvoice: 'इनवॉइस बनाएँ',
    invoiceGenerated: 'इनवॉइस बनाया गया और डाउनलोड किया गया!',
    addToBillPlaceholder: 'बिल में जोड़ने के लिए उत्पाद खोजें...',
    invoiceDownloadSuccess: 'इनवॉइस बनाया गया और डाउनलोड किया गया!',
    billSavedError: 'बिल सहेजने में विफल। कृपया फिर से प्रयास करें।',
    generating: 'बनाया जा रहा है...',
    loadingProducts: 'उत्पाद लोड हो रहे हैं...',
    clearBillConfirm: 'क्या आप वर्तमान बिल साफ करना चाहते हैं?',
    yesClearBill: 'हाँ, साफ करें',
    noProductsFoundAddInventory: 'कोई उत्पाद नहीं मिला। पहले उन्हें इन्वेंटरी में जोड़ें।',
    searchAndSelectProducts: 'बिलिंग शुरू करने के लिए ऊपर उत्पाद खोजें और चुनें',
    personalInformation: 'व्यक्तिगत जानकारी',
    shopInformation: 'दुकान की जानकारी',
    changePasswordOptional: 'पासवर्ड बदलें (वैकल्पिक)',
    newPassword: 'नया पासवर्ड',
    saveSuccess: 'सहेजा गया ✓',
    profileTitle: 'प्रोफ़ाइल',
    profileShopName: 'दुकान का नाम',
    profileUniqueIdReadOnly: 'आपका विशिष्ट विक्रेता आईडी (बदल नहीं सकता)',
    languageSelectionHint: 'प्रोफ़ाइल में अपनी पसंदीदा भाषा सेट करें',
    totalProductsLabel: 'कुल उत्पाद',
    todaysSalesLabel: 'आज की बिक्री',
    todaysBillsLabel: 'आज के बिल',
    totalBillsLabel: 'कुल बिल',
  },
};

export function translate(key: TranslationKey, locale: Locale): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function getStoredLocale(): Locale {
  const raw = localStorage.getItem('billcraft_locale');
  return raw === 'en' || raw === 'mr' || raw === 'hi' ? raw : DEFAULT_LOCALE;
}
