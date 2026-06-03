/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — version.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Single source of truth for the bot version.
 *   Reads from package.json in Node.js; uses fallback in
 *   Cloudflare Workers and other non-Node.js runtimes.
 *
 * @exports VERSION
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// VERSION — single source of truth
// ══════════════════════════════════════════════════════════════

let VERSION = '1.1.0-beta';

// ---- FEATURE: package.json version reader ----
// NOTE: Errors are silently caught — Workers and other
// non-Node.js runtimes will use the fallback above.

try {
    if (import.meta.url) {
        const { createRequire } = await import('node:module');
        const require = createRequire(import.meta.url);
        const pkg = require('../package.json');
        VERSION = pkg.version;
    }
} catch {
}

export { VERSION };

// ══════════════════════════════════════════════════════════════ END: version.js
