/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botHandler.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Core bot logic. Processes all Telegram updates:
 *   commands, callback queries, group join events,
 *   and the anti-promotion engine.
 *
 * @exports onUpdate(data, botApi, RestrictedChats, botUsername,
 *                   ownerId, webhookSecret, botPhoto)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import {
    startMessage, helpMessage, notAdminMessage,
    linkDeletedMessage, promotionDeletedMessage, botAddedMessage,
    onlyOwnerMessage, onlyAdminMessage, groupOnlyMessage,
    statusOkMessage, statusNotAdminMessage, statusPrivateMessage,
    versionInfo
} from './constants.js';
import { containsLinks, detectPromotion, log } from './helper.js';
import { getAdFooter } from './ads.js';
import { Store } from './store.js';

const uniqueChats = new Set();
const rateLimitMap = {};
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 10000;
const AUTO_DELETE_MS = 5000;

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

function withAd(msg) {
    return msg + getAdFooter();
}

function isOwner(userId, ownerId) {
    return ownerId && String(userId) === String(ownerId);
}

function isGroupChat(chatType) {
    return ['group', 'supergroup'].includes(chatType);
}

async function isGroupAdmin(botApi, chatId, userId) {
    try {
        const res = await botApi.getChatMember(chatId, userId);
        return ['creator', 'administrator'].includes(res.result?.status);
    } catch {
        return false;
    }
}

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

const startTime = Date.now();

const lastBotMessage = {};

async function cleanupMessages(botApi, chatId, userMessageId) {
    if (lastBotMessage[chatId]) {
        try { await botApi.deleteMessage(chatId, lastBotMessage[chatId]); } catch {}
        delete lastBotMessage[chatId];
    }
    try { await botApi.deleteMessage(chatId, userMessageId); } catch {}
}

function trackBotMessage(chatId, sent) {
    const msgId = sent?.result?.message_id;
    if (msgId) lastBotMessage[chatId] = msgId;
}

function getStartKeyboard(botUsername) {
    return [
        [
            { text: '✚ Aᴅᴅ Tᴏ Gʀᴏᴜᴘ', url: `https://t.me/${botUsername}?startgroup=true` },
        ],
        [
            { text: '📚 Hᴇʟᴘ', callback_data: 'cb_help' },
        ],
        [
            { text: '💥 Cʟᴏsᴇ ✕', callback_data: 'cb_close' },
        ],
    ];
}

function getBackKeyboard() {
    return [
        [
            { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' },
        ],
    ];
}

function getCloseKeyboard() {
    return [
        [
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' },
        ],
    ];
}

export async function onUpdate(data, botApi, RestrictedChats, botUsername, ownerId, webhookSecret, botPhoto) {

    await Store.load();

    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        const linkPreview = botPhoto ? {
            url: botPhoto,
            prefer_large_media: true,
            show_above_text: true
        } : null;

        const editMsg = async (text, keyboard) => {
            await botApi.editMessageText(chatId, messageId, text, keyboard, linkPreview);
        };

        try {
            switch (cq.data) {
                case 'cb_help':
                    await editMsg(withAd(helpMessage), getBackKeyboard());
                    break;
                case 'cb_menu': {
                    const caption = withAd(startMessage);
                    await editMsg(caption, getStartKeyboard(botUsername));
                    break;
                }
                case 'cb_close':
                    await botApi.deleteMessage(chatId, messageId);
                    break;
                default:
                    await botApi.answerCallbackQuery(cq.id, '❓ Uɴᴋɴᴏᴡɴ Aᴄᴛɪᴏɴ.', true);
                    return;
            }
            await botApi.answerCallbackQuery(cq.id);
        } catch (error) {
            log.error('[Callback]', error.message);
            try { await botApi.answerCallbackQuery(cq.id, '⚠️ Sᴏᴍᴇᴛʜɪɴɢ Wᴇɴᴛ Wʀᴏɴɢ.', true); } catch {}
        }
        return;
    }

    if (data.message) {
        const msg = data.message;
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const text = msg.text || msg.caption || '';
        const chatType = msg.chat.type;
        const userId = msg.from?.id;

        const chatTitle = msg.chat.title || msg.chat.first_name || String(chatId);
        await Store.updateChat(chatId, chatTitle, chatType);
        await Store.trackMessage();
        uniqueChats.add(chatId);

        const linkPreview = botPhoto ? {
            url: botPhoto,
            prefer_large_media: true,
            show_above_text: true
        } : null;

        if (msg.new_chat_members && Array.isArray(msg.new_chat_members)) {
            const isBotAdded = msg.new_chat_members.some(
                member => member.username?.toLowerCase() === botUsername.toLowerCase()
            );
            if (isBotAdded) {
                let botAdded = botAddedMessage;
                const isAdmin = await isGroupAdmin(botApi, chatId, userId);
                if (!isAdmin) {
                    botAdded += '\n\n' + notAdminMessage;
                }
                const sent = await botApi.sendMessage(chatId, botAdded, getCloseKeyboard());
                trackBotMessage(chatId, sent);
                return;
            }
        }

        if (msg.left_chat_member &&
            msg.left_chat_member.username?.toLowerCase() === botUsername.toLowerCase()) {
            await Store.removeChat(chatId);
            return;
        }

        if (chatType === 'private') {
            if (text && text.startsWith('/')) {
                await handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview);
                return;
            }
            const sent = await botApi.sendMessage(chatId, withAd(startMessage), getStartKeyboard(botUsername), linkPreview);
            trackBotMessage(chatId, sent);
            return;
        }

        if (isGroupChat(chatType)) {
            if (text && text.startsWith('/')) {
                await handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview);
                return;
            }

            if (!text) return;

            const isAdmin = await isGroupAdmin(botApi, chatId, userId);

            if (!isAdmin) {
                const hasLink = containsLinks(text);
                const isPromo = detectPromotion(text);

                if (hasLink || isPromo) {
                    await botApi.deleteMessage(chatId, messageId);

                    if (hasLink) await Store.trackLinkRemoved();
                    if (isPromo) await Store.trackPromotionStopped();

                    const userDisplay = msg.from?.username || String(msg.from?.id || 'User');
                    const delMsg = hasLink
                        ? linkDeletedMessage(userDisplay)
                        : promotionDeletedMessage(userDisplay);

                    const sent = await botApi.sendMessage(chatId, delMsg, null, linkPreview);
                    if (sent?.result?.message_id) {
                        setTimeout(async () => {
                            try { await botApi.deleteMessage(chatId, sent.result.message_id); } catch {}
                        }, AUTO_DELETE_MS);
                    }
                }
            }
        }
    }
}

async function handleCommand(text, chatId, msg, botApi, botUsername, ownerId, linkPreview) {
    const cmd = text.split(' ')[0].toLowerCase();
    const userId = msg.from?.id;

    switch (cmd) {
        case '/start':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const sent = await botApi.sendMessage(chatId, withAd(startMessage), getStartKeyboard(botUsername), linkPreview);
            trackBotMessage(chatId, sent);
            break;

        case '/help':
            await cleanupMessages(botApi, chatId, msg.message_id);
            const helpSent = await botApi.sendMessage(chatId, withAd(helpMessage), getCloseKeyboard(), linkPreview);
            trackBotMessage(chatId, helpSent);
            break;

        case '/status':
            await cleanupMessages(botApi, chatId, msg.message_id);
            if (isGroupChat(msg.chat.type)) {
                const botInfo = await botApi.getMe();
                const botId = botInfo?.result?.id;
                const isBotAdm = botId ? await isGroupAdmin(botApi, chatId, botId) : false;
                const statusMsg = isBotAdm ? statusOkMessage : statusNotAdminMessage;
                const statusSent = await botApi.sendMessage(chatId, withAd(statusMsg), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, statusSent);
            } else {
                const statusSent = await botApi.sendMessage(chatId, withAd(statusPrivateMessage), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, statusSent);
            }
            break;

        default:
            break;
    }
}
