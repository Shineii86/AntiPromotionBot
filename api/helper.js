/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — helper.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Utility functions: link/promotion detection, HTML response
 *   builder, and structured logger.
 *
 * @exports
 *   containsLinks, detectPromotion, getChatIds, returnHTML, log
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// LINK DETECTION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: URL / Link Detection ----

/**
 * Check if a text message contains promotional URLs not in the whitelist.
 * Matches http/https URLs, www domains, and t.me links.
 *
 * Supports exact domain + subdomain whitelisting.
 * e.g. "sub.example.com" whitelisted allows "sub.example.com"
 * but blocks "other.example.com".
 *
 * @param {string} text - Message text to scan
 * @param {string[]} [whitelist=[]] - Array of trusted domains
 * @returns {boolean} true if an unwhitelisted link is found
 */
export function containsLinks(text, whitelist = []) {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|t\.me\/[^\s]+/gi;
    const matches = text.match(urlRegex);
    if (!matches) return false;

    for (const url of matches) {
        let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
        domain = domain.replace(/^t\.me\//, '');
        // NOTE: Check both exact match and subdomain match
        if (!whitelist.some(w => domain === w.toLowerCase() || domain.endsWith('.' + w.toLowerCase()))) {
            return true;
        }
    }
    return false;
}

// ══════════════════════════════════════════════════════════════
// PROMOTION DETECTION
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Promotional Keyword Detection ----

/**
 * Detect promotional content via keyword matching.
 * Maches against a built-in list of 30+ common promo keywords.
 *
 * @param {string} text - Message text to scan
 * @returns {boolean} true if promotional keywords are found
 */
export function detectPromotion(text) {
    const promoKeywords = [
        'join', 'subscribe', 'follow', 'promotion', 'advertise', 'marketing',
        'discount', 'offer', 'sale', 'buy now', 'limited time', 'exclusive',
        'earn money', 'make money', 'free coins', 'click here', 'sign up',
        'register now', 'best price', 'channel', 'group', 'community',
        'giveaway', 'contest', 'win', 'prize', 'lottery', 'casino',
        'investment', 'crypto', 'bitcoin', 'ethereum', 'referral', 'bonus',
    ];
    const lowerText = text.toLowerCase();
    return promoKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

// ══════════════════════════════════════════════════════════════
// CHAT & HTTP UTILITIES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Chat ID Parser ----

/**
 * Parse comma-separated chat IDs from environment variable.
 *
 * @param {string} chats - Comma-separated chat ID string
 * @returns {number[]} Array of numeric chat IDs
 */
export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

// ---- FEATURE: HTML Response Builder ----

/**
 * Create an HTTP Response with HTML content type.
 *
 * @param {string} content - HTML string
 * @returns {Response} HTTP Response object
 */
export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}

// ══════════════════════════════════════════════════════════════
// STRUCTURED LOGGER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Logging ----

/**
 * Structured logger with ISO timestamps.
 * All bot output goes through here for consistency.
 */
export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};

// ══════════════════════════════════════════════════════════════ END: helper.js
