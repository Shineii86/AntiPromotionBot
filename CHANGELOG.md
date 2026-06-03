# Changelog

All notable changes to Anti-Promotion Bot are documented here.

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

- **Modular Architecture** (following Alisa Reaction Bot code style)
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
