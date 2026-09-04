/**
 * OmniMini Full-Stack Server
 * Express Web App Server + Telegram Bot (Webhook & Polling Dual-Mode for 100% Uptime)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '8154757152:AAHG-4c8LdtbEzm6cbQ7-YOm_Kd5xrJpvBo';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://telegram-shop-6m0d.onrender.com';
const MERCHANT_CHAT_ID = process.env.MERCHANT_CHAT_ID || null;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram Mini App Iframe & CSP Security Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *;");
  next();
});

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname)));

// Health Check API (For Render, Uptime Robot, etc.)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OmniMini Telegram Mini App & Bot Server',
    webAppUrl: WEB_APP_URL,
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

// API: Send Real-Time Order Notification to Telegram Chat
app.post('/api/send-order-alert', async (req, res) => {
  try {
    const { order, store, targetChatId } = req.body;
    const chatId = targetChatId || MERCHANT_CHAT_ID;

    if (!chatId) {
      return res.json({ ok: true, notice: 'No target chat ID specified, alert shown in in-app TMA banner.' });
    }

    const itemsText = order.items.map(i => `• ${i.qty}x *${i.name}* ($${i.lineTotal.toFixed(2)})`).join('\n');
    const messageText = `🔔 *ការកុម្ម៉ង់ថ្មី (New Order Alert)!* 🚀\n\n` +
      `🏪 *ហាង:* ${store?.name || 'Omni Store'}\n` +
      `🧾 *លេខកូដ:* \`#${order.id}\`\n` +
      `💰 *សរុប:* *$${order.total.toFixed(2)}* (${Math.round(order.total * 4100).toLocaleString()} ៛)\n` +
      `💳 *វិធីទូទាត់:* ${order.paymentMethod} (${order.paymentStatus})\n\n` +
      `👤 *អតិថិជន:* ${order.customer.name} (${order.customer.phone})\n` +
      `📍 *អាសយដ្ឋាន:* ${order.customer.address}\n\n` +
      `📦 *ទំនិញដែលបានកុម្ម៉ង់:*\n${itemsText}\n\n` +
      `⏰ _កាលបរិច្ឆេទ: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}_`;

    const result = await telegramRequest('sendMessage', {
      chat_id: chatId,
      text: messageText,
      parse_mode: 'Markdown'
    });

    res.json({ ok: result.ok, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Process Telegram Updates (Handles /start, /start store_slug, /shop, /app)
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
    text = `👋 សួស្តី **${firstName || 'អតិថិជន'}**!\n\n` +
      `សូមស្វាគមន៍មកកាន់ **Mini App ហាងនៅលើ Telegram** 🛍️\n` +
      `អ្នកអាចជ្រើសរើសទំនិញ ដាក់កន្ត្រក និងទូទាត់តាម Bakong KHQR បានយ៉ាងងាយស្រួល។\n\n` +
      `👇 **សូមចុចប៊ូតុងខាងក្រោមដើម្បីចូលទិញទំនិញ៖**`;
    buttonText = '🛍️ ចូលទិញទំនិញក្នុងហាង (Open Store)';
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

// Telegram Webhook Handler (Wakes up Render immediately upon user message!)
app.post('/api/telegram-webhook', (req, res) => {
  const update = req.body;
  if (update && update.message) {
    handleTelegramMessage(update.message);
  }
  res.sendStatus(200);
});

// Setup Webhook or Long-Polling
let offset = 0;

async function pollBot() {
  if (!BOT_TOKEN) return;

  try {
    const res = await telegramRequest('getUpdates', {
      offset: offset,
      timeout: 20
    });

    if (res && res.ok && Array.isArray(res.result) && res.result.length > 0) {
      for (const update of res.result) {
        offset = update.update_id + 1;
        if (update.message) {
          await handleTelegramMessage(update.message);
        }
      }
    }
  } catch (err) {
    console.warn('[Bot Polling Error]:', err.message);
  }

  setTimeout(pollBot, 1000);
}

// Setup Menu Button & Webhook on Startup
async function initBot() {
  if (!BOT_TOKEN) return;

  try {
    // 1. Set Menu Button
    await telegramRequest('setChatMenuButton', {
      menu_button: {
        type: 'web_app',
        text: '🛍️ បើកហាង Mini App',
        web_app: {
          url: WEB_APP_URL
        }
      }
    });
    console.log(`✅ Telegram Menu Button configured -> ${WEB_APP_URL}`);

    // 2. Set Webhook if deployed on HTTPS (Render)
    if (WEB_APP_URL && WEB_APP_URL.startsWith('https://')) {
      const webhookUrl = `${WEB_APP_URL}/api/telegram-webhook`;
      const webhookRes = await telegramRequest('setWebhook', {
        url: webhookUrl,
        drop_pending_updates: true
      });
      console.log(`✅ Telegram Webhook registered -> ${webhookUrl} (${JSON.stringify(webhookRes)})`);
    } else {
      // Local fallback
      pollBot();
    }
  } catch (e) {
    console.warn('Bot setup warning:', e.message);
    pollBot();
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚀 OmniMini Server is running on port ${PORT}`);
  console.log(`🌐 Web App URL: ${WEB_APP_URL}`);
  console.log(`🤖 Telegram Webhook / Polling: Initializing...`);
  console.log(`======================================================`);

  initBot();
});
