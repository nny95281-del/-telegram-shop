/**
 * Telegram Mini App (TMA) Integration Service
 * Manages Telegram WebApp SDK, User Context, Haptics, Direct Links & Bot Notifications
 */

class TelegramTmaService {
  constructor() {
    this.tg = window.Telegram?.WebApp || null;
    this.user = null;
    this.botUsername = "omnimini_shop_bot";
    this.init();
  }

  init() {
    if (this.tg) {
      try {
        this.tg.ready();
        this.tg.expand();
        
        // Enable closing confirmation to prevent accidental swipes
        if (this.tg.enableClosingConfirmation) {
          this.tg.enableClosingConfirmation();
        }

        // Apply Telegram Theme Colors
        if (this.tg.themeParams) {
          document.documentElement.style.setProperty('--tg-bg', this.tg.themeParams.bg_color || '#0F172A');
          document.documentElement.style.setProperty('--tg-text', this.tg.themeParams.text_color || '#F8FAFC');
        }

        // Get Telegram User
        const initData = this.tg.initDataUnsafe;
        if (initData && initData.user) {
          this.user = {
            id: String(initData.user.id),
            firstName: initData.user.first_name,
            lastName: initData.user.last_name || "",
            username: initData.user.username || "",
            photoUrl: initData.user.photo_url || "",
            languageCode: initData.user.language_code || "km"
          };
        }
      } catch (e) {
        console.warn("Telegram WebApp initialization error:", e);
      }
    }

    // Fallback Mock User for Local Browser testing
    if (!this.user) {
      this.user = {
        id: "77889911",
        firstName: "Sokha",
        lastName: "Mean",
        username: "sokha_merchant",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        languageCode: "km"
      };
    }
  }

  isInsideTelegram() {
    return !!(this.tg && this.tg.initData);
  }

  getStartParam() {
    if (this.tg && this.tg.initDataUnsafe && this.tg.initDataUnsafe.start_param) {
      return this.tg.initDataUnsafe.start_param;
    }

    // Check URL query params for fallback testing (?startapp=xyz or ?store=xyz)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("startapp")) return urlParams.get("startapp");
    if (urlParams.has("store")) return urlParams.get("store");

    const hash = window.location.hash;
    if (hash.includes("tgWebAppStartParam=")) {
      const match = hash.match(/tgWebAppStartParam=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }
    if (hash.includes("store=")) {
      const match = hash.match(/store=([^&]+)/);
      if (match) return decodeURIComponent(match[1]);
    }

    return null;
  }

  // Telegram Haptic Vibrations
  hapticImpact(style = "medium") {
    try {
      if (this.tg && this.tg.HapticFeedback) {
        this.tg.HapticFeedback.impactOccurred(style); // 'light', 'medium', 'heavy', 'rigid', 'soft'
      } else if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    } catch (e) {}
  }

  hapticNotification(type = "success") {
    try {
      if (this.tg && this.tg.HapticFeedback) {
        this.tg.HapticFeedback.notificationOccurred(type); // 'error', 'success', 'warning'
      } else if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    } catch (e) {}
  }

  getTelegramStoreLink(storeSlug) {
    if (!storeSlug) return `https://t.me/${this.botUsername}`;
    return `https://t.me/${this.botUsername}?start=${encodeURIComponent(storeSlug)}`;
  }

  getTelegramDirectAppUrl(storeSlug) {
    if (!storeSlug) return `https://t.me/${this.botUsername}/app`;
    return `https://t.me/${this.botUsername}/app?startapp=${encodeURIComponent(storeSlug)}`;
  }

  getWebStoreLink(storeSlug) {
    return `https://telegram-shop-6m0d.onrender.com/#store=${storeSlug}`;
  }

  shareStoreToTelegram(store) {
    if (!store) return;
    this.hapticImpact("light");
    const tgBotLink = this.getTelegramStoreLink(store.slug || store.id);
    const storeName = store.nameKh || store.name;
    const text = encodeURIComponent(`🛍️ សូមស្វាគមន៍មកកាន់ Mini App **${storeName}**!\n\n👇 ចុច Link ខាងក្រោមដើម្បីបើក Mini App ក្នុង Telegram និងទូទាត់តាម Bakong KHQR បានភ្លាមៗ៖\n${tgBotLink}`);
    
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(tgBotLink)}&text=${text}`;

    if (this.tg && this.tg.openTelegramLink) {
      this.tg.openTelegramLink(telegramShareUrl);
    } else {
      window.open(telegramShareUrl, "_blank");
    }
  }

  // Send Instant Order Alert (In-App Banner + Backend Notification)
  sendMerchantOrderNotification(order, store) {
    this.hapticNotification("success");

    // 1. Show Instant In-App Slide Banner
    const notifContainer = document.getElementById("telegramOrderAlertBanner");
    if (notifContainer) {
      document.getElementById("tgAlertStoreName").textContent = store.nameKh || store.name;
      document.getElementById("tgAlertOrderId").textContent = `#${order.id}`;
      document.getElementById("tgAlertAmount").textContent = `$${order.total.toFixed(2)}`;
      document.getElementById("tgAlertCustomer").textContent = `${order.customer.name} (${order.customer.phone})`;
      document.getElementById("tgAlertAddress").textContent = order.customer.address;
      document.getElementById("tgAlertItems").textContent = order.items.map(i => `${i.qty}x ${i.name}`).join(", ");

      notifContainer.classList.add("show");
      
      if (window.khqrService) {
        window.khqrService.playSuccessSound();
      }

      setTimeout(() => {
        notifContainer.classList.remove("show");
      }, 7000);
    }

    // 2. Call Server Alert API if available
    try {
      fetch('/api/send-order-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, store })
      }).catch(() => {});
    } catch (e) {}
  }
}

window.telegramTma = new TelegramTmaService();
