/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — index.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Express server entry point for Docker, Vercel, and local
 *   development. Handles webhook routing, env validation,
 *   health checks, and the landing page.
 *
 * @exports app (Express instance, default export for Vercel)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import express from 'express';
import dotenv from 'dotenv';
import { htmlContent } from './landing.js';
import { log } from './helper.js';
import { Store } from './store.js';
import { createBotConfig, handleUpdate } from './botManager.js';

// ══════════════════════════════════════════════════════════════
// ENVIRONMENT SETUP
// ══════════════════════════════════════════════════════════════

// dotenv only needed for local/Docker — Vercel/Render inject env vars natively
if (!process.env.VERCEL) {
    dotenv.config();
}

// ══════════════════════════════════════════════════════════════
// BOT INITIALIZATION
// ══════════════════════════════════════════════════════════════

const botConfig = createBotConfig(process.env);

if (!botConfig) {
    log.error('BOT_TOKEN not configured.');
    process.exit(1);
}

// ══════════════════════════════════════════════════════════════
// EXPRESS APP SETUP
// ══════════════════════════════════════════════════════════════

const app = express();
app.use(express.json({ limit: '1mb' }));

// ══════════════════════════════════════════════════════════════
// WEBHOOK ROUTES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Webhook Endpoint ----
// POST / — validates secret, delegates to bot handler
app.post('/', async (req, res) => {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== botConfig.webhookSecret) {
        log.warn('Webhook secret mismatch — rejecting');
        return res.status(403).send('Forbidden');
    }

    try {
        await handleUpdate(botConfig, req.body);
        res.status(200).send('Ok');
    } catch (error) {
        log.error('Webhook error:', error.message);
        res.status(200).send('Ok'); // Always return 200 to Telegram
    }
});

// ---- FEATURE: Set Webhook ----
// POST /set-webhook  { "base_url": "https://your-domain.com" }
// Registers webhook for the bot
app.post('/set-webhook', async (req, res) => {
    const { base_url } = req.body;
    if (!base_url) return res.status(400).json({ error: 'base_url is required' });

    const webhookUrl = `${base_url.replace(/\/+$/, '')}/`;
    try {
        const resp = await fetch(`https://api.telegram.org/bot${botConfig.token}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: webhookUrl, secret_token: botConfig.webhookSecret }),
        });
        const data = await resp.json();
        log.info(`[Webhook] @${botConfig.username} → ${webhookUrl}: ${data.description}`);
        res.json({ ok: data.ok, description: data.description });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// ══════════════════════════════════════════════════════════════
// STATIC ROUTES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Landing Page ----
app.get('/', (req, res) => {
    res.send(htmlContent);
});

// ---- FEATURE: Health Endpoint ----
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        bot: botConfig.username,
        webhookSecured: !!botConfig.webhookSecret,
    });
});

// ══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Payload size limit handler ----
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).send('Payload too large');
    next(err);
});

// ══════════════════════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════════════════════

// Pre-load store state on startup
Store.load();

// ══════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Graceful Shutdown ----

/**
 * Flush state to disk and exit cleanly.
 * Called on SIGTERM, SIGINT, and uncaught exceptions.
 *
 * @param {string} signal - Signal name or description
 */
async function shutdown(signal) {
    log.info(`[Shutdown] ${signal} received — flushing state...`);
    try {
        await Store.flush();
    } catch (error) {
        log.error('[Shutdown] Flush failed:', error.message);
    }
    process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (error) => {
    log.error('[Fatal] Uncaught exception:', error.message);
    shutdown('uncaughtException');
});

// ══════════════════════════════════════════════════════════════
// START SERVER
// ══════════════════════════════════════════════════════════════

// NOTE: Vercel does not allow self-listening — app is exported for Vercel's serverless runtime
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        log.info(`Server running on port ${PORT}`);
        log.info(`Bot: @${botConfig.username}`);
    });
}

export default app;

// ══════════════════════════════════════════════════════════════ END: index.js
