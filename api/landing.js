/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — landing.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   Landing page HTML template. Self-contained single-page
 *   with inline CSS, Lucide icons, scroll animations,
 *   particle effects, and cybersecurity-themed design.
 *
 * @exports htmlContent (named)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { VERSION } from './version.js';

// ══════════════════════════════════════════════════════════════
// LANDING PAGE HTML
// ══════════════════════════════════════════════════════════════

export const htmlContent = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Anti-Promotion Bot · Telegram Group Protection</title>

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='1.5'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E">
  <meta name="theme-color" content="#dc2626">

  <meta name="description" content="Anti-Promotion Bot — Telegram bot that automatically removes promotional links and spam from your groups. Deploy on Cloudflare Workers, Vercel, or Docker. Serverless and free.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://antipromotionbot.vercel.app">

  <meta property="og:title" content="Anti-Promotion Bot · Group Protection" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://antipromotionbot.vercel.app" />
  <meta property="og:description" content="Telegram bot that automatically removes promotional links and spam from your groups. Serverless, efficient, and always watching." />
  <meta property="og:site_name" content="Anti-Promotion Bot" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Shineii86" />
  <meta name="twitter:creator" content="@Shineii86" />
  <meta name="twitter:title" content="Anti-Promotion Bot · Group Protection" />
  <meta name="twitter:description" content="Telegram bot that removes promotional links and spam. Serverless, efficient, always watching." />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Anti-Promotion Bot",
    "description": "Telegram bot that automatically removes promotional links and spam from groups. Serverless deployment on Cloudflare Workers and Vercel.",
    "url": "https://antipromotionbot.vercel.app",
    "applicationCategory": "CommunicationApplication",
    "operatingSystem": "Cloudflare Workers, Vercel, Docker",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "author": {
      "@type": "Person",
      "name": "Shinei Nouzen",
      "url": "https://github.com/Shineii86"
    },
    "softwareVersion": "${VERSION}"
  }
  </script>

  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --bg: #0a0a0f;
      --bg-alt: #111118;
      --bg-card: #16161f;
      --surface: #1a1a24;
      --border: #2a2a3a;
      --border-hover: #f87171;
      --text: #f1f1f7;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --primary: #ef4444;
      --primary-light: #f87171;
      --primary-bg: rgba(239,68,68,0.1);
      --accent: #06b6d4;
      --accent-bg: rgba(6,182,212,0.1);
      --success: #10b981;
      --success-bg: rgba(16,185,129,0.1);
      --gradient-main: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #f59e0b 100%);
      --gradient-soft: linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(245,158,11,0.08) 100%);
      --radius: 16px;
      --radius-lg: 24px;
      --radius-sm: 10px;
      --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3);
      --shadow-xl: 0 24px 60px rgba(0,0,0,0.5);
    }

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { color: var(--primary); text-decoration: none; transition: all 0.2s; }
    a:hover { color: var(--primary-light); }
    ::selection { background: rgba(239,68,68,0.2); color: var(--text); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-alt); }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }

    .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    section { padding: 100px 0; }

    .bg-pattern {
      position: fixed; inset: 0; z-index: -2;
      background-image: radial-gradient(circle at 1px 1px, rgba(239,68,68,0.06) 1px, transparent 0);
      background-size: 40px 40px;
    }
    .bg-glow-top {
      position: fixed; top: -300px; right: -200px; z-index: -1;
      width: 700px; height: 700px; border-radius: 50%;
      background: radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .bg-glow-bottom {
      position: fixed; bottom: -400px; left: -200px; z-index: -1;
      width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Navigation - Dynamic Island */
    .island-wrap {
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      z-index: 100; display: flex; justify-content: center;
    }
    .island {
      display: flex; align-items: center; gap: 8px;
      background: rgba(22,22,31,0.92);
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 100px;
      padding: 8px 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
    }
    .island-brand {
      display: flex; align-items: center; gap: 8px;
      flex-shrink: 0; padding: 4px 8px; border-radius: 100px;
      text-decoration: none;
    }
    .island-logo {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--gradient-main);
      font-size: 16px;
    }
    .island-title {
      font-size: 15px; font-weight: 700; color: var(--text);
      letter-spacing: -0.02em; white-space: nowrap;
    }
    .island-divider { width: 1px; height: 24px; background: var(--border); flex-shrink: 0; }
    .island-links { display: flex; align-items: center; gap: 4px; }
    .island-links a {
      padding: 6px 14px; border-radius: 100px;
      font-size: 13px; font-weight: 500; color: var(--text-secondary);
      transition: all 0.2s; white-space: nowrap; text-decoration: none;
    }
    .island-links a:hover { color: var(--primary); background: var(--primary-bg); }
    .island-cta {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 7px 16px; border-radius: 100px;
      background: var(--gradient-main); color: #fff;
      font-size: 12px; font-weight: 600;
      box-shadow: 0 2px 8px rgba(239,68,68,0.3);
      flex-shrink: 0; white-space: nowrap; text-decoration: none;
      transition: all 0.2s;
    }
    .island-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,0.4); color: #fff; }

    @media (max-width: 640px) {
      .island-wrap { top: 10px; }
      .island { padding: 6px 10px; gap: 6px; }
      .island-logo { width: 28px; height: 28px; font-size: 14px; }
      .island-title { font-size: 13px; }
      .island-links a { padding: 5px 10px; font-size: 12px; }
      .island-cta { padding: 6px 12px; font-size: 11px; }
    }

    /* Hero */
    .hero {
      min-height: 100vh; display: flex; align-items: center;
      padding-top: 100px; position: relative; overflow: hidden;
    }
    .hero .container { width: 100%; }
    .hero-content { max-width: 700px; margin: 0 auto; text-align: center; }

    .hero-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px 6px 8px; border-radius: 100px;
      background: var(--primary-bg); border: 1px solid rgba(239,68,68,0.2);
      font-family: var(--mono); font-size: 12px; color: var(--primary-light);
      margin-bottom: 28px;
    }
    .hero-tag-dot {
      width: 8px; height: 8px; border-radius: 50%; background: var(--primary);
      animation: tagPulse 2s infinite;
    }
    @keyframes tagPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .hero-subtitle {
      display: block; font-size: clamp(14px, 1.8vw, 18px);
      font-weight: 600; color: var(--text-muted);
      letter-spacing: 0.08em; margin-bottom: 8px;
      font-family: var(--mono);
    }
    .hero h1 {
      font-size: clamp(36px, 5.5vw, 64px);
      font-weight: 800; line-height: 1.1;
      letter-spacing: -0.03em; margin-bottom: 20px;
    }
    .hero h1 .hl {
      background: var(--gradient-main);
      -webkit-background-clip: text; background-clip: text;
      color: transparent;
    }
    .hero-desc {
      font-size: 16px; color: var(--text-secondary);
      max-width: 560px; line-height: 1.7; margin: 0 auto 36px;
    }

    .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 100px;
      font-size: 15px; font-weight: 600;
      border: none; cursor: pointer;
      transition: all 0.25s; font-family: var(--font);
    }
    .btn-primary {
      background: var(--gradient-main); color: #fff;
      box-shadow: 0 4px 16px rgba(239,68,68,0.25);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(239,68,68,0.35); color: #fff;
    }
    .btn-ghost {
      background: var(--bg-card); color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { border-color: var(--primary); color: var(--primary); }

    /* Terminal Window */
    .terminal-wrap {
      margin-top: 48px; max-width: 600px; margin-left: auto; margin-right: auto;
    }
    .terminal {
      background: #0d0d14; border: 1px solid var(--border);
      border-radius: var(--radius); overflow: hidden;
      box-shadow: var(--shadow-xl); text-align: left;
    }
    .terminal-header {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    .terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
    .terminal-dot.r { background: #ef4444; }
    .terminal-dot.y { background: #eab308; }
    .terminal-dot.g { background: #22c55e; }
    .terminal-title {
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
      margin-left: 10px;
    }
    .terminal-body {
      padding: 20px; font-family: var(--mono); font-size: 13px; line-height: 2.2;
    }
    .terminal-line { display: flex; gap: 10px; }
    .terminal-prompt { color: #22c55e; font-weight: 600; }
    .terminal-cmd { color: var(--text); }
    .terminal-ok { color: #22c55e; }
    .terminal-warn { color: #eab308; }
    .terminal-err { color: #ef4444; }
    .terminal-muted { color: var(--text-muted); }
    .cursor-blink {
      display: inline-block; width: 2px; height: 14px;
      background: #22c55e; vertical-align: middle; margin-left: 2px;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    /* Section helpers */
    .section-label {
      font-family: var(--mono); font-size: 12px; color: var(--primary);
      letter-spacing: 0.12em; text-transform: uppercase;
      display: inline-flex; align-items: center; gap: 8px;
      margin-bottom: 12px; padding: 4px 12px; border-radius: 100px;
      background: var(--primary-bg);
    }
    .section-title {
      font-size: clamp(30px, 4vw, 44px);
      font-weight: 800; color: var(--text);
      letter-spacing: -0.03em; margin-bottom: 12px; line-height: 1.15;
    }
    .section-subtitle {
      font-size: 16px; color: var(--text-secondary); max-width: 560px; line-height: 1.7;
    }

    /* Stats Row */
    .stats-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 20px; margin-bottom: 80px;
    }
    .stat-card {
      text-align: center; padding: 28px 16px;
      border-radius: var(--radius); background: var(--bg-card);
      border: 1px solid var(--border); transition: all 0.3s;
    }
    .stat-card:hover { border-color: var(--primary); box-shadow: var(--shadow-md); }
    .stat-number {
      font-size: 32px; font-weight: 800; color: var(--text);
      font-family: var(--mono);
    }
    .stat-number .hl { background: var(--gradient-main); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; font-weight: 500; }

    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .stat-card { padding: 20px 12px; }
      .stat-number { font-size: 26px; }
    }
    @media (max-width: 400px) {
      .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; }
    }

    /* Features */
    .features-head { text-align: center; margin-bottom: 56px; }
    .features-head .section-subtitle { margin: 0 auto; }

    .feat-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
      gap: 20px;
    }
    .feat-card {
      padding: 32px; border-radius: var(--radius);
      background: var(--bg-card); border: 1px solid var(--border);
      transition: all 0.3s; position: relative; overflow: hidden;
    }
    .feat-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
    .feat-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--gradient-main); opacity: 0; transition: opacity 0.3s;
    }
    .feat-card:hover::after { opacity: 1; }

    .feat-icon {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      background: var(--primary-bg); color: var(--primary);
    }
    .feat-icon.c2 { background: var(--accent-bg); color: var(--accent); }
    .feat-icon.c3 { background: rgba(236,72,153,0.1); color: #ec4899; }
    .feat-icon.c4 { background: var(--success-bg); color: var(--success); }
    .feat-icon.c5 { background: rgba(234,179,8,0.1); color: #eab308; }
    .feat-icon.c6 { background: rgba(168,85,247,0.1); color: #a855f7; }

    .feat-card h3 { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .feat-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
    .feat-tag {
      display: inline-block; margin-top: 16px; padding: 4px 12px;
      border-radius: 100px; font-family: var(--mono); font-size: 11px;
      background: var(--surface); color: var(--text-muted);
    }

    /* Deploy */
    .deploy-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
      gap: 20px; margin-top: 48px;
    }
    .deploy-card {
      padding: 28px; border-radius: var(--radius);
      background: var(--bg-card); border: 1px solid var(--border);
      transition: all 0.3s; display: flex; align-items: flex-start; gap: 16px;
    }
    .deploy-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .deploy-ico {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-bg); color: var(--primary);
    }
    .deploy-card h4 { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .deploy-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .deploy-card code {
      font-family: var(--mono); font-size: 12px; padding: 4px 10px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--primary); margin-top: 10px;
      display: inline-block;
    }

    /* Command table */
    .cmd-section { margin-top: 40px; }
    .cmd-group { margin-bottom: 32px; }
    .cmd-group h4 {
      font-size: 15px; font-weight: 700; color: var(--text);
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    }
    .cmd-table {
      width: 100%; border-collapse: collapse;
      font-size: 13px;
    }
    .cmd-table th {
      text-align: left; padding: 8px 12px;
      font-family: var(--mono); font-size: 11px; text-transform: uppercase;
      color: var(--text-muted); border-bottom: 1px solid var(--border);
    }
    .cmd-table td {
      padding: 8px 12px; border-bottom: 1px solid rgba(42,42,58,0.5);
      color: var(--text-secondary);
    }
    .cmd-table td:first-child {
      font-family: var(--mono); color: var(--primary); font-weight: 600;
    }
    .cmd-table tr:hover td { background: rgba(255,255,255,0.02); }

    /* CTA */
    .cta { text-align: center; padding: 120px 0; }
    .cta-box {
      max-width: 620px; margin: 0 auto; padding: 56px 40px;
      border-radius: var(--radius-lg); position: relative; overflow: hidden;
      background: var(--bg-card); border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
    }
    .cta-box::before {
      content: ''; position: absolute; inset: -1px; border-radius: inherit;
      background: var(--gradient-main); z-index: -1; opacity: 0.06;
    }
    .cta-box h3 {
      font-size: clamp(26px, 3.5vw, 36px);
      font-weight: 800; color: var(--text); margin-bottom: 14px;
    }
    .cta-box p {
      font-size: 16px; color: var(--text-secondary); max-width: 400px;
      margin: 0 auto 32px; line-height: 1.7;
    }
    .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-badges {
      display: flex; gap: 20px; justify-content: center; margin-top: 28px;
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
    }
    .cta-badges span { display: flex; align-items: center; gap: 6px; }

    /* Footer */
    footer {
      padding: 28px 0; border-top: 1px solid var(--border);
      background: var(--surface);
    }
    footer .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    footer span { font-size: 13px; color: var(--text-muted); }
    footer a { color: var(--text-secondary); }
    footer a:hover { color: var(--primary); }
    .ft-right { display: flex; align-items: center; gap: 20px; }
    .ft-ver {
      font-family: var(--mono); font-size: 11px; color: var(--primary);
      padding: 2px 10px; background: var(--primary-bg); border-radius: 100px;
    }
    .ft-heart { color: #ef4444; vertical-align: middle; display: inline-block; width: 14px; height: 14px; }

    /* Back to top */
    .page-top {
      position: fixed; bottom: 32px; right: 32px; z-index: 90;
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(239,68,68,0.3);
      opacity: 0; transform: translateY(20px);
      transition: all 0.3s ease; pointer-events: none;
    }
    .page-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .page-top:hover { background: var(--primary-light); transform: translateY(-3px); }

    /* Reveal animation */
    .reveal {
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal.d1 { transition-delay: 0.08s; }
    .reveal.d2 { transition-delay: 0.16s; }
    .reveal.d3 { transition-delay: 0.24s; }
    .reveal.d4 { transition-delay: 0.32s; }
    .reveal.d5 { transition-delay: 0.40s; }
    .reveal.d6 { transition-delay: 0.48s; }

    /* Responsive */
    @media (max-width: 960px) {
      section { padding: 72px 0; }
      .hero { padding-top: 80px; }
    }
    @media (max-width: 640px) {
      .container { padding: 0 16px; }
      section { padding: 56px 0; }
      .hero { padding-top: 70px; min-height: auto; }
      .hero-desc { font-size: 15px; }
      .hero-btns { flex-direction: column; align-items: stretch; }
      .hero-btns .btn { justify-content: center; }
      .section-title { font-size: clamp(24px, 6vw, 32px); }
      .section-subtitle { font-size: 14px; }
      .feat-grid { grid-template-columns: 1fr; gap: 14px; }
      .feat-card { padding: 24px; }
      .deploy-grid { grid-template-columns: 1fr; gap: 14px; }
      .deploy-card { padding: 20px; flex-direction: column; gap: 12px; }
      .terminal-wrap { margin-top: 32px; }
      .terminal-body { padding: 14px; font-size: 12px; line-height: 2; }
      .cmd-table { font-size: 12px; }
      .cmd-table th, .cmd-table td { padding: 6px 8px; }
      .cta { padding: 56px 0; }
      .cta-box { padding: 32px 20px; }
      .cta-btns { flex-direction: column; align-items: stretch; }
      .cta-btns .btn { justify-content: center; }
      footer .container { flex-direction: column; text-align: center; gap: 10px; }
      .ft-right { justify-content: center; flex-wrap: wrap; }
    }
    @media (max-width: 380px) {
      .container { padding: 0 12px; }
      .hero h1 { font-size: 28px; }
      .hero-desc { font-size: 14px; }
      .feat-card { padding: 20px; }
    }
  </style>
</head>
<body>

  <div class="bg-pattern"></div>
  <div class="bg-glow-top"></div>
  <div class="bg-glow-bottom"></div>
  <canvas id="particles" style="position:fixed;inset:0;z-index:-1;pointer-events:none;"></canvas>

  <!-- Dynamic Island Navigation -->
  <div class="island-wrap">
    <div class="island">
      <a href="/" class="island-brand">
        <div class="island-logo"><i data-lucide="shield"></i></div>
        <span class="island-title">Anti-Promotion</span>
      </a>
      <div class="island-divider"></div>
      <div class="island-links">
        <a href="#features">Features</a>
        <a href="#deploy">Deploy</a>
        <a href="https://github.com/Shineii86/AntiPromotionBot" target="_blank">GitHub</a>
      </div>
      <a href="https://t.me/AntiPromotionBot" target="_blank" class="island-cta"><i data-lucide="zap"></i> Try Bot</a>
    </div>
  </div>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="hero-tag-dot"></span>
          ХМПФ — БОТОВАЯ СЕТЬ АКТИВНА
        </div>
        <h1>
          <span class="hero-subtitle">Anti-Promotion Bot</span>
          <span class="hl">Group Protection</span> Engine
        </h1>
        <p class="hero-desc">
          Хмпф. So you want a clean group? Fine. I'll do it myself.<br>
          Automatically detects and removes promotional links and spam — silently, efficiently, and without mercy.
        </p>
        <div class="hero-btns">
          <a href="#deploy" class="btn btn-primary"><i data-lucide="rocket"></i> Deploy Now</a>
          <a href="https://github.com/Shineii86/AntiPromotionBot" target="_blank" class="btn btn-ghost"><i data-lucide="code-2"></i> Source Code</a>
        </div>

        <div class="terminal-wrap">
          <div class="terminal">
            <div class="terminal-header">
              <span class="terminal-dot r"></span>
              <span class="terminal-dot y"></span>
              <span class="terminal-dot g"></span>
              <span class="terminal-title">monitoring — AntiPromotionBot</span>
            </div>
            <div class="terminal-body">
              <div class="terminal-line"><span class="terminal-prompt">$</span><span class="terminal-cmd"> detectPromotion("Free crypto here!")</span></div>
              <div class="terminal-line"><span class="terminal-err">>> MATCH: keyword[crypto] + URL detected</span></div>
              <div class="terminal-line"><span class="terminal-ok">>> <i data-lucide="ban" style="width:12px;height:12px;display:inline;vertical-align:middle"></i> Message deleted silently</span></div>
              <div class="terminal-line"><span class="terminal-prompt">$</span><span class="terminal-cmd"> detectPromotion("Check out my Telegram channel")</span></div>
              <div class="terminal-line"><span class="terminal-err">>> MATCH: invite_link detected</span></div>
              <div class="terminal-line"><span class="terminal-ok">>> <i data-lucide="ban" style="width:12px;height:12px;display:inline;vertical-align:middle"></i> Message deleted + user warned (tier 1)</span></div>
              <div class="terminal-line"><span class="terminal-prompt">$</span><span class="terminal-cmd"> detectPromotion("legit question about the project")</span></div>
              <div class="terminal-line"><span class="terminal-ok">>> <i data-lucide="check-circle" style="width:12px;height:12px;display:inline;vertical-align:middle"></i> Clean — message allowed</span></div>
              <div class="terminal-line" style="margin-top:8px"><span class="terminal-prompt">$</span><span class="terminal-cursor"> <span class="cursor-blink"></span></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section style="background: var(--bg-alt);">
    <div class="container">
      <div class="stats-row">
        <div class="stat-card reveal d1">
          <div class="stat-number"><span class="hl counter" data-target="12470">0</span></div>
          <div class="stat-label">Messages Scanned</div>
        </div>
        <div class="stat-card reveal d2">
          <div class="stat-number"><span class="hl counter" data-target="892">0</span></div>
          <div class="stat-label">Links Removed</div>
        </div>
        <div class="stat-card reveal d3">
          <div class="stat-number"><span class="hl counter" data-target="156">0</span></div>
          <div class="stat-label">Users Warned</div>
        </div>
        <div class="stat-card reveal d4">
          <div class="stat-number"><span class="hl counter" data-target="47">0</span></div>
          <div class="stat-label">Active Groups</div>
        </div>
      </div>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <div class="features-head reveal">
        <div class="section-label">Возможности</div>
        <h2 class="section-title">Key Features</h2>
        <p class="section-subtitle">A Telegram bot that keeps your groups clean by automatically removing promotional links and spam. Serverless, efficient, and always watching.</p>
      </div>
      <div class="feat-grid">
        <div class="feat-card reveal d1">
          <div class="feat-icon"><i data-lucide="link"></i></div>
          <h3>Link Detection</h3>
          <p>Detects promotional URLs — Telegram invites, crypto sites, social media, shopping links, and more.</p>
          <span class="feat-tag">automated</span>
        </div>
        <div class="feat-card reveal d2">
          <div class="feat-icon c2"><i data-lucide="search"></i></div>
          <h3>Spam Filter</h3>
          <p>30+ built-in promotional keywords + per-group custom keywords. Catches spam before it spreads.</p>
          <span class="feat-tag">30+ keywords</span>
        </div>
        <div class="feat-card reveal d3">
          <div class="feat-icon c3"><i data-lucide="triangle-alert"></i></div>
          <h3>Escalation System</h3>
          <p>Automatic tiered warnings: 1-2 = delete, 3-4 = strong warn, 5+ = auto mute 1 hour. Resets daily.</p>
          <span class="feat-tag">smart</span>
        </div>
        <div class="feat-card reveal d4">
          <div class="feat-icon c4"><i data-lucide="settings"></i></div>
          <h3>Per-Group Config</h3>
          <p>Each group has its own whitelist, blacklist, custom keywords, and pause state. Fully independent.</p>
          <span class="feat-tag">flexible</span>
        </div>
        <div class="feat-card reveal d5">
          <div class="feat-icon c5"><i data-lucide="cloud"></i></div>
          <h3>Serverless</h3>
          <p>Deployed on Cloudflare Workers & Vercel. Zero maintenance, auto-scaling, free tier friendly.</p>
          <span class="feat-tag">zero ops</span>
        </div>
        <div class="feat-card reveal d6">
          <div class="feat-icon c6"><i data-lucide="flag"></i></div>
          <h3>Report System</h3>
          <p>Deleted messages include a report button. Members can flag false positives to your admin log channel.</p>
          <span class="feat-tag">accountable</span>
        </div>
      </div>
    </div>
  </section>

  <section style="background: var(--bg-alt);">
    <div class="container">
      <div class="reveal" style="text-align:center">
        <div class="section-label" style="justify-content:center;">Команды</div>
        <h2 class="section-title">Command Reference</h2>
        <p class="section-subtitle" style="margin:0 auto 32px;">Commands grouped by access level. All commands work in groups only.</p>

        <div class="cmd-section" style="text-align:left;max-width:700px;margin:0 auto;">
          <div class="cmd-group">
            <h4><span style="color:var(--text-muted)"><i data-lucide="user" style="width:16px;height:16px"></i></span> Everyone</h4>
            <table class="cmd-table">
              <tr><th>Command</th><th>Description</th></tr>
              <tr><td>/start</td><td>Welcome message with inline keyboard</td></tr>
              <tr><td>/help</td><td>Full command reference</td></tr>
              <tr><td>/about</td><td>Bot information and links</td></tr>
              <tr><td>/donate</td><td>Support the project</td></tr>
              <tr><td>/status</td><td>Check if bot is admin</td></tr>
              <tr><td>/stats</td><td>Live statistics dashboard</td></tr>
            </table>
          </div>

          <div class="cmd-group">
            <h4><span style="color:var(--text-muted)"><i data-lucide="crown" style="width:16px;height:16px"></i></span> Group Admins</h4>
            <table class="cmd-table">
              <tr><th>Command</th><th>Description</th></tr>
              <tr><td>/pause</td><td>Pause monitoring in this chat</td></tr>
              <tr><td>/resume</td><td>Resume monitoring</td></tr>
              <tr><td>/settings</td><td>View per-group configuration</td></tr>
              <tr><td>/whitelist</td><td>Add trusted domain</td></tr>
              <tr><td>/blacklist</td><td>Block specific domain</td></tr>
              <tr><td>/keywords</td><td>Add custom keyword</td></tr>
              <tr><td>/warn (reply)</td><td>Manually warn a user</td></tr>
              <tr><td>/mute (reply)</td><td>Mute user for 1 hour</td></tr>
            </table>
          </div>

          <div class="cmd-group">
            <h4><span style="color:var(--text-muted)"><i data-lucide="lock" style="width:16px;height:16px"></i></span> Owner Only</h4>
            <table class="cmd-table">
              <tr><th>Command</th><th>Description</th></tr>
              <tr><td>/broadcast</td><td>Send message to all groups</td></tr>
              <tr><td>/chats</td><td>List all active chats</td></tr>
              <tr><td>/log</td><td>View deletion records</td></tr>
              <tr><td>/leave</td><td>Remove bot from group</td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="deploy">
    <div class="container">
      <div class="reveal" style="text-align:center">
        <div class="section-label" style="justify-content:center;">Установка</div>
        <h2 class="section-title">Deploy Anywhere</h2>
        <p class="section-subtitle" style="margin:0 auto;">One codebase, every platform. Pick your hosting and ship in seconds.</p>
      </div>
      <div class="deploy-grid">
        <div class="deploy-card reveal d1">
          <div class="deploy-ico"><i data-lucide="cloud"></i></div>
          <div>
            <h4>Cloudflare Workers</h4>
            <p>Recommended. Zero cold starts, 300+ edge locations. Free tier available.</p>
            <code>npx wrangler deploy</code>
          </div>
        </div>
        <div class="deploy-card reveal d2">
          <div class="deploy-ico"><i data-lucide="triangle"></i></div>
          <div>
            <h4>Vercel</h4>
            <p>Serverless functions with automatic HTTPS. Git-push deploys.</p>
            <code>vercel --prod</code>
          </div>
        </div>
        <div class="deploy-card reveal d3">
          <div class="deploy-ico"><i data-lucide="container"></i></div>
          <div>
            <h4>Docker</h4>
            <p>Self-hosted on any VPS. Full control, persistent storage.</p>
            <code>docker-compose up -d</code>
          </div>
        </div>
        <div class="deploy-card reveal d4">
          <div class="deploy-ico"><i data-lucide="train-front"></i></div>
          <div>
            <h4>Railway / Render</h4>
            <p>One-click deploy with automatic scaling and managed infrastructure.</p>
            <code>git push railway main</code>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <div class="cta-box reveal">
        <div class="section-label" style="justify-content:center;margin-bottom:16px;">Начать</div>
        <h3>Ready to clean up your group?</h3>
        <p>Deploy your own anti-promotion bot in minutes. Хмпф. Not that I care about your group or anything.</p>
        <div class="cta-btns">
          <a href="https://github.com/Shineii86/AntiPromotionBot" target="_blank" class="btn btn-primary"><i data-lucide="code-2"></i> Deploy on GitHub</a>
          <a href="https://github.com/Shineii86/AntiPromotionBot" target="_blank" class="btn btn-ghost"><i data-lucide="star"></i> Star on GitHub</a>
        </div>
        <div class="cta-badges">
          <span><i data-lucide="zap"></i> fast</span>
          <span><i data-lucide="lock"></i> secure</span>
          <span><i data-lucide="globe-2"></i> serverless</span>
          <span><i data-lucide="shield"></i> free</span>
        </div>
      </div>
    </div>
  </section>

  <button class="page-top" id="pageTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <i data-lucide="chevron-up"></i>
  </button>

  <footer>
    <div class="container">
      <span>© <span id="year"></span> Anti-Promotion Bot · Хмпф</span>
      <div class="ft-right">
        <span>Built with <i data-lucide="heart" class="ft-heart"></i> by <a href="https://github.com/Shineii86">Shinei Nouzen</a></span>
        <span class="ft-ver">v${VERSION}</span>
      </div>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    document.getElementById('year').textContent = new Date().getFullYear();

    (function() {
      var btn = document.getElementById('pageTop');
      window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
      });
    })();

    (function() {
      var reveals = document.querySelectorAll('.reveal');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function(el) { observer.observe(el); });
    })();

    (function() {
      var canvas = document.getElementById('particles');
      var ctx = canvas.getContext('2d');
      var dots = [];
      var colors = ['rgba(239,68,68,', 'rgba(249,115,22,', 'rgba(245,158,11,', 'rgba(6,182,212,'];
      var running = true;

      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      window.addEventListener('resize', resize);

      function spawnDot() {
        dots.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0, phase: 'in', life: 0,
          maxLife: 300 + Math.random() * 200
        });
      }

      function animate() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = dots.length - 1; i >= 0; i--) {
          var d = dots[i]; d.life++;
          if (d.phase === 'in') { d.opacity += 0.015; if (d.opacity >= 0.3) { d.opacity = 0.3; d.phase = 'hold'; } }
          else if (d.phase === 'hold') { if (d.life > d.maxLife * 0.6) d.phase = 'out'; }
          else { d.opacity -= 0.012; if (d.opacity <= 0) { dots.splice(i, 1); continue; } }
          ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = d.color + d.opacity + ')'; ctx.fill();
        }
        if (Math.random() < 0.02) spawnDot();
        requestAnimationFrame(animate);
      }

      spawnDot(); spawnDot(); spawnDot(); spawnDot(); spawnDot();
      animate();
    })();

    (function() {
      var counters = document.querySelectorAll('.counter');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var increment = Math.ceil(target / 60);
            var timer = setInterval(function() {
              current += increment;
              if (current >= target) { current = target; clearInterval(timer); }
              el.textContent = current.toLocaleString();
            }, 25);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function(el) { observer.observe(el); });
    })();

    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  </script>
</body>
</html>`;

// ══════════════════════════════════════════════════════════════ END: landing.js
