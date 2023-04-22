# BOT
This code is a TypeScript file that sets up a Telegram bot using the `node-telegram-bot-api` package. 
It listens for incoming messages and sends a response to users who have requested to join a specific chat. 

The code initializes a database connection using the `AppDataSource` class, loads configuration data from a JSON file, 
and creates a `TelegramBot` instance using a bot token obtained from Telegram's BotFather. 

When the bot receives a `chat_join_request` event (which is triggered when a user requests to join a group), 
it sends a message to the user containing some information, and saves the user's ID in a `UserResponse` entity in the database. 

When the bot receives a regular message from a user, it looks up the user's `UserResponse` entity and checks if they have already received a response. 
If they have not, it sends a message to a private channel containing the user's message, along with some additional information about the user. 
The `hasReply` flag in the `UserResponse` entity is then set to `true` to indicate that the user has already received a response.
