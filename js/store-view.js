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
            ${!isSimulator ? `<button class="store-back-btn" onclick="window.app.switchView('marketplace')" title="Back to Marketplace">←</button>` : ''}
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

    return `
      <div class="runtime-product-card" onclick="window.storeView.openProductDetailModal('${product.id}')">
        <div class="runtime-product-img-wrap">
          <img src="${product.image}" class="runtime-product-img" alt="${pName}" loading="lazy">
          ${product.badge ? `<span class="runtime-product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="runtime-product-body">
          <div class="runtime-product-name">${pName}</div>
          <div class="runtime-product-desc">${pDesc || ''}</div>
          <div class="runtime-product-footer">
            <div class="runtime-price-group">
              <span class="runtime-price-main">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="runtime-price-old">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="runtime-add-btn" onclick="event.stopPropagation(); window.storeView.quickAddToCart('${product.id}')">+</button>
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
        groupEl.innerHTML = `
          <div class="option-group-title">
            <span>${optGroup.name}</span>
            ${optGroup.required ? `<span style="color: #EF4444; font-size: 0.75rem;">Required</span>` : ''}
          </div>
          ${optGroup.choices.map((choice, cIdx) => `
            <label class="option-choice-row">
              <input type="${optGroup.type === 'multiple' ? 'checkbox' : 'radio'}" name="opt_group_${gIdx}" value="${choice.name}" data-price="${choice.price || 0}" ${cIdx === 0 && optGroup.required ? 'checked' : ''}>
              <span>${choice.name}</span>
              ${choice.price ? `<span style="color: var(--accent-gold); font-size: 0.8rem;">+$${choice.price.toFixed(2)}</span>` : ''}
            </label>
          `).join('')}
        `;
        optionsContainer.appendChild(groupEl);
      });
    }

    document.getElementById("detailModalQty").textContent = "1";
    document.getElementById("detailModalAddBtn").onclick = () => {
      const qty = parseInt(document.getElementById("detailModalQty").textContent) || 1;
      const selectedOptions = [];
      let extraPrice = 0;

      optionsContainer.querySelectorAll("input:checked").forEach(input => {
        selectedOptions.push(input.value);
        extraPrice += parseFloat(input.dataset.price) || 0;
      });

      this.addToCart(product, qty, selectedOptions, product.price + extraPrice);
      modal.classList.remove("active");
    };

    modal.classList.add("active");
  }

  updateDetailModalQty(change) {
    if (window.telegramTma) window.telegramTma.hapticImpact("light");
    const qtyEl = document.getElementById("detailModalQty");
    let qty = parseInt(qtyEl.textContent) || 1;
    qty = Math.max(1, qty + change);
    qtyEl.textContent = qty;
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
    window.app.switchView("orders");
  }
}

window.storeView = new StoreView();
