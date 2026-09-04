/**
 * Main Application Coordinator & Smart 3-Tier Router
 * Separates Platform Marketplace, Merchant Studio & Pure Customer Storefront
 */

class App {
  constructor() {
    this.currentView = "marketplace";
    this.isCustomerDirectLaunch = false;
    this.detectInitialRoute();
    this.init();
  }

  detectInitialRoute() {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const pathname = window.location.pathname || "";

    let storeSlug = null;
    
    // Check search params
    const searchParams = new URLSearchParams(search);
    if (searchParams.has("store")) storeSlug = searchParams.get("store");
    if (searchParams.has("startapp")) storeSlug = searchParams.get("startapp");
    if (searchParams.has("tgWebAppStartParam")) storeSlug = searchParams.get("tgWebAppStartParam");

    // Check hash params
    if (!storeSlug && hash) {
      const cleanHash = hash.replace(/^#\/?/, "");
      if (cleanHash.startsWith("store=")) {
        storeSlug = cleanHash.replace("store=", "");
      } else {
        const hashParams = new URLSearchParams(cleanHash.includes("?") ? cleanHash.split("?")[1] : cleanHash);
        if (hashParams.has("store")) storeSlug = hashParams.get("store");
        if (hashParams.has("startapp")) storeSlug = hashParams.get("startapp");
        if (hashParams.has("tgWebAppStartParam")) storeSlug = hashParams.get("tgWebAppStartParam");
      }
    }

    // Check pathname (e.g. /store/mn-512 or /s/mn-512)
    if (!storeSlug && (pathname.includes("/store/") || pathname.includes("/s/"))) {
      const parts = pathname.split("/");
      storeSlug = parts[parts.length - 1];
    }

    // Check Telegram WebApp SDK start_param
    if (!storeSlug && window.telegramTma) {
      const startParam = window.telegramTma.getStartParam();
      if (startParam) storeSlug = startParam;
    }

    if (storeSlug) {
      this.isCustomerDirectLaunch = true;
      this.currentView = "store";
      document.body.classList.add("in-store-view", "customer-mode");
      
      const storeViewEl = document.getElementById("view_store");
      const marketViewEl = document.getElementById("view_marketplace");
      if (marketViewEl) marketViewEl.style.display = "none";
      if (storeViewEl) {
        storeViewEl.style.display = "block";
        const runtime = document.getElementById("storeRuntimeContainer");
        if (runtime) {
          runtime.innerHTML = `
            <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; color: #FFFFFF; background: #0B0F19;">
              <div style="width: 50px; height: 50px; border: 4px solid rgba(16, 185, 129, 0.2); border-top-color: #10B981; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1.25rem;"></div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.4rem;">កំពុងបើកដំណើរការហាង...</h3>
              <p style="font-size: 0.85rem; color: #94A3B8; max-width: 320px;">សូមរង់ចាំបន្តិច ប្រព័ន្ធកំពុងទាញយកទិន្នន័យ...</p>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
          `;
        }
      }
    }
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

    // Check Telegram start_param & URL Route
    this.handleHashRoute();

    // Render Telegram User status
    this.renderTelegramUserBadge();

    // Initial render
    this.updateI18nLabels();
    this.updateOrderBadge();
  }

  async checkTelegramStartParam() {
    return this.handleHashRoute();
  }

  renderTelegramUserBadge() {
    const userContainer = document.getElementById("headerTelegramUser");
    if (!userContainer || !window.telegramTma || !window.telegramTma.user) return;

    const u = window.telegramTma.user;
    userContainer.innerHTML = `
      <div class="tg-user-pill" title="Telegram User ID: ${u.id}">
        <img src="${u.photoUrl}" class="tg-avatar-img" alt="${u.firstName}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'">
        <span>${u.username ? '@' + u.username : u.firstName}</span>
        <span class="tg-status-dot"></span>
      </div>
    `;
  }

  async handleHashRoute() {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const pathname = window.location.pathname || "";

    let storeSlug = null;
    
    // Check search params
    const searchParams = new URLSearchParams(search);
    if (searchParams.has("store")) storeSlug = searchParams.get("store");
    if (searchParams.has("startapp")) storeSlug = searchParams.get("startapp");
    if (searchParams.has("tgWebAppStartParam")) storeSlug = searchParams.get("tgWebAppStartParam");

    // Check hash params
    if (!storeSlug && hash) {
      const cleanHash = hash.replace(/^#\/?/, "");
      if (cleanHash.startsWith("store=")) {
        storeSlug = cleanHash.replace("store=", "");
      } else {
        const hashParams = new URLSearchParams(cleanHash.includes("?") ? cleanHash.split("?")[1] : cleanHash);
        if (hashParams.has("store")) storeSlug = hashParams.get("store");
        if (hashParams.has("startapp")) storeSlug = hashParams.get("startapp");
        if (hashParams.has("tgWebAppStartParam")) storeSlug = hashParams.get("tgWebAppStartParam");
      }
    }

    // Check pathname (e.g. /store/mn-512 or /s/mn-512)
    if (!storeSlug && (pathname.includes("/store/") || pathname.includes("/s/"))) {
      const parts = pathname.split("/");
      storeSlug = parts[parts.length - 1];
    }

    // Check Telegram WebApp SDK start_param
    if (!storeSlug && window.telegramTma) {
      const startParam = window.telegramTma.getStartParam();
      if (startParam) storeSlug = startParam;
    }

    if (storeSlug) {
      this.isCustomerDirectLaunch = true;
      let store = window.storeEngine.getStoreBySlug(storeSlug) || window.storeEngine.getStoreById(storeSlug);
      
      if (!store) {
        store = await window.storeEngine.fetchStoreBySlugAsync(storeSlug);
      }

      if (store) {
        this.openStoreMiniApp(store.id, true);
        return;
      } else {
        // Render Store Not Found / Retry screen
        const runtime = document.getElementById("storeRuntimeContainer");
        if (runtime) {
          runtime.innerHTML = `
            <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; color: #FFFFFF; background: #0B0F19;">
              <div style="font-size: 3.5rem; margin-bottom: 1rem;">🏬</div>
              <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem; color: #FFFFFF;">រកមិនឃើញហាង "${storeSlug}" នេះទេ</h3>
              <p style="font-size: 0.85rem; color: #94A3B8; max-width: 320px; margin-bottom: 1.5rem;">សូមពិនិត្យមើល Link ម្តងទៀត ឬព្យាយាមចុច Refresh ឡើងវិញ។</p>
              <div style="display: flex; gap: 0.75rem;">
                <button class="btn btn-primary" onclick="window.location.reload()">🔄 ព្យាយាមម្តងទៀត (Retry)</button>
              </div>
            </div>
          `;
        }
        return;
      }
    }

    const cleanHash = hash.replace(/^#\/?/, "");
    const params = new URLSearchParams(cleanHash.includes("?") ? cleanHash.split("?")[1] : cleanHash);
    if (params.has("view")) {
      const v = params.get("view");
      this.switchView(v);
    } else if (!this.isCustomerDirectLaunch && this.currentView !== "store") {
      this.switchView("marketplace");
    }
  }

  switchView(viewName) {
    this.currentView = viewName;

    if (viewName === "store") {
      document.body.classList.add("in-store-view");
      if (this.isCustomerDirectLaunch) {
        document.body.classList.add("customer-mode");
      }
    } else {
      document.body.classList.remove("in-store-view", "customer-mode");
    }

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
              <img src="${store.logo}" class="store-logo-img" alt="${sName}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&auto=format&fit=crop&q=80'">
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

  openStoreMiniApp(storeId, isDirect = false) {
    const store = window.storeEngine.getStoreById(storeId);
    if (!store) return;

    if (window.telegramTma) window.telegramTma.hapticImpact("medium");

    if (isDirect) {
      this.isCustomerDirectLaunch = true;
    }

    window.storeView.setStore(store);
    this.switchView("store");
    window.location.hash = `store=${store.slug}`;
  }

  openStoreInBuilder(storeId) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    this.isCustomerDirectLaunch = false;
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
        <div style="text-align: center; color: var(--text-muted); padding: 4rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">📦</div>
          <h3 style="font-size: 1.25rem; color: #FFFFFF; font-weight: 800; margin-bottom: 0.5rem;">មិនទាន់មានការកុម្ម៉ង់នៅឡើយទេ</h3>
          <p style="font-size: 0.88rem; color: #94A3B8; max-width: 320px; margin: 0 auto 1.5rem auto;">រុករកទំនិញក្នុងហាង និងធ្វើការកុម្ម៉ង់ដំបូងរបស់អ្នកឥឡូវនេះ!</p>
          <button class="btn btn-primary" onclick="window.app.switchView('marketplace')">🛍️ រុករកហាងទំនិញ</button>
        </div>
      `;
      return;
    }

    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

    let summaryHtml = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 14px; padding: 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #A5B4FC; font-weight: 700; text-transform: uppercase;">Orders</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${orders.length}</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #10B981; font-weight: 700; text-transform: uppercase;">សរុបប្រាក់</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: #10B981;">$${totalSpent.toFixed(2)}</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 14px; padding: 0.85rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #F59E0B; font-weight: 700; text-transform: uppercase;">ស្ថានភាព</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #F59E0B; margin-top: 0.3rem;">⚡ LIVE</div>
        </div>
      </div>
    `;

    container.innerHTML = summaryHtml + orders.map(ord => {
      const isDelivering = ord.status === 'DELIVERING';
      const isCompleted = ord.status === 'COMPLETED';
      const statusColor = isCompleted ? '#10B981' : (isDelivering ? '#38BDF8' : '#F59E0B');
      const statusBg = isCompleted ? 'rgba(16, 185, 129, 0.15)' : (isDelivering ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)');

      return `
        <div class="store-card" style="margin-bottom: 1.25rem; padding: 1.25rem; border-radius: 18px; background: var(--bg-surface); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <h3 style="color: #FFFFFF; font-size: 1.1rem; font-weight: 800; margin-bottom: 0.15rem;">${ord.storeName}</h3>
              <span style="font-size: 0.75rem; color: var(--text-muted);">#${ord.id} • ${new Date(ord.createdAt).toLocaleTimeString()} (${new Date(ord.createdAt).toLocaleDateString()})</span>
            </div>
            <span style="font-size: 0.78rem; font-weight: 800; background: ${statusBg}; color: ${statusColor}; padding: 0.35rem 0.75rem; border-radius: 99px; border: 1px solid ${statusColor}40;">
              ${isDelivering ? '🛵 ' : (isCompleted ? '✅ ' : '⏳ ')}${ord.status}
            </span>
          </div>

          <div style="margin-bottom: 0.85rem; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 10px;">
            ${ord.items.map(i => `
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #E2E8F0; margin-bottom: 0.35rem;">
                <span>${i.qty}x <strong>${i.name}</strong> ${i.options?.length ? `<small style="color:#94A3B8;">(${i.options.join(', ')})</small>` : ''}</span>
                <span style="color: #FFFFFF; font-weight: 700;">$${i.lineTotal.toFixed(2)}</span>
              </div>
            `).join('')}
            <div style="border-top: 1px dashed rgba(255,255,255,0.08); margin-top: 0.4rem; padding-top: 0.4rem; display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
              <span>ថ្លៃដឹកជញ្ជូន:</span>
              <span>$${(ord.deliveryFee || 0).toFixed(2)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
            <div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                វិធីទូទាត់: <strong style="color: ${ord.paymentStatus === 'PAID' ? '#10B981' : '#F59E0B'}">${ord.paymentMethod} (${ord.paymentStatus})</strong>
              </div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #F59E0B; margin-top: 0.15rem;">
                $${ord.total.toFixed(2)} <small style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${ord.totalKhr.toLocaleString()} ៛)</small>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" style="border-radius: 10px; padding: 0.45rem 0.85rem;" onclick="window.storeView.showOrderTrackingModal(window.storeEngine.getAllOrders().find(o => o.id === '${ord.id}'))">
              👁️ តាមដាន (Track)
            </button>
          </div>
        </div>
      `;
    }).join('');
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
