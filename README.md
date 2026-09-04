# 🛍️ OmniMini - Telegram Mini App E-Commerce Platform & Bot

ប្រព័ន្ធបង្កើត និងគ្រប់គ្រង Mini App ហាងទំនិញផ្ទាល់ខ្លួនលើ Telegram ជាមួយ Bakong KHQR Payment (Full-Stack Express + Telegram Bot + Merchant Studio)។

---

## 📁 រចនាសម្ព័ន្ធ Project (Clean Structure)

```text
shop/
├── server.js              # Express Web Server + Telegram Bot Long-Polling
├── package.json           # Node.js dependencies & scripts
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── render.yaml            # Render Blueprint deployment config
├── README.md              # Documentation & Deployment Guide
├── index.html             # Telegram Mini App SPA
├── js/                    # JavaScript modules (KHQR, TMA SDK, Engine, View, Builder)
└── styles/                # CSS Stylesheets (Main, Marketplace, Builder, Store, Telegram)
```

---

## 🚀 របៀប Run លើកុំព្យូទ័រផ្ទាល់ (Local Development)

1. **ដំឡើង Dependencies:**
   ```bash
   npm install
   ```

2. **ដំណើរការ Server & Bot:**
   ```bash
   npm start
   ```
   *(ឬ `node server.js`)*

3. បើក Browser ទៅកាន់៖ `http://localhost:3000`

---

## 🌐 របៀប Push ទៅកាន់ GitHub

1. **Initialize Git & Commit:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete omnimini telegram mini app and bot server"
   ```

2. **ភ្ជាប់ជាមួយ GitHub Repo របស់អ្នក:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## ☁️ របៀប Deploy លើ Render.com (Free Web Service 24/7)

1. ចូលទៅកាន់ [Render.com](https://render.com) ហើយ Login
2. ចុច **New +** ➔ ជ្រើសរើស **Web Service**
3. ភ្ជាប់ជាមួយ **GitHub Repository** របស់អ្នក
4. កំណត់ដូចខាងក្រោម៖
   - **Name:** `omnimini-shop`
   - **Language/Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. ត្រង់កន្លែង **Environment Variables** បន្ថែម៖
   - `BOT_TOKEN` = `8154757152:AAHG-4c8LdtbEzm6cbQ7-YOm_Kd5xrJpvBo`
   - `WEB_APP_URL` = *(URL ដែល Render ផ្ដល់ឱ្យ ឧទាហរណ៍ `https://omnimini-shop.onrender.com`)*
6. ចុច **Deploy Web Service** ជាការស្រេច!

---

## 🤖 របៀបកំណត់ក្នុង Telegram @BotFather

1. ចូលទៅកាន់ [@BotFather](https://t.me/BotFather) ក្នុង Telegram
2. វាយ `/mybots` ➔ ជ្រើសរើស Bot របស់អ្នក
3. ចុច **Bot Settings** ➔ **Menu Button** ➔ **Configure menu button**
4. ផ្ញើ Render URL របស់អ្នក (ឧ. `https://omnimini-shop.onrender.com`)
5. ដាក់ Button Text: `🛍️ បើកហាង Mini App`
6. បន្ទាប់មក ពេលណាអ្នកប្រើប្រាស់ចុចលើ Bot នោះប៊ូតុង Menu Mini App នឹងបង្ហាញឡើងភ្លាមៗ!
