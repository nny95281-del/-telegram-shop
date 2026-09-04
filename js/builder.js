/**
 * Merchant Studio / Store Builder Logic (with Telegram Mini App Integration)
 */

class StoreBuilder {
  constructor() {
    this.currentStoreId = null;
    this.currentTab = "identity";
    this.editingProductId = null;
    this.ordersFilter = "all";
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
      } else if (event === "orders_updated") {
        const store = this.getCurrentStore();
        if (store) this.renderStoreOrders(store);
      }
    });
  }

  setCurrentStore(storeId) {
    this.currentStoreId = storeId;
    localStorage.setItem("omnimini_active_merchant_store", storeId);
    this.loadStore(storeId);
  }

  getCurrentStore() {
    if (!this.currentStoreId) {
      const savedStoreId = localStorage.getItem("omnimini_active_merchant_store");
      if (savedStoreId && window.storeEngine.getStoreById(savedStoreId)) {
        this.currentStoreId = savedStoreId;
      } else {
        const stores = window.storeEngine.getAllStores();
        if (stores.length > 0) {
          this.currentStoreId = stores[0].id;
        }
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
      opt.textContent = `${store.nameKh || store.name} (${store.category})`;
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

    const store = this.getCurrentStore();
    if (store) {
      if (tabId === "orders") this.renderStoreOrders(store);
      if (tabId === "share") this.renderShareTab(store);
      if (tabId === "products") this.renderProductsTable(store);
      if (tabId === "blocks") this.renderBlocksList(store);
    }
  }

  loadStore(storeId) {
    const store = window.storeEngine.getStoreById(storeId);
    if (!store) return;

    this.currentStoreId = store.id;
    this.populateStoreSelector();

    // Fill Top Link Bar if present
    const topLinkEl = document.getElementById("builderTopTgLink");
    if (topLinkEl && window.telegramTma) {
      topLinkEl.value = window.telegramTma.getTelegramStoreLink(store.slug);
    }

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

    const prevLogo = document.getElementById("previewStoreLogo");
    if (prevLogo && store.logo) prevLogo.src = store.logo;

    const prevBanner = document.getElementById("previewStoreBanner");
    if (prevBanner && store.banner) prevBanner.src = store.banner;

    // 2. Fill Theme Colors
    const primaryEl = document.getElementById("inputPrimaryColor");
    const secondaryEl = document.getElementById("inputSecondaryColor");
    const accentEl = document.getElementById("inputAccentColor");
    const bgEl = document.getElementById("inputBgColor");
    const cardBgEl = document.getElementById("inputCardBgColor");

    if (primaryEl) {
      primaryEl.value = store.theme?.primaryColor || "#0F766E";
      const codePrimary = document.getElementById("codePrimaryColor");
      if (codePrimary) codePrimary.textContent = primaryEl.value;
    }
    if (secondaryEl) {
      secondaryEl.value = store.theme?.secondaryColor || "#14B8A6";
      const codeSecondary = document.getElementById("codeSecondaryColor");
      if (codeSecondary) codeSecondary.textContent = secondaryEl.value;
    }
    if (accentEl) {
      accentEl.value = store.theme?.accentColor || "#F59E0B";
      const codeAccent = document.getElementById("codeAccentColor");
      if (codeAccent) codeAccent.textContent = accentEl.value;
    }
    if (bgEl) {
      bgEl.value = store.theme?.bgColor || "#0F172A";
      const codeBg = document.getElementById("codeBgColor");
      if (codeBg) codeBg.textContent = bgEl.value;
    }
    if (cardBgEl) {
      cardBgEl.value = store.theme?.cardBg || "#1E293B";
      const codeCardBg = document.getElementById("codeCardBgColor");
      if (codeCardBg) codeCardBg.textContent = cardBgEl.value;
    }

    // 3. Fill Payment Config
    const khqrMerchantEl = document.getElementById("inputKhqrMerchantName");
    const khqrBakongEl = document.getElementById("inputKhqrBakongId");
    const khqrAccountEl = document.getElementById("inputKhqrAccount");
    const khqrQrInputEl = document.getElementById("inputStoreKhqrQr");
    const khqrQrPrevEl = document.getElementById("previewStoreKhqrQr");
    const enableKhqrEl = document.getElementById("inputEnableKhqr");
    const enableCodEl = document.getElementById("inputEnableCod");

    if (khqrMerchantEl) khqrMerchantEl.value = store.paymentConfig?.khqrMerchantName || store.nameKh || store.name || "";
    if (khqrBakongEl) khqrBakongEl.value = store.paymentConfig?.khqrBakongId || "merchant@aba";
    if (khqrAccountEl) khqrAccountEl.value = store.paymentConfig?.khqrAccountId || store.paymentConfig?.accountNumber || "012 345 678";
    if (khqrQrInputEl) khqrQrInputEl.value = store.paymentConfig?.qrImage || "";
    if (khqrQrPrevEl && store.paymentConfig?.qrImage) {
      khqrQrPrevEl.src = store.paymentConfig.qrImage;
    }
    if (enableKhqrEl) enableKhqrEl.checked = store.paymentConfig?.enableKhqr !== false;
    if (enableCodEl) enableCodEl.checked = store.paymentConfig?.enableCod !== false;

    // Render Sub-components
    this.renderBlocksList(store);
    this.renderProductsTable(store);
    this.renderStoreOrders(store);
    this.renderShareTab(store);
    this.updateSimulator(store);
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

    const primaryColor = document.getElementById("inputPrimaryColor")?.value || store.theme?.primaryColor;
    const secondaryColor = document.getElementById("inputSecondaryColor")?.value || store.theme?.secondaryColor;
    const accentColor = document.getElementById("inputAccentColor")?.value || store.theme?.accentColor;
    const bgColor = document.getElementById("inputBgColor")?.value || store.theme?.bgColor;
    const cardBg = document.getElementById("inputCardBgColor")?.value || store.theme?.cardBg;

    // Update Color Code Previews
    if (document.getElementById("codePrimaryColor")) document.getElementById("codePrimaryColor").textContent = primaryColor;
    if (document.getElementById("codeSecondaryColor")) document.getElementById("codeSecondaryColor").textContent = secondaryColor;
    if (document.getElementById("codeAccentColor")) document.getElementById("codeAccentColor").textContent = accentColor;
    if (document.getElementById("codeBgColor")) document.getElementById("codeBgColor").textContent = bgColor;
    if (document.getElementById("codeCardBgColor")) document.getElementById("codeCardBgColor").textContent = cardBg;

    const khqrMerchantName = document.getElementById("inputKhqrMerchantName")?.value || store.paymentConfig?.khqrMerchantName;
    const khqrBakongId = document.getElementById("inputKhqrBakongId")?.value || store.paymentConfig?.khqrBakongId;
    const khqrAccountId = document.getElementById("inputKhqrAccount")?.value || store.paymentConfig?.khqrAccountId;
    const qrImage = document.getElementById("inputStoreKhqrQr")?.value || store.paymentConfig?.qrImage || "";
    const enableKhqr = document.getElementById("inputEnableKhqr") ? document.getElementById("inputEnableKhqr").checked : true;
    const enableCod = document.getElementById("inputEnableCod") ? document.getElementById("inputEnableCod").checked : true;

    window.storeEngine.updateStore(store.id, {
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
        cardBg
      },
      paymentConfig: {
        khqrMerchantName,
        khqrBakongId,
        khqrAccountId,
        qrImage,
        enableKhqr,
        enableCod
      }
    });

    const updatedStore = this.getCurrentStore();
    this.updateSimulator(updatedStore);
  }


  applyPresetTheme(themeKey) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    const store = this.getCurrentStore();
    if (!store) return;

    const presets = {
      emerald: { primaryColor: "#0F766E", secondaryColor: "#14B8A6", accentColor: "#F59E0B", bgColor: "#0F172A", cardBg: "#1E293B" },
      rose: { primaryColor: "#E11D48", secondaryColor: "#BE123C", accentColor: "#FB7185", bgColor: "#18181B", cardBg: "#27272A" },
      cyberpunk: { primaryColor: "#6366F1", secondaryColor: "#8B5CF6", accentColor: "#EC4899", bgColor: "#0B0F19", cardBg: "#1E1B4B" },
      amber: { primaryColor: "#D97706", secondaryColor: "#F59E0B", accentColor: "#34D399", bgColor: "#1C1917", cardBg: "#292524" },
      darkluxe: { primaryColor: "#38BDF8", secondaryColor: "#0284C7", accentColor: "#F43F5E", bgColor: "#000000", cardBg: "#111827" }
    };

    const preset = presets[themeKey];
    if (preset) {
      window.storeEngine.updateStore(store.id, { theme: preset });
      this.loadStore(store.id);
      window.app.showToast(`Applied ${themeKey.toUpperCase()} theme!`, "success");
    }
  }

  renderBlocksList(store) {
    const container = document.getElementById("builderBlocksList");
    if (!container) return;

    container.innerHTML = store.blocks.map(b => `
      <div class="block-item-card">
        <div class="block-item-info">
          <span class="block-item-icon">📌</span>
          <div>
            <strong style="color: #FFFFFF; font-size: 0.9rem;">${b.title || b.type.replace('_', ' ').toUpperCase()}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${b.type}</div>
          </div>
        </div>
        <label class="switch-toggle">
          <input type="checkbox" ${b.enabled !== false ? 'checked' : ''} onchange="window.storeBuilder.toggleBlock('${b.id}', this.checked)">
          <span class="slider"></span>
        </label>
      </div>
    `).join('');
  }

  toggleBlock(blockId, isEnabled) {
    const store = this.getCurrentStore();
    if (!store) return;

    const block = store.blocks.find(b => b.id === blockId);
    if (block) {
      block.enabled = isEnabled;
      window.storeEngine.updateStore(store.id, { blocks: store.blocks });
      this.updateSimulator(store);
    }
  }

  renderProductsTable(store) {
    const tbody = document.getElementById("builderProductsTableBody");
    if (!tbody) return;

    if (!store.products || store.products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">មិនទាន់មានមុខទំនិញនៅឡើយទេ។ ចុច "+ បន្ថែមទំនិញថ្មី" ដើម្បីបង្កើត!</td></tr>`;
      return;
    }

    tbody.innerHTML = store.products.map(p => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${p.image}" class="prod-table-thumb" alt="${p.name}">
            <div>
              <strong style="color: #FFFFFF; font-size: 0.88rem;">${p.nameKh || p.name}</strong>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${p.name}</div>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight: 700; color: var(--accent-gold);">$${p.price.toFixed(2)}</span>
          ${p.originalPrice ? `<div style="font-size: 0.72rem; text-decoration: line-through; color: var(--text-muted);">$${p.originalPrice.toFixed(2)}</div>` : ''}
        </td>
        <td>
          <span class="badge-category">${p.categoryId}</span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.storeBuilder.openEditProductModal('${p.id}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="window.storeBuilder.deleteProductPrompt('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleImageUpload(event, targetType) {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      window.app.showToast("រូបភាពធំពេក សូមជ្រើសរើសរូបក្រោម 8MB", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      if (targetType === 'logo') {
        const inputLogo = document.getElementById('inputStoreLogo');
        const prevLogo = document.getElementById('previewStoreLogo');
        if (inputLogo) inputLogo.value = base64Url;
        if (prevLogo) prevLogo.src = base64Url;
        this.handleInputChange();
      } else if (targetType === 'banner') {
        const inputBanner = document.getElementById('inputStoreBanner');
        const prevBanner = document.getElementById('previewStoreBanner');
        if (inputBanner) inputBanner.value = base64Url;
        if (prevBanner) prevBanner.src = base64Url;
        this.handleInputChange();
      } else if (targetType === 'product') {
        const inputProd = document.getElementById('prodFormImage');
        const prevProd = document.getElementById('previewProductImage');
        if (inputProd) inputProd.value = base64Url;
        if (prevProd) prevProd.src = base64Url;
      } else if (targetType === 'khqrQr') {
        const inputKhqr = document.getElementById('inputStoreKhqrQr');
        const prevKhqr = document.getElementById('previewStoreKhqrQr');
        if (inputKhqr) inputKhqr.value = base64Url;
        if (prevKhqr) prevKhqr.src = base64Url;
        this.handleInputChange();
      }
      if (window.telegramTma) window.telegramTma.hapticImpact('medium');
      window.app.showToast('បាន Upload រូបភាពជោគជ័យ!', 'success');
    };
    reader.readAsDataURL(file);
  }

  openReceiptModal(imgUrl) {
    if (!imgUrl) return;
    const modal = document.getElementById("receiptModalOverlay");
    const img = document.getElementById("receiptModalImg");
    if (modal && img) {
      img.src = imgUrl;
      modal.classList.add("active");
    }
  }

  openAddProductModal() {
    this.editingProductId = null;
    const store = this.getCurrentStore();
    if (!store) return;

    document.getElementById("productModalTitle").textContent = "+ បន្ថែមទំនិញថ្មី (Add Product)";
    document.getElementById("prodFormName").value = "";
    document.getElementById("prodFormNameKh").value = "";
    document.getElementById("prodFormPrice").value = "";
    document.getElementById("prodFormOrigPrice").value = "";
    document.getElementById("prodFormImage").value = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80";
    document.getElementById("prodFormDesc").value = "";
    document.getElementById("prodFormDescKh").value = "";
    document.getElementById("prodFormBadge").value = "";

    const prevProd = document.getElementById("previewProductImage");
    if (prevProd) prevProd.src = "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=80";

    // Categories dropdown
    const catSelect = document.getElementById("prodFormCategory");
    if (catSelect) {
      catSelect.innerHTML = store.categories.map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');
    }

    document.getElementById("productModalOverlay").classList.add("active");
  }

  openEditProductModal(productId) {
    const store = this.getCurrentStore();
    if (!store) return;

    const prod = store.products.find(p => p.id === productId);
    if (!prod) return;

    this.editingProductId = productId;
    document.getElementById("productModalTitle").textContent = "✏️ កែសម្រួលទំនិញ (Edit Product)";
    document.getElementById("prodFormName").value = prod.name || "";
    document.getElementById("prodFormNameKh").value = prod.nameKh || "";
    document.getElementById("prodFormPrice").value = prod.price || "";
    document.getElementById("prodFormOrigPrice").value = prod.originalPrice || "";
    document.getElementById("prodFormImage").value = prod.image || "";
    document.getElementById("prodFormDesc").value = prod.description || "";
    document.getElementById("prodFormDescKh").value = prod.descriptionKh || "";
    document.getElementById("prodFormBadge").value = prod.badge || "";

    const prevProd = document.getElementById("previewProductImage");
    if (prevProd && prod.image) prevProd.src = prod.image;

    const catSelect = document.getElementById("prodFormCategory");
    if (catSelect) {
      catSelect.innerHTML = store.categories.map(c => `
        <option value="${c.id}" ${c.id === prod.categoryId ? 'selected' : ''}>${c.name}</option>
      `).join('');
    }

    document.getElementById("productModalOverlay").classList.add("active");
  }

  saveProductForm() {
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
      window.app.showToast("សូមបញ្ចូលឈ្មោះទំនិញ និងតម្លៃត្រឹមត្រូវ", "warning");
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
      window.app.showToast("បានកែសម្រួលទំនិញរួចរាល់!", "success");
    } else {
      window.storeEngine.addProduct(store.id, productPayload);
      window.app.showToast("បានបន្ថែមទំនិញថ្មីជោគជ័យ!", "success");
    }

    if (window.telegramTma) window.telegramTma.hapticImpact("medium");

    document.getElementById("productModalOverlay").classList.remove("active");
    this.renderProductsTable(store);
    this.updateSimulator(store);
  }

  saveProductModal() {
    this.saveProductForm();
  }

  deleteProductPrompt(productId) {
    const store = this.getCurrentStore();
    if (!store) return;

    if (confirm("តើអ្នកពិតជាចង់លុបទំនិញនេះមែនទេ?")) {
      window.storeEngine.deleteProduct(store.id, productId);
      this.renderProductsTable(store);
      this.updateSimulator(store);
      window.app.showToast("បានលុបទំនិញរួចរាល់", "info");
    }
  }

  renderStoreOrders(store) {
    const container = document.getElementById("builderOrdersList");
    if (!container) return;

    const orders = window.storeEngine.getOrdersForStore(store.id);
    const totalRev = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length;

    let filterHtml = `
      <div class="orders-summary-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="background: rgba(36, 161, 222, 0.12); border: 1px solid rgba(36, 161, 222, 0.3); border-radius: 12px; padding: 0.85rem;">
          <div style="font-size: 0.75rem; color: #70C5FB;">ការកុម្ម៉ង់សរុប</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${orders.length}</div>
        </div>
        <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 0.85rem;">
          <div style="font-size: 0.75rem; color: #F59E0B;">កំពុងរង់ចាំ/ធ្វើ</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #FFFFFF;">${pendingOrders}</div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 0.85rem;">
          <div style="font-size: 0.75rem; color: #10B981;">ប្រាក់ចំណូលសរុប</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #10B981;">$${totalRev.toFixed(2)}</div>
        </div>
      </div>
    `;

    if (orders.length === 0) {
      container.innerHTML = filterHtml + `<div style="text-align: center; color: var(--text-muted); padding: 3rem; background: var(--bg-card); border-radius: 16px;">មិនទាន់មានការបញ្ជាទិញសម្រាប់ហាងនេះនៅឡើយទេ។ ផ្ញើ Link Mini App ឱ្យភ្ញៀវដើម្បីចាប់ផ្តើមទទួល Order!</div>`;
      return;
    }

    container.innerHTML = filterHtml + orders.map(ord => `
      <div class="store-card" style="margin-bottom: 1rem; padding: 1.1rem; border-radius: 14px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem;">
          <div>
            <strong style="color: #FFFFFF; font-size: 1.05rem;">#${ord.id}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.5rem;">${new Date(ord.createdAt).toLocaleTimeString()} (${new Date(ord.createdAt).toLocaleDateString()})</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 0.75rem; font-weight: 700; background: ${ord.paymentStatus === 'PAID' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${ord.paymentStatus === 'PAID' ? '#10B981' : '#F59E0B'}; padding: 0.25rem 0.6rem; border-radius: 6px;">
              ${ord.paymentMethod}: ${ord.paymentStatus}
            </span>
          </div>
        </div>
        
        <div style="font-size: 0.88rem; margin-bottom: 0.65rem; color: #E2E8F0;">
          👤 <strong>${ord.customer.name}</strong> • 📞 <a href="tel:${ord.customer.phone}" style="color: #38BDF8; font-weight: 700;">${ord.customer.phone}</a><br>
          📍 អាសយដ្ឋាន: <span style="color: #94A3B8;">${ord.customer.address}</span>
          ${ord.customer.notes ? `<div style="font-size: 0.78rem; color: #F59E0B; margin-top: 0.2rem;">📝 ចំណាំ: ${ord.customer.notes}</div>` : ''}
        </div>

        <!-- Payment Slip Preview (If customer uploaded receipt) -->
        ${ord.receiptImage ? `
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(36, 161, 222, 0.1); border: 1px solid rgba(36, 161, 222, 0.3); border-radius: 10px; padding: 0.6rem 0.85rem; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <img src="${ord.receiptImage}" alt="Receipt" style="width: 38px; height: 38px; border-radius: 6px; object-fit: cover; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;" onclick="window.storeBuilder.openReceiptModal('${ord.receiptImage}')">
              <div>
                <div style="font-size: 0.82rem; font-weight: 700; color: #70C5FB;">🧾 បង្កាន់ដៃបង់ប្រាក់ (Payment Slip)</div>
                <div style="font-size: 0.7rem; color: #94A3B8;">អតិថិជនបានភ្ជាប់រូបវិក្កយបត្រ</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.storeBuilder.openReceiptModal('${ord.receiptImage}')" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">
              🔍 មើលរូបពេញ
            </button>
          </div>
        ` : ''}

        <div style="background: rgba(0,0,0,0.25); padding: 0.75rem; border-radius: 8px; font-size: 0.83rem; margin-bottom: 0.75rem;">
          ${ord.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
              <span>${item.qty}x <strong>${item.name}</strong> ${item.options?.length ? `(${item.options.join(', ')})` : ''}</span>
              <span style="font-weight: 700; color: #F8FAFC;">$${item.lineTotal.toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 0.4rem; padding-top: 0.4rem; display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
            <span>ថ្លៃដឹកជញ្ជូន (Delivery):</span>
            <span>$${(ord.deliveryFee || 0).toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 1.1rem; color: var(--accent-gold);">
            $${ord.total.toFixed(2)} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(${ord.totalKhr.toLocaleString()} ៛)</span>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <select class="form-select btn-sm" onchange="window.storeEngine.updateOrderStatus('${ord.id}', this.value); window.storeBuilder.renderStoreOrders(window.storeBuilder.getCurrentStore()); window.app.showToast('បានប្តូរស្ថានភាព Order!', 'success');" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; border-radius: 8px;">
              <option value="PENDING" ${ord.status === 'PENDING' ? 'selected' : ''}>⏳ មិនទាន់ទទួល</option>
              <option value="PREPARING" ${ord.status === 'PREPARING' ? 'selected' : ''}>👨‍🍳 កំពុងរៀបចំ</option>
              <option value="DELIVERING" ${ord.status === 'DELIVERING' ? 'selected' : ''}>🛵 កំពុងដឹកជញ្ជូន</option>
              <option value="COMPLETED" ${ord.status === 'COMPLETED' ? 'selected' : ''}>✅ បានបញ្ចប់</option>
            </select>
          </div>
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
        merchantName: store.nameKh || store.name,
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
