# fixTokWeb

אתר שיווקי סטטי ל-**[fix-tok.com](https://fix-tok.com)**. האפליקציה נמצאת ב-[fixTok](https://github.com/shimonlazimi24/fixTok) על **app.fix-tok.com**.

## מבנה

| נתיב | תפקיד |
|------|--------|
| `index.html` | דף הנחיתה |
| `fixtok.css` | עיצוב (Rubik, Heebo, כתום מותג) |
| `app.js` | ניווט, FAQ, reveal |
| `img/` | תמונות לדף |
| `shots/` | צילומי מסך להמחשה |
| `uploads/` | קבצי PDF ותמונות נוספות |
| `assets/` | לוגו ו-favicon |
| `marketing/` | OG וערכת שיווק |
| `robots.txt`, `sitemap.xml`, `llms.txt` | SEO ו-GEO |

## פיתוח מקומי

```bash
npm install
npm run dev
```

פתחו http://localhost:3000

## עריכת תוכן

ערכו ישירות את `index.html`, `fixtok.css` או `app.js` — אין שלב build.

## פריסה ב-Railway

1. **New Project** → Deploy from GitHub → `shimonlazimi24/fixTokWeb`.
2. שירות נפרד מהאפליקציה (fixTok).
3. `PORT` מוגדר אוטומטית; `npm start` מגיש את הקבצים הסטטיים.

### דומיין מותאם

1. ב-Railway: **Settings → Networking → Custom Domain** → `fix-tok.com` ו-`www.fix-tok.com`.
2. ב-DNS: CNAME ליעד Railway.
3. המתינו ל-HTTPS (Let's Encrypt אוטומטי).

### Google Search Console

1. הוסיפו נכס `https://fix-tok.com`.
2. שלחו sitemap: `https://fix-tok.com/sitemap.xml`

### GEO (מנועי AI)

- `https://fix-tok.com/llms.txt` — תקציר
- `https://fix-tok.com/llms-full.txt` — גרסה מפורטת

## רישיון

פרטי — FixTok.
