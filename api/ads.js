/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — ads.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * Inspired by: https://github.com/Shineii86/AdLab
 *
 * @description
 *   Lightweight ad management module. Stores a pool of promotional
 *   messages and exposes functions to retrieve a random ad or
 *   an HTML-formatted footer block.
 *
 * @exports
 *   getRandomAd, getAdFooter, getAdCount
 *
 * @customization
 *   Edit the `advertisements` array below to add, remove,
 *   or modify ads.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// ADVERTISEMENT POOL
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Ad Pool ----

const advertisements = [
    "@MaximXBots - Engage with cutting-edge bots designed for fun, utility, and more. Join the bot revolution and elevate your Telegram experience!",
    "@MaximXGroup - Join our community for bot support, updates, and discussions.",
    "@CodeFlix_Bots - Discover a world of powerful Telegram bots for every need.",
];

// ══════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Random Ad Picker ----

/**
 * Returns a randomly selected ad text (plain string, no formatting).
 *
 * @returns {string} Random ad from the pool
 */
export function getRandomAd() {
    return advertisements[Math.floor(Math.random() * advertisements.length)];
}

// ---- FEATURE: Ad Footer Builder ----

/**
 * Returns an HTML-formatted ad footer block ready to append
 * to any bot message. Uses Telegram HTML (parse_mode: "HTML").
 *
 * Format:
 *   ──────
 *   📮 Ads: Quinx Ads
 *   > ad text here
 *
 * @returns {string} HTML-formatted ad footer
 */
export function getAdFooter() {
    const ad = getRandomAd();
    return `\n\n📮 <b>Aᴅs:</b> <a href="https://t.me/QuinxAds">Quinx Ads</a>\n<blockquote>${ad}</blockquote>`;
}

/**
 * Returns the current number of ads in the pool.
 *
 * @returns {number} Ad count
 */
export function getAdCount() {
    return advertisements.length;
}

// ══════════════════════════════════════════════════════════════ END: ads.js
