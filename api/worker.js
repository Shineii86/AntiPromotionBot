/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — worker.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Cloudflare Workers entry point. Supports single-bot and
 *   multi-bot webhook routing.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { htmlContent } from './landing.js';
import { returnHTML, log } from './helper.js';
import { BotManager } from './botManager.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (!this._manager || this._managerEnv !== env) {
            this._manager = new BotManager(env);
            this._managerEnv = env;
        }
        const manager = this._manager;

        if (url.pathname === '/health' && request.method === 'GET') {
            return new Response(JSON.stringify({
                status: 'ok', timestamp: new Date().toISOString(), botCount: manager.count,
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        if (url.pathname.startsWith('/bot/') && request.method === 'POST') {
            const botId = url.pathname.split('/')[2];
            const bot = manager.getBot(botId);
            if (!bot) return new Response('Unknown bot', { status: 404 });
            const token = request.headers.get('x-telegram-bot-api-secret-token');
            if (token !== bot.webhookSecret) return new Response('Forbidden', { status: 403 });
            const data = await request.json();
            try { await manager.handleUpdate(botId, data); } catch (error) { log.error('Webhook error:', error.message); }
            return new Response('Ok', { status: 200 });
        }

        if (request.method === 'POST') {
            const token = request.headers.get('x-telegram-bot-api-secret-token');
            const data = await request.json();
            const handled = await manager.handleBySecret(token, data);
            if (!handled) return new Response('Forbidden', { status: 403 });
            return new Response('Ok', { status: 200 });
        }

        return returnHTML(htmlContent);
    }
};
