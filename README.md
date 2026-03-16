# 🎓 TikTok Shop Academy — Partner Training

Training interattivo per agenzie e TikTok Shop Partner.  
4 settimane + sezione Policy · 195 quiz · Tracking progressi · Recap finale.

## 🚀 Deploy su GitHub Pages — Passo per passo

### Prerequisiti
- Un account GitHub (gratuito)
- Git installato sul computer ([scarica qui](https://git-scm.com/downloads))

### Step 1 — Crea il repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. **Repository name**: `tiktok-shop-academy`
3. Scegli **Public**
4. **NON** selezionare nessun file iniziale (no README, no .gitignore)
5. Clicca **Create repository**

> ⚠️ Se scegli un nome diverso da `tiktok-shop-academy`, devi aggiornare il campo `base` in `vite.config.js` con il nome esatto del repository.

### Step 2 — Carica i file

Apri il terminale nella cartella del progetto ed esegui:

```bash
git init
git add .
git commit -m "TikTok Shop Academy"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/tiktok-shop-academy.git
git push -u origin main
```

Sostituisci `TUO-USERNAME` con il tuo username GitHub.

### Step 3 — Attiva GitHub Pages

1. Vai nelle **Settings** del repository
2. Menu laterale → **Pages**
3. In **Source** seleziona **GitHub Actions**
4. Il deploy parte automaticamente ad ogni push su `main`

### Step 4 — Attendi il deploy

1. Vai nella tab **Actions** del repository
2. Vedrai il workflow "Deploy to GitHub Pages" in esecuzione
3. Quando diventa verde ✅, il sito è online

### 🔗 Il tuo sito sarà su:

```
https://TUO-USERNAME.github.io/tiktok-shop-academy/
```

---

## 💻 Sviluppo locale (opzionale)

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` nel browser.

---

## 📝 Personalizzazione

- **Nome repository diverso?** → Modifica `base` in `vite.config.js`
- **Dominio personalizzato?** → Crea un file `public/CNAME` con il tuo dominio, poi configura il DNS
- **Aggiungere domande?** → Modifica gli array quiz in `src/App.jsx`
