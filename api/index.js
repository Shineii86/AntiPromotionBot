/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — index.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Express server entry point for Docker, Vercel, and local
 *   development.
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
    log.error('No bot configured. Set BOT_TOKEN + BOT_USERNAME.');
    process.exit(1);
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/', async (req, res) => {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    const handled = await manager.handleBySecret(token, req.body);
    if (!handled) {
        log.warn('Webhook secret mismatch — rejecting');
        return res.status(403).send('Forbidden');
    }
    res.status(200).send('Ok');
});

app.get('/', (req, res) => {
    res.send(htmlContent);
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).send('Payload too large');
    }
    next(err);
});

Store.load();

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

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        log.info(`Server running on port ${PORT}`);
        for (const bot of manager.getAllBots()) {
            log.info(`  @${bot.username}`);
        }
    });
}

export default app;
