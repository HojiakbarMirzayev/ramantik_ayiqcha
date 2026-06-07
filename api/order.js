// Vercel Serverless Function — buyurtmani Telegram botga yuboradi.
// Token va chat_id MAXFIY env o'zgaruvchilarda turadi (brauzerga chiqmaydi).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const TOKEN = process.env.TG_TOKEN;

  // Lead qaerga tushishi kerak: shaxsiy chat + "Ramantik ayiqcha" guruhi.
  // (chat_id maxfiy emas — token bo'lmasa baribir yuborib bo'lmaydi)
  const RECIPIENTS = [
    process.env.TG_CHAT_ID || '5137983794',     // shaxsiy bot chat
    process.env.TG_GROUP_ID || '-5162543796'    // "Ramantik ayiqcha" guruhi
  ].filter(Boolean);

  if (!TOKEN) {
    return res.status(500).json({ ok: false, error: 'Server sozlanmagan (token yo\'q)' });
  }

  // body ni o'qish (Vercel JSON ni avtomatik parse qiladi, lekin himoya uchun tekshiramiz)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name  = String(body.name  || '').trim().slice(0, 80);
  const phone = String(body.phone || '').trim();

  // Validatsiya
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2) {
    return res.status(400).json({ ok: false, error: 'Ism noto\'g\'ri' });
  }
  // +998 + 9 raqam = 12 ta raqam
  if (!(digits.length === 12 && digits.startsWith('998'))) {
    return res.status(400).json({ ok: false, error: 'Telefon raqam noto\'g\'ri' });
  }
  const fullPhone = '+' + digits;

  const text =
    '🧸 <b>Yangi buyurtma — Ramantik Ayiqcha</b>\n\n' +
    '👤 <b>Ism:</b> ' + escapeHtml(name) + '\n' +
    '📞 <b>Telefon:</b> ' + fullPhone + '\n' +
    '🕒 ' + new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  try {
    // Har bir manzilga (shaxsiy + guruh) yuboramiz
    const results = await Promise.all(RECIPIENTS.map(async (chatId) => {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
        });
        const data = await tgRes.json();
        if (!data.ok) console.error('Telegram error (' + chatId + '):', data);
        return data.ok === true;
      } catch (e) {
        console.error('Yuborishda xato (' + chatId + '):', e);
        return false;
      }
    }));

    // Kamida bittasi yetib borsa — muvaffaqiyatli deb hisoblaymiz
    if (results.some(Boolean)) {
      return res.status(200).json({ ok: true });
    }
    return res.status(502).json({ ok: false, error: 'Telegram xatosi' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server xatosi' });
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
