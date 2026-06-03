/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Anti-Promotion Bot — constants.js
 * Repository: https://github.com/Shineii86/AntiPromotionBot
 *
 * @description
 *   All user-facing message templates and inline keyboard layouts.
 *   Every string the bot sends to Telegram lives here.
 *
 * @exports
 *   startMessage, helpMessage, statusMessage, notAdminMessage,
 *   linkDeletedMessage, promotionDeletedMessage, botAddedMessage,
 *   onlyOwnerMessage, onlyAdminMessage, groupOnlyMessage
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
• Rᴇsᴘᴇᴄᴛs ᴀᴅᴍɪɴ ᴍᴇssᴀɢᴇs
• Kᴇᴇᴘs ʏᴏᴜʀ ɢʀᴏᴜᴘ ᴄʟᴇᴀɴ ᴀɴᴅ ᴛɪᴅʏ

Usᴇ Tʜᴇ Bᴜᴛᴛᴏɴs Bᴇʟᴏᴡ. Aɴᴅ Kɴᴏᴡ Tʜᴀᴛ I'ᴍ Aʟᴡᴀʏs Wᴀᴛᴄʜɪɴɢ.`

export const helpMessage = `📚 <b>Cᴏᴍᴍᴀɴᴅs — Pᴀʏ Aᴛᴛᴇɴᴛɪᴏɴ</b>

Dᴏɴ'ᴛ Mᴀᴋᴇ Mᴇ Exᴘʟᴀɪɴ Tᴡɪᴄᴇ.

🔹 <code>/start</code> — Wʜᴇʀᴇ Yᴏᴜ Mᴇᴛ Mᴇ.
🔹 <code>/help</code> — Tʜɪs Vᴇʀʏ Mᴇssᴀɢᴇ.
🔹 <code>/status</code> — Cʜᴇᴄᴋ Iғ I'ᴍ Pʀᴏᴘᴇʀʟʏ Cᴏɴғɪɢᴜʀᴇᴅ.

────────────────

<b>🛡️ Hᴏᴡ I Wᴏʀᴋ:</b>
1. Aᴅᴅ Mᴇ Tᴏ Yᴏᴜʀ Gʀᴏᴜᴘ.
2. Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs.
3. I Aᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ Rᴇᴍᴏᴠᴇ Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Cᴏɴᴛᴇɴᴛs.
4. Aᴅᴍɪɴs Aʀᴇ Exᴇᴍᴘᴛᴇᴅ. Nᴏ Sᴘᴀᴍ Fᴏʀ Tʜᴇᴍ.

💡 <b>Tɪᴘ:</b>
• Mᴀᴋᴇ Sᴜʀᴇ I'ᴍ Aɴ Aᴅᴍɪɴ Fᴏʀ Mᴇ Tᴏ Wᴏʀᴋ.`

export const notAdminMessage = `⚠️ Хмпф. I Mᴜsᴛ Bᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs Tᴏ Fᴜɴᴄᴛɪᴏɴ Pʀᴏᴘᴇʀʟʏ. Dᴏɴ'ᴛ Wᴀsᴛᴇ Mʏ Tɪᴍᴇ.`

export const linkDeletedMessage = (username) =>
    `🚫 @${username}, Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Cᴏɴᴛᴇɴᴛ Is Nᴏᴛ Aʟʟᴏᴡᴇᴅ Hᴇʀᴇ. I'ᴠᴇ Rᴇᴍᴏᴠᴇᴅ Iᴛ.`

export const promotionDeletedMessage = (username) =>
    `🚫 @${username}, Sᴘᴀᴍ Aɴᴅ Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Cᴏɴᴛᴇɴᴛ Aʀᴇ Sᴛʀɪᴄᴛʟʏ Pʀᴏʜɪʙɪᴛᴇᴅ. Dᴏɴ'ᴛ Tᴇsᴛ Mᴇ.`

export const botAddedMessage = `🎉 Tʜᴀɴᴋ Yᴏᴜ Fᴏʀ Aᴅᴅɪɴɢ Mᴇ. I'ʟʟ Kᴇᴇᴘ Tʜɪs Pʟᴀᴄᴇ Cʟᴇᴀɴ Fʀᴏᴍ Sᴘᴀᴍ Aɴᴅ Pʀᴏᴍᴏᴛɪᴏɴᴀʟ Lɪɴᴋs.

Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Sᴏ I Cᴀɴ Dᴏ Mʏ Jᴏʙ.`

export const botAlreadyPresentMessage = `Хмпф. I'ᴍ Aʟʀᴇᴀᴅʏ Hᴇʀᴇ. Dᴏɴ'ᴛ Yᴏᴜ Rᴇᴍᴇᴍʙᴇʀ?`

export const onlyOwnerMessage = `👑 Tʜɪs Cᴏᴍᴍᴀɴᴅ Is Fᴏʀ Tʜᴇ Oᴡɴᴇʀ. Yᴏᴜ Tʜɪɴᴋ Yᴏᴜ Cᴀɴ Jᴜsᴛ—? Дурак.`

export const onlyAdminMessage = `🔒 Aᴅᴍɪɴ Pᴇʀᴍɪssɪᴏɴs Rᴇǫᴜɪʀᴇᴅ. Dᴏɴ'ᴛ Eᴠᴇɴ Tʀʏ Wɪᴛʜᴏᴜᴛ Tʜᴇᴍ.`

export const groupOnlyMessage = `🏘️ Tʜɪs Cᴏᴍᴍᴀɴᴅ Oɴʟʏ Wᴏʀᴋs Iɴ Gʀᴏᴜᴘs.`

export const statusOkMessage = `✅ <b>Sᴛᴀᴛᴜs: Aʟʟ Gᴏᴏᴅ</b>

I'ᴍ Pʀᴏᴘᴇʀʟʏ Cᴏɴғɪɢᴜʀᴇᴅ As Aɴ Aᴅᴍɪɴ Iɴ Tʜɪs Gʀᴏᴜᴘ. Nᴏᴛʜɪɴɢ Gᴇᴛs Pᴀsᴛ Mᴇ.`

export const statusNotAdminMessage = `❌ <b>Sᴛᴀᴛᴜs: Nᴏᴛ Cᴏɴғɪɢᴜʀᴇᴅ</b>

I'ᴍ Nᴏᴛ Aɴ Aᴅᴍɪɴ Iɴ Tʜɪs Gʀᴏᴜᴘ. Pʟᴇᴀsᴇ Mᴀᴋᴇ Mᴇ Aɴ Aᴅᴍɪɴ Wɪᴛʜ Dᴇʟᴇᴛᴇ Mᴇssᴀɢᴇ Pᴇʀᴍɪssɪᴏɴs.`

export const statusPrivateMessage = `ℹ️ Pʟᴇᴀsᴇ Usᴇ <code>/status</code> Iɴ A Gʀᴏᴜᴘ Tᴏ Cʜᴇᴄᴋ Iғ I'ᴍ Wᴏʀᴋɪɴɢ Tʜᴇʀᴇ.`

export const versionInfo = `🚀 <b>Vᴇʀsɪᴏɴ:</b> v${VERSION}`
