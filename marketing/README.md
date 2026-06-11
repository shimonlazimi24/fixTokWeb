# ערכת שיווק FixTok

מקור התוכן: `content/copy.he.mjs` - עריכה אחת, ואז `npm run build`.

## משפט אחד

יש לכם תיקון שתקוע? צלמו סרטון קצר, קבלו תיק עבודה והשוו הצעות מקבלנים - בלי לרדוף אחרי אף אחד. [fix-tok.com](https://fix-tok.com)

## UTM לקמפיינים

תבניות ב-`content/links.mjs` (`UTM_TEMPLATES`). דוגמה:

```
https://app.fix-tok.com/login?role=client&next=%2Fclient%2Fnew&utm_source=facebook&utm_medium=social&utm_campaign=renovation_q2
```

בקוד: `withUtm(APP_LINKS.clientStart, UTM_TEMPLATES.facebookRenovation)`.

## קישורי CTA מוכנים

| קהל | קישור |
|-----|--------|
| לקוח - התחלה | https://app.fix-tok.com/login?role=client&next=%2Fclient%2Fnew |
| קבלן | https://app.fix-tok.com/contractor |
| התחברות | https://app.fix-tok.com/login |

## תמונת שיתוף

- ברירת מחדל: `marketing/og-default.svg` (1200×630)
- להחלפה לקמפיין: עדכנו SVG/PNG ושימו גם ב-`SEO.ogImage` ב-`content/seo.mjs`, ואז `npm run build`.

## קבצים להעתקה

פסקאות מוכנות: `marketing/snippets.md`.
