/**
 * Main Application Coordinator & Router (with Telegram Mini App Support)
 */

class App {
  constructor() {
    this.currentView = "marketplace";
    this.init();
  }

  init() {
    // Bind global navigation
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.telegramTma) window.telegramTma.hapticImpact("light");
        const view = btn.dataset.view;
        this.switchView(view);
      });
    });

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.telegramTma) window.telegramTma.hapticImpact("light");
        const lang = btn.dataset.lang;
        window.storeEngine.setLanguage(lang);
      });
    });

    // Subscribe to engine changes
    window.storeEngine.subscribe((event, data) => {
      if (event === "lang_changed") {
        this.updateI18nLabels();
        this.renderCurrentView();
      } else if (event === "stores_updated") {
        this.updateOrderBadge();
        if (this.currentView === "marketplace") this.renderMarketplace();
      } else if (event === "orders_updated") {
        this.updateOrderBadge();
        if (this.currentView === "orders") this.renderOrdersView();
      }
    });

    // Handle hash change routing
    window.addEventListener("hashchange", () => this.handleHashRoute());

    // Check Telegram start_param (Direct Store Launch via Telegram Bot Link)
    this.checkTelegramStartParam();

    // Render Telegram User status
    this.renderTelegramUserBadge();

    // Initial render
    this.updateI18nLabels();
    this.updateOrderBadge();
  }

  checkTelegramStartParam() {
    if (window.telegramTma) {
      const startParam = window.telegramTma.getStartParam();
      if (startParam) {
        const store = window.storeEngine.getStoreBySlug(startParam) || window.storeEngine.getStoreById(startParam);
        if (store) {
          this.openStoreMiniApp(store.id);
          return;
        }
      }
    }
    this.handleHashRoute();
  }

  renderTelegramUserBadge() {
    const userContainer = document.getElementById("headerTelegramUser");
    if (!userContainer || !window.telegramTma || !window.telegramTma.user) return;

    const u = window.telegramTma.user;
    userContainer.innerHTML = `
      <div class="tg-user-pill" title="Telegram User ID: ${u.id}">
        <img src="${u.photoUrl}" class="tg-avatar-img" alt="${u.firstName}">
        <span>${u.username ? '@' + u.username : u.firstName}</span>
        <span class="tg-status-dot"></span>
      </div>
    `;
  }

  handleHashRoute() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      if (this.currentView !== "store") {
        this.switchView("marketplace");
      }
      return;
    }

    const params = new URLSearchParams(hash);
    if (params.has("store")) {
      const storeSlug = params.get("store");
      const store = window.storeEngine.getStoreBySlug(storeSlug) || window.storeEngine.getStoreById(storeSlug);
      if (store) {
        this.openStoreMiniApp(store.id);
        return;
      }
    }

    if (params.has("view")) {
      const v = params.get("view");
      this.switchView(v);
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    document.querySelectorAll(".view-container").forEach(c => c.style.display = "none");

    const targetEl = document.getElementById(`view_${viewName}`);
    if (targetEl) {
      targetEl.style.display = "block";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.renderCurrentView();
  }

  renderCurrentView() {
    switch (this.currentView) {
      case "marketplace":
        this.renderMarketplace();
        break;
      case "builder":
        window.storeBuilder.loadStore(window.storeBuilder.getCurrentStore()?.id);
        break;
      case "store":
        if (window.storeView.currentStore) {
          window.storeView.renderFullStore(window.storeView.currentStore);
        }
        break;
      case "orders":
        this.renderOrdersView();
        break;
    }
  }

  updateI18nLabels() {
    const lang = window.storeEngine.lang;
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const translated = window.storeEngine.t(key);
      if (translated) {
        if (el.tagName === "INPUT" && el.getAttribute("placeholder")) {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      }
    });
  }

  updateOrderBadge() {
    const orders = window.storeEngine.getAllOrders();
    const badge = document.getElementById("headerOrdersBadge");
    if (badge) {
      badge.textContent = orders.length;
      badge.style.display = orders.length > 0 ? "inline-block" : "none";
    }
  }

  renderMarketplace() {
    const stores = window.storeEngine.getAllStores();
    const grid = document.getElementById("marketplaceStoreGrid");
    if (!grid) return;

    const searchTerm = document.getElementById("marketplaceSearchInput")?.value.toLowerCase() || "";
    const activeCategory = document.querySelector(".cat-pill.active")?.dataset.category || "all";

    const filtered = stores.filter(s => {
      const matchCat = activeCategory === "all" || s.category === activeCategory;
      const matchSearch = !searchTerm || 
        s.name.toLowerCase().includes(searchTerm) || 
        (s.nameKh && s.nameKh.includes(searchTerm)) ||
        s.products.some(p => p.name.toLowerCase().includes(searchTerm));
      return matchCat && matchSearch;
    });

    const lang = window.storeEngine.lang;

    let html = filtered.map(store => {
      const sName = (lang === 'km' && store.nameKh) ? store.nameKh : store.name;
      const sTagline = (lang === 'km' && store.taglineKh) ? store.taglineKh : store.tagline;

      return `
        <div class="store-card">
          <div class="store-card-banner" style="background-image: url('${store.banner}');">
            <span class="store-card-category-badge">${store.category}</span>
          </div>
          <div class="store-card-body">
            <div class="store-avatar-row">
              <img src="${store.logo}" class="store-logo-img" alt="${sName}">
              <div class="store-rating-badge">★ ${store.rating || 4.9}</div>
            </div>
            <h3 class="store-title">${sName}</h3>
            <p class="store-tagline">${sTagline}</p>

            <div class="store-meta-pills">
              <span class="store-meta-item">🛵 $${(store.deliveryFee || 1).toFixed(2)}</span>
              <span>•</span>
              <span class="store-meta-item">⚡ ${store.estimatedMinutes || '20-30'} ${window.storeEngine.t("deliveryTime")}</span>
              <span>•</span>
              <span class="store-meta-item">🛍️ ${store.products.length} Items</span>
            </div>

            <div class="store-card-actions">
              <button class="btn btn-primary btn-sm btn-block" onclick="window.app.openStoreMiniApp('${store.id}')">
                ${window.storeEngine.t("openMiniApp")}
              </button>
              <button class="btn btn-telegram btn-sm" onclick="window.telegramTma.shareStoreToTelegram(window.storeEngine.getStoreById('${store.id}'))" title="Share to Telegram Chat">
                ✈️
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.app.openStoreInBuilder('${store.id}')" title="Edit in Merchant Studio">
                🛠️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    html += `
      <div class="create-store-card" onclick="window.app.openCreateStoreModal()">
        <div class="create-store-icon">+</div>
        <h3>${window.storeEngine.t("createNewStore")}</h3>
        <p>Launch your customized Telegram mini app store in under 2 minutes.</p>
      </div>
    `;

    grid.innerHTML = html;
  }

  filterMarketplaceCategory(catPillEl) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
    catPillEl.classList.add("active");
    this.renderMarketplace();
  }

  openStoreMiniApp(storeId) {
    const store = window.storeEngine.getStoreById(storeId);
    if (!store) return;

    if (window.telegramTma) window.telegramTma.hapticImpact("medium");

    window.storeView.setStore(store);
    this.switchView("store");
    window.location.hash = `store=${store.slug}`;
  }

  openStoreInBuilder(storeId) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    window.storeBuilder.setCurrentStore(storeId);
    this.switchView("builder");
  }

  openCreateStoreModal() {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    document.getElementById("createStoreModal").classList.add("active");
  }

  submitCreateStore() {
    const name = document.getElementById("newStoreName").value.trim();
    const nameKh = document.getElementById("newStoreNameKh").value.trim();
    const category = document.getElementById("newStoreCategory").value;
    const themeColor = document.getElementById("newStoreThemeColor").value;

    if (!name) {
      this.showToast("Please enter a store name", "warning");
      return;
    }

    const newStore = window.storeEngine.createStore({
      name,
      nameKh,
      category,
      primaryColor: themeColor
    });

    if (window.telegramTma) window.telegramTma.hapticNotification("success");

    document.getElementById("createStoreModal").classList.remove("active");
    document.getElementById("newStoreName").value = "";
    document.getElementById("newStoreNameKh").value = "";

    this.showToast("🎉 Telegram Store Mini App Created Successfully!", "success");
    this.openStoreInBuilder(newStore.id);
  }

  renderOrdersView() {
    const container = document.getElementById("ordersViewList");
    if (!container) return;

    const orders = window.storeEngine.getAllOrders();
    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <h3>No orders placed yet</h3>
          <p>Explore mini apps in the marketplace and place your first order!</p>
          <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="window.app.switchView('marketplace')">Explore Marketplace</button>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(ord => `
      <div class="store-card" style="margin-bottom: 1.25rem; padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
          <div>
            <h3 style="color: #FFFFFF; font-size: 1.05rem;">${ord.storeName}</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Order #${ord.id} • ${new Date(ord.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span style="font-size: 0.8rem; font-weight: 700; background: rgba(99, 102, 241, 0.2); color: #A5B4FC; padding: 0.3rem 0.7rem; border-radius: 99px;">
              ${ord.status}
            </span>
          </div>
        </div>

        <div style="margin-bottom: 0.75rem;">
          ${ord.items.map(i => `
            <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.3rem;">
              <span>${i.qty}x ${i.name} ${i.options?.length ? `<small>(${i.options.join(', ')})</small>` : ''}</span>
              <span style="color: #FFFFFF; font-weight: 600;">$${i.lineTotal.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Payment: <strong style="color: ${ord.paymentStatus === 'PAID' ? '#10B981' : '#F59E0B'}">${ord.paymentMethod} (${ord.paymentStatus})</strong>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-gold);">$${ord.total.toFixed(2)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${ord.totalKhr.toLocaleString()} ៛</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icons = { success: "✅", info: "ℹ️", warning: "⚠️", error: "❌" };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Global Boot
window.app = new App();
