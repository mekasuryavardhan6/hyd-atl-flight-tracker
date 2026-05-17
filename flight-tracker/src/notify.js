import { config } from "./config.js";

export async function notify(message) {
  if (config.dryRun || !config.telegram.botToken || !config.telegram.chatId) {
    console.log(message);
    return;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.telegram.chatId,
        text: message,
        disable_web_page_preview: true
      })
    }
  );

  const body = await response.json();
  if (!response.ok || !body.ok) {
    throw new Error(body.description || `Telegram notification failed with HTTP ${response.status}`);
  }
}
