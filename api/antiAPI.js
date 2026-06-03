/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — antiAPI.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Telegram Bot API wrapper. All HTTP calls to the Telegram
 *   API go through this class for consistent error handling,
 *   logging, and request formatting.
 *
 * @exports TelegramBotAPI (default)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// TELEGRAM BOT API WRAPPER
// ══════════════════════════════════════════════════════════════

export default class TelegramBotAPI {
    /**
     * @param {string} botToken - Telegram Bot API token from @BotFather
     */
    constructor(botToken) {
        this.apiUrl = `https://api.telegram.org/bot${botToken}/`;
    }

    /**
     * Core API caller. All public methods delegate to this.
     * Handles timeout, error logging, and response parsing.
     *
     * @param {string} action - API method name (e.g. "sendMessage")
     * @param {Object} body - Request payload
     * @returns {Promise<Object>} Parsed Telegram API response
     * @throws {Error} On HTTP error or timeout
     */
    async callApi(action, body) {
        try {
            const response = await fetch(this.apiUrl + action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(10000),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error(`[TG API] ${action} failed (${response.status}): ${data.description || 'Unknown'}`);
                throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
            }
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`[TG API] Timeout: ${action}`);
                throw new Error(`Telegram API timeout: ${action}`);
            }
            throw error;
        }
    }

    // ---- FEATURE: Bot Info ----

    /** @returns {Promise<Object>} Bot profile info */
    async getMe() {
        return this.callApi('getMe', {});
    }

    // ---- FEATURE: Chat & Membership ----

    /** @param {number} chatId @returns {Promise<Object>} Chat member info */
    async getChatMember(chatId, userId) {
        return this.callApi('getChatMember', { chat_id: chatId, user_id: userId });
    }

    // ---- FEATURE: Messaging ----

    /**
     * Send an HTML message to a chat with optional inline keyboard.
     *
     * @param {number} chatId
     * @param {string} text - HTML-formatted message
     * @param {Array|null} [inlineKeyboard=null] - Inline keyboard markup
     * @param {Object|null} [linkPreviewOptions=null] - Link preview config
     * @returns {Promise<Object>}
     */
    async sendMessage(chatId, text, inlineKeyboard = null, linkPreviewOptions = null) {
        return this.callApi('sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: !linkPreviewOptions,
            ...(linkPreviewOptions && { link_preview_options: linkPreviewOptions }),
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } }),
        });
    }

    /**
     * Edit an existing message's text and keyboard.
     *
     * @param {number} chatId
     * @param {number} messageId
     * @param {string} text - HTML-formatted message
     * @param {Array|null} [inlineKeyboard=null]
     * @param {Object|null} [linkPreviewOptions=null]
     * @returns {Promise<Object>}
     */
    async editMessageText(chatId, messageId, text, inlineKeyboard = null, linkPreviewOptions = null) {
        return this.callApi('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: !linkPreviewOptions,
            ...(linkPreviewOptions && { link_preview_options: linkPreviewOptions }),
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } }),
        });
    }

    /** @param {number} chatId @param {number} messageId @returns {Promise<Object>} */
    async deleteMessage(chatId, messageId) {
        return this.callApi('deleteMessage', {
            chat_id: chatId,
            message_id: messageId,
        });
    }

    // ---- FEATURE: Callback Queries ----

    /**
     * Answer a callback query (inline button press).
     *
     * @param {string} callbackQueryId
     * @param {string} [text=''] - Toast notification text
     * @param {boolean} [showAlert=false] - Show as alert dialog
     * @returns {Promise<Object>}
     */
    async answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
        return this.callApi('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: showAlert,
        });
    }

    // ---- FEATURE: Chat Management ----

    /** @param {number} chatId @returns {Promise<Object>} */
    async leaveChat(chatId) {
        return this.callApi('leaveChat', { chat_id: chatId });
    }

    // ---- FEATURE: Webhook Management ----

    /**
     * Register or update the webhook URL for this bot.
     *
     * @param {string} url - Webhook endpoint URL
     * @param {string} [secretToken=''] - Secret token for x-telegram-bot-api-secret-token header
     * @param {string[]} [allowedUpdates=['message','callback_query']] - Update types to receive
     * @returns {Promise<Object>}
     */
    async setWebhook(url, secretToken = '', allowedUpdates = ['message', 'callback_query']) {
        return this.callApi('setWebhook', {
            url: url,
            secret_token: secretToken,
            allowed_updates: allowedUpdates,
        });
    }
}

// ══════════════════════════════════════════════════════════════ END: antiAPI.js
