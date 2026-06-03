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
 *   Persists: chats, stats, paused chats, per-group config,
 *   user violations, recent deletions, command usage.
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
            warningsSent: 0,
            repeatOffenders: 0,
        },
        paused: [],
        commandUsage: {},
        recentDeletions: [],
        userViolations: {},
        perChatConfig: {},
    };
}

function fileLoad() {
    if (!fs || !STATE_FILE) return false;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (fs.existsSync(STATE_FILE)) {
            const raw = fs.readFileSync(STATE_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            const defaults = getDefaultState();
            state = {
                ...defaults,
                ...parsed,
                stats: { ...defaults.stats, ...parsed.stats },
                commandUsage: { ...defaults.commandUsage, ...parsed.commandUsage },
                userViolations: { ...defaults.userViolations, ...parsed.userViolations },
                perChatConfig: { ...defaults.perChatConfig, ...parsed.perChatConfig },
            };
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
            const defaults = getDefaultState();
            state = {
                ...defaults,
                ...data,
                stats: { ...defaults.stats, ...data.stats },
                commandUsage: { ...defaults.commandUsage, ...data.commandUsage },
                userViolations: { ...defaults.userViolations, ...data.userViolations },
                perChatConfig: { ...defaults.perChatConfig, ...data.perChatConfig },
            };
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
        delete state.perChatConfig[key];
        state.paused = state.paused.filter(id => String(id) !== key);
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

async function trackWarning() {
    state.stats.warningsSent++;
    scheduleSave();
}

async function trackRepeatOffender() {
    state.stats.repeatOffenders++;
    scheduleSave();
}

async function trackCommand(cmd) {
    const name = cmd.replace('/', '');
    state.commandUsage[name] = (state.commandUsage[name] || 0) + 1;
    scheduleSave();
}

function getCommandUsage() { return state.commandUsage; }

async function addDeletion(entry) {
    state.recentDeletions.push(entry);
    if (state.recentDeletions.length > 50) state.recentDeletions.shift();
    scheduleSave();
}

function getRecentDeletions(limit = 20) {
    return state.recentDeletions.slice(-limit).reverse();
}

function isPaused(chatId) { return state.paused.includes(Number(chatId)); }
function getPausedCount() { return state.paused.length; }

async function pauseChat(chatId) {
    const id = Number(chatId);
    if (!state.paused.includes(id)) {
        state.paused.push(id);
        scheduleSave();
    }
}

async function resumeChat(chatId) {
    const id = Number(chatId);
    const idx = state.paused.indexOf(id);
    if (idx !== -1) {
        state.paused.splice(idx, 1);
        scheduleSave();
    }
}

function getUserViolations(chatId, userId) {
    const key = `${chatId}:${userId}`;
    return state.userViolations[key] || 0;
}

async function incrementUserViolation(chatId, userId) {
    const key = `${chatId}:${userId}`;
    state.userViolations[key] = (state.userViolations[key] || 0) + 1;
    scheduleSave();
    return state.userViolations[key];
}

async function resetUserViolations(chatId, userId) {
    const key = `${chatId}:${userId}`;
    delete state.userViolations[key];
    scheduleSave();
}

function getPerChatConfig(chatId) {
    return state.perChatConfig[String(chatId)] || {};
}

async function setPerChatConfig(chatId, config) {
    const key = String(chatId);
    state.perChatConfig[key] = { ...(state.perChatConfig[key] || {}), ...config };
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
    trackWarning,
    trackRepeatOffender,
    trackCommand,
    getCommandUsage,
    addDeletion,
    getRecentDeletions,
    isPaused,
    getPausedCount,
    pauseChat,
    resumeChat,
    getUserViolations,
    incrementUserViolation,
    resetUserViolations,
    getPerChatConfig,
    setPerChatConfig,
};
