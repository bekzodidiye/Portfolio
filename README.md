# ⚡ Bekzod Idiyev — Python Backend & Systems Architect Portfolio

> Zamonaviy, interaktiv, 3D vizualizatsiyaga ega va ko'p tilli (UZ / EN / RU) Senior Python Backend dasturchi portfolio platformasi.

![Portfolio Banner](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Asosiy Xususiyatlar (Key Features)

- **🎨 3D Cyber & Systems Visualizer**: Three.js va Canvas yordamida yaratilgan real vaqtli interaktiv orqa fon va tizimli telemetriya animatsiyalari.
- **⚡ GSAP ScrollTrigger Animations**: Har bir bo'lim va kartochka foydalanuvchi skroll qilganda silliq va dinamik ravishda ochiladi (Smooth Reveal).
- **💻 Interactive Terminal CLI Sandbox**: Brauzer ichidagi virtual Linux/Python konsoli (`help`, `skills`, `projects`, `contact`, `clear`, `sudo` buyruqlari bilan).
- **🌐 3 Tilli Tizim (i18n)**: O'zbekcha (UZ), Inglizcha (EN) va Ruscha (RU) tillarida bir zumda almashinuvchi to'liq lokalizatsiya.
- **🔍 Chuqur Loyiha Modallari (Architecture Modal)**: Har bir loyihaning arxitekturasi, backend stacki, ma'lumotlar bazasi sxemasi va natijalarini to'liq ko'rish imkoniyati (React Portal orqali `document.body` darajasida).
- **📄 Interactive CV / Resume Viewer**: Rezyumeni modal oynada ko'rish, qidirish va to'g'ridan-to'g'ri chop etish (`print`) yoki yuklab olish imkoniyati.
- **🐍 Python Contact Handler & .env Config**: Python dasturchisi uslubidagi dinamik kontakt formasi va production muhit o'zgaruvchilari ko'rinishi.
- **📱 100% Mobile Responsive & Touch-Friendly**: Barcha qurilmalarda (mobil, planshet, noutbuk, 4K monitor) mukammal moslashuvchanlik.
- **🚫 Zero-Scrollbar Design**: Barcha modallar va ichki skroll konteynerlarida ko'rinmaydigan toza skroll (`no-scrollbar`).

---

## 🛠️ Texnologiyalar Stacki (Tech Stack)

### Frontend & UI
- **Core**: React 19 + TypeScript 5.8 + Vite 6
- **Styling**: Tailwind CSS v4 (Modern Utility-first CSS)
- **3D & Visuals**: Three.js (WebGL rendering)
- **Animations**: GSAP (GreenSock) + ScrollTrigger plugin, Motion (Framer Motion v12)
- **Icons**: Lucide React
- **Effects**: Canvas Confetti, Custom 3D Tilt & Magnetic Physics

### Dasturchining Asosiy Texnologiyalari (Backend Domain)
- **Languages**: Python 3.11+, SQL, TypeScript
- **Frameworks & Libs**: FastAPI, Django, aiogram 3.x, Asyncio, Celery, SQLAlchemy, Tortoise-ORM
- **Databases & Caching**: PostgreSQL, Redis, SQLite
- **DevOps & Architecture**: Docker, Docker Compose, Nginx, RESTful APIs, Microservices, CI/CD

---

## 📁 Loyiha Strukturasi (Folder Structure)

Loyiha qat'iy **Single Responsibility Principle (SRP)** va **200 qatordan oshmaslik** qoidasi asosida modullarga ajratilgan:

```
src/
├── components/             # Qayta ishlatiluvchi UI va bo'lim komponentlari
│   ├── AnimatedCounter.tsx    # Raqamlarni animatsiya bilan hisoblagich
│   ├── ContactFormEditor.tsx  # Python contact_handler formasi
│   ├── ContactQuickCards.tsx  # Telefon, Email, Telegram va Buxoro vaqti kartalari
│   ├── ContactSection.tsx     # Asosiy kontakt bo'limi
│   ├── EduTimelineCard.tsx    # Ta'lim yo'nalishi kartasi
│   ├── Footer.tsx             # Sayt pastki qismi va ijtimoiy havolalar
│   ├── HeroSection.tsx        # Hero banner, sarlavha va CTA tugmalari
│   ├── HeroSystemVisualizer.tsx # Tizim telemetriyasi va API metrikalari
│   ├── LanguageSwitcher.tsx   # UZ / EN / RU til almashtirgichi
│   ├── MagneticButton.tsx     # Sichqonchaga tortiluvchi magnit tugma
│   ├── ModernBackground.tsx   # 3D va dinamik fon qatlami
│   ├── Navbar.tsx             # Asosiy sticky navigatsiya paneli
│   ├── ProjectCard.tsx        # Alohida loyiha kartasi
│   ├── ProjectModal.tsx       # Loyiha arxitekturasini ko'rsatuvchi modal
│   ├── ProjectsSection.tsx    # Asosiy loyihalar bo'limi
│   ├── ResumeModal.tsx        # Rezyume (CV) ko'rish va yuklab olish modali
│   ├── ScrollProgressBar.tsx  # Sahifa skroll progress indikatori
│   ├── SkillTiltCard.tsx      # 3D sichqoncha harakatiga moslashuvchi ko'nikma kartasi
│   ├── SkillsSection.tsx      # Texnologiyalar matritsasi bo'limi
│   ├── SpotlightCard.tsx      # Radial nur effektli karta
│   ├── TerminalAbout.tsx      # Men haqimda va Terminal sarlavhasi
│   ├── TerminalCliWindow.tsx  # Interaktiv buyruqlar qatori oynasi
│   ├── TimelineSection.tsx    # Ish va ta'lim tajribasi bo'limi
│   ├── WorkTimelineCard.tsx   # Ish tajribasi kartasi
│   └── subtleThreeScene.ts    # WebGL 3D zarrachalar render logikasi
├── context/
│   └── LanguageContext.tsx    # Ko'p tillilik (i18n) global holati
├── data/
│   ├── portfolioData.ts       # Barcha statik loyihalar, tajriba va profillar
│   └── translations/          # UZ, EN, RU tarjima lug'atlari
│       ├── uz.ts
│       ├── en.ts
│       ├── ru.ts
│       └── index.ts
├── hooks/
│   ├── useGsapDepthParallax.ts # 3D chuqurlik va parallaks hooki
│   ├── useGsapReveal.ts       # GSAP ScrollTrigger kirish animatsiyalari
│   └── useInView.ts           # Element ko'rinishini kuzatish hooki
├── types/
│   ├── portfolio.ts           # Portfolio ma'lumotlar modellari
│   └── translations.ts        # Tarjima tiplari va interfeyslari
├── App.tsx                    # Asosiy sahifa yig'uvchi komponent
├── index.css                  # Global Tailwind stillari va utilitylar
└── main.tsx                   # React DOM render kirish nuqtasi
```

---

## 🚀 Ishga Tushirish (Getting Started)

### Talablar (Prerequisites)
- **Node.js**: `v18.0.0` yoki undan yuqori
- **npm** yoki **pnpm** / **yarn**

### 1. Repozitoriyani klonlash
```bash
git clone https://github.com/bekzodidiyev/portfolio.git
cd portfolio
```

### 2. Bog'liqliklarni o'rnatish (Install Dependencies)
```bash
npm install
```

### 3. Dasturni rivojlantirish (Development) rejimida ishga tushirish
```bash
npm run dev
```
Dastur avtomatik ravishda `http://localhost:3000` manzilida ishga tushadi.

### 4. Kodni tekshirish (Typecheck & Lint)
```bash
npm run lint
```

### 5. Production uchun yig'ish (Build)
```bash
npm run build
```
Tayyorlangan fayllar `dist/` papkasida hosil bo'ladi.

---

## 👨‍💻 Muallif Haqida (About the Author)

- **Ism-familiya**: Bekzod Idiyev
- **Soha**: Python Backend Developer & High-Load Architect
- **Joylashuv**: Buxoro, O'zbekiston
- **Telegram**: [@toyneden](https://t.me/toyneden)
- **Email**: [Bekzodidiye@gmail.com](mailto:Bekzodidiye@gmail.com)
- **Telefon**: +998 94 613 87 86

---

## 📄 Litsenziya (License)

Ushbu loyiha [MIT License](LICENSE) asosida ochiq manba sifatida taqdim etiladi.
