/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botManager.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Multi-bot manager. Parses BOT_TOKENS env var and manages
 *   multiple TelegramBotAPI instances, each with its own config.
 *   Supports single-bot (BOT_TOKEN) and multi-bot (BOT_TOKENS)
 *   modes with full backward compatibility.
 *
 * @exports BotManager
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import TelegramBotAPI from './antiAPI.js';
import { log } from './helper.js';
import { onUpdate } from './botHandler.js';

// ══════════════════════════════════════════════════════════════
// BOT CONFIGURATION PARSER
// ══════════════════════════════════════════════════════════════

/**
 * Parse BOT_TOKENS env var into bot configurations.
 * Format: token1:username1,token2:username2
 *
 * Falls back to BOT_TOKEN + BOT_USERNAME for single-bot mode.
 *
 * @param {Object} env - Environment variables
 * @returns {Array<Object>} Array of bot configurations
 */
function parseBotConfigs(env) {
    // Multi-bot mode: BOT_TOKENS takes precedence
    if (env.BOT_TOKENS) {
        const entries = env.BOT_TOKENS.split(',').map(s => s.trim()).filter(Boolean);
        const configs = [];

        for (const entry of entries) {
            // NOTE: Use lastIndexOf to handle tokens with colons
            const lastColon = entry.lastIndexOf(':');
            if (lastColon === -1) {
                log.warn(`[BotManager] Invalid BOT_TOKENS entry (need token:username): ${entry.substring(0, 20)}...`);
                continue;
            }
            const token = entry.substring(0, lastColon).trim();
            const username = entry.substring(lastColon + 1).trim();
            if (!token || !username) continue;
            configs.push({ token, username, botId: username.toLowerCase() });
        }

        if (configs.length === 0) {
            log.error('[BotManager] BOT_TOKENS set but no valid entries parsed');
            return [];
        }

        return configs;
    }

    // Single-bot mode: backward compatible
    if (env.BOT_TOKEN && env.BOT_USERNAME) {
        return [{ token: env.BOT_TOKEN, username: env.BOT_USERNAME, botId: env.BOT_USERNAME.toLowerCase() }];
    }

    return [];
}

// ══════════════════════════════════════════════════════════════
// BOT MANAGER
// ══════════════════════════════════════════════════════════════

export class BotManager {
    /**
     * @param {Object} env - Environment variables
     */
    constructor(env) {
        this.env = env;
        this.bots = new Map();           // botId -> { api, config }
        this.webhookSecrets = new Map(); // secret -> botId (for routing)

        const configs = parseBotConfigs(env);

        for (const cfg of configs) {
            const botConfig = {
                token: cfg.token,
                username: cfg.username,
                botId: cfg.botId,
                api: new TelegramBotAPI(cfg.token),
                ownerId: env.OWNER_ID || '',
                webhookSecret: env.WEBHOOK_SECRET || (globalThis.crypto?.randomUUID?.() || 'auto-secret-' + Date.now()),
                botPhoto: env.BOT_PHOTO || '',
                logChannel: env.LOG_CHANNEL || '',
            };

            this.bots.set(cfg.botId, botConfig);
            this.webhookSecrets.set(botConfig.webhookSecret, cfg.botId);

            log.info(`[BotManager] Registered bot: @${cfg.username} (${cfg.botId})`);
        }

        log.info(`[BotManager] ${this.bots.size} bot(s) configured`);
    }

    /**
     * Get a bot config by its botId (username.toLowerCase()).
     *
     * @param {string} botId - Bot identifier
     * @returns {Object|null} Bot config or null
     */
    getBot(botId) {
        return this.bots.get(botId);
    }

    /**
     * Get a bot config by webhook secret token.
     *
     * @param {string} secret - Webhook secret token
     * @returns {Object|null} Bot config or null
     */
    getBotBySecret(secret) {
        const botId = this.webhookSecrets.get(secret);
        return botId ? this.bots.get(botId) : null;
    }

    /**
     * Get all registered bots.
     *
     * @returns {Object[]} Array of bot configs
     */
    getAllBots() {
        return [...this.bots.values()];
    }

    /**
     * Get bot count.
     *
     * @returns {number} Number of registered bots
     */
    get count() {
        return this.bots.size;
    }

    /**
     * Handle an incoming Telegram update for a specific bot.
     *
     * @param {string} botId - Bot identifier (username.toLowerCase())
     * @param {Object} data - Telegram update object
     * @returns {Promise<void>}
     */
    async handleUpdate(botId, data) {
        const bot = this.bots.get(botId);
        if (!bot) throw new Error(`Unknown bot: ${botId}`);

        await onUpdate(
            data, bot.api,
            bot.username, bot.ownerId,
            bot.webhookSecret, bot.botPhoto,
            bot.logChannel
        );
    }

    /**
     * Route an update by webhook secret (for single-endpoint mode).
     * Validates the secret and delegates to the correct bot.
     *
     * @param {string} secret - x-telegram-bot-api-secret-token header
     * @param {Object} data - Telegram update object
     * @returns {Promise<boolean>} true if handled, false if secret unknown
     */
    async handleBySecret(secret, data) {
        const bot = this.getBotBySecret(secret);
        if (!bot) return false;
        await this.handleUpdate(bot.botId, data);
        return true;
    }
}

// ══════════════════════════════════════════════════════════════ END: botManager.js
