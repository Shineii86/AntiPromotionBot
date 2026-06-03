/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — ads.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * Inspired by: https://github.com/Shineii86/AdLab
 *
 * @description
 *   Lightweight ad management module.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const advertisements = [
    "@MaximXBots - Engage with cutting-edge bots designed for fun, utility, and more. Join the bot revolution and elevate your Telegram experience!",
    "@MaximXGroup - Join our community for bot support, updates, and discussions.",
    "@CodeFlix_Bots - Discover a world of powerful Telegram bots for every need.",
];

export function getRandomAd() {
    return advertisements[Math.floor(Math.random() * advertisements.length)];
}

export function getAdFooter() {
    const ad = getRandomAd();
    return `\n\n📮 <b>Aᴅs:</b> <a href="https://t.me/QuinxAds">Quinx Ads</a>\n<blockquote>${ad}</blockquote>`;
}

export function getAdCount() {
    return advertisements.length;
}
