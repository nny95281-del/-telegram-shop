/**
 * Customer Store Mini-App Runtime & Checkout Engine (with Telegram WebApp Haptics & Alerts)
 */

class StoreView {
  constructor() {
    this.currentStore = null;
    this.cart = [];
    this.activeCategory = "all";
    this.activeOrder = null;
  }

  setStore(store) {
    this.currentStore = store;
    this.cart = [];
    this.activeCategory = "all";
  }

  generateStoreHtml(store, isSimulator = false) {
    if (!store) return `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No store found</div>`;

    const theme = store.theme || {};
    const themeStyles = `
      --store-primary: ${theme.primaryColor || '#0F766E'};
      --store-secondary: ${theme.secondaryColor || '#14B8A6'};
      --store-accent: ${theme.accentColor || '#F59E0B'};
      --store-bg: ${theme.bgColor || '#0F172A'};
      --store-text: ${theme.textColor || '#F8FAFC'};
      --store-card-bg: ${theme.cardBg || '#1E293B'};
      --store-font: ${theme.fontFamily || "'Inter', 'Kantumruy Pro', sans-serif"};
      --store-radius: ${theme.borderRadius || '16px'};
    `;

    const lang = window.storeEngine.lang;
    const storeDisplayName = (lang === 'km' && store.nameKh) ? store.nameKh : store.name;
    const storeTagline = (lang === 'km' && store.taglineKh) ? store.taglineKh : store.tagline;

    const filteredProducts = this.activeCategory === "all" 
      ? store.products 
      : store.products.filter(p => p.categoryId === this.activeCategory);

    let blocksHtml = "";

    store.blocks.forEach(block => {
      if (block.enabled === false) return;

      switch (block.type) {
        case "announcement":
          blocksHtml += `
            <div class="runtime-announcement">
              <span>${block.text || "🎉 Welcome to our store!"}</span>
            </div>
          `;
          break;

        case "hero_banner":
          blocksHtml += `
            <div class="runtime-hero" style="background-image: url('${block.image || store.banner}');">
              <div class="runtime-hero-content">
                <h3>${block.title || storeDisplayName}</h3>
                <p>${block.subtitle || storeTagline}</p>
              </div>
            </div>
          `;
          break;

        case "category_bar":
          blocksHtml += `
            <div class="runtime-categories">
              <button class="runtime-cat-chip ${this.activeCategory === 'all' ? 'active' : ''}" data-cat-id="all">
                🌟 ${window.storeEngine.t("allCategories")}
              </button>
              ${store.categories.map(c => `
                <button class="runtime-cat-chip ${this.activeCategory === c.id ? 'active' : ''}" data-cat-id="${c.id}">
                  ${c.icon || '🏷️'} ${c.name}
                </button>
              `).join('')}
            </div>
          `;
          break;

        case "featured_products":
          const featuredProds = store.products.filter(p => p.badge || p.originalPrice).slice(0, 4);
          if (featuredProds.length > 0) {
            blocksHtml += `
              <div class="runtime-section">
                <div class="runtime-section-title">
                  <span>${block.title || "🔥 Featured"}</span>
                </div>
                <div class="runtime-product-grid">
                  ${featuredProds.map(p => this.renderProductCard(p, lang)).join('')}
                </div>
              </div>
            `;
          }
          break;

        case "product_grid":
          blocksHtml += `
            <div class="runtime-section">
              <div class="runtime-section-title">
                <span>${block.title || (lang === 'km' ? '📦 មុខទំនិញទាំងអស់' : '📦 All Menu')}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${filteredProducts.length} items</span>
              </div>
              <div class="runtime-product-grid">
                ${filteredProducts.length > 0 ? filteredProducts.map(p => this.renderProductCard(p, lang)).join('') : `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No items in this category</div>`}
              </div>
            </div>
          `;
          break;

        case "store_info":
          blocksHtml += `
            <div class="runtime-info-block">
              <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 0.2rem;">📍 ${storeDisplayName}</div>
              <div class="runtime-info-row"><span>🏠</span> ${block.address || "Phnom Penh, Cambodia"}</div>
              <div class="runtime-info-row"><span>📞</span> ${block.phone || "+855 12 345 678"}</div>
              ${block.telegram ? `<div class="runtime-info-row"><span>✈️</span> Telegram: @${block.telegram}</div>` : ''}
              <div class="runtime-info-row" style="color: var(--store-accent);"><span>⚡</span> Avg Delivery: ${store.estimatedMinutes || '20-30'} mins • Fee: $${(store.deliveryFee || 1).toFixed(2)}</div>
            </div>
          `;
          break;
      }
    });

    const totalCartCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalCartPrice = this.cart.reduce((sum, item) => sum + item.lineTotal, 0);

    return `
      <div class="store-runtime-wrapper" style="${themeStyles}">
        <!-- Top Customer Store Navbar -->
        <header class="store-navbar">
          <div class="store-nav-left">
            ${(!isSimulator && !window.app?.isCustomerDirectLaunch) ? `<button class="store-back-btn" onclick="window.app.switchView('marketplace')" title="Back to Marketplace">←</button>` : ''}
            <img src="${store.logo}" class="store-nav-logo" alt="${storeDisplayName}">
            <div class="store-nav-info">
              <h2>${storeDisplayName}</h2>
              <span>⭐ ${store.rating || 4.9} (${store.ordersCount || 0} ${window.storeEngine.t("ordersCompleted")})</span>
            </div>
          </div>
          <div class="store-nav-actions">
            <button class="store-action-btn" onclick="window.storeView.openCustomerOrdersModal()" title="My Orders">
              📦
            </button>
            <button class="store-action-btn" onclick="window.telegramTma.shareStoreToTelegram(window.storeView.currentStore || window.storeBuilder.getCurrentStore())" title="Share to Telegram">
              ✈️
            </button>
            <button class="store-action-btn" onclick="window.storeView.openCartModal()" title="Cart">
              🛒 ${totalCartCount > 0 ? `<span style="background: red; color: white; font-size: 0.65rem; padding: 1px 4px; border-radius: 10px;">${totalCartCount}</span>` : ''}
            </button>
          </div>
        </header>

        <!-- Dynamic Store Blocks -->
        ${blocksHtml}

        <!-- Store Footer -->
        <footer style="text-align: center; padding: 2rem 1rem 5rem 1rem; color: var(--text-muted); font-size: 0.78rem;">
          <div>🛍️ ${storeDisplayName} • Powered by <strong style="color: #70C5FB;">OmniMini Telegram</strong></div>
        </footer>

        <!-- Floating Cart Bar (Appears when cart > 0) -->
        ${totalCartCount > 0 ? `
          <div class="runtime-cart-bar" onclick="window.storeView.openCartModal()">
            <div class="cart-bar-left">
              <span class="cart-bar-badge">${totalCartCount}</span>
              <span class="cart-bar-text">${window.storeEngine.t("viewCart")}</span>
            </div>
            <span class="cart-bar-price">$${totalCartPrice.toFixed(2)}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderProductCard(product, lang) {
    const pName = (lang === 'km' && product.nameKh) ? product.nameKh : product.name;
    const pDesc = (lang === 'km' && product.descriptionKh) ? product.descriptionKh : product.description;
    const priceKhr = Math.round(product.price * 4100);

    let discountBadge = "";
    if (product.originalPrice && product.originalPrice > product.price) {
      const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      discountBadge = `<span class="runtime-product-badge" style="background: #EF4444; color: #FFFFFF;">-${discountPercent}%</span>`;
    } else if (product.badge) {
      discountBadge = `<span class="runtime-product-badge">${product.badge}</span>`;
    }

    return `
      <div class="runtime-product-card" onclick="window.storeView.openProductDetailModal('${product.id}')">
        <div class="runtime-product-img-wrap">
          <img src="${product.image}" class="runtime-product-img" alt="${pName}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80'">
          ${discountBadge}
        </div>
        <div class="runtime-product-body">
          <div class="runtime-product-name" title="${pName}">${pName}</div>
          <div class="runtime-product-desc">${pDesc || ''}</div>
          <div class="runtime-product-footer">
            <div class="runtime-price-group">
              <div style="display: flex; align-items: baseline; gap: 0.35rem;">
                <span class="runtime-price-main">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span style="font-size: 0.72rem; text-decoration: line-through; color: #94A3B8; font-weight: 500;">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <span class="runtime-price-khr">${priceKhr.toLocaleString()} ៛</span>
            </div>
            <button class="runtime-add-btn" onclick="event.stopPropagation(); window.storeView.quickAddToCart('${product.id}')" title="Add to Cart">+</button>
          </div>
        </div>
      </div>
    `;
  }

  bindStoreEvents(container, store, isSimulator) {
    container.querySelectorAll(".runtime-cat-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.telegramTma) window.telegramTma.hapticImpact("light");
        this.activeCategory = btn.dataset.catId;
        if (isSimulator) {
          window.storeBuilder.updateSimulator(store);
        } else {
          this.renderFullStore(store);
        }
      });
    });
  }

  renderFullStore(store) {
    this.setStore(store);
    const container = document.getElementById("storeRuntimeContainer");
    if (!container) return;

    container.innerHTML = this.generateStoreHtml(store, false);
    this.bindStoreEvents(container, store, false);
  }

  quickAddToCart(productId) {
    if (!this.currentStore) return;
    const product = this.currentStore.products.find(p => p.id === productId);
    if (!product) return;

    if (product.options && product.options.length > 0) {
      this.openProductDetailModal(productId);
      return;
    }

    this.addToCart(product, 1, [], product.price);
  }

  openProductDetailModal(productId) {
    if (!this.currentStore) return;
    const product = this.currentStore.products.find(p => p.id === productId);
    if (!product) return;

    this.currentDetailProductId = productId;
    if (window.telegramTma) window.telegramTma.hapticImpact("light");

    const modal = document.getElementById("storeProductDetailModal");
    if (!modal) return;

    const lang = window.storeEngine.lang;
    const pName = (lang === 'km' && product.nameKh) ? product.nameKh : product.name;
    const pDesc = (lang === 'km' && product.descriptionKh) ? product.descriptionKh : product.description;

    document.getElementById("detailModalImg").src = product.image;
    document.getElementById("detailModalTitle").textContent = pName;
    document.getElementById("detailModalDesc").textContent = pDesc || '';
    document.getElementById("detailModalPrice").textContent = `$${product.price.toFixed(2)}`;

    const optionsContainer = document.getElementById("detailModalOptions");
    optionsContainer.innerHTML = "";

    if (product.options && product.options.length > 0) {
      product.options.forEach((optGroup, gIdx) => {
        const groupEl = document.createElement("div");
        groupEl.className = "option-group";
        groupEl.style.cssText = "margin-bottom: 1rem; background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);";
        
        const isMultiple = optGroup.type === 'checkbox' || optGroup.type === 'multiple';
        
        groupEl.innerHTML = `
          <div class="option-group-title" style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.5rem;">
            <span>${optGroup.name}</span>
            ${optGroup.required ? `<span style="color: #EF4444; font-size: 0.72rem; font-weight: normal;">* ចាំបាច់ (Required)</span>` : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${optGroup.choices.map((choice, cIdx) => {
              const label = choice.label || choice.name || `Option ${cIdx + 1}`;
              const priceMod = parseFloat(choice.priceModifier !== undefined ? choice.priceModifier : choice.price) || 0;
              const isChecked = (cIdx === 0 && optGroup.required && !isMultiple);

              return `
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.65rem; background: rgba(255,255,255,0.04); border-radius: 8px; cursor: pointer; font-size: 0.85rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="${isMultiple ? 'checkbox' : 'radio'}" name="opt_group_${gIdx}" value="${label}" data-price="${priceMod}" ${isChecked ? 'checked' : ''} onchange="window.storeView.recalculateDetailModalPrice(${product.price})">
                    <span style="color: #E2E8F0;">${label}</span>
                  </div>
                  ${priceMod > 0 ? `<span style="color: #F59E0B; font-weight: 700; font-size: 0.8rem;">+$${priceMod.toFixed(2)}</span>` : ''}
                </label>
              `;
            }).join('')}
          </div>
        `;
        optionsContainer.appendChild(groupEl);
      });
    }

    const qtyEl = document.getElementById("detailModalQty");
    if (qtyEl) qtyEl.textContent = "1";

    this.recalculateDetailModalPrice(product.price);

    document.getElementById("detailModalAddBtn").onclick = () => {
      const currentQty = parseInt(document.getElementById("detailModalQty")?.textContent) || 1;
      const selectedOptions = [];
      let extraPrice = 0;

      optionsContainer.querySelectorAll("input:checked").forEach(input => {
        selectedOptions.push(input.value);
        extraPrice += parseFloat(input.dataset.price) || 0;
      });

      this.addToCart(product, currentQty, selectedOptions, product.price + extraPrice);
      modal.classList.remove("active");
    };

    modal.classList.add("active");
  }

  recalculateDetailModalPrice(basePrice) {
    const optionsContainer = document.getElementById("detailModalOptions");
    const qtyEl = document.getElementById("detailModalQty");
    const priceEl = document.getElementById("detailModalPrice");
    if (!priceEl) return;

    let extraPrice = 0;
    if (optionsContainer) {
      optionsContainer.querySelectorAll("input:checked").forEach(input => {
        extraPrice += parseFloat(input.dataset.price) || 0;
      });
    }

    const qty = parseInt(qtyEl?.textContent) || 1;
    const unitPrice = basePrice + extraPrice;
    const total = unitPrice * qty;
    const totalKhr = Math.round(total * 4100);

    priceEl.innerHTML = `$${total.toFixed(2)} <span style="font-size: 0.75rem; color: #94A3B8; font-weight: normal;">(${totalKhr.toLocaleString()} ៛)</span>`;
  }

  updateDetailModalQty(change) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    const qtyEl = document.getElementById("detailModalQty");
    if (!qtyEl) return;

    let qty = parseInt(qtyEl.textContent) || 1;
    qty = Math.max(1, qty + change);
    qtyEl.textContent = qty;

    const basePrice = this.currentStore?.products?.find(p => p.id === this.currentDetailProductId)?.price || 0;
    this.recalculateDetailModalPrice(basePrice);
  }

  addToCart(product, qty, selectedOptions, unitPrice) {
    if (window.telegramTma) window.telegramTma.hapticNotification("success");
    if (window.khqrService) window.khqrService.playPopSound();

    const existingIndex = this.cart.findIndex(item => 
      item.product.id === product.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
      this.cart[existingIndex].lineTotal = this.cart[existingIndex].qty * this.cart[existingIndex].unitPrice;
    } else {
      this.cart.push({
        product,
        qty,
        selectedOptions,
        unitPrice,
        lineTotal: qty * unitPrice
      });
    }

    window.app.showToast(`+${qty} ${product.name} ${window.storeEngine.t("itemAdded")}`, "success");
    this.refreshCurrentView();
  }

  refreshCurrentView() {
    if (window.app.currentView === "builder") {
      window.storeBuilder.updateSimulator(this.currentStore);
    } else {
      this.renderFullStore(this.currentStore);
    }
  }

  openCartModal() {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    const modal = document.getElementById("storeCartModal");
    if (!modal || !this.currentStore) return;

    const itemsContainer = document.getElementById("cartItemsList");
    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">${window.storeEngine.t("emptyCart")}</div>`;
      document.getElementById("cartSubtotal").textContent = "$0.00";
      document.getElementById("cartDeliveryFee").textContent = "$0.00";
      document.getElementById("cartTotal").textContent = "$0.00";
      document.getElementById("cartTotalKhr").textContent = "0 ៛";
      modal.classList.add("active");
      return;
    }

    itemsContainer.innerHTML = this.cart.map((item, idx) => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="flex: 1;">
          <strong style="color: #FFFFFF; font-size: 0.9rem;">${item.product.name}</strong>
          ${item.selectedOptions.length > 0 ? `<div style="font-size: 0.72rem; color: var(--text-muted);">${item.selectedOptions.join(', ')}</div>` : ''}
          <div style="color: var(--accent-gold); font-size: 0.85rem; font-weight: 700;">$${item.unitPrice.toFixed(2)}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" style="width: 28px; height: 28px; padding: 0;" onclick="window.storeView.updateCartQty(${idx}, -1)">-</button>
          <span style="font-weight: 700; width: 20px; text-align: center;">${item.qty}</span>
          <button class="btn btn-secondary btn-sm" style="width: 28px; height: 28px; padding: 0;" onclick="window.storeView.updateCartQty(${idx}, 1)">+</button>
        </div>
      </div>
    `).join('');

    const subtotal = this.cart.reduce((s, i) => s + i.lineTotal, 0);
    const deliveryFee = this.currentStore.deliveryFee || 1.00;
    const total = subtotal + deliveryFee;
    const totalKhr = Math.round(total * 4100);

    document.getElementById("cartSubtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("cartDeliveryFee").textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
    document.getElementById("cartTotalKhr").textContent = `${totalKhr.toLocaleString()} ៛`;

    modal.classList.add("active");
  }

  updateCartQty(index, change) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    if (!this.cart[index]) return;
    this.cart[index].qty += change;
    if (this.cart[index].qty <= 0) {
      this.cart.splice(index, 1);
    } else {
      this.cart[index].lineTotal = this.cart[index].qty * this.cart[index].unitPrice;
    }
    this.openCartModal();
    this.refreshCurrentView();
  }

  proceedToCheckout() {
    if (window.telegramTma) window.telegramTma.hapticImpact("medium");
    if (this.cart.length === 0) {
      window.app.showToast("Your cart is empty!", "warning");
      return;
    }

    document.getElementById("storeCartModal").classList.remove("active");
    const checkoutModal = document.getElementById("storeCheckoutModal");

    const subtotal = this.cart.reduce((s, i) => s + i.lineTotal, 0);
    const deliveryFee = this.currentStore.deliveryFee || 1.00;
    const total = subtotal + deliveryFee;

    document.getElementById("checkoutSummaryTotal").textContent = `$${total.toFixed(2)} (${Math.round(total * 4100).toLocaleString()} ៛)`;

    checkoutModal.classList.add("active");
  }

  submitOrder() {
    const name = document.getElementById("checkoutCustName").value.trim();
    const phone = document.getElementById("checkoutCustPhone").value.trim();
    const address = document.getElementById("checkoutCustAddress").value.trim();
    const notes = document.getElementById("checkoutCustNotes").value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "KHQR";

    if (!name || !phone || !address) {
      window.app.showToast(window.storeEngine.t("enterDetails"), "warning");
      return;
    }

    const subtotal = this.cart.reduce((s, i) => s + i.lineTotal, 0);
    const deliveryFee = this.currentStore.deliveryFee || 1.00;
    const total = subtotal + deliveryFee;

    const orderItems = this.cart.map(i => ({
      id: i.product.id,
      name: i.product.name,
      price: i.unitPrice,
      qty: i.qty,
      options: i.selectedOptions,
      lineTotal: i.lineTotal
    }));

    const newOrder = window.storeEngine.createOrder({
      storeId: this.currentStore.id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      customer: { name, phone, address, notes },
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID"
    });

    this.activeOrder = newOrder;
    this.cart = [];
    this.refreshCurrentView();

    document.getElementById("storeCheckoutModal").classList.remove("active");

    // Trigger Instant Telegram Notification to the Merchant!
    if (window.telegramTma) {
      window.telegramTma.sendMerchantOrderNotification(newOrder, this.currentStore);
    }

    if (paymentMethod === "KHQR") {
      this.openKhqrPaymentModal(newOrder);
    } else {
      if (window.khqrService) window.khqrService.playSuccessSound();
      window.app.showToast(window.storeEngine.t("orderConfirmed"), "success");
      this.showOrderTrackingModal(newOrder);
    }
  }

  openKhqrPaymentModal(order) {
    if (window.telegramTma) window.telegramTma.hapticImpact("medium");
    const modal = document.getElementById("khqrPaymentModal");
    const canvas = document.getElementById("khqrCanvas");

    document.getElementById("khqrModalStoreName").textContent = this.currentStore.nameKh || this.currentStore.name;
    document.getElementById("khqrModalAmount").textContent = `$${order.total.toFixed(2)}`;
    document.getElementById("khqrModalAmountKhr").textContent = `${order.totalKhr.toLocaleString()} ៛`;

    if (window.khqrService && canvas) {
      window.khqrService.renderKhqrCanvas(canvas, {
        merchantName: this.currentStore.paymentConfig?.khqrMerchantName || this.currentStore.name,
        bakongId: this.currentStore.paymentConfig?.khqrBakongId || "merchant@aba",
        amount: order.total,
        currency: "USD"
      });
    }

    modal.classList.add("active");
  }

  simulateKhqrSuccess() {
    if (window.telegramTma) window.telegramTma.hapticNotification("success");
    if (window.khqrService) window.khqrService.playSuccessSound();

    document.getElementById("khqrPaymentModal").classList.remove("active");
    window.app.showToast(window.storeEngine.t("paidWithKhqr"), "success");

    if (this.activeOrder) {
      window.storeEngine.updateOrderStatus(this.activeOrder.id, "PREPARING");
      this.showOrderTrackingModal(this.activeOrder);
    }
  }

  showOrderTrackingModal(order) {
    const modal = document.getElementById("orderTrackingModal");
    if (!modal) return;

    document.getElementById("trackOrderId").textContent = `#${order.id}`;
    document.getElementById("trackStoreName").textContent = order.storeName;
    document.getElementById("trackTotal").textContent = `$${order.total.toFixed(2)}`;

    this.updateTrackingStepper(order.status);
    modal.classList.add("active");
  }

  updateTrackingStepper(status) {
    const steps = ["PENDING", "PREPARING", "DELIVERING", "COMPLETED"];
    const currentIdx = steps.indexOf(status);

    document.querySelectorAll(".order-stepper .step-item").forEach((step, idx) => {
      step.classList.toggle("completed", idx < currentIdx);
      step.classList.toggle("active", idx === currentIdx);
    });
  }

  openCustomerOrdersModal() {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    
    const modal = document.getElementById("storeCustomerOrdersModal");
    const container = document.getElementById("customerModalOrdersList");
    if (!modal || !container) return;

    const allOrders = window.storeEngine.getAllOrders();
    const storeOrders = this.currentStore 
      ? allOrders.filter(o => o.storeId === this.currentStore.id)
      : allOrders;

    if (storeOrders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📦</div>
          <h4 style="font-size: 1.1rem; color: #FFFFFF; font-weight: 700; margin-bottom: 0.3rem;">មិនទាន់មានការកុម្ម៉ង់នៅឡើយទេ</h4>
          <p style="font-size: 0.85rem; color: #94A3B8;">ជ្រើសរើសទំនិញដាក់កន្ត្រក និងធ្វើការកុម្ម៉ង់ដើម្បីតាមដានទីនេះ!</p>
        </div>
      `;
    } else {
      container.innerHTML = storeOrders.map(ord => `
        <div class="store-card" style="margin-bottom: 1rem; padding: 1rem; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <div>
              <strong style="color: #FFFFFF; font-size: 0.95rem;">Order #${ord.id}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(ord.createdAt).toLocaleTimeString()} (${new Date(ord.createdAt).toLocaleDateString()})</div>
            </div>
            <span style="font-size: 0.78rem; font-weight: 700; background: ${ord.status === 'COMPLETED' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}; color: ${ord.status === 'COMPLETED' ? '#10B981' : '#A5B4FC'}; padding: 0.25rem 0.6rem; border-radius: 99px;">
              ${ord.status}
            </span>
          </div>

          <div style="margin-bottom: 0.5rem;">
            ${ord.items.map(i => `
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #CBD5E1; margin-bottom: 0.2rem;">
                <span>${i.qty}x ${i.name}</span>
                <span style="color: #FFFFFF; font-weight: 600;">$${i.lineTotal.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.5rem; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">ទូទាត់: <strong style="color: ${ord.paymentStatus === 'PAID' ? '#10B981' : '#F59E0B'}">${ord.paymentMethod}</strong></span>
            <span style="font-size: 1.05rem; font-weight: 800; color: #F59E0B;">$${ord.total.toFixed(2)}</span>
          </div>
        </div>
      `).join('');
    }

    modal.classList.add("active");
  }
}

window.storeView = new StoreView();
