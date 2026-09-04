/**
 * StoreEngine - Central Data Store & Multi-Tenant State Manager
 * Real-Time Cloud Sync (Enables Cross-Device Merchant & Customer Store Sharing)
 */

class StoreEngine {
  constructor() {
    this.STORAGE_KEY_STORES = "omnimini_stores_v2";
    this.STORAGE_KEY_ORDERS = "omnimini_orders_v2";
    this.STORAGE_KEY_ACTIVE_STORE = "omnimini_active_store_id";
    this.STORAGE_KEY_LANG = "omnimini_lang";
    
    this.lang = localStorage.getItem(this.STORAGE_KEY_LANG) || "km";
    this.listeners = [];
    this.stores = [];
    this.orders = [];
    this.initData();
  }

  initData() {
    const rawStores = localStorage.getItem(this.STORAGE_KEY_STORES);
    if (!rawStores) {
      this.stores = JSON.parse(JSON.stringify(DEFAULT_STORES));
      this.saveStores(false);
    } else {
      try {
        this.stores = JSON.parse(rawStores);
      } catch (e) {
        this.stores = JSON.parse(JSON.stringify(DEFAULT_STORES));
      }
    }

    const rawOrders = localStorage.getItem(this.STORAGE_KEY_ORDERS);
    if (!rawOrders) {
      this.orders = [];
    } else {
      try {
        this.orders = JSON.parse(rawOrders);
      } catch (e) {
        this.orders = [];
      }
    }

    // Sync stores from Cloud Server
    this.syncFromCloudServer();
  }

  async syncFromCloudServer() {
    try {
      const res = await fetch('/api/stores');
      const data = await res.json();
      if (data && data.ok && Array.isArray(data.stores)) {
        // Merge cloud stores with local
        data.stores.forEach(cloudStore => {
          const idx = this.stores.findIndex(s => s.id === cloudStore.id || s.slug === cloudStore.slug);
          if (idx > -1) {
            this.stores[idx] = { ...this.stores[idx], ...cloudStore };
          } else {
            this.stores.unshift(cloudStore);
          }
        });
        localStorage.setItem(this.STORAGE_KEY_STORES, JSON.stringify(this.stores));
        this.notify("stores_updated", this.stores);
      }
    } catch (e) {
      console.warn("Could not sync stores from server:", e);
    }
  }

  saveStores(syncToCloud = true) {
    localStorage.setItem(this.STORAGE_KEY_STORES, JSON.stringify(this.stores));
    this.notify("stores_updated", this.stores);

    if (syncToCloud && this.stores.length > 0) {
      // Sync active/latest store to cloud
      this.stores.forEach(s => {
        fetch('/api/stores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s)
        }).catch(() => {});
      });
    }
  }

  saveOrders() {
    localStorage.setItem(this.STORAGE_KEY_ORDERS, JSON.stringify(this.orders));
    this.notify("orders_updated", this.orders);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(event, data) {
    this.listeners.forEach(cb => {
      try { cb(event, data); } catch (e) { console.error("Listener error:", e); }
    });
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem(this.STORAGE_KEY_LANG, lang);
    this.notify("lang_changed", lang);
  }

  t(key) {
    const dict = I18N[this.lang] || I18N.km;
    return dict[key] || key;
  }

  getAllStores() {
    return this.stores;
  }

  getStoreById(storeId) {
    return this.stores.find(s => s.id === storeId) || null;
  }

  getStoreBySlug(slug) {
    if (!slug) return null;
    const lower = slug.toLowerCase();
    return this.stores.find(s => s.slug?.toLowerCase() === lower || s.id?.toLowerCase() === lower) || null;
  }

  // Asynchronous cloud fetch for deep customer links
  async fetchStoreBySlugAsync(slug) {
    if (!slug) return null;
    const local = this.getStoreBySlug(slug);
    if (local) return local;

    try {
      const res = await fetch(`/api/stores/${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data && data.ok && data.store) {
        this.stores.unshift(data.store);
        localStorage.setItem(this.STORAGE_KEY_STORES, JSON.stringify(this.stores));
        this.notify("stores_updated", this.stores);
        return data.store;
      }
    } catch (e) {
      console.warn("Cloud store fetch error:", e);
    }
    return null;
  }

  createStore(storeData) {
    const newId = "store_" + Date.now();
    let cleanSlug = (storeData.name || storeData.nameKh || "store")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!cleanSlug) cleanSlug = "store";

    const newStore = {
      id: newId,
      slug: `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`,
      name: storeData.name || "My New Mini App",
      nameKh: storeData.nameKh || "ហាង Mini App ថ្មីរបស់ខ្ញុំ",
      tagline: storeData.tagline || "Welcome to our store!",
      taglineKh: storeData.taglineKh || "សូមស្វាគមន៍មកកាន់ហាងយើងខ្ញុំ!",
      category: storeData.category || "cafe",
      logo: storeData.logo || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=240&auto=format&fit=crop&q=80",
      banner: storeData.banner || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
      theme: {
        primaryColor: storeData.primaryColor || "#0F766E",
        secondaryColor: storeData.secondaryColor || "#14B8A6",
        accentColor: storeData.accentColor || "#F59E0B",
        bgColor: "#0B0F19",
        textColor: "#F8FAFC",
        cardBg: "#111827",
        fontFamily: "'Plus Jakarta Sans', 'Kantumruy Pro', sans-serif",
        borderRadius: "16px"
      },
      blocks: [
        { id: "b_hero", type: "hero_banner", enabled: true, title: "Special Opening Promo! 🎉", subtitle: "Welcome to our official Telegram store", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&auto=format&fit=crop&q=80" },
        { id: "b_announce", type: "announcement", enabled: true, text: "🎉 សូមស្វាគមន៍មកកាន់ Mini App ហាងយើងខ្ញុំ!" },
        { id: "b_categories", type: "category_bar", enabled: true },
        { id: "b_all", type: "product_grid", enabled: true, title: "មុខទំនិញទាំងអស់ / All Products" },
        { id: "b_contact", type: "store_info", enabled: true, address: "Phnom Penh, Cambodia", phone: "+855 12 345 678", telegram: "my_store_kh" }
      ],
      categories: [
        { id: "cat_main", name: "Special / ពិសេស", icon: "⭐" },
        { id: "cat_general", name: "General / ទូទៅ", icon: "📦" }
      ],
      products: [
        {
          id: "prod_init_1",
          categoryId: "cat_main",
          name: "Signature Item",
          nameKh: "ទំនិញពិសេសប្រចាំហាង",
          price: 5.00,
          originalPrice: 6.50,
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
          description: "High quality signature product curated for our loyal customers.",
          descriptionKh: "ទំនិញគុណភាពខ្ពស់ដែលបានជ្រើសរើសយ៉ាងពិសេសសម្រាប់អតិថិជន។",
          badge: "FEATURED",
          options: []
        }
      ],
      paymentConfig: {
        khqrMerchantName: (storeData.name || "MY MINI APP STORE").toUpperCase(),
        khqrBakongId: "mystore@aba",
        khqrAccountId: "012 345 678",
        currency: "USD",
        usdRateToKhr: 4100,
        enableCod: true,
        enableKhqr: true
      },
      ordersCount: 0,
      rating: 5.0,
      deliveryFee: 1.00,
      estimatedMinutes: "20-30"
    };

    this.stores.unshift(newStore);
    this.saveStores(true);
    return newStore;
  }

  updateStore(storeId, updatedFields) {
    const idx = this.stores.findIndex(s => s.id === storeId);
    if (idx === -1) return null;

    this.stores[idx] = {
      ...this.stores[idx],
      ...updatedFields,
      theme: {
        ...this.stores[idx].theme,
        ...(updatedFields.theme || {})
      },
      paymentConfig: {
        ...this.stores[idx].paymentConfig,
        ...(updatedFields.paymentConfig || {})
      }
    };

    this.saveStores(true);
    return this.stores[idx];
  }

  deleteStore(storeId) {
    this.stores = this.stores.filter(s => s.id !== storeId);
    this.saveStores(true);
  }

  // Product CRUD
  addProduct(storeId, productData) {
    const store = this.getStoreById(storeId);
    if (!store) return null;

    const newProduct = {
      id: "prod_" + Date.now(),
      categoryId: productData.categoryId || (store.categories[0] ? store.categories[0].id : "cat_general"),
      name: productData.name || "New Product",
      nameKh: productData.nameKh || productData.name || "ទំនិញថ្មី",
      price: parseFloat(productData.price) || 1.00,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      image: productData.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80",
      description: productData.description || "",
      descriptionKh: productData.descriptionKh || "",
      badge: productData.badge || "",
      options: productData.options || []
    };

    store.products.unshift(newProduct);
    this.saveStores(true);
    return newProduct;
  }

  updateProduct(storeId, productId, productData) {
    const store = this.getStoreById(storeId);
    if (!store) return null;

    const pIdx = store.products.findIndex(p => p.id === productId);
    if (pIdx === -1) return null;

    store.products[pIdx] = {
      ...store.products[pIdx],
      ...productData,
      price: parseFloat(productData.price) || store.products[pIdx].price,
      originalPrice: productData.originalPrice !== undefined ? (productData.originalPrice ? parseFloat(productData.originalPrice) : null) : store.products[pIdx].originalPrice
    };

    this.saveStores(true);
    return store.products[pIdx];
  }

  deleteProduct(storeId, productId) {
    const store = this.getStoreById(storeId);
    if (!store) return false;

    store.products = store.products.filter(p => p.id !== productId);
    this.saveStores(true);
    return true;
  }

  // Orders Management
  createOrder(orderData) {
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const store = this.getStoreById(orderData.storeId);
    
    const newOrder = {
      id: orderId,
      storeId: orderData.storeId,
      storeName: store ? (store.nameKh || store.name) : "Mini App Store",
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total,
      totalKhr: Math.round(orderData.total * 4100),
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod || "KHQR",
      paymentStatus: orderData.paymentStatus || "PENDING",
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    if (store) {
      store.ordersCount = (store.ordersCount || 0) + 1;
      this.saveStores(true);
    }

    // Sync order to Cloud Server
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const ord = this.orders.find(o => o.id === orderId);
    if (!ord) return null;

    ord.status = status;
    if (status === "COMPLETED" || status === "DELIVERING") {
      ord.paymentStatus = "PAID";
    }
    this.saveOrders();
    return ord;
  }

  getOrdersForStore(storeId) {
    return this.orders.filter(o => o.storeId === storeId);
  }

  getAllOrders() {
    return this.orders;
  }
}

// Global singleton instance
window.storeEngine = new StoreEngine();
