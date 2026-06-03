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

export function containsLinks(text, whitelist = []) {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|t\.me\/[^\s]+/gi;
    const matches = text.match(urlRegex);
    if (!matches) return false;
    for (const url of matches) {
        let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
        domain = domain.replace(/^t\.me\//, '');
        if (!whitelist.some(w => domain === w.toLowerCase() || domain.endsWith('.' + w.toLowerCase()))) {
            return true;
        }
    }
    return false;
}

export function detectPromotion(text) {
    const promoKeywords = [
        'join', 'subscribe', 'follow', 'promotion', 'advertise', 'marketing',
        'discount', 'offer', 'sale', 'buy now', 'limited time', 'exclusive',
        'earn money', 'make money', 'free coins', 'click here', 'sign up',
        'register now', 'best price', 'channel', 'group', 'community',
        'giveaway', 'contest', 'win', 'prize', 'lottery', 'casino',
        'investment', 'crypto', 'bitcoin', 'ethereum', 'referral', 'bonus'
    ];
    const lowerText = text.toLowerCase();
    return promoKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}

export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};
