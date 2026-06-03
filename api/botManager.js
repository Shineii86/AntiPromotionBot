/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botManager.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Single-bot manager. Creates bot config from BOT_TOKEN
 *   and BOT_USERNAME. Just enough to wire env → API → handler.
 *
 * @exports createBotConfig
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import TelegramBotAPI from './antiAPI.js';
import { log } from './helper.js';
import { onUpdate } from './botHandler.js';

// ══════════════════════════════════════════════════════════════
// BOT CONFIG FACTORY
// ══════════════════════════════════════════════════════════════

/**
 * Create a single bot config from environment variables.
 *
 * @param {Object} env - Environment variables
 * @returns {Object|null} Bot config object or null if BOT_TOKEN missing
 */
export function createBotConfig(env) {
    if (!env.BOT_TOKEN) {
        log.error('[BotManager] BOT_TOKEN is required');
        return null;
    }

    const username = env.BOT_USERNAME || 'unknown';
    const botId = username.toLowerCase();

    const config = {
        token: env.BOT_TOKEN,
        username,
        botId,
        api: new TelegramBotAPI(env.BOT_TOKEN),
        ownerId: env.OWNER_ID || '',
        webhookSecret: env.WEBHOOK_SECRET || (globalThis.crypto?.randomUUID?.() || 'auto-secret-' + Date.now()),
        botPhoto: env.BOT_PHOTO || '',
        logChannel: env.LOG_CHANNEL || '',
    };

    log.info(`[BotManager] Configured bot: @${username}`);
    return config;
}

/**
 * Process an incoming Telegram update for the bot.
 *
 * @param {Object} config - Bot config from createBotConfig()
 * @param {Object} data - Telegram update object
 * @returns {Promise<void>}
 */
export async function handleUpdate(config, data) {
    if (!config) throw new Error('Bot not configured');

    await onUpdate(
        data, config.api,
        config.username, config.ownerId,
        config.webhookSecret, config.botPhoto,
        config.logChannel
    );
}

// ══════════════════════════════════════════════════════════════ END: botManager.js
