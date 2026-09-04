/**
 * Mock Data for Default Stores in Super App Platform
 * High-Definition Curated Catalog with Verified HD Images
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
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=240&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
    theme: {
      primaryColor: "#0F766E",
      secondaryColor: "#14B8A6",
      accentColor: "#F59E0B",
      bgColor: "#0B0F19",
      textColor: "#F8FAFC",
      cardBg: "#111827",
      fontFamily: "'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif",
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
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop&q=80",
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
    logo: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=240&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    theme: {
      primaryColor: "#E11D48",
      secondaryColor: "#BE123C",
      accentColor: "#FB7185",
      bgColor: "#09090B",
      textColor: "#FAFAFA",
      cardBg: "#18181B",
      fontFamily: "'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif",
      borderRadius: "14px"
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
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
        description: "Full grain calfskin leather, vulcanized cushioned rubber sole.",
        descriptionKh: "ស្បែកគោសុទ្ធគុណភាពខ្ពស់ បាតជ័របត់បែនស្រួលដើរ។",
        options: []
      }
    ],
    paymentConfig: {
      khqrMerchantName: "ZANDO CAMBODIA",
      khqrBakongId: "zando_fashion@aba",
      khqrAccountId: "010 999 888",
      currency: "USD",
      usdRateToKhr: 4100,
      enableCod: true,
      enableKhqr: true
    },
    ordersCount: 128,
    rating: 4.8,
    deliveryFee: 1.50,
    estimatedMinutes: "25-35"
  }
];

// Multi-language localization dictionary
const I18N = {
  km: {
    superAppTitle: "OmniMini Platform",
    superAppSubtitle: "ប្រព័ន្ធបង្កើត Mini App ហាងលើ Telegram",
    exploreStores: "🛍️ រុករកហាង",
    merchantStudio: "🛠️ ស្តូឌីយោបង្កើតហាង",
    myOrders: "📦 ការកុម្ម៉ង់របស់ខ្ញុំ",
    createNewStore: "+ បង្កើត Mini App ហាងថ្មី",
    allCategories: "ទាំងអស់",
    allStores: "ហាងទាំងអស់",
    deliveryTime: "នាទី",
    openMiniApp: "ចូលទិញទំនិញ ➔",
    ordersCompleted: "ការកុម្ម៉ង់ជោគជ័យ",
    tabIdentity: "🎨 អត្តសញ្ញាណ & ពណ៌ (Theme)",
    tabBlocks: "🧱 ប្លុកទំព័រហាង (Layout)",
    tabProducts: "📦 មុខទំនិញ & Menu",
    tabPayment: "💳 គណនី Bakong KHQR",
    tabOrders: "📊 ការកុម្ម៉ង់ (Orders)",
    tabShare: "🔗 Telegram Link",
    presetThemes: "ជ្រើសរើស Theme ស្អាតៗរៀបចំស្រាប់ (Preset Themes):",
    storeNameLabel: "ឈ្មោះហាង (English):",
    storeNameKhLabel: "ឈ្មោះហាងជាភាសាខ្មែរ:",
    taglineLabel: "ពាក្យស្លោក/ការពិពណ៌នាខ្លី (English):",
    logoUrlLabel: "Logo Image URL:",
    bannerUrlLabel: "Banner Image URL:",
    themeColors: "កំណត់ពណ៌ម៉ាកយីហោ (Custom Colors):",
    itemAdded: "បានដាក់ចូលកន្ត្រក!",
    viewCart: "មើលកន្ត្រកទំនិញ",
    emptyCart: "កន្ត្រករបស់អ្នកទទេស្អាត",
    enterDetails: "សូមបំពេញឈ្មោះ លេខទូរស័ព្ទ និងអាសយដ្ឋានដឹកជញ្ជូន",
    orderConfirmed: "ការកុម្ម៉ង់ទទួលបានជោគជ័យ!",
    paidWithKhqr: "បានទូទាត់ប្រាក់តាម Bakong KHQR រួចរាល់!"
  },
  en: {
    superAppTitle: "OmniMini Platform",
    superAppSubtitle: "Telegram Mini App Store Builder",
    exploreStores: "🛍️ Explore Stores",
    merchantStudio: "🛠️ Merchant Studio",
    myOrders: "📦 My Orders",
    createNewStore: "+ Create Store",
    allCategories: "All",
    allStores: "All Stores",
    deliveryTime: "mins",
    openMiniApp: "Shop Now ➔",
    ordersCompleted: "orders",
    tabIdentity: "🎨 Branding & Theme",
    tabBlocks: "🧱 Page Layout",
    tabProducts: "📦 Products & Menu",
    tabPayment: "💳 Bakong KHQR Account",
    tabOrders: "📊 Orders Manager",
    tabShare: "🔗 Telegram Link",
    presetThemes: "Preset Curated Themes:",
    storeNameLabel: "Store Name (English):",
    storeNameKhLabel: "Store Name (Khmer):",
    taglineLabel: "Store Tagline:",
    logoUrlLabel: "Logo Image URL:",
    bannerUrlLabel: "Banner Image URL:",
    themeColors: "Custom Brand Colors:",
    itemAdded: "added to cart!",
    viewCart: "View Shopping Cart",
    emptyCart: "Your cart is empty",
    enterDetails: "Please enter your name, phone number, and address",
    orderConfirmed: "Order placed successfully!",
    paidWithKhqr: "Bakong KHQR payment verified successfully!"
  }
};
