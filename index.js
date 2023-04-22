"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const app_data_source_1 = require("./app-data-source");
const user_response_entity_1 = require("./models/user-response.entity");
function sendErrorMessage(query, config, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userIdString = query.from.username
                ? `\nNom d'utilisateur : <a href="tg://user?id=${query.from.id}">@${query.from.username}</a>\n\n`
                : `\nID de l'utilisateur : <a href="tg://user?id=${query.from.id}">@${query.from.id}</a>\n\n`;
            const content = userIdString +
                `ERREUR !\n L'utilisateur à choisis des paramèters empêchant le robot de lui parler, merci de le contacter manuellement.`;
            yield bot.sendMessage(config.privateChannelId, content, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Contacter l'utilisateur",
                                url: `tg://user?id=${query.from.id}`,
                            },
                        ],
                    ],
                },
            });
        }
        catch (e) {
            console.error(e);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let config;
    let bot;
    // Try to initialize database
    try {
        yield app_data_source_1.AppDataSource.initialize();
        console.log('[OK] Database loaded');
    }
    catch (e) {
        console.error(e);
        console.log('[ERR] Error while loading database');
    }
    // Try to load configuration
    try {
        config = require('../config.json');
        console.log('[OK] Configuration loaded');
    }
    catch (e) {
        console.error(e);
        console.log('[ERR] Error while loading configuration');
    }
    if (config === undefined) {
        console.log('[ERR] Error while loading configuration');
        return;
    }
    // Try to load bot
    try {
        bot = new node_telegram_bot_api_1.default(config.botToken, { polling: true });
        console.log('[OK] Bot loaded');
    }
    catch (e) {
        console.error(e);
        console.log('[ERR] Error while loading bot');
    }
    if (bot === undefined) {
        console.log('[ERR] Error while loading bot');
        return;
    }
    bot.on('chat_join_request', (query) => __awaiter(void 0, void 0, void 0, function* () {
        if (!bot || !config)
            return;
        if (!query || !query.chat || !query.chat.id)
            return;
        const chatId = query.chat.id;
        // Check if chat ID is the request channel chat ID
        if (chatId !== config.requestChannelId)
            return;
        // Try to send private message to the user
        try {
            const userId = query.from.id;
            const message = yield bot.sendMessage(query.from.id, config.messageToSend, {
                parse_mode: 'MarkdownV2',
            });
            if (!message) {
                sendErrorMessage(query, config, bot);
                return;
            }
            const userResponse = new user_response_entity_1.UserResponse(userId);
            yield app_data_source_1.AppDataSource.manager.save(userResponse);
        }
        catch (e) {
            console.error(e);
            sendErrorMessage(query, config, bot);
        }
    }));
    bot.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (!config || !bot)
            return;
        if (!message.from || !message.text)
            return;
        const userId = message.from.id;
        const userResponse = yield app_data_source_1.AppDataSource.manager.findOne(user_response_entity_1.UserResponse, {
            where: { userId },
        });
        if (!userResponse)
            return;
        if (!userResponse.hasReply) {
            const userIdString = message.from.username
                ? `\nNom d'utilisateur : <a href="tg://user?id=${message.from.id}">@${message.from.username}</a>\n\n`
                : `\nL'utilisateur n'a pas de pseudo.\nID de l'utilisateur : <a href="tg://user?id=${message.from.id}">@${message.from.id}</a>\n\n`;
            const content = userIdString + `Message envoyé :\n` + `${message.text}`;
            // Try to send message response in private channel
            try {
                const msg = yield bot.sendMessage(config.privateChannelId, content, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Profil de l'utilisateur",
                                    url: `tg://user?id=${message.from.id}`,
                                },
                            ],
                        ],
                    },
                });
                if (!msg)
                    return;
                userResponse.hasReply = true;
                yield app_data_source_1.AppDataSource.manager.save(userResponse);
            }
            catch (e) {
                console.error(e);
            }
        }
    }));
}))();
