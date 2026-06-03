/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botHandler.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Core bot logic. Processes all Telegram updates:
 *   commands, callback queries, anti-promotion engine,
 *   repeat offender tracking, per-group config,
 *   report system, broadcast, and more.
 *
 * @exports onUpdate
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import {
    startMessage, helpMessage, aboutMessage, donateMessage, notAdminMessage,
    linkDeletedMessage, promotionDeletedMessage, botAddedMessage,
    onlyOwnerMessage, onlyAdminMessage, groupOnlyMessage,
    statusOkMessage, statusNotAdminMessage, statusPrivateMessage,
    pausedMessage, resumedMessage, notPausedMessage,
    broadcastStarted, broadcastDone, logEmptyMessage,
    mutedMessage, warnedMessage, repeatOffenderMessage,
    whitelistUpdatedMessage, blacklistUpdatedMessage, keywordsUpdatedMessage,
    betaNotice, versionInfo
} from './constants.js';
import { containsLinks, detectPromotion, log } from './helper.js';
import { getAdFooter } from './ads.js';
import { Store } from './store.js';

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Rate Limiting ----
const RATE_LIMIT_MAX = 10;         // Max actions per window per chat
const RATE_LIMIT_WINDOW = 10000;   // Window duration in ms (10 sec)
const AUTO_DELETE_MS = 5000;       // Auto-delete bot messages after 5s
const LOG_MAX = 50;                // Max deletion log entries kept in memory

const startTime = Date.now();
const uniqueChats = new Set();
const rateLimitMap = {};            // chatId -> { count, resetAt }
const lastBotMessage = {};         // chatId -> message_id (to clean up previous bot msg)

// ══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Uptime Formatter ----

/**
 * Format milliseconds into a human-readable uptime string.
 *
 * @param {number} ms - Milliseconds since start
 * @returns {string} e.g. "1ᴅ 3ʜ 15ᴍ" or "5ᴍ 30s"
 */
function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}ᴅ ${h % 24}ʜ ${m % 60}ᴍ`;
    if (h > 0) return `${h}ʜ ${m % 60}ᴍ ${s % 60}s`;
    if (m > 0) return `${m}ᴍ ${s % 60}s`;
    return `${s}s`;
}

// ---- FEATURE: IST Timestamp Formatter ----

/**
 * Format a Date or timestamp to IST (UTC+5:30) human-readable string.
 * Used in deletion logs and stats.
 *
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} e.g. "03 Jᴜɴ 2026, 2:30:00 Pᴍ Isᴛ"
 */
function formatIST(date) {
    const d = date instanceof Date ? date : new Date(date);
    const ist = new Date(d.getTime() + (5 * 60 + 30) * 60 * 1000);
    const day = String(ist.getUTCDate()).padStart(2, '0');
    const month = ['Jᴀɴ', 'Fᴇʙ', 'Mᴀʀ', 'Aᴘʀ', 'Mᴀʏ', 'Jᴜɴ', 'Jᴜʟ', 'Aᴜɢ', 'Sᴇᴘ', 'Oᴄᴛ', 'Nᴏᴠ', 'Dᴇᴄ'][ist.getUTCMonth()];
    const year = ist.getUTCFullYear();
    let hours = ist.getUTCHours();
    const ampm = hours >= 12 ? 'Pᴍ' : 'Aᴍ';
    hours = hours % 12 || 12;
    const mins = String(ist.getUTCMinutes()).padStart(2, '0');
    const secs = String(ist.getUTCSeconds()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins}:${secs} ${ampm} Isᴛ`;
}

/**
 * Append ad footer to a message string.
 *
 * @param {string} msg - Base message
 * @returns {string} Message with ad footer appended
 */
function withAd(msg) {
    return msg + getAdFooter();
}

/**
 * Check if the given user ID matches the bot owner.
 *
 * @param {number|string} userId
 * @param {string} ownerId
 * @returns {boolean}
 */
function isOwner(userId, ownerId) {
    return ownerId && String(userId) === String(ownerId);
}

/**
 * Check if the chat type is a group or supergroup.
 *
 * @param {string} chatType
 * @returns {boolean}
 */
function isGroupChat(chatType) {
    return ['group', 'supergroup'].includes(chatType);
}

/**
 * Check if a user is a group admin (creator or administrator).
 *
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {number} chatId
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
async function isGroupAdmin(botApi, chatId, userId) {
    try {
        const res = await botApi.getChatMember(chatId, userId);
        return ['creator', 'administrator'].includes(res.result?.status);
    } catch {
        return false;
    }
}

// ══════════════════════════════════════════════════════════════
// RATE LIMITING
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Per-Chat Rate Limiter ----

/**
 * Enforce per-chat rate limit.
 * Allows up to RATE_LIMIT_MAX actions per RATE_LIMIT_WINDOW ms.
 * Resets automatically when the window expires.
 *
 * @param {number} chatId
 * @returns {boolean} true if action is allowed
 */
function checkRateLimit(chatId) {
    const now = Date.now();
    const entry = rateLimitMap[chatId];
    if (!entry || now > entry.resetAt) {
        rateLimitMap[chatId] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

// ══════════════════════════════════════════════════════════════
// MESSAGE CLEANUP
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Auto-cleanup of bot messages ----

/**
 * Delete the previous bot message in a chat, then the user's command message.
 * Tracks last bot message per chat to avoid flooding.
 *
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {number} chatId
 * @param {number} userMessageId - The user's command message to delete
 */
async function cleanupMessages(botApi, chatId, userMessageId) {
    if (lastBotMessage[chatId]) {
        try { await botApi.deleteMessage(chatId, lastBotMessage[chatId]); } catch {}
        delete lastBotMessage[chatId];
    }
    try { await botApi.deleteMessage(chatId, userMessageId); } catch {}
}

/**
 * Track the last bot message sent in a chat for future cleanup.
 *
 * @param {number} chatId
 * @param {Object} sent - Response from sendMessage
 */
function trackBotMessage(chatId, sent) {
    const msgId = sent?.result?.message_id;
    if (msgId) lastBotMessage[chatId] = msgId;
}

// ══════════════════════════════════════════════════════════════
// KEYBOARD BUILDERS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Inline Keyboards ----

/**
 * Build the main menu keyboard for the /start screen.
 *
 * @param {string} botUsername
 * @returns {Array} Telegram inline keyboard markup
 */
function getStartKeyboard(botUsername) {
    return [
        [{ text: '✚ Aᴅᴅ Tᴏ Gʀᴏᴜᴘ', url: `https://t.me/${botUsername}?startgroup=true` }],
        [{ text: '📚 Hᴇʟᴘ', callback_data: 'cb_help' }, { text: '📊 Sᴛᴀᴛs', callback_data: 'cb_stats' }],
        [{ text: '🛡️ Aʙᴏᴜᴛ', callback_data: 'cb_about' }, { text: '🎁 Dᴏɴᴀᴛᴇ', callback_data: 'cb_donate' }],
        [{ text: '💥 Cʟᴏsᴇ ✕', callback_data: 'cb_close' }],
    ];
}

/**
 * Build the back-navigation keyboard (used from help/about/donate).
 *
 * @returns {Array} Telegram inline keyboard markup
 */
function getBackKeyboard() {
    return [
        [{ text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu' }, { text: '🎁 Dᴏɴᴀᴛᴇ', callback_data: 'cb_donate' }, { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' }],
    ];
}

/**
 * Build a simple close-only keyboard.
 *
 * @returns {Array} Telegram inline keyboard markup
 */
function getCloseKeyboard() {
    return [
        [{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' }],
    ];
}

// ══════════════════════════════════════════════════════════════
// STATS MESSAGE BUILDER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /stats Message ----

/**
 * Build the stats display message.
 * Includes live counters, command usage, and recent deletions.
 *
 * @param {string} botUsername
 * @param {string} logChannel - Log channel ID (for display only)
 * @returns {string} HTML-formatted stats message
 */
function getStatsMessage(botUsername, logChannel) {
    const storeStats = Store.getStats();
    const uptime = formatUptime(Date.now() - startTime);
    const cmdLines = Object.entries(Store.getCommandUsage())
        .map(([cmd, count]) => `<code>/${cmd}</code> — ${count}`)
        .join('\n') || 'Nᴏɴᴇ Yᴇᴛ.';
    const deletionLog = Store.getRecentDeletions(5);
    let recentText = '';
    if (deletionLog.length > 0) {
        recentText = '\n\n📋 <b>Lᴀᴛᴇsᴛ Dᴇʟᴇᴛɪᴏɴs:</b>\n' +
            deletionLog.slice(0, 5).map((e, i) =>
                `${i + 1}. ${e.type} → ${e.user} ɪɴ ${e.chat} (${formatIST(e.time)})`
            ).join('\n');
    }
    return `${withAd(`📊 <b>Aɴᴛɪ-Pʀᴏᴍᴏᴛɪᴏɴ Sᴛᴀᴛs</b>

📨 <b>Mᴇssᴀɢᴇs Pʀᴏᴄᴇssᴇᴅ:</b> ${storeStats.messagesProcessed.toLocaleString()}
🚫 <b>Lɪɴᴋs Rᴇᴍᴏᴠᴇᴅ:</b> ${storeStats.linksRemoved.toLocaleString()}
🔍 <b>Pʀᴏᴍᴏᴛɪᴏɴs Sᴛᴏᴘᴘᴇᴅ:</b> ${storeStats.promotionsStopped.toLocaleString()}
⚠️ <b>Wᴀʀɴɪɴɢs Sᴇɴᴛ:</b> ${storeStats.warningsSent.toLocaleString()}
🔄 <b>Rᴇᴘᴇᴀᴛ Oғғᴇɴᴅᴇʀs:</b> ${storeStats.repeatOffenders.toLocaleString()}
💬 <b>Uɴɪǫᴜᴇ Cʜᴀᴛs:</b> ${uniqueChats.size.toLocaleString()}
⏸️ <b>Pᴀᴜsᴇᴅ Cʜᴀᴛs:</b> ${Store.getPausedCount().toLocaleString()}
⏱️ <b>Uᴘᴛɪᴍᴇ:</b> ${uptime}
🕐 <b>Sᴛᴀʀᴛᴇᴅ:</b> ${formatIST(startTime)}
💾 <b>Sᴛᴏʀᴀɢᴇ:</b> ${Store.getStorageType()}

📋 <b>Cᴏᴍᴍᴀɴᴅ Usᴀɢᴇ:</b>
${cmdLines}${recentText}

${betaNotice}`)}`;
}

// ══════════════════════════════════════════════════════════════
// MAIN UPDATE HANDLER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Telegram Update Dispatcher ----

/**
 * Process an incoming Telegram update.
 * Routes callback queries and messages through the appropriate handlers.
 *
 * @param {Object} data - Telegram update object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {number[]} RestrictedChats - Array of restricted chat IDs (unused, kept for signature compat)
 * @param {string} botUsername
 * @param {string} ownerId
 * @param {string} webhookSecret
 * @param {string} botPhoto
 * @param {string} logChannel
 */
export async function onUpdate(data, botApi, RestrictedChats, botUsername, ownerId, webhookSecret, botPhoto, logChannel) {

    await Store.load();

    // ══════════════════════════════════════════════════════════════
    // CALLBACK QUERY HANDLING
    // ══════════════════════════════════════════════════════════════

    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        const linkPreview = botPhoto ? {
            url: botPhoto, prefer_large_media: true, show_above_text: true
        } : null;

        const editMsg = async (text, keyboard) => {
            await botApi.editMessageText(chatId, messageId, text, keyboard, linkPreview);
        };

        try {
            switch (cq.data) {
                // ---- FEATURE: /help callback ----
                case 'cb_help':
                    await editMsg(withAd(helpMessage), getBackKeyboard());
                    break;
                // ---- FEATURE: Main menu callback ----
                case 'cb_menu':
                    await editMsg(withAd(startMessage), getStartKeyboard(botUsername));
                    break;
                // ---- FEATURE: /stats callback ----
                case 'cb_stats':
                    await editMsg(getStatsMessage(botUsername, logChannel), getBackKeyboard());
                    break;
                // ---- FEATURE: /about callback ----
                case 'cb_about':
                    await editMsg(withAd(aboutMessage), getBackKeyboard());
                    break;
                // ---- FEATURE: /donate callback ----
                case 'cb_donate':
                    await editMsg(withAd(donateMessage), getBackKeyboard());
                    break;
                // ---- FEATURE: Close button ----
                case 'cb_close':
                    await botApi.deleteMessage(chatId, messageId);
                    break;
                default:
                    // ---- FEATURE: Report button ----
                    if (cq.data.startsWith('cb_report:')) {
                        const parts = cq.data.split(':');
                        const reportedChatId = parts[1];
                        const reportedUserId = parts[2];
                        const reportedMsgId = parts[3];
                        if (logChannel) {
                            const reportText = `🚨 <b>Rᴇᴘᴏʀᴛ</b>\n\n👤 <b>Usᴇʀ:</b> <code>${reportedUserId}</code>\n💬 <b>Cʜᴀᴛ:</b> <code>${reportedChatId}</code>\n📝 <b>Mᴇssᴀɢᴇ:</b> <a href="https://t.me/c/${reportedChatId.replace('-100', '')}/${reportedMsgId}">Jᴜᴍᴘ</a>`;
                            try { await botApi.sendMessage(logChannel, reportText); } catch {}
                        }
                        await botApi.answerCallbackQuery(cq.id, '🚨 Rᴇᴘᴏʀᴛ Sᴜʙᴍɪᴛᴛᴇᴅ. Aᴅᴍɪɴs Wɪʟʟ Rᴇᴠɪᴇᴡ.', false);
                    } else {
                        await botApi.answerCallbackQuery(cq.id, '❓ Uɴᴋɴᴏᴡɴ Aᴄᴛɪᴏɴ.', true);
                    }
                    return;
            }
            await botApi.answerCallbackQuery(cq.id);
        } catch (error) {
            log.error('[Callback]', error.message);
            try { await botApi.answerCallbackQuery(cq.id, '⚠️ Sᴏᴍᴇᴛʜɪɴɢ Wᴇɴᴛ Wʀᴏɴɢ.', true); } catch {}
        }
        return;
    }

    // ══════════════════════════════════════════════════════════════
    // MESSAGE HANDLING
    // ══════════════════════════════════════════════════════════════

    if (data.message) {
        const msg = data.message;
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const text = msg.text || msg.caption || '';
        const chatType = msg.chat.type;
        const userId = msg.from?.id;
        const chatTitle = msg.chat.title || msg.chat.first_name || String(chatId);

        // Track chat activity
        await Store.updateChat(chatId, chatTitle, chatType);
        await Store.trackMessage();
        uniqueChats.add(chatId);

        const linkPreview = botPhoto ? {
            url: botPhoto, prefer_large_media: true, show_above_text: true
        } : null;

        // ---- FEATURE: Bot Added to Group ----
        if (msg.new_chat_members && Array.isArray(msg.new_chat_members)) {
            const isBotAdded = msg.new_chat_members.some(
                member => member.username?.toLowerCase() === botUsername.toLowerCase()
            );
            if (isBotAdded) {
                let welcome = botAddedMessage;
                const isAdmin = await isGroupAdmin(botApi, chatId, userId);
                if (!isAdmin) welcome += '\n\n' + notAdminMessage;
                const sent = await botApi.sendMessage(chatId, welcome, getCloseKeyboard());
                trackBotMessage(chatId, sent);
                return;
            }
        }

        // ---- FEATURE: Bot Removed from Group ----
        if (msg.left_chat_member &&
            msg.left_chat_member.username?.toLowerCase() === botUsername.toLowerCase()) {
            await Store.removeChat(chatId);
            return;
        }

        // ---- FEATURE: Private Chat ----
        if (chatType === 'private') {
            if (text && text.startsWith('/')) {
                await handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview, logChannel);
                return;
            }
            const sent = await botApi.sendMessage(chatId, withAd(startMessage), getStartKeyboard(botUsername), linkPreview);
            trackBotMessage(chatId, sent);
            return;
        }

        // ---- FEATURE: Group Chat Processing ----
        if (isGroupChat(chatType)) {
            if (text && text.startsWith('/')) {
                await handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview, logChannel);
                return;
            }
            if (!text) return;

            // Skip admins — they can send whatever they want
            const isAdmin = await isGroupAdmin(botApi, chatId, userId);
            if (isAdmin) return;

            // Skip if paused
            if (Store.isPaused(chatId)) return;

            // Enforce rate limit
            if (!checkRateLimit(chatId)) return;

            // Load per-group config
            const config = Store.getPerChatConfig(chatId);
            const whitelist = config.whitelist || [];
            const blacklist = config.blacklist || [];
            const customKeywords = config.customKeywords || [];

            // ---- FEATURE: Anti-Promotion Engine ----
            const hasLink = containsLinks(text, whitelist);
            const isPromo = detectPromotion(text, customKeywords);
            const hasBlacklisted = blacklist.some(d => text.toLowerCase().includes(d.toLowerCase()));

            if (hasLink || isPromo || hasBlacklisted) {
                await botApi.deleteMessage(chatId, messageId);

                // Track violations and deletions
                const violationCount = await Store.incrementUserViolation(chatId, userId);
                const userDisplay = msg.from?.username || String(msg.from?.id || 'User');

                await Store.addDeletion({
                    time: Date.now(),
                    chat: chatTitle,
                    chatId,
                    user: userDisplay,
                    userId,
                    type: hasBlacklisted ? 'blacklisted' : hasLink ? 'link' : 'promotion',
                });

                if (hasLink) await Store.trackLinkRemoved();
                if (isPromo || hasBlacklisted) await Store.trackPromotionStopped();

                // ---- FEATURE: Escalating Warnings ----
                // 1-2 violations: simple delete notice
                // 3-4 violations: strong warning
                // 5+ violations: auto-mute for 1 hour
                let delMsg;
                let keyboard = null;
                let deleteAfter = AUTO_DELETE_MS;

                if (violationCount >= 5) {
                    await Store.trackRepeatOffender();
                    try {
                        await botApi.callApi('restrictChatMember', {
                            chat_id: chatId,
                            user_id: userId,
                            permissions: { can_send_messages: false },
                            until_date: Math.floor(Date.now() / 1000) + 3600,
                        });
                    } catch {}
                    delMsg = mutedMessage(userDisplay);
                    deleteAfter = 8000;
                } else if (violationCount >= 3) {
                    await Store.trackWarning();
                    delMsg = repeatOffenderMessage(userDisplay, violationCount);
                    deleteAfter = 8000;
                } else if (hasBlacklisted) {
                    delMsg = linkDeletedMessage(userDisplay);
                } else if (hasLink) {
                    // ---- FEATURE: Report Button ----
                    delMsg = linkDeletedMessage(userDisplay);
                    keyboard = [[{ text: '🚨 Rᴇᴘᴏʀᴛ', callback_data: `cb_report:${chatId}:${userId}:${messageId}` }]];
                } else {
                    delMsg = promotionDeletedMessage(userDisplay);
                }

                const sent = await botApi.sendMessage(chatId, delMsg, keyboard, linkPreview);
                if (sent?.result?.message_id) {
                    setTimeout(async () => {
                        try { await botApi.deleteMessage(chatId, sent.result.message_id); } catch {}
                    }, deleteAfter);
                }

                // ---- FEATURE: Log Channel ----
                if (logChannel) {
                    const logText = `🚫 <b>Dᴇʟᴇᴛɪᴏɴ</b>\n\n👤 <b>Usᴇʀ:</b> @${userDisplay} (<code>${userId}</code>)\n💬 <b>Cʜᴀᴛ:</b> ${chatTitle} (<code>${chatId}</code>)\n📝 <b>Tʏᴘᴇ:</b> ${hasBlacklisted ? 'Bʟᴀᴄᴋʟɪsᴛᴇᴅ Dᴏᴍᴀɪɴ' : hasLink ? 'Lɪɴᴋ' : 'Pʀᴏᴍᴏᴛɪᴏɴ'}\n⚠️ <b>Vɪᴏʟᴀᴛɪᴏɴs:</b> ${violationCount}`;
                    try { await botApi.sendMessage(logChannel, logText); } catch {}
                }
            }
        }
    }
}

// ══════════════════════════════════════════════════════════════
// COMMAND HANDLER
// ══════════════════════════════════════════════════════════════

/**
 * Process a command message. Routes to the appropriate handler
 * based on the command name.
 *
 * @param {string} text - Full message text
 * @param {number} chatId
 * @param {Object} msg - Telegram message object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {string} botUsername
 * @param {string} ownerId
 * @param {Object|null} linkPreview - Link preview config
 * @param {string} logChannel
 */
async function handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview, logChannel) {
    const cmd = text.split(' ')[0].toLowerCase();
    const args = text.split(' ').slice(1).join(' ').trim();
    const userId = msg.from?.id;
    const chatType = msg.chat.type;

    await Store.trackCommand(cmd);

    switch (cmd) {
        // ---- FEATURE: /start ----
        case '/start':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const sent = await botApi.sendMessage(chatId, withAd(startMessage), getStartKeyboard(botUsername), linkPreview);
            trackBotMessage(chatId, sent);
            break;

        // ---- FEATURE: /help ----
        case '/help':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const helpSent = await botApi.sendMessage(chatId, withAd(helpMessage), getCloseKeyboard(), linkPreview);
            trackBotMessage(chatId, helpSent);
            break;

        // ---- FEATURE: /status ----
        case '/status':
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (isGroupChat(chatType)) {
                const botInfo = await botApi.getMe();
                const botId = botInfo?.result?.id;
                const isBotAdm = botId ? await isGroupAdmin(botApi, chatId, botId) : false;
                const paused = Store.isPaused(chatId) ? '\n\n⏸️ Mᴏɴɪᴛᴏʀɪɴɢ Is Cᴜʀʀᴇɴᴛʟʏ <b>Pᴀᴜsᴇᴅ</b>.' : '';
                const statusSent = await botApi.sendMessage(chatId, withAd((isBotAdm ? statusOkMessage : statusNotAdminMessage) + paused), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, statusSent);
            } else {
                const statusSent = await botApi.sendMessage(chatId, withAd(statusPrivateMessage), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, statusSent);
            }
            break;

        // ---- FEATURE: /about ----
        case '/about':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const aboutSent = await botApi.sendMessage(chatId, withAd(aboutMessage), getBackKeyboard(), linkPreview);
            trackBotMessage(chatId, aboutSent);
            break;

        // ---- FEATURE: /donate ----
        case '/donate':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const donateSent = await botApi.sendMessage(chatId, withAd(donateMessage), getBackKeyboard(), linkPreview);
            trackBotMessage(chatId, donateSent);
            break;

        // ---- FEATURE: /stats ----
        case '/stats':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const statsSent = await botApi.sendMessage(chatId, getStatsMessage(botUsername, logChannel), getCloseKeyboard(), linkPreview);
            trackBotMessage(chatId, statsSent);
            break;

        // ---- FEATURE: /pause ----
        case '/pause':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            await Store.pauseChat(chatId);
            const pauseSent = await botApi.sendMessage(chatId, withAd(pausedMessage), getCloseKeyboard(), linkPreview);
            trackBotMessage(chatId, pauseSent);
            break;

        // ---- FEATURE: /resume ----
        case '/resume':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!Store.isPaused(chatId)) {
                await cleanupMessages(botApi, chatId, msg.message_id);
                const s = await botApi.sendMessage(chatId, withAd(notPausedMessage), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            await Store.resumeChat(chatId);
            const resumeSent = await botApi.sendMessage(chatId, withAd(resumedMessage), getCloseKeyboard(), linkPreview);
            trackBotMessage(chatId, resumeSent);
            break;

        // ---- FEATURE: /settings ----
        case '/settings':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            {
                const cfg = Store.getPerChatConfig(chatId);
                const whitelist = (cfg.whitelist || []).join(', ') || 'Nᴏɴᴇ';
                const blacklist = (cfg.blacklist || []).join(', ') || 'Nᴏɴᴇ';
                const keywords = (cfg.customKeywords || []).join(', ') || 'Nᴏɴᴇ';
                const settingsMsg = `⚙️ <b>Sᴇᴛᴛɪɴɢs Fᴏʀ Tʜɪs Cʜᴀᴛ</b>\n\n✅ <b>Wʜɪᴛᴇʟɪsᴛ:</b> ${whitelist}\n🚫 <b>Bʟᴀᴄᴋʟɪsᴛ:</b> ${blacklist}\n🔍 <b>Cᴜsᴛᴏᴍ Kᴇʏᴡᴏʀᴅs:</b> ${keywords}\n⏸️ <b>Pᴀᴜsᴇᴅ:</b> ${Store.isPaused(chatId) ? 'Yᴇs' : 'Nᴏ'}\n\n${betaNotice}`;
                const s = await botApi.sendMessage(chatId, withAd(settingsMsg), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        // ---- FEATURE: /whitelist ----
        case '/whitelist':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (!args) {
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/whitelist domain.com</code>', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            {
                const cfg = Store.getPerChatConfig(chatId);
                const list = cfg.whitelist || [];
                const domain = args.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
                if (!list.includes(domain)) list.push(domain);
                await Store.setPerChatConfig(chatId, { whitelist: list });
                const s = await botApi.sendMessage(chatId, withAd(`${whitelistUpdatedMessage}\n➕ <code>${domain}</code>`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        // ---- FEATURE: /blacklist ----
        case '/blacklist':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (!args) {
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/blacklist domain.com</code>', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            {
                const cfg = Store.getPerChatConfig(chatId);
                const list = cfg.blacklist || [];
                const domain = args.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
                if (!list.includes(domain)) list.push(domain);
                await Store.setPerChatConfig(chatId, { blacklist: list });
                const s = await botApi.sendMessage(chatId, withAd(`${blacklistUpdatedMessage}\n🚫 <code>${domain}</code>`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        // ---- FEATURE: /keywords ----
        case '/keywords':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (!args) {
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/keywords word1 word2</code>', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            {
                const cfg = Store.getPerChatConfig(chatId);
                const existing = cfg.customKeywords || [];
                const newWords = args.split(/\s+/).map(w => w.toLowerCase()).filter(w => w && !existing.includes(w));
                const updated = [...existing, ...newWords];
                await Store.setPerChatConfig(chatId, { customKeywords: updated });
                const s = await botApi.sendMessage(chatId, withAd(`${keywordsUpdatedMessage}\n➕ ${newWords.join(', ')}`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        // ---- FEATURE: /warn ----
        case '/warn':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (!args) {
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/warn @username</code>', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            {
                const targetName = args.replace('@', '');
                let targetId = null;
                // NOTE: Support both reply-to and @username syntax
                if (msg.reply_to_message?.from) {
                    targetId = msg.reply_to_message.from.id;
                }
                if (targetId) {
                    const count = await Store.incrementUserViolation(chatId, targetId);
                    await Store.trackWarning();
                    const s = await botApi.sendMessage(chatId, withAd(warnedMessage(targetName, count)), getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, s);
                } else {
                    const s = await botApi.sendMessage(chatId, '📵 Cᴏᴜʟᴅ Nᴏᴛ Iᴅᴇɴᴛɪғʏ Usᴇʀ. Rᴇᴘʟʏ Tᴏ Tʜᴇɪʀ Mᴇssᴀɢᴇ Oʀ Usᴇ /warn Iɴ Tʜᴇɪʀ Cʜᴀᴛ.', getCloseKeyboard());
                    trackBotMessage(chatId, s);
                }
            }
            break;

        // ---- FEATURE: /mute ----
        case '/mute':
            if (!isGroupChat(chatType)) {
                const s = await botApi.sendMessage(chatId, withAd(groupOnlyMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!await isGroupAdmin(botApi, chatId, userId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyAdminMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (!args && !msg.reply_to_message) {
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/mute @username</code> Oʀ Rᴇᴘʟʏ Tᴏ A Mᴇssᴀɢᴇ.', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            {
                const muteUserId = msg.reply_to_message?.from?.id || args;
                if (muteUserId && typeof muteUserId === 'number') {
                    try {
                        await botApi.callApi('restrictChatMember', {
                            chat_id: chatId,
                            user_id: muteUserId,
                            permissions: { can_send_messages: false },
                            until_date: Math.floor(Date.now() / 1000) + 3600,
                        });
                        const name = msg.reply_to_message?.from?.username || 'Usᴇʀ';
                        const s = await botApi.sendMessage(chatId, withAd(mutedMessage(name)), getCloseKeyboard(), linkPreview);
                        trackBotMessage(chatId, s);
                    } catch (e) {
                        const s = await botApi.sendMessage(chatId, `📵 Fᴀɪʟᴇᴅ Tᴏ Mᴜᴛᴇ: ${e.message}`, getCloseKeyboard());
                        trackBotMessage(chatId, s);
                    }
                } else {
                    const s = await botApi.sendMessage(chatId, '📵 Cᴏᴜʟᴅ Nᴏᴛ Iᴅᴇɴᴛɪғʏ Usᴇʀ.', getCloseKeyboard());
                    trackBotMessage(chatId, s);
                }
            }
            break;

        // ---- FEATURE: /broadcast ----
        case '/broadcast':
            if (!isOwner(userId, ownerId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyOwnerMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            if (!args) {
                await cleanupMessages(botApi, chatId, msg.message_id);
                const s = await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/broadcast &lt;message&gt;</code>', getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            {
                let bSent = await botApi.sendMessage(chatId, broadcastStarted, getCloseKeyboard());
                trackBotMessage(chatId, bSent);
                const allChats = [...uniqueChats];
                let success = 0, failed = 0;
                for (const cid of allChats) {
                    try {
                        await botApi.sendMessage(cid, `📢 <b>Bʀᴏᴀᴅᴄᴀsᴛ</b>\n\n${args}`);
                        success++;
                    } catch { failed++; }
                }
                bSent = await botApi.sendMessage(chatId, withAd(broadcastDone(success, failed)), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, bSent);
            }
            break;

        // ---- FEATURE: /log ----
        case '/log':
            if (!isOwner(userId, ownerId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyOwnerMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            {
                const deletions = Store.getRecentDeletions(20);
                if (deletions.length === 0) {
                    const s = await botApi.sendMessage(chatId, withAd(logEmptyMessage), getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, s); return;
                }
                const lines = deletions.map((e, i) =>
                    `${i + 1}. [${e.type}] ${e.user} → ${e.chat} (${formatIST(e.time)})`
                ).join('\n');
                const s = await botApi.sendMessage(chatId, withAd(`📋 <b>Rᴇᴄᴇɴᴛ Dᴇʟᴇᴛɪᴏɴs:</b>\n\n${lines}`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        // ---- FEATURE: /chats ----
        case '/chats':
            if (!isOwner(userId, ownerId)) {
                const s = await botApi.sendMessage(chatId, withAd(onlyOwnerMessage), getCloseKeyboard());
                trackBotMessage(chatId, s); return;
            }
            await cleanupMessages(botApi, chatId, msg.message_id);
            {
                const allChats = Store.getAllChats();
                if (allChats.length === 0) {
                    const s = await botApi.sendMessage(chatId, '📭 Nᴏ Aᴄᴛɪᴠᴇ Cʜᴀᴛs Yᴇᴛ.', getCloseKeyboard());
                    trackBotMessage(chatId, s); return;
                }
                const chatLines = allChats.map((c, i) => {
                    const typeEmoji = { group: '👥', supergroup: '👥', channel: '📢', private: '💬' }[c.type] || '❓';
                    const paused = Store.isPaused(c.id) ? ' ⏸️' : '';
                    return `${i + 1}. ${typeEmoji} ${c.title} (<code>${c.id}</code>)${paused}`;
                }).join('\n');
                const groups = allChats.filter(c => c.type === 'group' || c.type === 'supergroup').length;
                const channels = allChats.filter(c => c.type === 'channel').length;
                const privates = allChats.filter(c => c.type === 'private').length;
                const s = await botApi.sendMessage(chatId, withAd(`💬 <b>Aʟʟ Cʜᴀᴛs (${allChats.length}):</b>\n\n${chatLines}\n\n📊 ${groups} ɢʀᴏᴜᴘs · ${channels} ᴄʜᴀɴɴᴇʟs · ${privates} ᴘʀɪᴠᴀᴛᴇ`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, s);
            }
            break;

        default:
            break;
    }
}

// ══════════════════════════════════════════════════════════════ END: botHandler.js
