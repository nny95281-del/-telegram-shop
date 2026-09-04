/**
 * Mock Data for Default Stores in Super App Platform
 */

const DEFAULT_STORES = [
  {
    id: "store_koi_cafe",
    slug: "koi-artisan-cafe",
    name: "KOI & Artisan Café",
    nameKh: "ខេអូអាយ & អាទីសាន កាហ្វេ",
    tagline: "Specialty Coffee, Milk Tea & Fresh Croissants",
    taglineKh: "កាហ្វេពិសេស តែទឹកដោះគោ និងនំបុ័ងដុតស្រស់ៗ",
    category: "cafe",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
    theme: {
      primaryColor: "#0F766E",
      secondaryColor: "#14B8A6",
      accentColor: "#F59E0B",
      bgColor: "#0F172A",
      textColor: "#F8FAFC",
      cardBg: "#1E293B",
      fontFamily: "Inter, 'Kantumruy Pro', sans-serif",
      borderRadius: "16px"
    },
    blocks: [
      { id: "b_hero", type: "hero_banner", enabled: true, title: "Special Deal Today! ☕", subtitle: "Buy 2 Get 1 Free on all Signature Teas", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80" },
      { id: "b_announce", type: "announcement", enabled: true, text: "🎉 ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការកុម្ម៉ង់ចាប់ពី $10 ឡើងទៅក្នុងរាជធានីភ្នំពេញ!" },
      { id: "b_categories", type: "category_bar", enabled: true },
      { id: "b_featured", type: "featured_products", enabled: true, title: "ពេញនិយមប្រចាំសប្តាហ៍ / Best Sellers" },
      { id: "b_all", type: "product_grid", enabled: true, title: "មុខម្ហូប និងភេសជ្ជៈទាំងអស់ / All Menu" },
      { id: "b_contact", type: "store_info", enabled: true, address: "BKK1, St. 57, Phnom Penh", phone: "+855 12 888 999", telegram: "koicafe_kh" }
    ],
    categories: [
      { id: "cat_coffee", name: "Coffee / កាហ្វេ", icon: "☕" },
      { id: "cat_milktea", name: "Artisan Tea / តែទឹកដោះគោ", icon: "🧋" },
      { id: "cat_bakery", name: "Bakery / នំបុ័ង & នំខេក", icon: "🥐" },
      { id: "cat_snacks", name: "Snacks / អាហារសម្រន់", icon: "🍟" }
    ],
    products: [
      {
        id: "prod_1",
        categoryId: "cat_coffee",
        name: "Iced Caramel Macchiato",
        nameKh: "ខារ៉ាមែល ម៉ាគីយ៉ាតូ ទឹកកក",
        price: 3.50,
        originalPrice: 4.00,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80",
        description: "Espresso with vanilla syrup, steamed milk and topped with rich caramel drizzle.",
        descriptionKh: "កាហ្វេ espresso ជាមួយស៊ីរ៉ូវ៉ានីឡា ទឹកដោះគោ និងស្រោចដោយខារ៉ាមែលយ៉ាងឈ្ងុយឆ្ងាញ់។",
        badge: "HOT DEAL",
        options: [
          {
            name: "Size / ទំហំ",
            type: "radio",
            required: true,
            choices: [
              { label: "Medium (M)", priceModifier: 0 },
              { label: "Large (L)", priceModifier: 0.75 }
            ]
          },
          {
            name: "Sweetness / កម្រិតស្ករ",
            type: "radio",
            required: true,
            choices: [
              { label: "100% Sugar", priceModifier: 0 },
              { label: "50% Sugar", priceModifier: 0 },
              { label: "25% Sugar", priceModifier: 0 },
              { label: "0% No Sugar", priceModifier: 0 }
            ]
          },
          {
            name: "Toppings / ថែមបន្ថែម",
            type: "checkbox",
            required: false,
            choices: [
              { label: "Espresso Shot (+1)", priceModifier: 0.75 },
              { label: "Boba Pearls (+0.5$)", priceModifier: 0.50 },
              { label: "Cheese Cream Foam", priceModifier: 0.65 }
            ]
          }
        ]
      },
      {
        id: "prod_2",
        categoryId: "cat_milktea",
        name: "Golden Bubble Milk Tea",
        nameKh: "តែទឹកដោះគោ គជ់មាស",
        price: 3.25,
        originalPrice: 3.75,
        image: "https://images.unsplash.com/photo-1558857563-b37cf5c49129?w=500&auto=format&fit=crop&q=80",
        description: "Signature Black Tea blend with silky fresh milk and chewy artisan golden pearls.",
        descriptionKh: "តែខ្មៅរសជាតិដើម ទឹកដោះគោស្រស់ ជាមួយគ្រាប់គជ់មាសទន់ស្វិត។",
        badge: "BESTSELLER",
        options: [
          {
            name: "Size / ទំហំ",
            type: "radio",
            required: true,
            choices: [
              { label: "Regular", priceModifier: 0 },
              { label: "Large", priceModifier: 0.60 }
            ]
          },
          {
            name: "Ice Level / ទឹកកក",
            type: "radio",
            required: true,
            choices: [
              { label: "Normal Ice 100%", priceModifier: 0 },
              { label: "Less Ice 50%", priceModifier: 0 },
              { label: "No Ice", priceModifier: 0 }
            ]
          }
        ]
      },
      {
        id: "prod_3",
        categoryId: "cat_coffee",
        name: "Spanish Latte (Condensed Milk)",
        nameKh: "អេស្ប៉ាញឡាតេ (ទឹកដោះគោខាប់)",
        price: 3.80,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80",
        description: "Rich espresso combined with condensed milk and whole milk over crystal ice.",
        descriptionKh: "កាហ្វេ espresso ផ្សំជាមួយទឹកដោះគោខាប់ និងទឹកដោះគោស្រស់ រសជាតិដិតផ្អែមស្រទន់។",
        badge: "POPULAR",
        options: []
      },
      {
        id: "prod_4",
        categoryId: "cat_bakery",
        name: "Butter French Croissant",
        nameKh: "នំបុ័ង ក្រ្វាសង់ ប័រស្រស់បារាំង",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
        description: "Flaky, golden-baked Parisian croissant made with 100% French imported butter.",
        descriptionKh: "ក្រ្វាសង់ស្រួយស្រទាប់មាស ធ្វើពីប័របារាំងសុទ្ធ១០០% ឈ្ងុយឆ្ងាញ់។",
        options: []
      },
      {
        id: "prod_5",
        categoryId: "cat_bakery",
        name: "Basque Burnt Cheesecake",
        nameKh: "នំឈីសខេកដុត បាស្ក៍",
        price: 4.20,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=80",
        description: "Creamy interior with a beautifully caramelized exterior.",
        descriptionKh: "នំខេកឈីសរសជាតិទន់រលាយក្នុងមាត់ ជាមួយស្រទាប់ដុតយ៉ាងឈ្ងុយ។",
        options: []
      }
    ],
    paymentConfig: {
      khqrMerchantName: "KOI ARTISAN CAFE",
      khqrBakongId: "koi_cafe@aba",
      khqrAccountId: "000 888 777",
      currency: "USD",
      usdRateToKhr: 4100,
      enableCod: true,
      enableKhqr: true
    },
    ordersCount: 42,
    rating: 4.9,
    deliveryFee: 1.25,
    estimatedMinutes: "15-25"
  },
  {
    id: "store_zando_style",
    slug: "zando-urban-fashion",
    name: "ZANDO Urban Collection",
    nameKh: "ហាងសម្លៀកបំពាក់ ហ្សាន់ដូ",
    tagline: "Streetwear, Minimalist & Modern Casual Outfits",
    taglineKh: "ម៉ូដសម្លៀកបំពាក់ទាន់សម័យ បែបយុវវ័យ និងថ្លៃថ្នូរ",
    category: "fashion",
    logo: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    theme: {
      primaryColor: "#E11D48",
      secondaryColor: "#BE123C",
      accentColor: "#FB7185",
      bgColor: "#09090B",
      textColor: "#FAFAFA",
      cardBg: "#18181B",
      fontFamily: "Inter, 'Kantumruy Pro', sans-serif",
      borderRadius: "12px"
    },
    blocks: [
      { id: "b_hero", type: "hero_banner", enabled: true, title: "Summer Season Sale! 🔥", subtitle: "Up to 40% OFF on all New Arrivals", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80" },
      { id: "b_categories", type: "category_bar", enabled: true },
      { id: "b_all", type: "product_grid", enabled: true, title: "New Arrivals 2026" }
    ],
    categories: [
      { id: "cat_men", name: "Men / បុរស", icon: "👕" },
      { id: "cat_women", name: "Women / នារី", icon: "👗" },
      { id: "cat_shoes", name: "Footwear / ស្បែកជើង", icon: "👟" }
    ],
    products: [
      {
        id: "prod_z1",
        categoryId: "cat_men",
        name: "Oversized Heavyweight Cotton Tee",
        nameKh: "អាវយឺត Oversized កប្បាសសុទ្ធ",
        price: 16.50,
        originalPrice: 22.00,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
        description: "260 GSM breathable cotton with dropped shoulder silhouette.",
        descriptionKh: "សាច់ក្រណាត់កប្បាសក្រាស់ទន់ ត្រជាក់ស្រួលពាក់ ម៉ូដទាន់សម័យ។",
        badge: "SALE -25%",
        options: [
          {
            name: "Size",
            type: "radio",
            required: true,
            choices: [
              { label: "S", priceModifier: 0 },
              { label: "M", priceModifier: 0 },
              { label: "L", priceModifier: 0 },
              { label: "XL", priceModifier: 1.00 }
            ]
          },
          {
            name: "Color / ពណ៌",
            type: "radio",
            required: true,
            choices: [
              { label: "Onyx Black", priceModifier: 0 },
              { label: "Vintage Beige", priceModifier: 0 },
              { label: "Sage Green", priceModifier: 0 }
            ]
          }
        ]
      },
      {
        id: "prod_z2",
        categoryId: "cat_women",
        name: "Linen Relaxed Shirt",
        nameKh: "អាវសាច់ក្រណាត់ Linen នារី",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&auto=format&fit=crop&q=80",
        description: "Premium washed linen fabric, airy and elegant look.",
        descriptionKh: "សាច់ក្រណាត់ Linen ប្រណិត ស្រាលស្រួលពាក់ និងថ្លៃថ្នូរ។",
        badge: "NEW",
        options: []
      },
      {
        id: "prod_z3",
        categoryId: "cat_shoes",
        name: "Minimalist Leather Sneakers",
        nameKh: "ស្បែកជើងប៉ាតា ស្បែកប្រណិត",
        price: 45.00,
        originalPrice: 55.00,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=80",
        description: "Italian calfskin leather with memory foam cushioned sole.",
        descriptionKh: "ស្បែកគោទន់ ជាមួយទ្រនាប់បាតស្បែកជើង Memory Foam ដើរមិនឈឺជើង។",
        badge: "TOP PICK",
        options: []
      }
    ],
    paymentConfig: {
      khqrMerchantName: "ZANDO URBAN FASHION",
      khqrBakongId: "zando_fashion@acleda",
      khqrAccountId: "112 334 556",
      currency: "USD",
      usdRateToKhr: 4100,
      enableCod: true,
      enableKhqr: true
    },
    ordersCount: 89,
    rating: 4.8,
    deliveryFee: 1.50,
    estimatedMinutes: "30-45"
  },
  {
    id: "store_angkor_tech",
    slug: "angkor-tech-gadgets",
    name: "Angkor Tech & Gadgets",
    nameKh: "ហាងគ្រឿងអេឡិចត្រូនិច អង្គរតិច",
    tagline: "Smartphones, Wireless Audio & Smart Home Devices",
    taglineKh: "ទូរស័ព្ទ កាសឥតខ្សែ និងគ្រឿងបច្ចេកវិទ្យាទំនើបៗ",
    category: "electronics",
    logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    theme: {
      primaryColor: "#6366F1",
      secondaryColor: "#4F46E5",
      accentColor: "#A855F7",
      bgColor: "#030712",
      textColor: "#F9FAFB",
      cardBg: "#111827",
      fontFamily: "Inter, 'Kantumruy Pro', sans-serif",
      borderRadius: "14px"
    },
    blocks: [
      { id: "b_hero", type: "hero_banner", enabled: true, title: "Next-Gen Audio Experience 🎧", subtitle: "Active Noise Cancellation with 40h Battery", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80" },
      { id: "b_categories", type: "category_bar", enabled: true },
      { id: "b_all", type: "product_grid", enabled: true, title: "Featured Gadgets" }
    ],
    categories: [
      { id: "cat_audio", name: "Audio / កាស & ឧបករណ៍បំពងសម្លេង", icon: "🎧" },
      { id: "cat_chargers", name: "Power & Cables / ឆ្នាំងសាក & ខ្សែ", icon: "⚡" },
      { id: "cat_wearables", name: "Smartwatches / នាឡិកាឆ្លាតវៃ", icon: "⌚" }
    ],
    products: [
      {
        id: "prod_tech1",
        categoryId: "cat_audio",
        name: "Pro Wireless ANC Headphones",
        nameKh: "កាសឥតខ្សែ Pro កាត់បន្ថយសម្លេងរំខាន",
        price: 59.00,
        originalPrice: 79.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
        description: "Studio grade audio with 45dB hybrid ANC and ultra-low latency mode.",
        descriptionKh: "សម្លេងច្បាស់កម្រិត Studio កាត់បន្ថយសម្លេងរំខាន 45dB ថ្មកាន់បាន ៤០ ម៉ោង។",
        badge: "SALE",
        options: []
      },
      {
        id: "prod_tech2",
        categoryId: "cat_chargers",
        name: "65W GaN Fast Charger (3-Ports)",
        nameKh: "ឆ្នាំងសាកល្បឿនលឿន 65W GaN (រន្ធ៣)",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80",
        description: "Compact GaN technology charges laptops, phones, and tablets simultaneously.",
        descriptionKh: "បច្ចេកវិទ្យា GaN សាកថ្ម Laptop, ទូរស័ព្ទ និង Tablet បានក្នុងពេលតែមួយ។",
        options: []
      }
    ],
    paymentConfig: {
      khqrMerchantName: "ANGKOR TECH GADGETS",
      khqrBakongId: "angkortech@aba",
      khqrAccountId: "099 777 555",
      currency: "USD",
      usdRateToKhr: 4100,
      enableCod: true,
      enableKhqr: true
    },
    ordersCount: 154,
    rating: 4.95,
    deliveryFee: 1.00,
    estimatedMinutes: "20-40"
  }
];

// Translations dictionary (Khmer & English)
const I18N = {
  km: {
    superAppTitle: "OmniMini Platform",
    superAppSubtitle: "ផ្សារ Mini App អាជីវកម្ម និងប្រព័ន្ធបង្កើត Mini App ផ្ទាល់ខ្លួន",
    exploreStores: "🛍️ រុករកហាង (Marketplace)",
    merchantStudio: "🛠️ ស្ទូឌីយោបង្កើតហាង (Merchant Studio)",
    myOrders: "📦 ការកុម្ម៉ង់របស់ខ្ញុំ",
    createNewStore: "+ បង្កើត Mini App ហាងថ្មី",
    searchStores: "ស្វែងរកហាង ឬមុខទំនិញ...",
    allCategories: "ទាំងអស់",
    cafeCategory: "កាហ្វេ & ភេសជ្ជៈ",
    fashionCategory: "សម្លៀកបំពាក់",
    foodCategory: "ម្ហូបអាហារ",
    electronicsCategory: "អេឡិចត្រូនិច",
    openMiniApp: "ចូលហាង Mini App ➔",
    ordersCompleted: "ការកុម្ម៉ង់ជោគជ័យ",
    deliveryTime: "នាទី",
    storeBuilderTitle: "🛠️ Merchant Mini App Studio (ឧបករណ៍កែច្នៃហាង)",
    liveSimulator: "📱 Live Mobile Simulator (មើលផ្ទាល់)",
    tabIdentity: "🎨 អត្តសញ្ញាណ & ពណ៌ (Theme)",
    tabBlocks: "🧱 ប្លុកទំព័រហាង (Layout)",
    tabProducts: "📦 មុខទំនិញ & Menu",
    tabPayment: "💳 ទូទាត់ KHQR & Bakong",
    tabOrders: "📊 ការកុម្ម៉ង់ & ស្ថិតិ",
    tabShare: "🔗 QR Code & Share Link",
    saveChanges: "💾 រក្សាទុកការផ្លាស់ប្តូរ",
    storeNameLabel: "ឈ្មោះហាង (Store Name):",
    storeNameKhLabel: "ឈ្មោះហាងជាភាសាខ្មែរ:",
    taglineLabel: "ពាក្យស្លោក/ការពិពណ៌នាខ្លី:",
    logoUrlLabel: "តំណភ្ជាប់ Logo (Image URL):",
    bannerUrlLabel: "តំណភ្ជាប់ Banner ក្បាលទំព័រ:",
    themeColors: "🎨 កំណត់ពណ៌ម៉ាកយីហោ (Brand Theme Colors):",
    primaryColor: "ពណ៌ចម្បង (Primary)",
    secondaryColor: "ពណ៌រង (Secondary)",
    accentColor: "ពណ៌រំលេច (Accent)",
    bgColor: "ពណ៌ផ្ទៃខាងក្រោយ (Background)",
    cardBg: "ពណ៌ប្រអប់កាត (Card Bg)",
    presetThemes: "ជ្រើសរើស Theme ស្អាតៗរៀបចំស្រាប់ (Preset Themes):",
    themeEmerald: "Emerald Coffee (ត្បូងមរកត)",
    themeRose: "Rose Gold Fashion (ផ្កាកុលាប)",
    themeCyberpunk: "Cyber Violet Tech (ស្វាយទំនើប)",
    themeAmber: "Amber Bistro (មាសឆ្អៅ)",
    themeDarkMinimal: "Dark Luxe (ខ្មៅប្រណិត)",
    addProductBtn: "+ បន្ថែមទំនិញថ្មី",
    productName: "ឈ្មោះទំនិញ",
    productPrice: "តម្លៃ ($)",
    productCategory: "ប្រភេទ",
    actions: "សកម្មភាព",
    edit: "កែប្រែ",
    delete: "លុប",
    addToCart: "ដាក់ក្នុងកន្ត្រក",
    viewCart: "មើលកន្ត្រកទំនិញ",
    checkout: "ទូទាត់ប្រាក់ឥឡូវនេះ",
    total: "សរុប",
    subtotal: "តម្លៃទំនិញ",
    deliveryFeeLabel: "ថ្លៃដឹកជញ្ជូន",
    scanKhqrPay: "ស្កេនទូទាត់ជាមួយ Bakong KHQR",
    orPayCod: "ឬបង់ប្រាក់ផ្ទាល់ពេលទទួលទំនិញ (Cash on Delivery)",
    orderConfirmed: "ការកុម្ម៉ង់របស់អ្នកទទួលបានជោគជ័យ! 🎉",
    trackingStatus: "ស្ថានភាពកុម្ម៉ង់:",
    statusPending: "⏳ រង់ចាំការបញ្ជាក់",
    statusPreparing: "👨‍🍳 ហាងកំពុងរៀបចំទំនិញ",
    statusDelivering: "🛵 កំពុងដឹកជញ្ជូន",
    statusCompleted: "✅ បានទទួលទំនិញរួចរាល់",
    orderTime: "ម៉ោងកុម្ម៉ង់",
    customerName: "ឈ្មោះអតិថិជន",
    customerPhone: "លេខទូរស័ព្ទ",
    deliveryAddress: "អាសយដ្ឋានដឹកជញ្ជូន",
    notes: "ចំណាំបន្ថែម",
    confirmOrderBtn: "✅ បញ្ជាក់ការកុម្ម៉ង់",
    backToMarketplace: "⬅️ ត្រឡប់ទៅ Super App",
    shareStoreLink: "ចែករំលែក Link ហាង",
    copyLink: "ចម្លង Link",
    copied: "បានចម្លងរួចរាល់!",
    downloadQr: "ទាញយក QR Code ហាង",
    simulateOrderFlow: "សាកល្បងដំណើរការកុម្ម៉ង់",
    noProductsYet: "មិនទាន់មានទំនិញនៅឡើយទេ សូមបន្ថែមក្នុង Tab មុខទំនិញ!",
    emptyCart: "កន្ត្រករបស់អ្នកនៅទទេនៅឡើយ!",
    enterDetails: "សូមបញ្ចូលព័ត៌មានដឹកជញ្ជូន",
    paidWithKhqr: "បានទូទាត់តាម KHQR ជោគជ័យ ✅"
  },
  en: {
    superAppTitle: "OmniMini Platform",
    superAppSubtitle: "Business Mini App Directory & No-Code Mini App Builder",
    exploreStores: "🛍️ Discover Stores",
    merchantStudio: "🛠️ Merchant Studio",
    myOrders: "📦 My Orders",
    createNewStore: "+ Create Store Mini App",
    searchStores: "Search stores, products, or cuisines...",
    allCategories: "All Categories",
    cafeCategory: "Cafe & Drinks",
    fashionCategory: "Fashion & Style",
    foodCategory: "Food & Dining",
    electronicsCategory: "Electronics",
    openMiniApp: "Launch Mini App ➔",
    ordersCompleted: "Orders completed",
    deliveryTime: "mins",
    storeBuilderTitle: "🛠️ Merchant Mini App Studio (Customizer)",
    liveSimulator: "📱 Live Mobile Simulator",
    tabIdentity: "🎨 Identity & Theme",
    tabBlocks: "🧱 Page Layout Blocks",
    tabProducts: "📦 Menu & Products",
    tabPayment: "💳 KHQR & Payment",
    tabOrders: "📊 Orders & Stats",
    tabShare: "🔗 QR Code & Share",
    saveChanges: "💾 Save Changes",
    storeNameLabel: "Store Name (English):",
    storeNameKhLabel: "Store Name (Khmer):",
    taglineLabel: "Tagline / Short description:",
    logoUrlLabel: "Logo Image URL:",
    bannerUrlLabel: "Hero Banner URL:",
    themeColors: "🎨 Brand Theme Colors:",
    primaryColor: "Primary Color",
    secondaryColor: "Secondary Color",
    accentColor: "Accent Color",
    bgColor: "Background Color",
    cardBg: "Card Background",
    presetThemes: "Preset Curated Themes:",
    themeEmerald: "Emerald Cafe",
    themeRose: "Rose Gold Fashion",
    themeCyberpunk: "Cyber Violet Tech",
    themeAmber: "Amber Bistro",
    themeDarkMinimal: "Dark Luxe",
    addProductBtn: "+ Add New Product",
    productName: "Product Name",
    productPrice: "Price ($)",
    productCategory: "Category",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    addToCart: "Add to Cart",
    viewCart: "View Cart",
    checkout: "Proceed to Checkout",
    total: "Total",
    subtotal: "Subtotal",
    deliveryFeeLabel: "Delivery Fee",
    scanKhqrPay: "Scan to Pay with Bakong KHQR",
    orPayCod: "Or Pay with Cash on Delivery (COD)",
    orderConfirmed: "Your order has been placed successfully! 🎉",
    trackingStatus: "Order Status:",
    statusPending: "⏳ Pending Confirmation",
    statusPreparing: "👨‍🍳 Kitchen Preparing",
    statusDelivering: "🛵 Out for Delivery",
    statusCompleted: "✅ Delivered & Completed",
    orderTime: "Order Time",
    customerName: "Recipient Name",
    customerPhone: "Phone Number",
    deliveryAddress: "Delivery Address",
    notes: "Special Instructions",
    confirmOrderBtn: "✅ Place Order",
    backToMarketplace: "⬅️ Back to Super App",
    shareStoreLink: "Share Store Link",
    copyLink: "Copy Link",
    copied: "Copied to clipboard!",
    downloadQr: "Download Store QR",
    simulateOrderFlow: "Simulate Order Flow",
    noProductsYet: "No products added yet. Add some in the Products tab!",
    emptyCart: "Your cart is empty!",
    enterDetails: "Please fill in delivery details",
    paidWithKhqr: "KHQR Payment Verified ✅"
  }
};
