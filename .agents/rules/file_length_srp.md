# 📏 SENIOR SRP & FILE LENGTH LIMIT STANDARTI (MAX ~200 QATOR)

Loyiha arxitekturasi va kod sifatini Senior darajada saqlash uchun quyidagi qoidalar **MAJBURIY** va **QAT'IY** hisoblanadi:

---

### 1. Bitta faylda 200 qatordan oshiq kod bo'lmasligi shart (Single Responsibility Principle - SRP)
* Har qanday React komponenti, servis yoki yordamchi fayl maksimal **~200 qator** atrofida bo'lishi lozim.
* 200 qatordan oshgan har qanday fayl monolitik hisoblanadi va darhol modullarga (sub-components, custom hooks, helper utilities) bo'linishi kerak.

### 2. Modullashtirish qoidalari:
1. **React komponentlari:**
   - Katta sahifa yoki komponentlar o'zining ichki elementlarini (masalan, `MobileMenu`, `ModalContent`, `RoleSelector`, `CodeTemplates`, `DetailsPanel`) alohida kichik komponentlarga ajratishi lozim.
   - Og'ir logika `custom hook` larga (`useXxx.ts`) ko'chirilishi kerak.
2. **Servislar va Utility fayllar:**
   - Masalan, `visitorTelemetry.ts` apparatura, tarmoq va geolokatsiya funksiyalarini alohida `visitorHardware.ts`, `visitorNetwork.ts`, `visitorGeoProviders.ts` kabi ixtisoslashgan modullarga bo'lishi kerak.
   - Xabar formatlari yoki shablonlar (masalan, Telegram xabarlari shablonlari) `telegramMessageBuilder.ts` kabi alohida fayllarga ajratilishi lozim.
3. **Statik ma'lumotlar va konfiguratsiyalar:**
   - Ma'lumot massivlari, shablonlar yoki lug'atlar UI komponent ichida turmasligi, `*.data.ts` yoki alohida `constants.ts` fayllariga chiqarilishi kerak.

### 3. Har doim tekshirish tartibi (Audit & Verification):
Har bir PR oldidan loyihadagi fayllar uzunligi quyidagi buyruq orqali tekshirilishi shart:
```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + | sort -rn
```
Agar 200 qatordan oshib ketgan biznes-kod yoki UI fayl aniqlansa, darhol refactoring qilinishi shart!
