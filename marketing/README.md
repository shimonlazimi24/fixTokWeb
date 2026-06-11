# ערכת שיווק FixTok (fix-tok.com)

## משפט אחד

יש לכם תיקון שתקוע? צלמו סרטון קצר, קבלו תיק עבודה והשוו הצעות מקבלנים - בלי לרדוף אחרי אף אחד. [fix-tok.com](https://www.fix-tok.com)

## מעקב קמפיינים (אתר בלבד)

האתר `fix-tok.com` שומר מקור הגעה בדפדפן ושולח אירועים ל-GA4 (אם מוגדר).

### הגדרת GA4

1. צרו נכס ב-[Google Analytics](https://analytics.google.com/) ל-`fix-tok.com`.
2. העתיקו את ה-Measurement ID (מתחיל ב-`G-`).
3. הדביקו ב-`marketing/tracking-config.js`:

```javascript
window.FIXTOK_TRACKING = {
  ga4Id: "G-XXXXXXXXXX",
  attributionDays: 90,
};
```

4. דחפו ל-production. ב-GA4 תראו: כניסות, `campaign_landing`, לחיצות על CTA, וואטסאפ ומייל.

### בדיקה מקומית

פתחו: `http://localhost:3000/?fx-wa&debug_mkt=1`  
בקונסול (F12) יופיעו הנתונים שנשמרו.

---

## לינקים ייעודיים לקמפיינים

### פורמט קצר (`fx-*`) - מומלץ לוואטסאפ

| ערוץ | לינק |
|------|------|
| וואטסאפ | `https://www.fix-tok.com/?fx-wa` |
| סטטוס וואטסאפ | `https://www.fix-tok.com/?fx-wa-status` |
| קבוצת וואטסאפ | `https://www.fix-tok.com/?fx-wa-group` |
| פייסבוק | `https://www.fix-tok.com/?fx-fb` |
| אינסטגרם | `https://www.fix-tok.com/?fx-ig` |
| מייל | `https://www.fix-tok.com/?fx-em` |

לינקים ישנים עם `?dlm-*` עדיין נתמכים.

### פורמט UTM (GA4 / מודעות)

```
https://www.fix-tok.com/?utm_source=whatsapp&utm_medium=status&utm_campaign=renovation-june-2026
https://www.fix-tok.com/?utm_source=facebook&utm_medium=paid&utm_campaign=lookalike-homeowners
https://www.fix-tok.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand-he
```

### Google / Meta click IDs

נשמרים אוטומטית אם מגיעים ב-URL: `gclid`, `fbclid`, `gbraid`, `wbraid`.

---

## מה קורה אחרי הכניסה

1. המשתמש נכנס עם לינק מסומן (למשל `?fx-wa`).
2. האתר שומר את המקור ב-localStorage (90 יום, first-touch).
3. כל כפתור ל-`app.fix-tok.com` מקבל את התגיות אוטומטית בלחיצה.
4. GA4 מקבל אירוע `campaign_landing` + `click_app_cta` / `click_whatsapp` / `click_email`.

**חשוב:** המעקב הוא על **fix-tok.com** בלבד. האפליקציה לא מנטרת את זה (אלא אם תוסיפו שם בנפרד).

---

## קישורי CTA

| קהל | קישור (בלי תגיות) |
|-----|-------------------|
| לקוח - מהאתר | `https://www.fix-tok.com` (CTA מוסיף תגיות לבד) |
| קבלן | `https://www.fix-tok.com/#pros` |

## תמונת שיתוף

- ברירת מחדל: `marketing/og-default.svg` (1200×630)

## קבצים

- `marketing/tracking-config.js` - GA4 ID
- `marketing/marketing.js` - לוגיקת מעקב
- `marketing/snippets.md` - פסקאות מוכנות עם לינקים
