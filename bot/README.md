# 🤖 Bekzod Idiyev — Telegram Bot Engine (v2.0)

Ushbu bot **Bekzod Idiyev**ning rasmiy portfolio boti bo'lib, **Python aiogram 3.x** va **Vercel Serverless Webhook** asosida ishlab chiqilgan.

---

## 🌟 Imkoniyatlar:
- 🚀 **Telegram Mini App (Web App):** 3D portfolioni Telegram ichida to'liq ekranda ochish
- 👨‍💻 **Men Haqimda:** Bio, School 21 Data Science va backend arxitekturasi
- 📂 **Loyihalar Katalogi:** Buddy Team, Esports Bot, PeerLearn Mini App va Paynet CRM (inline kod va demo havolalari)
- 🛠️ **Ko'nikmalar:** Python, FastAPI, Django, PostgreSQL, Docker, Redis, Celery
- 📄 **Rezyume / CV:** PDF yuklab olish va online spetsifikatsiya
- ✍️ **FSM Xabar Qoldirish:** Foydalanuvchidan ism, kontakt va xabarni olib, shaxsan Bekzodga yetkazish
- 👑 **Admin Boshqaruv Paneli (`/admin`):** Statistika ko'rish va barcha a'zolarga xabar tarqatish (Broadcast)
- 🌐 **3 Tilli Tizim:** O'zbekcha, Ruscha, Inglizcha

---

## 🚀 Ishga Tushirish:

### 1-usul: Mahalliy yoki VPS Serverda Polling orqali yurgizish (Python)
```bash
# 1. Virtual muhit yaratish va kutubxonalarni o'rnatish
python3 -m venv .venv
source .venv/bin/activate
pip install -r bot/requirements.txt

# 2. Botni ishga tushirish
python3 -m bot.main
```

### 2-usul: Vercel Serverless Webhook orqali 24/7 Bepul Ishlatish
Vercel'ga loyihani deploy qilgandan so'ng, Telegram Webhookni sozlang:
```bash
curl -F "url=https://YOUR_VERCEL_DOMAIN.vercel.app/api/webhook" https://api.telegram.org/bot8708309461:AAGAh4Pz_Rfr4jHN8qRtkq9MbtEpT3Q5Hfc/setWebhook
```
