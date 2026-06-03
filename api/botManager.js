/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botManager.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Multi-bot manager. Parses BOT_TOKENS env var and manages
 *   multiple TelegramBotAPI instances, each with its own config.
 *   Supports single-bot (BOT_TOKEN) and multi-bot (BOT_TOKENS).
 *
 * @exports BotManager
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import TelegramBotAPI from './antiAPI.js';
import { getChatIds, log } from './helper.js';
import { onUpdate } from './botHandler.js';

function parseBotConfigs(env) {
    if (env.BOT_TOKENS) {
        const entries = env.BOT_TOKENS.split(',').map(s => s.trim()).filter(Boolean);
        const configs = [];
        for (const entry of entries) {
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
        return configs;
    }
    if (env.BOT_TOKEN && env.BOT_USERNAME) {
        return [{ token: env.BOT_TOKEN, username: env.BOT_USERNAME, botId: env.BOT_USERNAME.toLowerCase() }];
    }
    return [];
}

export class BotManager {
    constructor(env) {
        this.env = env;
        this.bots = new Map();
        this.webhookSecrets = new Map();

        const configs = parseBotConfigs(env);
        for (const cfg of configs) {
            const botConfig = {
                token: cfg.token,
                username: cfg.username,
                botId: cfg.botId,
                api: new TelegramBotAPI(cfg.token),
                restrictedChats: getChatIds(env.RESTRICTED_CHATS),
                ownerId: env.OWNER_ID || '',
                webhookSecret: env.WEBHOOK_SECRET || (globalThis.crypto?.randomUUID?.() || 'auto-secret-' + Date.now()),
                botPhoto: env.BOT_PHOTO || '',
                logChannel: env.LOG_CHANNEL || '',
            };
            this.bots.set(cfg.botId, botConfig);
            this.webhookSecrets.set(botConfig.webhookSecret, cfg.botId);
            log.info(`[BotManager] Registered bot: @${cfg.username}`);
        }
        log.info(`[BotManager] ${this.bots.size} bot(s) configured`);
    }

    getBot(botId) {
        return this.bots.get(botId);
    }

    getBotBySecret(secret) {
        const botId = this.webhookSecrets.get(secret);
        return botId ? this.bots.get(botId) : null;
    }

    getAllBots() {
        return [...this.bots.values()];
    }

    get count() {
        return this.bots.size;
    }

    async handleUpdate(botId, data) {
        const bot = this.bots.get(botId);
        if (!bot) throw new Error(`Unknown bot: ${botId}`);
        await onUpdate(data, bot.api, bot.restrictedChats, bot.username, bot.ownerId, bot.webhookSecret, bot.botPhoto, bot.logChannel);
    }

    async handleBySecret(secret, data) {
        const bot = this.getBotBySecret(secret);
        if (!bot) return false;
        await this.handleUpdate(bot.botId, data);
        return true;
    }
}
