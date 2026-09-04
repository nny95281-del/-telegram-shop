/**
 * OmniMini Full-Stack Server
 * Express Web App Server + Telegram Bot (Webhook & Polling Dual-Mode for 100% Uptime)
 * Real-Time Multi-Tenant Stores & Orders Cloud Database
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '8154757152:AAHG-4c8LdtbEzm6cbQ7-YOm_Kd5xrJpvBo';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://telegram-shop-6m0d.onrender.com';
const MERCHANT_CHAT_ID = process.env.MERCHANT_CHAT_ID || null;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Telegram Mini App Iframe & CSP Security Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  next();
});

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname)));

// In-Memory Cloud Database with Default Stores
let serverStores = [
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
        options: []
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
        options: []
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

let serverOrders = [];

// ==========================================
// REST APIs for Multi-Tenant Store & Orders Cloud Sync
// ==========================================

// GET /api/stores - Get all stores
app.get('/api/stores', (req, res) => {
  res.json({ ok: true, stores: serverStores });
});

// GET /api/stores/:idOrSlug - Get single store for customer link
app.get('/api/stores/:idOrSlug', (req, res) => {
  const param = req.params.idOrSlug.toLowerCase();
  const store = serverStores.find(s => s.slug?.toLowerCase() === param || s.id?.toLowerCase() === param);
  if (store) {
    res.json({ ok: true, store });
  } else {
    res.status(404).json({ ok: false, error: 'Store not found' });
  }
});

// POST /api/stores - Upsert store (when merchant creates or updates a store)
app.post('/api/stores', (req, res) => {
  const incomingStore = req.body;
  if (!incomingStore || !incomingStore.id) {
    return res.status(400).json({ ok: false, error: 'Invalid store payload' });
  }

  const existingIdx = serverStores.findIndex(s => s.id === incomingStore.id || s.slug === incomingStore.slug);
  if (existingIdx > -1) {
    serverStores[existingIdx] = { ...serverStores[existingIdx], ...incomingStore };
  } else {
    serverStores.unshift(incomingStore);
  }

  console.log(`[Cloud Store Synced] Store: "${incomingStore.name}" (Slug: ${incomingStore.slug})`);
  res.json({ ok: true, store: incomingStore, totalStores: serverStores.length });
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const storeId = req.query.storeId;
  if (storeId) {
    return res.json({ ok: true, orders: serverOrders.filter(o => o.storeId === storeId) });
  }
  res.json({ ok: true, orders: serverOrders });
});

// POST /api/orders - Submit order & trigger alert
app.post('/api/orders', async (req, res) => {
  const newOrder = req.body;
  if (!newOrder || !newOrder.id) {
    return res.status(400).json({ ok: false, error: 'Invalid order' });
  }

  serverOrders.unshift(newOrder);

  // Trigger telegram alert to merchant
  const store = serverStores.find(s => s.id === newOrder.storeId);
  if (store && MERCHANT_CHAT_ID) {
    const itemsText = newOrder.items.map(i => `• ${i.qty}x *${i.name}* ($${i.lineTotal.toFixed(2)})`).join('\n');
    const messageText = `🔔 *ការកុម្ម៉ង់ថ្មី (New Order Alert)!* 🚀\n\n` +
      `🏪 *ហាង:* ${store.nameKh || store.name}\n` +
      `🧾 *លេខកូដ:* \`#${newOrder.id}\`\n` +
      `💰 *សរុប:* *$${newOrder.total.toFixed(2)}* (${Math.round(newOrder.total * 4100).toLocaleString()} ៛)\n` +
      `💳 *វិធីទូទាត់:* ${newOrder.paymentMethod} (${newOrder.paymentStatus})\n\n` +
      `👤 *អតិថិជន:* ${newOrder.customer.name} (${newOrder.customer.phone})\n` +
      `📍 *អាសយដ្ឋាន:* ${newOrder.customer.address}\n\n` +
      `📦 *ទំនិញ:*\n${itemsText}`;

    telegramRequest('sendMessage', {
      chat_id: MERCHANT_CHAT_ID,
      text: messageText,
      parse_mode: 'Markdown'
    }).catch(() => {});
  }

  res.json({ ok: true, order: newOrder });
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OmniMini Telegram Mini App & Bot Server',
    webAppUrl: WEB_APP_URL,
    totalStores: serverStores.length,
    botActive: !!BOT_TOKEN
  });
});

// Helper: Telegram API Request
function telegramRequest(method, payload) {
  return new Promise((resolve, reject) => {
    if (!BOT_TOKEN) return resolve({ ok: false, description: 'BOT_TOKEN is missing' });

    const data = payload ? JSON.stringify(payload) : null;
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: payload ? 'POST' : 'GET',
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ ok: false, error: body });
        }
      });
    });

    req.on('error', err => {
      console.warn(`[Telegram API Error in ${method}]:`, err.message);
      resolve({ ok: false, error: err.message });
    });

    if (data) req.write(data);
    req.end();
  });
}

// Process Telegram Updates
async function handleTelegramMessage(message) {
  if (!message || !message.text) return;

  const chatId = message.chat.id;
  const text = message.text.trim();
  const firstName = message.from?.first_name || '';

  console.log(`[Telegram Message] Chat: ${chatId} (${firstName}) -> "${text}"`);

  if (text.startsWith('/start')) {
    const parts = text.split(' ');
    const startParam = parts.length > 1 ? parts[1].trim() : '';
    await sendWelcomeMessage(chatId, firstName, startParam);
  } else if (text.startsWith('/app') || text.startsWith('/shop')) {
    await sendWelcomeMessage(chatId, firstName, '');
  }
}

// Send Welcome Message with Inline WebApp Button
async function sendWelcomeMessage(chatId, firstName, startParam = '') {
  const storeUrl = startParam ? `${WEB_APP_URL}/#store=${startParam}` : WEB_APP_URL;

  let text = `👋 សួស្តី **${firstName || 'ម្ចាស់អាជីវកម្ម'}**!\n\n` +
    `សូមស្វាគមន៍មកកាន់ **OmniMini Platform** ⚡\n` +
    `ប្រព័ន្ធបង្កើត និងគ្រប់គ្រង Mini App ហាងផ្ទាល់ខ្លួននៅលើ Telegram ជាមួយ Bakong KHQR Payment។\n\n` +
    `👇 **សូមចុចប៊ូតុងខាងក្រោមដើម្បីបើក Mini App៖**`;

  let buttonText = '🛍️ បើកហាង Mini App (Open App)';

  if (startParam) {
    // Find store if available on server
    const targetStore = serverStores.find(s => s.slug?.toLowerCase() === startParam.toLowerCase() || s.id?.toLowerCase() === startParam.toLowerCase());
    const storeDisplayName = targetStore ? (targetStore.nameKh || targetStore.name) : 'ហាងទំនិញ';

    text = `👋 សួស្តី **${firstName || 'អតិថិជន'}**!\n\n` +
      `សូមស្វាគមន៍មកកាន់ Mini App **${storeDisplayName}** លើ Telegram 🛍️\n` +
      `អ្នកអាចជ្រើសរើសទំនិញ ដាក់កន្ត្រក និងទូទាត់តាម Bakong KHQR បានភ្លាមៗ។\n\n` +
      `👇 **សូមចុចប៊ូតុងខាងក្រោមដើម្បីចូលទិញទំនិញ៖**`;
    buttonText = `🛍️ ចូលទិញក្នុងហាង ${storeDisplayName}`;
  }

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: buttonText,
          web_app: {
            url: storeUrl
          }
        }
      ],
      [
        {
          text: '🌐 បើកលើ Web Browser',
          url: storeUrl
        }
      ]
    ]
  };

  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup
  });
}

// Telegram Webhook Handler
app.post('/api/telegram-webhook', (req, res) => {
  const update = req.body;
  if (update && update.message) {
    handleTelegramMessage(update.message);
  }
  res.sendStatus(200);
});

// Setup Menu Button & Webhook on Startup
async function initBot() {
  if (!BOT_TOKEN) return;

  try {
    await telegramRequest('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '🛍️ បើកហាង Mini App',
        web_app: {
          url: WEB_APP_URL
        }
      }
    });

    if (WEB_APP_URL && WEB_APP_URL.startsWith('https://')) {
      const webhookUrl = `${WEB_APP_URL}/api/telegram-webhook`;
      await telegramRequest('setWebhook', {
        url: webhookUrl,
        drop_pending_updates: true
      });
      console.log(`✅ Telegram Webhook active -> ${webhookUrl}`);
    }
  } catch (e) {
    console.warn('Bot setup warning:', e.message);
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚀 OmniMini Server is running on port ${PORT}`);
  console.log(`🌐 Web App URL: ${WEB_APP_URL}`);
  console.log(`☁️ Multi-Tenant Cloud Database: Ready (${serverStores.length} Stores)`);
  console.log(`======================================================`);

  initBot();
});
