/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — index.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Express server entry point for Docker, Vercel, and local
 *   development. Supports single-bot (BOT_TOKEN) and multi-bot
 *   (BOT_TOKENS) modes.
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
import { BotManager } from './botManager.js';

if (!process.env.VERCEL) {
    dotenv.config();
}

const manager = new BotManager(process.env);
if (manager.count === 0) {
    log.error('No bot configured. Set BOT_TOKEN + BOT_USERNAME or BOT_TOKENS.');
    process.exit(1);
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/bot/:botId', async (req, res) => {
    const { botId } = req.params;
    const bot = manager.getBot(botId);
    if (!bot) return res.status(404).send('Unknown bot');
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== bot.webhookSecret) {
        log.warn(`Webhook secret mismatch for @${bot.username}`);
        return res.status(403).send('Forbidden');
    }
    try {
        await manager.handleUpdate(botId, req.body);
        res.status(200).send('Ok');
    } catch (error) {
        log.error(`Webhook error for @${bot.username}:`, error.message);
        res.status(200).send('Ok');
    }
});

app.post('/', async (req, res) => {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    const handled = await manager.handleBySecret(token, req.body);
    if (!handled) {
        log.warn('Webhook secret mismatch on /');
        return res.status(403).send('Forbidden');
    }
    res.status(200).send('Ok');
});

app.post('/set-webhooks', async (req, res) => {
    const { base_url } = req.body;
    if (!base_url) return res.status(400).json({ error: 'base_url is required' });
    const cleanUrl = base_url.replace(/\/+$/, '');
    const results = [];
    for (const bot of manager.getAllBots()) {
        const webhookUrl = `${cleanUrl}/bot/${bot.botId}`;
        try {
            const resp = await fetch(`https://api.telegram.org/bot${bot.token}/setWebhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: webhookUrl, secret_token: bot.webhookSecret }),
            });
            const data = await resp.json();
            results.push({ bot: `@${bot.username}`, url: webhookUrl, ok: data.ok, description: data.description });
            log.info(`[Webhook] @${bot.username} → ${webhookUrl}`);
        } catch (error) {
            results.push({ bot: `@${bot.username}`, url: webhookUrl, ok: false, error: error.message });
        }
    }
    res.json({ ok: true, results });
});

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.get('/health', (req, res) => {
    const bots = manager.getAllBots();
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        botCount: manager.count,
        bots: bots.map(b => ({ username: b.username, webhookSecured: !!b.webhookSecret })),
    });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') return res.status(413).send('Payload too large');
    next(err);
});

Store.load();

async function shutdown(signal) {
    log.info(`[Shutdown] ${signal} received — flushing state...`);
    try { await Store.flush(); } catch (error) { log.error('[Shutdown] Flush failed:', error.message); }
    process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (error) => {
    log.error('[Fatal] Uncaught exception:', error.message);
    shutdown('uncaughtException');
});

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        log.info(`Server running on port ${PORT}`);
        log.info(`Bots: ${manager.count} configured`);
        for (const bot of manager.getAllBots()) {
            log.info(`  @${bot.username} → /bot/${bot.botId}`);
        }
    });
}

export default app;
