/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — botManager.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Bot manager. Parses bot config from env vars and manages
 *   TelegramBotAPI instances.
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
    if (env.BOT_TOKEN && env.BOT_USERNAME) {
        return [{
            token: env.BOT_TOKEN,
            username: env.BOT_USERNAME,
            botId: env.BOT_USERNAME.toLowerCase(),
        }];
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

        await onUpdate(
            data, bot.api, bot.restrictedChats,
            bot.username, bot.ownerId,
            bot.webhookSecret, bot.botPhoto
        );
    }

    async handleBySecret(secret, data) {
        const bot = this.getBotBySecret(secret);
        if (!bot) return false;
        await this.handleUpdate(bot.botId, data);
        return true;
    }
}
