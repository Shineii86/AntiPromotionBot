/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — worker.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Cloudflare Workers entry point.
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
                status: 'ok',
                timestamp: new Date().toISOString(),
                botCount: manager.count,
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (request.method === 'POST') {
            const token = request.headers.get('x-telegram-bot-api-secret-token');
            const data = await request.json();
            const handled = await manager.handleBySecret(token, data);
            if (!handled) {
                return new Response('Forbidden', { status: 403 });
            }
            return new Response('Ok', { status: 200 });
        }

        return returnHTML(htmlContent);
    }
};
