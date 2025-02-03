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



-----------------------------------------

Ce code est un ensemble de fichiers TypeScript qui configure un bot Telegram à l’aide du package 'node-telegram-bot-api'.
Il écoute les messages entrants et envoie une réponse aux utilisateurs qui ont demandé à rejoindre un chat spécifique.

Le code initialise une connexion à une base de données à l’aide de la classe 'AppDataSource', charge les données de configuration à partir d’un fichier JSON,
et crée une instance 'TelegramBot' à l’aide d’un jeton de bot obtenu à partir du BotFather de Telegram.

Lorsque le bot reçoit un événement « chat_join_request » (qui se déclenche lorsqu’un utilisateur demande à rejoindre un groupe),
il envoie un message à l’utilisateur contenant certaines informations et enregistre l’ID de l’utilisateur dans une entité 'UserResponse' de la base de données.

Lorsque le bot reçoit un message régulier d’un utilisateur, il recherche l’entité « UserResponse » de l’utilisateur et vérifie s’il a déjà reçu une réponse.
Si ce n’est pas le cas, il envoie un message à un canal privé contenant le message de l’utilisateur, ainsi que des informations supplémentaires sur l’utilisateur.
L’indicateur 'hasReply' dans l’enti 'UserResponse'
