/**
 * Telegram Mini App (TMA) Integration Service
 * Manages Telegram WebApp SDK, User Context, Haptics, Direct Links & Bot Notifications
 */

class TelegramTmaService {
  constructor() {
    this.tg = window.Telegram?.WebApp || null;
    this.user = null;
    this.botUsername = "omnimini_shop_bot"; // Configured bot username
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

        // Get Telegram User
        const initData = this.tg.initDataUnsafe;
        if (initData && initData.user) {
          this.user = {
            id: initData.user.id,
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
        firstName: "Sokha (Merchant)",
        lastName: "Cambodia",
        username: "sokha_store_owner",
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

    // Also check URL query params for fallback testing (?startapp=xyz or #tgWebAppStartParam=xyz)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("startapp")) return urlParams.get("startapp");

    const hash = window.location.hash;
    if (hash.includes("tgWebAppStartParam=")) {
      const match = hash.match(/tgWebAppStartParam=([^&]+)/);
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
    return `https://t.me/${this.botUsername}/app?startapp=${storeSlug}`;
  }

  shareStoreToTelegram(store) {
    this.hapticImpact("light");
    const link = this.getTelegramStoreLink(store.slug || store.id);
    const text = encodeURIComponent(`🛍️ សូមស្វាគមន៍មកកាន់ Mini App ហាង ${store.name} លើ Telegram!\nចុច Link ខាងក្រោមដើម្បីកុម្ម៉ង់ និងទូទាត់តាម Bakong KHQR បានភ្លាមៗ៖\n${link}`);
    
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;

    if (this.tg && this.tg.openTelegramLink) {
      this.tg.openTelegramLink(telegramShareUrl);
    } else {
      window.open(telegramShareUrl, "_blank");
    }
  }

  // Send / Simulate Instant Order Alert to Merchant's Telegram Chat
  sendMerchantOrderNotification(order, store) {
    this.hapticNotification("success");

    // Telegram Bot Notification Banner Pop-up
    const notifContainer = document.getElementById("telegramOrderAlertBanner");
    if (notifContainer) {
      document.getElementById("tgAlertStoreName").textContent = store.name;
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
  }
}

window.telegramTma = new TelegramTmaService();
