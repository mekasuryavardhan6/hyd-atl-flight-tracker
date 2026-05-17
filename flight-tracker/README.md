# HYD to ATL flight tracker

Cloud-ready tracker for your round-trip flight search:

- Hyderabad (HYD) to Atlanta (ATL)
- Depart June 15-19, 2026
- Return about 89 days later
- Avoid Qatar Airways, Emirates, and Etihad
- Exactly 1 stop each way
- Prefer cheap total round-trip price, shorter travel time, and layovers around 2 hours
- Send Telegram alerts every 6 hours from GitHub Actions

## How it works

The tracker uses the SerpApi Google Flights API because it returns structured flight prices,
durations, layovers, and Google Flights links. It does not scrape browser pages.

Current search pairs:

| Depart | Return |
|---|---|
| 2026-06-15 | 2026-09-12 |
| 2026-06-16 | 2026-09-13 |
| 2026-06-17 | 2026-09-14 |
| 2026-06-18 | 2026-09-15 |
| 2026-06-19 | 2026-09-16 |

## Setup

1. Create a GitHub repository from the parent folder that contains `flight-tracker` and `.github/workflows/flight-tracker.yml`.
2. Get a SerpApi key from https://serpapi.com.
3. Create a Telegram bot:
   - Open Telegram and message `@BotFather`
   - Run `/newbot`
   - Copy the bot token
4. Get your Telegram chat ID:
   - Send any message to your new bot
   - Open `https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates`
   - Copy `message.chat.id`
5. In GitHub, go to `Settings -> Secrets and variables -> Actions -> New repository secret`.
6. Add these secrets:
   - `SERPAPI_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
7. Go to `Actions -> HYD to ATL flight tracker -> Run workflow` to test immediately.

After that, GitHub Actions runs it every 6 hours even when your laptop is closed.

## Local test

PowerShell:

```powershell
$env:SERPAPI_KEY="your_serpapi_key"
$env:TELEGRAM_BOT_TOKEN="your_bot_token"
$env:TELEGRAM_CHAT_ID="your_chat_id"
node src/index.js
```

Dry run without Telegram:

```powershell
$env:SERPAPI_KEY="your_serpapi_key"
$env:DRY_RUN="true"
node src/index.js
```

## Cost note

Each run can make multiple SerpApi searches: one outbound search per date, plus return searches
for the best outbound candidates. Keep `MAX_OUTBOUND_PER_DATE` small if you are on a limited plan.

## Skyscanner and Skiplagged

This version does not scrape Skyscanner or Skiplagged because scheduled scraping is fragile and
often blocked. The safest cloud version uses a structured API first. We can add another provider
later if you get access to a reliable API for those sources.
