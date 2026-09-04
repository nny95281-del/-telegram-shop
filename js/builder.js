/**
 * Merchant Studio / Store Builder Logic (with Telegram Mini App Integration)
 */

class StoreBuilder {
  constructor() {
    this.currentStoreId = null;
    this.currentTab = "identity";
    this.editingProductId = null;
    this.init();
  }

  init() {
    // Listen for store engine events
    window.storeEngine.subscribe((event, data) => {
      if (event === "stores_updated" || event === "lang_changed") {
        this.populateStoreSelector();
        if (this.currentStoreId) {
          this.loadStore(this.currentStoreId);
        }
      }
    });
  }

  setCurrentStore(storeId) {
    this.currentStoreId = storeId;
    this.loadStore(storeId);
  }

  getCurrentStore() {
    if (!this.currentStoreId) {
      const stores = window.storeEngine.getAllStores();
      if (stores.length > 0) {
        this.currentStoreId = stores[0].id;
      }
    }
    return window.storeEngine.getStoreById(this.currentStoreId);
  }

  populateStoreSelector() {
    const select = document.getElementById("builderStoreSelect");
    if (!select) return;

    const stores = window.storeEngine.getAllStores();
    select.innerHTML = "";
    stores.forEach(store => {
      const opt = document.createElement("option");
      opt.value = store.id;
      opt.textContent = `${store.name} (${store.category})`;
      if (store.id === this.currentStoreId) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });
  }

  switchTab(tabId) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    this.currentTab = tabId;
    document.querySelectorAll(".builder-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `tab_${tabId}`);
    });
  }

  loadStore(storeId) {
    const store = window.storeEngine.getStoreById(storeId);
    if (!store) return;

    this.currentStoreId = store.id;
    this.populateStoreSelector();

    // 1. Fill Identity Form
    const nameEl = document.getElementById("inputStoreName");
    const nameKhEl = document.getElementById("inputStoreNameKh");
    const taglineEl = document.getElementById("inputStoreTagline");
    const taglineKhEl = document.getElementById("inputStoreTaglineKh");
    const logoEl = document.getElementById("inputStoreLogo");
    const bannerEl = document.getElementById("inputStoreBanner");
    const catEl = document.getElementById("selectStoreCategory");

    if (nameEl) nameEl.value = store.name || "";
    if (nameKhEl) nameKhEl.value = store.nameKh || "";
    if (taglineEl) taglineEl.value = store.tagline || "";
    if (taglineKhEl) taglineKhEl.value = store.taglineKh || "";
    if (logoEl) logoEl.value = store.logo || "";
    if (bannerEl) bannerEl.value = store.banner || "";
    if (catEl) catEl.value = store.category || "cafe";

    // 2. Fill Theme Colors
    const primaryEl = document.getElementById("inputPrimaryColor");
    const secondaryEl = document.getElementById("inputSecondaryColor");
    const accentEl = document.getElementById("inputAccentColor");
    const bgEl = document.getElementById("inputBgColor");
    const cardBgEl = document.getElementById("inputCardBgColor");

    if (primaryEl) {
      primaryEl.value = store.theme.primaryColor || "#0F766E";
      document.getElementById("codePrimaryColor").textContent = store.theme.primaryColor;
    }
    if (secondaryEl) {
      secondaryEl.value = store.theme.secondaryColor || "#14B8A6";
      document.getElementById("codeSecondaryColor").textContent = store.theme.secondaryColor;
    }
    if (accentEl) {
      accentEl.value = store.theme.accentColor || "#F59E0B";
      document.getElementById("codeAccentColor").textContent = store.theme.accentColor;
    }
    if (bgEl) {
      bgEl.value = store.theme.bgColor || "#0F172A";
      document.getElementById("codeBgColor").textContent = store.theme.bgColor;
    }
    if (cardBgEl) {
      cardBgEl.value = store.theme.cardBg || "#1E293B";
      document.getElementById("codeCardBgColor").textContent = store.theme.cardBg;
    }

    // 3. Fill Payment Config
    const khqrNameEl = document.getElementById("inputKhqrMerchantName");
    const khqrBakongEl = document.getElementById("inputKhqrBakongId");
    const khqrAccEl = document.getElementById("inputKhqrAccount");
    const enableKhqrEl = document.getElementById("inputEnableKhqr");
    const enableCodEl = document.getElementById("inputEnableCod");

    if (khqrNameEl) khqrNameEl.value = store.paymentConfig?.khqrMerchantName || store.name.toUpperCase();
    if (khqrBakongEl) khqrBakongEl.value = store.paymentConfig?.khqrBakongId || "merchant@aba";
    if (khqrAccEl) khqrAccEl.value = store.paymentConfig?.khqrAccountId || "000 111 222";
    if (enableKhqrEl) enableKhqrEl.checked = store.paymentConfig?.enableKhqr !== false;
    if (enableCodEl) enableCodEl.checked = store.paymentConfig?.enableCod !== false;

    // 4. Render Blocks Checkboxes
    this.renderBlocksConfig(store);

    // 5. Render Products Table
    this.renderProductsTable(store);

    // 6. Render Store Orders
    this.renderStoreOrders(store);

    // 7. Render Share / Telegram QR tab
    this.renderShareTab(store);

    // 8. Update Live Simulator Mockup
    this.updateSimulator(store);
  }

  applyPresetTheme(themeName) {
    const store = this.getCurrentStore();
    if (!store) return;

    if (window.telegramTma) window.telegramTma.hapticImpact("medium");

    const presets = {
      emerald: {
        primaryColor: "#0F766E",
        secondaryColor: "#14B8A6",
        accentColor: "#F59E0B",
        bgColor: "#0B1522",
        textColor: "#F8FAFC",
        cardBg: "#162235",
        borderRadius: "16px"
      },
      rose: {
        primaryColor: "#E11D48",
        secondaryColor: "#BE123C",
        accentColor: "#FB7185",
        bgColor: "#09090B",
        textColor: "#FAFAFA",
        cardBg: "#18181B",
        borderRadius: "12px"
      },
      cyberpunk: {
        primaryColor: "#6366F1",
        secondaryColor: "#8B5CF6",
        accentColor: "#EC4899",
        bgColor: "#050816",
        textColor: "#F9FAFB",
        cardBg: "#0F172A",
        borderRadius: "14px"
      },
      amber: {
        primaryColor: "#D97706",
        secondaryColor: "#F59E0B",
        accentColor: "#34D399",
        bgColor: "#1C140C",
        textColor: "#FFFBEB",
        cardBg: "#291D11",
        borderRadius: "18px"
      },
      darkluxe: {
        primaryColor: "#38BDF8",
        secondaryColor: "#0284C7",
        accentColor: "#F43F5E",
        bgColor: "#000000",
        textColor: "#FFFFFF",
        cardBg: "#121212",
        borderRadius: "10px"
      }
    };

    if (presets[themeName]) {
      store.theme = { ...presets[themeName] };
      window.storeEngine.updateStore(store.id, { theme: store.theme });
      this.loadStore(store.id);
      window.app.showToast(window.storeEngine.t("saveChanges") + ` (${themeName})`, "success");
    }
  }

  handleInputChange() {
    const store = this.getCurrentStore();
    if (!store) return;

    const name = document.getElementById("inputStoreName")?.value || store.name;
    const nameKh = document.getElementById("inputStoreNameKh")?.value || store.nameKh;
    const tagline = document.getElementById("inputStoreTagline")?.value || store.tagline;
    const taglineKh = document.getElementById("inputStoreTaglineKh")?.value || store.taglineKh;
    const logo = document.getElementById("inputStoreLogo")?.value || store.logo;
    const banner = document.getElementById("inputStoreBanner")?.value || store.banner;
    const category = document.getElementById("selectStoreCategory")?.value || store.category;

    const primaryColor = document.getElementById("inputPrimaryColor")?.value || store.theme.primaryColor;
    const secondaryColor = document.getElementById("inputSecondaryColor")?.value || store.theme.secondaryColor;
    const accentColor = document.getElementById("inputAccentColor")?.value || store.theme.accentColor;
    const bgColor = document.getElementById("inputBgColor")?.value || store.theme.bgColor;
    const cardBg = document.getElementById("inputCardBgColor")?.value || store.theme.cardBg;

    if (document.getElementById("codePrimaryColor")) document.getElementById("codePrimaryColor").textContent = primaryColor;
    if (document.getElementById("codeSecondaryColor")) document.getElementById("codeSecondaryColor").textContent = secondaryColor;
    if (document.getElementById("codeAccentColor")) document.getElementById("codeAccentColor").textContent = accentColor;
    if (document.getElementById("codeBgColor")) document.getElementById("codeBgColor").textContent = bgColor;
    if (document.getElementById("codeCardBgColor")) document.getElementById("codeCardBgColor").textContent = cardBg;

    const paymentConfig = {
      khqrMerchantName: document.getElementById("inputKhqrMerchantName")?.value || store.name.toUpperCase(),
      khqrBakongId: document.getElementById("inputKhqrBakongId")?.value || "merchant@aba",
      khqrAccountId: document.getElementById("inputKhqrAccount")?.value || "000 111 222",
      enableKhqr: document.getElementById("inputEnableKhqr")?.checked,
      enableCod: document.getElementById("inputEnableCod")?.checked,
      currency: "USD",
      usdRateToKhr: 4100
    };

    const updated = window.storeEngine.updateStore(store.id, {
      name,
      nameKh,
      tagline,
      taglineKh,
      logo,
      banner,
      category,
      theme: {
        primaryColor,
        secondaryColor,
        accentColor,
        bgColor,
        cardBg,
        textColor: "#FFFFFF",
        borderRadius: store.theme.borderRadius || "16px"
      },
      paymentConfig
    });

    this.updateSimulator(updated);
  }

  renderBlocksConfig(store) {
    const container = document.getElementById("builderBlocksList");
    if (!container) return;

    container.innerHTML = "";
    const blockIcons = {
      hero_banner: "🖼️",
      announcement: "📢",
      category_bar: "🏷️",
      featured_products: "⭐",
      product_grid: "📦",
      store_info: "📍"
    };

    store.blocks.forEach(block => {
      const card = document.createElement("div");
      card.className = "block-item-card";
      card.innerHTML = `
        <div class="block-item-info">
          <div class="block-item-icon">${blockIcons[block.type] || "🧱"}</div>
          <div>
            <div class="block-item-title">${block.title || block.type.replace('_', ' ').toUpperCase()}</div>
            <div class="block-item-subtitle">${block.subtitle || block.text || block.type}</div>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" data-block-id="${block.id}" ${block.enabled !== false ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      `;

      const check = card.querySelector('input[type="checkbox"]');
      check.addEventListener("change", (e) => {
        if (window.telegramTma) window.telegramTma.hapticImpact("light");
        block.enabled = e.target.checked;
        window.storeEngine.updateStore(store.id, { blocks: store.blocks });
        this.updateSimulator(store);
      });

      container.appendChild(card);
    });
  }

  renderProductsTable(store) {
    const tbody = document.getElementById("builderProductsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!store.products || store.products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">${window.storeEngine.t("noProductsYet")}</td></tr>`;
      return;
    }

    store.products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <img src="${p.image}" class="product-row-thumb" alt="${p.name}">
            <div>
              <div style="font-weight: 700; color: #FFFFFF;">${p.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.nameKh || ''}</div>
            </div>
          </div>
        </td>
        <td><span style="color: #10B981; font-weight: 700;">$${p.price.toFixed(2)}</span></td>
        <td><span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); padding: 0.2rem 0.5rem; border-radius: 4px;">${p.categoryId}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.storeBuilder.openEditProductModal('${p.id}')">✏️ ${window.storeEngine.t("edit")}</button>
          <button class="btn btn-danger btn-sm" onclick="window.storeBuilder.deleteProductPrompt('${p.id}')">🗑️ ${window.storeEngine.t("delete")}</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  openAddProductModal() {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    this.editingProductId = null;
    document.getElementById("modalProductTitle").textContent = window.storeEngine.t("addProductBtn");
    document.getElementById("prodFormName").value = "";
    document.getElementById("prodFormNameKh").value = "";
    document.getElementById("prodFormPrice").value = "";
    document.getElementById("prodFormOrigPrice").value = "";
    document.getElementById("prodFormImage").value = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80";
    document.getElementById("prodFormDesc").value = "";
    document.getElementById("prodFormDescKh").value = "";
    document.getElementById("prodFormBadge").value = "";

    const store = this.getCurrentStore();
    const catSelect = document.getElementById("prodFormCategory");
    if (catSelect && store) {
      catSelect.innerHTML = store.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    document.getElementById("productModalOverlay").classList.add("active");
  }

  openEditProductModal(productId) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    const store = this.getCurrentStore();
    if (!store) return;
    const prod = store.products.find(p => p.id === productId);
    if (!prod) return;

    this.editingProductId = productId;
    document.getElementById("modalProductTitle").textContent = `${window.storeEngine.t("edit")}: ${prod.name}`;
    document.getElementById("prodFormName").value = prod.name || "";
    document.getElementById("prodFormNameKh").value = prod.nameKh || "";
    document.getElementById("prodFormPrice").value = prod.price || "";
    document.getElementById("prodFormOrigPrice").value = prod.originalPrice || "";
    document.getElementById("prodFormImage").value = prod.image || "";
    document.getElementById("prodFormDesc").value = prod.description || "";
    document.getElementById("prodFormDescKh").value = prod.descriptionKh || "";
    document.getElementById("prodFormBadge").value = prod.badge || "";

    const catSelect = document.getElementById("prodFormCategory");
    if (catSelect) {
      catSelect.innerHTML = store.categories.map(c => `<option value="${c.id}" ${c.id === prod.categoryId ? 'selected' : ''}>${c.name}</option>`).join('');
    }

    document.getElementById("productModalOverlay").classList.add("active");
  }

  saveProductModal() {
    const store = this.getCurrentStore();
    if (!store) return;

    const name = document.getElementById("prodFormName").value.trim();
    const nameKh = document.getElementById("prodFormNameKh").value.trim();
    const price = parseFloat(document.getElementById("prodFormPrice").value) || 0;
    const originalPrice = document.getElementById("prodFormOrigPrice").value ? parseFloat(document.getElementById("prodFormOrigPrice").value) : null;
    const image = document.getElementById("prodFormImage").value.trim() || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80";
    const description = document.getElementById("prodFormDesc").value.trim();
    const descriptionKh = document.getElementById("prodFormDescKh").value.trim();
    const badge = document.getElementById("prodFormBadge").value.trim();
    const categoryId = document.getElementById("prodFormCategory").value;

    if (!name || price <= 0) {
      window.app.showToast("Please enter product name and a valid price", "warning");
      return;
    }

    const productPayload = {
      name,
      nameKh,
      price,
      originalPrice,
      image,
      description,
      descriptionKh,
      badge,
      categoryId
    };

    if (this.editingProductId) {
      window.storeEngine.updateProduct(store.id, this.editingProductId, productPayload);
      window.app.showToast("Product updated successfully", "success");
    } else {
      window.storeEngine.addProduct(store.id, productPayload);
      window.app.showToast("Product created successfully", "success");
    }

    if (window.telegramTma) window.telegramTma.hapticImpact("medium");

    document.getElementById("productModalOverlay").classList.remove("active");
    this.renderProductsTable(store);
    this.updateSimulator(store);
  }

  deleteProductPrompt(productId) {
    const store = this.getCurrentStore();
    if (!store) return;

    if (confirm("Are you sure you want to delete this product?")) {
      window.storeEngine.deleteProduct(store.id, productId);
      this.renderProductsTable(store);
      this.updateSimulator(store);
      window.app.showToast("Product removed", "info");
    }
  }

  renderStoreOrders(store) {
    const container = document.getElementById("builderOrdersList");
    if (!container) return;

    const orders = window.storeEngine.getOrdersForStore(store.id);
    if (orders.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 3rem;">No orders placed for this mini app yet.</div>`;
      return;
    }

    container.innerHTML = orders.map(ord => `
      <div class="store-card" style="margin-bottom: 1rem; padding: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <strong style="color: #FFFFFF; font-size: 1rem;">#${ord.id}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">${new Date(ord.createdAt).toLocaleTimeString()}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <select class="form-select btn-sm" onchange="window.storeEngine.updateOrderStatus('${ord.id}', this.value); window.storeBuilder.renderStoreOrders(window.storeBuilder.getCurrentStore());" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
              <option value="PENDING" ${ord.status === 'PENDING' ? 'selected' : ''}>⏳ Pending</option>
              <option value="PREPARING" ${ord.status === 'PREPARING' ? 'selected' : ''}>👨‍🍳 Preparing</option>
              <option value="DELIVERING" ${ord.status === 'DELIVERING' ? 'selected' : ''}>🛵 Delivering</option>
              <option value="COMPLETED" ${ord.status === 'COMPLETED' ? 'selected' : ''}>✅ Completed</option>
            </select>
            <span style="font-size: 0.75rem; font-weight: 700; background: ${ord.paymentStatus === 'PAID' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${ord.paymentStatus === 'PAID' ? '#10B981' : '#F59E0B'}; padding: 0.2rem 0.5rem; border-radius: 4px;">${ord.paymentStatus}</span>
          </div>
        </div>
        <div style="font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-secondary);">
          Customer: <strong style="color: #FFFFFF;">${ord.customer.name}</strong> (${ord.customer.phone}) - ${ord.customer.address}
        </div>
        <div style="background: rgba(0,0,0,0.2); padding: 0.6rem; border-radius: 8px; font-size: 0.8rem; margin-bottom: 0.5rem;">
          ${ord.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
              <span>${item.qty}x ${item.name}</span>
              <span style="font-weight: 700;">$${item.lineTotal.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.95rem; color: var(--accent-gold);">
          <span>Total:</span>
          <span>$${ord.total.toFixed(2)} (${ord.totalKhr.toLocaleString()} ៛)</span>
        </div>
      </div>
    `).join('');
  }

  renderShareTab(store) {
    const linkInput = document.getElementById("shareStoreUrl");
    const tgLinkInput = document.getElementById("shareTgStoreUrl");
    const qrCanvas = document.getElementById("shareQrCanvas");

    const directWebUrl = `${window.location.origin}${window.location.pathname}#store=${store.slug}`;
    const directTelegramUrl = window.telegramTma ? window.telegramTma.getTelegramStoreLink(store.slug) : `https://t.me/omnimini_shop_bot/app?startapp=${store.slug}`;

    if (linkInput) linkInput.value = directWebUrl;
    if (tgLinkInput) tgLinkInput.value = directTelegramUrl;

    if (qrCanvas && window.khqrService) {
      window.khqrService.renderKhqrCanvas(qrCanvas, {
        merchantName: store.name,
        bakongId: store.paymentConfig?.khqrBakongId || "merchant@aba",
        amount: 0,
        currency: "USD"
      });
    }
  }

  updateSimulator(store) {
    const frame = document.getElementById("phoneSimulatorScreen");
    if (!frame) return;

    frame.innerHTML = window.storeView.generateStoreHtml(store, true);
    window.storeView.bindStoreEvents(frame, store, true);
  }
}

window.storeBuilder = new StoreBuilder();
