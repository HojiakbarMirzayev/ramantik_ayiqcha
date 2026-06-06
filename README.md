# Ramantik Ayiqcha 🧸🌹

Sevishganlar uchun romantik sovg'a — yumshoq ayiqcha sotuv sayti.
Mijoz ism + telefon qoldirsa, ma'lumot avtomatik Telegram botga keladi.

## Tuzilma
```
index.html        — sahifa
css/style.css     — dizayn
js/main.js        — animatsiyalar + forma
api/order.js      — MAXFIY serverless function (Telegramga yuboradi)
```

## ⚠️ Muhim: Maxfiy sozlamalar (env variables)
Bot tokeni kodda YO'Q. Vercel'da quyidagi 2 ta o'zgaruvchi qo'shilishi shart:

| Nomi | Qiymati |
|------|---------|
| `TG_TOKEN`   | Telegram bot tokeni (BotFather bergan) |
| `TG_CHAT_ID` | Buyurtma keladigan chat_id |

Vercel → Project → **Settings → Environment Variables** bo'limidan qo'shiladi.
Qo'shgandan keyin **Redeploy** qilish kerak.

## Deploy (Vercel)
1. Kodni GitHub'ga yuklang.
2. vercel.com → **Add New → Project** → GitHub repo'ni import qiling.
3. Yuqoridagi env o'zgaruvchilarni qo'shing.
4. **Deploy** bosing.
