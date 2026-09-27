# Anand Eriwal Numerology — website

Static site (plain HTML/CSS/JS, no build step, no dependencies). Free to host anywhere that serves static files, including Vercel's free tier.

## Structure

```
index.html            Page markup
css/styles.css         All styling
js/script.js            Product data, FAQ data, nav, and the order-form wizard
assets/favicon.svg      Browser tab icon
assets/Free_Student_Numerology_Guide.pdf   Free lead-magnet PDF linked from the "Free student numerology guide" section
```

## Deploy to Vercel (free)

1. Push this folder to a GitHub repo.
2. In Vercel, "Add New… → Project" → import that repo.
3. Framework preset: **Other** (or "No framework"). No build command, no output directory override needed — it's static.
4. Deploy. Vercel's free Hobby plan covers this.

Or via CLI, from this folder: `npx vercel` (no install needed, uses the free `vercel` CLI).

## Things to finish before this goes fully live

- **Buy now flow** — by design, right now the order wizard collects name / date of birth / product-specific details / contact info, then just shows a "we'll be in touch" confirmation (see `submitOrder()` in `js/script.js`). No payment is taken yet. Once you have PhonePe (or another gateway) API access, replace the body of `submitOrder()` with a redirect to the generated payment link, built from `wizard.product` and `wizard.answers`.
- **Trust line number** — "1,200+ reports delivered" in the hero (`index.html`) is a placeholder; swap for a real figure or a star rating you can stand behind.
- **FAQ answers** — the six FAQ answers in `js/script.js` (`FAQS` array) are reasonable defaults but should be reviewed against your actual delivery times, refund policy, and privacy practice before publishing.
- **Favicon / brand mark** — `assets/favicon.svg` is a simple placeholder geometric mark; swap it for real branding if you have one.

## Editing products or FAQ

Both live as plain arrays at the top of `js/script.js` — `PRODUCTS` and `FAQS`. Add, remove, or reorder entries there; the page re-renders from that data, no HTML editing needed. Each product's `extraFields` array controls which extra question(s) the order wizard asks for that specific product.
