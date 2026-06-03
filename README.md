# 🛡️ Anti-Promotion Bot

[![Cloudflare Workers](https://img.shields.io/badge/Deployed_on-Cloudflare_Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AntiPromotionBot)
[![License: MIT](https://img.shields.io/badge/License-MIT-008000.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/Shineii86/AntiPromotionBot?style=for-the-badge&color=blue)](https://github.com/Shineii86/AntiPromotionBot/releases)

---

> **Хмпф. Sᴏ Yᴏᴜ Wᴀɴᴛ A Cʟᴇᴀɴ Gʀᴏᴜᴘ? Fɪɴᴇ. I'ʟʟ Dᴏ Iᴛ Mʏsᴇʟғ.**

Anti-Promotion Bot is a Telegram bot that **automatically removes promotional links and spam** from your groups. Serverless, efficient, and always watching — deployed on Cloudflare Workers & Vercel.

## ✨ Features

- **🚫 Link Detection** — Automatically detects and removes promotional links
- **🔍 Spam Filter** — Identifies 30+ promotional keywords and spam patterns
- **🛡️ Admin Safe** — Respects admin messages while keeping regular members in check
- **⚡ Auto-Cleanup** — Warning messages auto-delete after 5 seconds
- **☁️ Serverless** — Zero-maintenance deployment on Cloudflare Workers & Vercel

## 🎮 Commands

| Command | Description |
|---|---|
| `/start` | Welcome message with inline keyboard |
| `/help` | Command reference and usage guide |
| `/status` | Check if bot is properly configured as admin |

## 🚀 Quick Deploy

### Cloudflare Workers

```bash
git clone https://github.com/Shineii86/AntiPromotionBot.git
cd AntiPromotionBot
npm install
npx wrangler deploy
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AntiPromotionBot)

```bash
vercel --prod
```

## 🔐 Configuration

| Variable | Description | Required |
|---|---|---|
| `BOT_TOKEN` | Telegram Bot API token from @BotFather | ✅ |
| `BOT_USERNAME` | Bot username without @ | ✅ |
| `RESTRICTED_CHATS` | Chat IDs to exclude (comma separated) | ❌ |
| `OWNER_ID` | Telegram user ID for owner-only commands | ❌ |
| `WEBHOOK_SECRET` | Secret token for webhook validation | ❌ |
| `BOT_PHOTO` | Photo URL for bot messages | ❌ |
| `PORT` | Server port for Docker/VPS | ❌ |

## 🏗️ Project Structure

```
AntiPromotionBot/
├── api/
│   ├── index.js              # Express server (Docker/Vercel/Local)
│   ├── worker.js             # Cloudflare Worker entry point
│   ├── botHandler.js         # Core anti-promotion logic
│   ├── botManager.js         # Bot configuration manager
│   ├── store.js              # Persistent state storage
│   ├── antiAPI.js            # Telegram API wrapper
│   ├── constants.js          # Message templates and keyboard layouts
│   ├── landing.js            # Landing page HTML
│   ├── helper.js             # Utility functions and logger
│   ├── ads.js                # Ad library
│   ├── version.js            # Version source of truth
├── .env.example              # Environment variable template
├── .gitignore
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
├── README.md                 # This file
├── package.json
├── wrangler.toml             # Cloudflare Workers config
└── vercel.json               # Vercel config
```

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Copyright © 2026 [Shinei Nouzen](https://github.com/Shineii86) All Rights Reserved**
