/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — store.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Persistent state storage. Environment-aware:
 *   - Upstash Redis (free): when UPSTASH_REDIS_REST_URL is set
 *   - Local/Docker/Render: uses data/state.json file
 *   - Cloudflare Workers / Fallback: in-memory (non-persistent)
 *
 *   Persists: chats, stats counters, config settings.
 *
 * @exports Store
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { log } from './helper.js';

const isNode = typeof process !== 'undefined'
    && typeof process.versions === 'object'
    && !!process.versions.node;

let fs = null;
let path = null;
let DATA_DIR = null;
let STATE_FILE = null;

async function loadNodeModules() {
    if (fs) return true;
    if (!isNode) return false;
    try {
        [fs, path] = await Promise.all([import('fs'), import('path')]);
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        DATA_DIR = path.join(__dirname, '..', 'data');
        STATE_FILE = path.join(DATA_DIR, 'state.json');
        return true;
    } catch {
        return false;
    }
}

let isUpstash = false;
const KV_KEY = 'antipromotionbot:state';

function detectRedis() {
    isUpstash = isNode
        && typeof process.env !== 'undefined'
        && !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let storageType = 'memory';
let redis = null;
let loaded = false;

let state = getDefaultState();

function getDefaultState() {
    return {
        chats: {},
        stats: {
            messagesProcessed: 0,
            promotionsStopped: 0,
            linksRemoved: 0,
        },
    };
}

function fileLoad() {
    if (!fs || !STATE_FILE) return false;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (fs.existsSync(STATE_FILE)) {
            const raw = fs.readFileSync(STATE_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            state = { ...getDefaultState(), ...parsed, stats: { ...getDefaultState().stats, ...parsed.stats } };
            log.info(`[Store:File] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            fileSave();
            log.info('[Store:File] Created fresh state.json');
        }
        return true;
    } catch (error) {
        log.error('[Store:File] Failed to load:', error.message);
        state = getDefaultState();
        return false;
    }
}

function fileSave() {
    if (!fs || !STATE_FILE) return;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
        log.error('[Store:File] Failed to save:', error.message);
    }
}

async function upstashInit() {
    if (redis) return;
    try {
        const { Redis } = await import('@upstash/redis');
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        log.info('[Store:Upstash] Redis client initialized');
    } catch (error) {
        log.error('[Store:Upstash] Failed to initialize:', error.message);
        storageType = 'memory';
    }
}

async function upstashLoad() {
    await upstashInit();
    if (!redis) return;
    try {
        const data = await redis.get(KV_KEY);
        if (data) {
            state = { ...getDefaultState(), ...data, stats: { ...getDefaultState().stats, ...data.stats } };
            log.info(`[Store:Upstash] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            await upstashSave();
            log.info('[Store:Upstash] Created fresh state in Redis');
        }
    } catch (error) {
        log.error('[Store:Upstash] Failed to load:', error.message);
        state = getDefaultState();
    }
}

async function upstashSave() {
    if (!redis) return;
    try {
        await redis.set(KV_KEY, state);
    } catch (error) {
        log.error('[Store:Upstash] Failed to save:', error.message);
    }
}

const SAVE_DEBOUNCE_MS = 5000;
let dirty = false;
let saveTimer = null;

function scheduleSave() {
    dirty = true;
    if (saveTimer) return;
    saveTimer = setTimeout(async () => {
        saveTimer = null;
        if (!dirty) return;
        dirty = false;
        if (storageType === 'upstash') await upstashSave();
        else if (storageType === 'file') fileSave();
    }, SAVE_DEBOUNCE_MS);
}

async function flush() {
    if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
    }
    dirty = false;
    if (storageType === 'upstash') await upstashSave();
    else if (storageType === 'file') fileSave();
    log.info('[Store] Flushed to disk');
}

async function load() {
    if (loaded) return;
    detectRedis();
    if (isUpstash) {
        storageType = 'upstash';
        await upstashLoad();
    } else {
        const hasFS = await loadNodeModules();
        if (hasFS && fileLoad()) {
            storageType = 'file';
        } else {
            storageType = 'memory';
            state = getDefaultState();
            log.info('[Store] Using in-memory storage');
        }
    }
    loaded = true;
    log.info(`[Store] Storage backend: ${storageType}`);
}

async function updateChat(chatId, title, type) {
    const key = String(chatId);
    const now = Date.now();
    if (state.chats[key]) {
        state.chats[key].title = title || state.chats[key].title;
        state.chats[key].type = type || state.chats[key].type;
        state.chats[key].lastSeen = now;
        state.chats[key].messageCount = (state.chats[key].messageCount || 0) + 1;
    } else {
        state.chats[key] = {
            id: Number(chatId),
            title: title || `Chat ${chatId}`,
            type: type || 'unknown',
            firstSeen: now,
            lastSeen: now,
            messageCount: 1,
        };
    }
    scheduleSave();
}

async function removeChat(chatId) {
    const key = String(chatId);
    if (state.chats[key]) {
        delete state.chats[key];
        scheduleSave();
        return true;
    }
    return false;
}

function getAllChats() { return Object.values(state.chats); }
function getChatCount() { return Object.keys(state.chats).length; }
function hasChat(chatId) { return String(chatId) in state.chats; }

function getStats() { return state.stats; }

async function trackMessage() {
    state.stats.messagesProcessed++;
    scheduleSave();
}

async function trackPromotionStopped() {
    state.stats.promotionsStopped++;
    scheduleSave();
}

async function trackLinkRemoved() {
    state.stats.linksRemoved++;
    scheduleSave();
}

function getStorageType() { return storageType; }

export const Store = {
    load,
    flush,
    getStorageType,
    updateChat,
    removeChat,
    getAllChats,
    getChatCount,
    hasChat,
    getStats,
    trackMessage,
    trackPromotionStopped,
    trackLinkRemoved,
};
