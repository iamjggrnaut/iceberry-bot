const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '7831236876:AAGoeH9g-aQ9SvcpBXbjdxBo3iquxZKvD3A';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Добро пожаловать в наш магазин! Нажмите на кнопку, что начать', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Открыть магазин',
                            web_app: {
                                url: 'https://iceberryshop.ru/'
                            }
                        }
                    ]
                ]
            }
        });
    }
});