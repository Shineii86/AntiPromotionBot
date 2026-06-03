/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — constants.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   All user-facing message templates and inline keyboard layouts.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { VERSION } from './version.js';

export const startMessage = `🛡️ <b>Aɴᴛɪ-Pʀᴏᴍᴏᴛɪᴏɴ Bᴏᴛ</b>

Хмпф. Sᴏ Yᴏᴜ'ᴠᴇ Sᴜᴍᴍᴏɴᴇᴅ Mᴇ. I Sᴜᴘᴘᴏsᴇ Yᴏᴜ Wᴀɴᴛ A Cʟᴇᴀɴ, Sᴘᴀᴍ-Fʀᴇᴇ Gʀᴏᴜᴘ? Дa, I Tʜᴏᴜɢʜᴛ Sᴏ.

I Aᴍ Tʜᴇ Gᴜᴀʀᴅɪᴀɴ Oғ Yᴏᴜʀ Cʜᴀᴛ — Aʟᴡᴀʏs Wᴀᴛᴄʜɪɴɢ, Aʟᴡᴀʏs Rᴇᴍᴏᴠɪɴɢ.

<b>🛡️ Wʜᴀᴛ I Dᴏ:</b>
• Rᴇᴍᴏᴠᴇs ᴘʀᴏᴍᴏᴛɪᴏɴᴀʟ ʟɪɴᴋs ғʀᴏᴍ ʀᴇɢᴜʟᴀʀ ᴍᴇᴍʙᴇʀs
• Dᴇᴛᴇᴄᴛs ᴀɴᴅ ʀᴇᴍᴏᴠᴇs sᴘᴀᴍ ᴄᴏɴᴛᴇɴᴛ
• Tʀᴀᴄᴋs ʀᴇᴘᴇᴀᴛ ᴏғғᴇɴᴅᴇʀs ᴡɪᴛʜ ᴇsᴄᴀʟᴀᴛɪɴɢ ᴡᴀʀɴɪɴɢs
• Rᴇsᴘᴇᴄᴛs ᴀᴅᴍɪɴ ᴍᴇssᴀɢᴇs
• Kᴇᴇᴘs ʏᴏᴜʀ ɢʀᴏᴜᴘ ᴄʟᴇᴀɴ ᴀɴᴅ ᴛɪᴅʏ

Usᴇ Tʜᴇ Bᴜᴛᴛᴏɴs Bᴇʟᴏᴡ. Aɴᴅ Kɴᴏᴡ Tʜᴀᴛ I'ᴍ Aʟᴡᴀʏs Wᴀᴛᴄʜɪɴɢ.`

export const helpMessage = `📚 <b>Cᴏᴍᴍᴀɴᴅs — Pᴀʏ Aᴛᴛᴇɴᴛɪᴏɴ</b>

🔹 <code>/start</code> — Wʜᴇʀᴇ Yᴏᴜ Mᴇᴛ Mᴇ.
🔹 <code>/help</code> — Tʜɪs Mᴇssᴀɢᴇ.
🔹 <code>/about</code> — Lᴇᴀʀɴ Aʙᴏᴜᴛ Mᴇ.
🔹 <code>/donate</code> — Sᴜᴘᴘᴏʀᴛ Mʏ Dᴇᴠᴇʟᴏᴘᴇʀ.
🔹 <code>/status</code> — Cʜᴇᴄᴋ Mʏ Cᴏɴғɪɢᴜʀᴀᴛɪᴏɴ.
🔹 <code>/stats</code> — Lɪᴠᴇ Sᴛᴀᴛɪsᴛɪᴄs.

────────────────

👑 <b>Gʀᴏᴜᴘ Aᴅᴍɪɴs Oɴʟʏ:</b>
🔹 <code>/pause</code> — Pᴀᴜsᴇ ᴍᴏɴɪᴛᴏʀɪɴɢ ɪɴ ᴛʜɪs ᴄʜᴀᴛ.
🔹 <code>/resume</code> — Rᴇsᴜᴍᴇ ᴍᴏɴɪᴛᴏʀɪɴɢ.
🔹 <code>/settings</code> — Vɪᴇᴡ ᴘᴇʀ-ɢʀᴏᴜᴘ ᴄᴏɴғɪɢᴜʀᴀᴛɪᴏɴ.
🔹 <code>/whitelist</code> +<code>domain</code> — Aᴅᴅ ᴛʀᴜsᴛᴇᴅ ᴅᴏᴍᴀɪɴ.
🔹 <code>/blacklist</code> +<code>domain</code> — Bʟᴏᴄᴋ sᴘᴇᴄɪғɪᴄ ᴅᴏᴍᴀɪɴ.
🔹 <code>/keywords</code> +<code>word</code> — Aᴅᴅ ᴄᴜsᴛᴏᴍ ᴋᴇʏᴡᴏʀᴅ.
🔹 <code>/warn</code> @<code>user</code> — Wᴀʀɴ ᴀ ᴜsᴇʀ ᴍᴀɴᴜᴀʟʟʏ.
🔹 <code>/mute</code> @<code>user</code> — Mᴜᴛᴇ ᴀ sᴘᴀᴍᴍᴇʀ.

────────────────

🔒 <b>Oᴡɴᴇʀ Oɴʟʏ:</b>
🔹 <code>/broadcast</code> — Sᴇɴᴅ ᴛᴏ ᴀʟʟ ᴄʜᴀᴛs.
🔹 <code>/chats</code> — Lɪsᴛ ᴀʟʟ ᴀᴄᴛɪᴠᴇ ᴄʜᴀᴛs.
🔹 <code>/log</code> — Vɪᴇᴡ ʀᴇᴄᴇɴᴛ ᴅᴇʟᴇᴛɪᴏɴs.

────────────────

<b>🛡️ Hᴏᴡ I Wᴏʀᴋ:</b>
1. Aᴅᴅ Mᴇ Tᴏ Yᴏᴜʀ Gʀᴏᴜᴘ.
2. Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs.
3. I Aᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ Rᴇᴍᴏᴠᴇ Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Cᴏɴᴛᴇɴᴛ.
4. Rᴇᴘᴇᴀᴛ Oғғᴇɴᴅᴇʀs Gᴇᴛ Esᴄᴀʟᴀᴛɪɴɢ Wᴀʀɴɪɴɢs.
5. Aᴅᴍɪɴs Aʀᴇ Exᴇᴍᴘᴛᴇᴅ.

💡 <b>Bᴇᴛᴀ Nᴏᴛᴇ:</b>
Tʜɪs Bᴏᴛ Is Iɴ Bᴇᴛᴀ. Yᴏᴜ Mᴀʏ Fɪɴᴅ Bᴜɢs Oʀ Eʀʀᴏʀs. Rᴇᴘᴏʀᴛ Tʜᴇᴍ Tᴏ @Shineii86.`

export const notAdminMessage = `⚠️ Хмпф. I Mᴜsᴛ Bᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs Tᴏ Fᴜɴᴄᴛɪᴏɴ Pʀᴏᴘᴇʀʟʏ. Dᴏɴ'ᴛ Wᴀsᴛᴇ Mʏ Tɪᴍᴇ.`

export const linkDeletedMessage = (username) =>
    `🚫 @${username}, Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Cᴏɴᴛᴇɴᴛ Is Nᴏᴛ Aʟʟᴏᴡᴇᴅ Hᴇʀᴇ. I'ᴠᴇ Rᴇᴍᴏᴠᴇᴅ Iᴛ.`

export const promotionDeletedMessage = (username) =>
    `🚫 @${username}, Sᴘᴀᴍ Is Sᴛʀɪᴄᴛʟʏ Pʀᴏʜɪʙɪᴛᴇᴅ. Dᴏɴ'ᴛ Tᴇsᴛ Mᴇ.`

export const repeatOffenderMessage = (username, count) =>
    `⚠️ @${username}, Tʜɪs Is Wᴀʀɴɪɴɢ Nᴜᴍʙᴇʀ <b>${count}</b>. Nᴇxᴛ Tɪᴍᴇ Yᴏᴜ'ʟʟ Bᴇ Mᴜᴛᴇᴅ.`

export const botAddedMessage = `🎉 Tʜᴀɴᴋ Yᴏᴜ Fᴏʀ Aᴅᴅɪɴɢ Mᴇ. I'ʟʟ Kᴇᴇᴘ Tʜɪs Pʟᴀᴄᴇ Cʟᴇᴀɴ Fʀᴏᴍ Sᴘᴀᴍ Aɴᴅ Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Lɪɴᴋs.

Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Sᴏ I Cᴀɴ Dᴏ Mʏ Jᴏʙ.

⚠️ <b>Bᴇᴛᴀ Vᴇʀsɪᴏɴ:</b> Yᴏᴜ Mᴀʏ Eɴᴄᴏᴜɴᴛᴇʀ Bᴜɢs. Rᴇᴘᴏʀᴛ Tʜᴇᴍ Tᴏ @Shineii86.`

export const botAlreadyPresentMessage = `Хмпф. I'ᴍ Aʟʀᴇᴀᴅʏ Hᴇʀᴇ. Dᴏɴ'ᴛ Yᴏᴜ Rᴇᴍᴇᴍʙᴇʀ?`

export const onlyOwnerMessage = `👑 Tʜɪs Cᴏᴍᴍᴀɴᴅ Is Fᴏʀ Tʜᴇ Oᴡɴᴇʀ. Oɴʟʏ. Yᴏᴜ Tʜɪɴᴋ Yᴏᴜ Cᴀɴ Jᴜsᴛ—? Дурак.`

export const onlyAdminMessage = `🔒 Aᴅᴍɪɴ Pᴇʀᴍɪssɪᴏɴs Rᴇǫᴜɪʀᴇᴅ. Dᴏɴ'ᴛ Eᴠᴇɴ Tʀʏ Wɪᴛʜᴏᴜᴛ Tʜᴇᴍ.`

export const groupOnlyMessage = `🏘️ Tʜɪs Cᴏᴍᴍᴀɴᴅ Oɴʟʏ Wᴏʀᴋs Iɴ Gʀᴏᴜᴘs.`

export const statusOkMessage = `✅ <b>Sᴛᴀᴛᴜs: Aʟʟ Gᴏᴏᴅ</b>

I'ᴍ Pʀᴏᴘᴇʀʟʏ Cᴏɴғɪɢᴜʀᴇᴅ As Aɴ Aᴅᴍɪɴ Iɴ Tʜɪs Gʀᴏᴜᴘ. Nᴏᴛʜɪɴɢ Gᴇᴛs Pᴀsᴛ Mᴇ.`

export const statusNotAdminMessage = `❌ <b>Sᴛᴀᴛᴜs: Nᴏᴛ Cᴏɴғɪɢᴜʀᴇᴅ</b>

I'ᴍ Nᴏᴛ Aɴ Aᴅᴍɪɴ Iɴ Tʜɪs Gʀᴏᴜᴘ. Pʟᴇᴀsᴇ Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs.`

export const statusPrivateMessage = `ℹ️ Pʟᴇᴀsᴇ Usᴇ <code>/status</code> Iɴ A Gʀᴏᴜᴘ Tᴏ Cʜᴇᴄᴋ Iғ I'ᴍ Wᴏʀᴋɪɴɢ Tʜᴇʀᴇ.`

export const pausedMessage = `⏸️ <b>Mᴏɴɪᴛᴏʀɪɴɢ Pᴀᴜsᴇᴅ</b>

I Wᴏɴ'ᴛ Rᴇᴍᴏᴠᴇ Aɴʏ Cᴏɴᴛᴇɴᴛ Uɴᴛɪʟ Yᴏᴜ Usᴇ <code>/resume</code>. Dᴏɴ'ᴛ Gᴇᴛ Tᴏᴏ Cᴏᴍғᴏʀᴛᴀʙʟᴇ.`

export const resumedMessage = `▶️ <b>Mᴏɴɪᴛᴏʀɪɴɢ Rᴇsᴜᴍᴇᴅ</b>

I'ᴍ Bᴀᴄᴋ. Tɪᴍᴇ Tᴏ Kᴇᴇᴘ Tʜɪɴɢs Cʟᴇᴀɴ Aɢᴀɪɴ.`

export const notPausedMessage = `ℹ️ Mᴏɴɪᴛᴏʀɪɴɢ Isɴ'ᴛ Pᴀᴜsᴇᴅ Hᴇʀᴇ. Wᴇʀᴇ Yᴏᴜ Tʀʏɪɴɢ Tᴏ Gᴇᴛ Mʏ Aᴛᴛᴇɴᴛɪᴏɴ?`

export const broadcastStarted = `📡 Bʀᴏᴀᴅᴄᴀsᴛɪɴɢ… Lɪsᴛᴇɴ Uᴘ, Eᴠᴇʀʏᴏɴᴇ.`

export const broadcastDone = (success, failed) =>
    `✅ <b>Bʀᴏᴀᴅᴄᴀsᴛ Cᴏᴍᴘʟᴇᴛᴇ!</b>\n\n📨 Sᴇɴᴛ: ${success}\n❌ Fᴀɪʟᴇᴅ: ${failed}\n\nХмпф. Tʜᴇʏ'ᴠᴇ Bᴇᴇɴ Nᴏᴛɪғɪᴇᴅ.`

export const logEmptyMessage = `📋 Nᴏ Dᴇʟᴇᴛɪᴏɴs Lᴏɢɢᴇᴅ Yᴇᴛ. Eɪᴛʜᴇʀ I'ᴍ Nᴏᴛ Wᴏʀᴋɪɴɢ Oʀ Yᴏᴜʀ Gʀᴏᴜᴘ Is Rᴇᴍᴀʀᴋᴀʙʟʏ Cʟᴇᴀɴ.`

export const mutedMessage = (username) =>
    `🤐 @${username} Hᴀs Bᴇᴇɴ Mᴜᴛᴇᴅ. Tʜᴇʏ Wᴏɴ'ᴛ Bᴇ Aʙʟᴇ Tᴏ Sᴇɴᴅ Mᴇssᴀɢᴇs Fᴏʀ 1 Hᴏᴜʀ.`

export const warnedMessage = (username, count) =>
    `⚠️ @${username} Hᴀs Bᴇᴇɴ Wᴀʀɴᴇᴅ (${count}).`

export const whitelistUpdatedMessage = `✅ Wʜɪᴛᴇʟɪsᴛ Uᴘᴅᴀᴛᴇᴅ.`

export const blacklistUpdatedMessage = `✅ Bʟᴀᴄᴋʟɪsᴛ Uᴘᴅᴀᴛᴇᴅ.`

export const keywordsUpdatedMessage = `✅ Kᴇʏᴡᴏʀᴅs Uᴘᴅᴀᴛᴇᴅ.`

export const betaNotice = `⚠️ <b>Bᴇᴛᴀ Vᴇʀsɪᴏɴ</b>
Tʜɪs Bᴏᴛ Is Iɴ Bᴇᴛᴀ. Yᴏᴜ Mᴀʏ Fɪɴᴅ Bᴜɢs, Eʀʀᴏʀs, Oʀ Uɴᴇxᴘᴇᴄᴛᴇᴅ Bᴇʜᴀᴠɪᴏʀ. Pʟᴇᴀsᴇ Rᴇᴘᴏʀᴛ Tʜᴇᴍ Tᴏ @Shineii86 Sᴏ Tʜᴇʏ Cᴀɴ Bᴇ Fɪxᴇᴅ.

Sᴜɢɢᴇsᴛɪᴏɴs Aɴᴅ Fᴇᴇᴅʙᴀᴄᴋ Aʀᴇ Aʟᴡᴀʏs Wᴇʟᴄᴏᴍᴇ.`

export const aboutMessage = `🛡️ <b>Aʙᴏᴜᴛ Aɴᴛɪ-Pʀᴏᴍᴏᴛɪᴏɴ Bᴏᴛ</b>

Cʀᴀғᴛᴇᴅ Bʏ <b><a href='https://t.me/Shineii86'>Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a></b> Usɪɴɢ <b>Nᴏᴅᴇ.js</b> & <b>Express</b> — Dᴇᴘʟᴏʏᴇᴅ Oɴ <b>Cʟᴏᴜᴅғʟᴀʀᴇ Wᴏʀᴋᴇʀs</b>, <b>Vᴇʀᴄᴇʟ</b> & <b>Dᴏᴄᴋᴇʀ</b>.

Tʜᴇ Gᴜᴀʀᴅɪᴀɴ Oғ Yᴏᴜʀ Cʜᴀᴛs — Aʟᴡᴀʏs Wᴀᴛᴄʜɪɴɢ, Aʟᴡᴀʏs Rᴇᴍᴏᴠɪɴɢ. Nᴏ Sᴘᴀᴍ Gᴇᴛs Pᴀsᴛ Mᴇ.

<b>» 🚀 Vᴇʀsɪᴏɴ:</b> v${VERSION}
<b>» 📡 Nᴇᴛᴡᴏʀᴋ:</b> <a href='https://t.me/QuinxNetwork'>Quinx Nᴇᴛᴡᴏʀᴋ</a>
<b>» 🔔 Mᴀɪɴ Cʜᴀɴɴᴇʟ:</b> <a href='https://t.me/MaximXBots'>Mᴀxɪᴍ X Bᴏᴛs</a>
<b>» 💬 Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ:</b> <a href='https://t.me/MaximXGroup'>Mᴀxɪᴍ X Gʀᴏᴜᴘ</a>

<b>🛡️ Fᴇᴀᴛᴜʀᴇs:</b>
• Lɪɴᴋ Dᴇᴛᴇᴄᴛɪᴏɴ — Aᴜᴛᴏ-ʀᴇᴍᴏᴠᴇs ᴘʀᴏᴍᴏᴛɪᴏɴᴀʟ ʟɪɴᴋs
• Sᴘᴀᴍ Fɪʟᴛᴇʀ — 30+ ᴘʀᴏᴍᴏᴛɪᴏɴᴀʟ ᴋᴇʏᴡᴏʀᴅs
• Wʜɪᴛᴇʟɪsᴛ/Bʟᴀᴄᴋʟɪsᴛ — Pᴇʀ-ɢʀᴏᴜᴘ ᴅᴏᴍᴀɪɴ ᴄᴏɴᴛʀᴏʟ
• Esᴄᴀʟᴀᴛɪɴɢ Wᴀʀɴɪɴɢs — 3 sᴛʀɪᴋᴇs → ᴡᴀʀɴ, 5 → ᴍᴜᴛᴇ
• Lᴏɢ Cʜᴀɴɴᴇʟ — Fᴏʀᴡᴀʀᴅs ᴅᴇʟᴇᴛɪᴏɴs ᴛᴏ ᴀᴅᴍɪɴ ᴄʜᴀɴɴᴇʟ
• Sᴛᴀᴛs & Lᴏɢs — Fᴜʟʟ ᴍᴏɴɪᴛᴏʀɪɴɢ ᴅᴀsʜʙᴏᴀʀᴅ

<b>Bᴏᴛ Cʀᴇᴅɪᴛs:</b>
<b>» 💀 Dᴇᴠᴇʟᴏᴘᴇʀ:</b> <a href='https://t.me/Shineii86'>Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a>`

export const donateMessage = `🎁 <b>Sᴜᴘᴘᴏʀᴛ Tʜᴇ Pʀᴏᴊᴇᴄᴛ</b>

Lᴏᴏᴋ… Iғ Yᴏᴜ Aᴘᴘʀᴇᴄɪᴀᴛᴇ Mʏ Sᴇʀᴠɪᴄᴇs, A Sᴍᴀʟʟ Cᴏɴᴛʀɪʙᴜᴛɪᴏɴ Kᴇᴇᴘs Mᴇ Rᴜɴɴɪɴɢ. Nᴏᴛ Tʜᴀᴛ I Nᴇᴇᴅ Iᴛ, Bᴜᴛ…

<b>How To Donate:</b>

📱 <b>Tᴏɴ Pᴀʏᴍᴇɴᴛ Vɪᴀ Tᴏɴᴋᴇᴇᴘᴇʀ</b>
<code>UQBmK_-2A-gHnhx0hmWdFeQc8X7iZ0O_UkxQbQGU2uA6OwmX</code>
<i>(Aᴄᴄᴇᴘᴛs Bᴏᴛʜ Tᴏɴ Aɴᴅ Usᴅᴛ)</i>

💜 <b>Tᴇʟᴇɢʀᴀᴍ Sᴛᴀʀs</b>
Sᴇɴᴅ Dɪʀᴇᴄᴛʟʏ Tᴏ <a href="https://t.me/Shineii86">Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a>

Eᴠᴇɴ A Sᴍᴀʟʟ Gᴇsᴛᴜʀᴇ Mᴇᴀɴs Mᴏʀᴇ Tʜᴀɴ Yᴏᴜ Tʜɪɴᴋ. Спасибо. 🙏`

export const versionInfo = `🚀 <b>Vᴇʀsɪᴏɴ:</b> v${VERSION}`
