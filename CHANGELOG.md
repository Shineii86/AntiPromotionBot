# Changelog

All notable changes to Anti-Promotion Bot are documented here.

---

## [v1.1.1-beta] — 2026-06-03

### 🐛 Bug Fixes

- **Fixed `detectPromotion()` ignoring custom keywords** — The function now accepts a `customKeywords` parameter and merges it with the built-in keyword list before checking. Per-group custom keywords now actually work.
- **Fixed `/mute` broken user ID resolution** — Switched to reply-only mode. The old code tried to use a string `@username` as a numeric user ID, which always failed.
- **Fixed `broadcast` hitting private chats** — Now only sends to groups/supergroups, not private DMs.
- **Fixed `broadcast` using volatile `uniqueChats` Set** — Now reads from `Store.getAllChats()`, which persists across restarts.
- **Fixed bot-added `notAdminMessage` logic** — Now checks if the *bot itself* is an admin in the group, not the user who added it.
- **Fixed apostrophe escaping in `/warn` and `/mute` usage messages** — Strings no longer break due to unescaped single quotes.

### 🗑️ Removed Dead Code / Unused Features

- **Removed `RestrictedChats` parameter** — This was passed through botManager → onUpdate → botHandler but never checked anywhere. Removed from `onUpdate` signature, `botManager.js`, and `.env.example`.
- **Removed unused exports** — `getAdCount()` (ads.js), `getUserViolations()` and `resetUserViolations()` (store.js), `versionInfo` (constants.js), `getChat()` and `getWebhookInfo()` (antiAPI.js).
- **Removed `uniqueChats` Set** in favor of `Store.getAllChats()`.
- **Removed multi-bot infrastructure** — Stripped `parseBotConfigs()`, `BotManager` class, `BOT_TOKENS` parsing, `/bot/:botId` routing, `handleBySecret()`. `botManager.js` is now a simple single-bot factory (~30 lines). Simplified `index.js` and `worker.js` entry points accordingly.

### ✨ Features Added

- **`/leave` command** — Owner can now remotely remove the bot from a group with `/leave`.
- **Domain validation** for `/whitelist` and `/blacklist` — Invalid domain formats are rejected with a usage message.

### 🔧 Improvements

- **`/warn` now requires reply** — Removed the broken @username syntax; only reply-to works, which provides a reliable user ID.
- **AntiAPI `setWebhook` now accepts `allowedUpdates`** — Configurable instead of hardcoded.
- **Updated `wrangler.toml`** — Removed unused `EMOJI_LIST` variable.
- **Updated `README.md`** — Full command table for all roles, updated env var docs.
- **Section header comments added to `antiAPI.js`** — Matches Alisa-style codebase convention.

---

## [v1.1.0-beta] — 2026-06-03

### ⚠️ Beta Release

This is the first beta release. You may encounter bugs, errors, or unexpected behavior. Please report them to @Shineii86.

### ✨ New Features

- **Multi-Bot Support** — Run multiple Anti-Promotion bots from a single deployment via `BOT_TOKENS` env var. Fully backward compatible with `BOT_TOKEN` + `BOT_USERNAME`.
- **`/stats` Command** — Live statistics showing messages processed, links removed, promotions stopped, warnings sent, repeat offenders, unique chats, paused chats, uptime, start time, storage backend, and command usage breakdown. Includes latest deletions preview.
- **`/pause` & `/resume` Commands** — Group admins can temporarily pause or resume the bot's monitoring in their group.
- **`/settings` Command** — Group admins can view their per-group configuration (whitelist, blacklist, custom keywords, pause status).
- **`/whitelist` Command** — Group admins can add trusted domains that bypass link detection.
- **`/blacklist` Command** — Group admins can add blocked domains for stricter enforcement.
- **`/keywords` Command** — Group admins can add custom promotional keywords to detect.
- **`/warn` Command** — Group admins can manually warn a user (reply to their message). Tracks violation count.
- **`/mute` Command** — Group admins can mute a spammer for 1 hour.
- **`/broadcast` Command** — Owner-only: send a message to every unique chat the bot has seen.
- **`/log` Command** — Owner-only: view the last 20 deletion records with timestamps in IST.
- **`/chats` Command** — Owner-only: list all active chats with type emojis, IDs, and pause status.
- **Escalating Warnings** — Tracks user violations per chat:
  - 1-2 violations: message deleted with standard warning
  - 3-4 violations: strong warning with repeat offender notice
  - 5+ violations: automatic mute for 1 hour
- **Domain Whitelist** — Trusted domains in whitelist bypass link detection. Supports subdomain matching.
- **Custom Keywords** — Group admins can add their own promotional keywords.
- **Log Channel** — Forward all deletion events to a private admin channel (`LOG_CHANNEL` env var).
- **Report Button** — Deleted messages include a 🚨 Report button for members to flag content to admins.
- **Callback Stats Button** — Added 📊 Stats button to the start menu.
- **IST Timestamps** — All deletion logs and stats use Indian Standard Time (UTC+5:30).
- **Beta Notice** — All messages include a beta version notice directing users to report bugs.
- **`/set-webhooks` Endpoint** — Set webhooks for ALL bots in one POST request with `base_url`.

### 🔧 Changes

- `botManager.js` — Added multi-bot parsing via `BOT_TOKENS`, `logChannel` config, and `globalThis.crypto.randomUUID()` fallback for webhook secrets.
- `store.js` — Added `paused` chats tracking, `commandUsage` tracking, `recentDeletions` log (last 50), `userViolations` per chat/user, `perChatConfig` (whitelist, blacklist, customKeywords). New methods: `isPaused`, `pauseChat`, `resumeChat`, `getPausedCount`, `trackCommand`, `getCommandUsage`, `addDeletion`, `getRecentDeletions`, `getUserViolations`, `incrementUserViolation`, `resetUserViolations`, `getPerChatConfig`, `setPerChatConfig`, `trackWarning`, `trackRepeatOffender`.
- `constants.js` — Added 12+ new message constants: `pausedMessage`, `resumedMessage`, `notPausedMessage`, `broadcastStarted`, `broadcastDone`, `logEmptyMessage`, `mutedMessage`, `warnedMessage`, `repeatOffenderMessage`, `whitelistUpdatedMessage`, `blacklistUpdatedMessage`, `keywordsUpdatedMessage`, `betaNotice`. Updated `helpMessage` with all new commands and beta notice. Updated `botAddedMessage` with beta warning.
- `helper.js` — `containsLinks()` now accepts an optional `whitelist` array parameter. Whitelisted domains are ignored during link detection.
- `botHandler.js` — Complete rewrite with all new commands, callback handlers, escalation system, report flow, log channel integration, per-group config loading, rate limiting, and beta notices.
- `index.js` — Added multi-bot webhook routing (`POST /bot/:botId`), `/set-webhooks` endpoint, health check with bot details.
- `worker.js` — Added multi-bot webhook routing (`POST /bot/<botId>`), health endpoint with bot count.
- Updated to ESM modules throughout, added `globalThis.crypto` fallback for Cloudflare Workers.

### 📦 New Dependencies

- `@upstash/redis` (optional) — Free persistent storage for serverless deployments.

### 📖 Documentation

- `README.md` — Updated with all new commands, beta notice, multi-bot config.
- `CHANGELOG.md` — This file.

---

## [v1.0.0] — 2026-06-03

### ✨ Initial Release

- **Anti-Promotion Engine** — Automatically detects and removes promotional links and spam content from group messages
  - URL detection: matches HTTP/HTTPS links, `www.` domains, and `t.me/` links
  - Keyword detection: 30+ promotional keywords including crypto, giveaway, casino, referral patterns
  - Admin exemption: messages from group admins and creator are never removed
  - Auto-delete notifications: warning messages are automatically removed after 5 seconds

- **Commands**
  - `/start` — Welcome message with inline keyboard
  - `/help` — Command reference and usage guide
  - `/status` — Check if bot is properly configured as admin in the group

- **Group Management**
  - Bot-added detection: greets the group when added
  - Bot-removed cleanup: removes chat data when bot leaves
  - Admin status check: warns if bot is not an admin after being added

- **Callback Queries**
  - Inline keyboard navigation for Help and Menu
  - Close button to dismiss messages

- **Multi-Platform Support**
  - Cloudflare Workers entry point (`api/worker.js`)
  - Express server for Docker/Vercel/Local (`api/index.js`)
  - Landing page at root URL

- **Modular Architecture**
  - `api/antiAPI.js` — Telegram Bot API wrapper
  - `api/botHandler.js` — Core anti-promotion logic
  - `api/botManager.js` — Bot configuration manager
  - `api/constants.js` — Message templates and keyboard layouts
  - `api/helper.js` — Utility functions (link/promotion detection, logger)
  - `api/store.js` — Persistent state storage (Upstash Redis / file / memory)
  - `api/ads.js` — Centralized ad library
  - `api/landing.js` — Landing page HTML
  - `api/version.js` — Version source of truth

- **Security Features**
  - Webhook secret validation
  - Rate limiting (10 actions per 10 seconds per chat)
  - Owner-only admin commands protection

- **Infrastructure**
  - `package.json` — ESM module with Express and dotenv
  - `wrangler.toml` — Cloudflare Workers configuration
  - `vercel.json` — Vercel deployment config
  - `.env.example` — Environment variable template
  - `.gitignore` — Node modules, env, and data exclusions
