/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — worker.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Cloudflare Workers entry point. Handles webhook POST,
 *   health checks, and the landing page — single bot only.
 *
 * @exports default (Worker module)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { htmlContent } from './landing.js';
import { returnHTML, log } from './helper.js';
import { createBotConfig, handleUpdate } from './botManager.js';

// ══════════════════════════════════════════════════════════════
// CLOUDFLARE WORKERS FETCH HANDLER
// ══════════════════════════════════════════════════════════════

export default {
    /**
     * Main request handler for Cloudflare Workers.
     * Routes: / POST (webhook), /health GET, / GET (landing).
     *
     * @param {Request} request - Incoming HTTP request
     * @param {Object} env - Worker environment variables
     * @returns {Promise<Response>} HTTP response
     */
    async fetch(request, env) {
        const url = new URL(request.url);

        // ---- FEATURE: Health Endpoint ----
        if (url.pathname === '/health' && request.method === 'GET') {
            const botConfig = createBotConfig(env);
            return new Response(JSON.stringify({
                status: 'ok', timestamp: new Date().toISOString(), bot: botConfig?.username || 'none',
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        // ---- FEATURE: Webhook POST ----
        if (request.method === 'POST') {
            const botConfig = createBotConfig(env);
            if (!botConfig) return new Response('BOT_TOKEN not configured', { status: 500 });

            const token = request.headers.get('x-telegram-bot-api-secret-token');
            if (token !== botConfig.webhookSecret) {
                return new Response('Forbidden', { status: 403 });
            }

            const data = await request.json();
            try {
                await handleUpdate(botConfig, data);
            } catch (error) {
                log.error('Webhook error:', error.message);
            }
            return new Response('Ok', { status: 200 });
        }

        // ---- FEATURE: Landing Page ----
        return returnHTML(htmlContent);
    }
};

// ══════════════════════════════════════════════════════════════ END: worker.js
