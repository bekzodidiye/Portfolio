# 🔀 MAJBURIY GIT VA PULL REQUEST (PR) STANDARTI

Har qanday yangilanish, o'zgarish, tuzatish yoki yangi funksiya kiritilganda quyidagi qadamlar **MAJBURIY** va **QAT'IY** bajariladi:

---

### 1. Hech qachon to'g'ridan-to'g'ri `main` tarmog'iga push qilinmaydi
Barcha o'zgarishlar alohida tarmoqda amalga oshiriladi:
* Yangi funksiyalar uchun: `feat/<funksiya-nomi>`
* Xatoliklarni tuzatish uchun: `fix/<xatolik-nomi>`

### 2. Standart ish oqimi (Workflow):
1. **Yangi tarmoq ochish:**
   ```bash
   git checkout -b feat/<nomi>
   ```
2. **O'zgarishlarni kiritish, sinash va commit qilish:**
   ```bash
   git add <fayllar>
   git commit -m "feat/fix(...): tavsif"
   git push -u origin feat/<nomi>
   ```
3. **Pull Request (PR) yaratish:**
   ```bash
   gh pr create --title "..." --body "..." --base main --head feat/<nomi>
   ```
4. **PR'ni `main` tarmog'iga merge qilish va tarmoqni tozalash:**
   ```bash
   gh pr merge <PR_raqami> --merge --delete-branch
   ```
5. **Mahalliy `main` ni eng so'nggi holatga keltirish:**
   ```bash
   git checkout main && git pull origin main
   ```
