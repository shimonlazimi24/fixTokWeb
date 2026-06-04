# fixTokWeb

אתר שיווקי סטטי ל-**[fix-tok.com](https://fix-tok.com)**. האפליקציה נמצאת ב-[fixTok](https://github.com/shimonlazimi24/fixTok) על **app.fix-tok.com**.

## מבנה

| נתיב | תפקיד |
|------|--------|
| `content/copy.he.mjs` | כל הטקסטים בעברית |
| `content/links.mjs` | קישורי אפליקציה + UTM |
| `content/seo.mjs` | מטא, Schema.org |
| `scripts/build.mjs` | בניית `index.html`, `contact.html` |
| `styles/landing.css` | עיצוב יוקרתי (Heebo, כתום מותג) |
| `public/` | מקור ל-robots, sitemap, llms |
| `marketing/` | ערכת שיווק + OG |

## פיתוח מקומי

```bash
npm install
npm run dev
```

פתחו http://localhost:3000

## עריכת תוכן

1. ערכו `content/copy.he.mjs` (או `links.mjs` / `seo.mjs`).
2. הריצו `npm run build`.
3. פרסמו מחדש.

פסקאות מוכנות לרשתות: `marketing/snippets.md`.

## פריסה ב-Railway

1. **New Project** → Deploy from GitHub → `shimonlazimi24/fixTokWeb`.
2. שירות נפרד מהאפליקציה (fixTok).
3. משתני סביבה: אין חובה; `PORT` מוגדר אוטומטית.
4. Build: Nixpacks מריץ `npm install` + `npm start` (כולל `prestart` → build).

### דומיין מותאם

1. ב-Railway: **Settings → Networking → Custom Domain** → `fix-tok.com` ו-`www.fix-tok.com`.
2. ב-DNS (רשם הדומיין):
   - `fix-tok.com` → CNAME ליעד Railway (או ALIAS/ANAME אם נתמך)
   - `www` → CNAME לאותו שירות
3. המתינו ל-HTTPS (Let's Encrypt אוטומטי).

### Google Search Console

1. הוסיפו נכס `https://fix-tok.com` (אימות DNS או HTML).
2. שלחו sitemap: `https://fix-tok.com/sitemap.xml`
3. בדקו: [PageSpeed Insights](https://pagespeed.web.dev/), Mobile-Friendly Test.

### GEO (מנועי AI)

- `https://fix-tok.com/llms.txt` — תקציר
- `https://fix-tok.com/llms-full.txt` — גרסה מפורטת

## סרטון Hero (אופציונלי)

שימו `hero.mp4` / `hero.webm` ב-`public/video/` — ראו `public/video/README.md`.

## רישיון

פרטי — FixTok.
