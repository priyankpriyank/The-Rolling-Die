# The Rolling Die 🎲

A full-stack board game store inventory management system featuring a public storefront, a secure manager portal with live WebSocket activity monitoring, and an integrated Discord bot providing real-time inventory queries.

---

## ⚙️ Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (bundled with Node.js)
- A [Discord Developer](https://discord.com/developers/applications) account and a Discord test server (Guild) with administrator/manage server permissions.

---

## 📁 Project Structure

```text
Project1/
├── app.js                   # Express server entry point & Socket.IO initialization
├── bot/
│   ├── bot.js               # Discord bot client & interaction handlers
│   └── registerCommands.js  # Script to register slash commands with Discord API
├── controllers/             # Express controllers (auth, game, manager)
├── database/
│   ├── createManager.js     # Script to create initial manager account
│   ├── inventory.db         # SQLite database file (created automatically)
│   └── seed.js              # Script to populate sample board games
├── middleware/              # Authentication & session middleware
├── models/
│   ├── database.js          # SQLite connection and table definitions
│   ├── gameModel.js         # Game queries (search, CRUD operations)
│   └── managerModel.js      # Manager queries and verification
├── public/                  # Static assets (CSS, client JS, images)
├── routes/                  # Express route definitions
├── views/                   # Mustache HTML view templates
├── .env.example             # Template for required environment variables
├── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies

In the project root directory, install all dependencies:

```bash
npm install
```

---

### 2. Environment Configuration

Create a `.env` file in the root directory by copying the sample template:
```
Open `.env` and fill in the required configuration variables:

```ini
# Discord Bot Credentials (see Step 3 below)
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_application_client_id_here
DISCORD_GUILD_ID=your_discord_server_guild_id_here

# Initial Store Manager Account
MANAGER_USERNAME=admin
MANAGER_PASSWORD=your_manager_password_min_12_chars
```

> **Note:** The `MANAGER_PASSWORD` must be at least **12 characters long** as enforced by the manager creation script.

---

### 3. Discord Bot Configuration

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Name your application (e.g., `The Rolling Die Bot`).
3. Under **General Information**, copy the **Application ID** and paste it into `.env` as `DISCORD_CLIENT_ID`.
4. Go to the **Bot** tab on the left menu:
   - Click **Add Bot** (or **Reset Token**).
   - Copy the generated token and paste it into `.env` as `DISCORD_TOKEN`.
5. Invite the bot to your Discord server:
   - Navigate to **OAuth2** > **URL Generator**.
   - Under **Scopes**, select `bot` and `applications.commands`.
   - Under **Bot Permissions**, select `Send Messages`, `Read Messages/View Channels`, and `Use Slash Commands`.
   - Copy the generated URL at the bottom, paste it into your browser, select your Discord server, and click **Authorize**.
6. Retrieve your Discord Server (Guild) ID:
   - In Discord, enable Developer Mode (*User Settings* > *Advanced* > *Developer Mode*).
   - Right-click your server icon in the sidebar and choose **Copy Server ID**.
   - Paste this ID into `.env` as `DISCORD_GUILD_ID`.

---

### 4. Initialize & Seed Database

The SQLite database schema (`games` and `managers` tables) is auto-created on initial database connection.

To seed the initial sample board games and create your manager account:

```bash
node database/seed.js
node database/createManager.js
```

### 5. Register Discord Slash Commands

Register the slash commands (`/stock`, `/price`, `/game`) with your Discord guild:

```bash
npm run register-commands
```

*(Alternatively, you can run `node bot/registerCommands.js`)*.

You should see:
```text
Registering Discord slash commands...
Discord slash commands registered successfully!
```

---

## 🏃 Running the Application

Start the web server and the Discord bot together:

```bash
# Standard start:
npm start

# Or development mode with auto-reload:
npm run dev
```

Once started, the console will confirm:
```text
Server running at http://localhost:3000
Discord bot logged in as <YourBotName>#1234
```

---

## 🖥️ Application Usage

### Web Application Routes

| URL Path | Access | Description |
| :--- | :--- | :--- |
| `http://localhost:3000/` | Public | Homepage showcasing store highlights. |
| `http://localhost:3000/inventory` | Public | Storefront inventory catalogue with real-time stock and search. |
| `http://localhost:3000/manager/login` | Public | Manager login page. |
| `http://localhost:3000/manager/dashboard` | Manager | Live dashboard with Socket.IO real-time bot interaction feed & inventory overview. |
| `http://localhost:3000/manager/add` | Manager | Add a new board game to inventory. |
| `http://localhost:3000/manager/edit/:id` | Manager | Edit price, stock, description, or players for a game. |

---

### Discord Bot Slash Commands

Type these commands in any channel within your authorized Discord guild:

- `/stock title:<game_name>`
  - Checks if a game is currently in stock and displays quantity available.
- `/price title:<game_name>`
  - Displays the current retail price of the requested game.
- `/game title:<game_name>`
  - Returns complete game information including category, player count, price, stock, and description.

> Every time a user executes a command on Discord, the event is broadcasted in real time to the **Manager Dashboard** via WebSockets!
