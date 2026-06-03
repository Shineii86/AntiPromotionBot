/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — landing.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Landing page HTML content for webhook root URL.
 *   Provides a clean, visually appealing status page
 *   when visiting the bot's base URL in a browser.
 *
 * @exports htmlContent
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// LANDING PAGE HTML
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Landing Page ----

export const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anti-Promotion Bot — Group Protection</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    color: #e0e0e0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .container {
    max-width: 800px;
    text-align: center;
  }
  h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
  h1 span { color: #ff6b6b; }
  .badge {
    display: inline-block;
    background: #ff6b6b;
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
  p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; color: #b0b0b0; }
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .feature {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.25rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .feature h3 { margin-bottom: 0.5rem; color: #ff6b6b; }
  .feature p { font-size: 0.9rem; margin-bottom: 0; }
  .btn {
    display: inline-block;
    background: #ff6b6b;
    color: #fff;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
  }
  .btn:hover { background: #e05555; transform: translateY(-2px); }
  .footer { margin-top: 2rem; font-size: 0.85rem; color: #666; }
  .footer a { color: #ff6b6b; text-decoration: none; }
</style>
</head>
<body>
<div class="container">
  <div class="badge">v1.1.0-beta</div>
  <h1>🛡️ <span>Anti-Promotion</span> Bot</h1>
  <p>A Telegram bot that keeps your groups clean by automatically removing promotional links and spam. Serverless, efficient, and always watching.</p>
  <div class="features">
    <div class="feature">
      <h3>🚫 Link Detection</h3>
      <p>Automatically detects and removes promotional links from non-admin members.</p>
    </div>
    <div class="feature">
      <h3>🔍 Spam Filter</h3>
      <p>Identifies promotional keywords and spam content before it spreads.</p>
    </div>
    <div class="feature">
      <h3>🛡️ Admin Safe</h3>
      <p>Respects admin messages while keeping regular members in check.</p>
    </div>
    <div class="feature">
      <h3>⚡ Serverless</h3>
      <p>Deployed on Cloudflare Workers & Vercel for zero-maintenance operation.</p>
    </div>
  </div>
  <a class="btn" href="https://t.me/AntiPromotionBot" target="_blank">🤖 Try Bot</a>
  <div class="footer">
    <p>© 2026 <a href="https://github.com/Shineii86">Shinei Nouzen</a> — MIT License</p>
  </div>
</div>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════ END: landing.js
