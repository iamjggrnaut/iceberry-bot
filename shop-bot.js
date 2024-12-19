const { Telegraf } = require('telegraf');

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const bot = new Telegraf('8026160087:AAE_s7_9tChz_njiq9QbYV-_VvDZ8Y-tC0s');

const getCoods = async () => {
    const res = await fetch('https://iceberryshop.ru/api/product/all', {
        method: 'GET',
        headers: {
            'content-type': 'application.json'
        }
    })
    const data = await res.json()
    return data
}

// Команда /start
bot.start((ctx) => {
    ctx.reply('Добро пожаловать в наш интернет-магазин! Используйте команды для навигации:\n\n' +
        '/catalog - Посмотреть каталог товаров\n' +
        '/search - Найти товар\n' +
        '/cart - Просмотреть корзину\n' +
        '/add_to_cart [product_id] - Добавить товар в корзину\n' +
        '/remove_from_cart [product_id] - Удалить товар из корзины\n' +
        '/checkout - Оформить заказ\n' +
        '/order_status [order_id] - Проверить статус заказа\n' +
        '/contact_support - Связаться с поддержкой\n' +
        '/promotions - Узнать о текущих акциях\n' +
        '/profile - Просмотреть профиль\n' +
        '/help - Получить помощь');
});

// Команда /catalog
bot.command('catalog', (ctx) => {
    ctx.reply(
        getCoods().then(data => 'got it').then(res => JSON.stringify(res))
    );
});

// Команда /search
bot.command('search', (ctx) => {
    ctx.reply('Введите название товара для поиска:');
});

// Команда /cart
bot.command('cart', (ctx) => {
    ctx.reply('Ваша корзина пуста.');
});

// Команда /add_to_cart
bot.command('add_to_cart', (ctx) => {
    const productId = ctx.message.text.split(' ')[1];
    if (productId) {
        ctx.reply(`Товар с ID ${productId} добавлен в корзину.`);
    } else {
        ctx.reply('Пожалуйста, укажите ID товара.');
    }
});

// Команда /remove_from_cart
bot.command('remove_from_cart', (ctx) => {
    const productId = ctx.message.text.split(' ')[1];
    if (productId) {
        ctx.reply(`Товар с ID ${productId} удален из корзины.`);
    } else {
        ctx.reply('Пожалуйста, укажите ID товара.');
    }
});

// Команда /checkout
bot.command('checkout', (ctx) => {
    ctx.reply('Процесс оформления заказа начат.');
});

// Команда /order_status
bot.command('order_status', (ctx) => {
    const orderId = ctx.message.text.split(' ')[1];
    if (orderId) {
        ctx.reply(`Статус заказа ${orderId}: В обработке.`);
    } else {
        ctx.reply('Пожалуйста, укажите номер заказа.');
    }
});

// Команда /contact_support
bot.command('contact_support', (ctx) => {
    ctx.reply('Свяжитесь с нашей поддержкой по адресу saha.inna77@mail.ru');
});

// Команда /promotions
bot.command('promotions', (ctx) => {
    ctx.reply('Текущие акции: Скидка 20% на все товары до конца месяца!');
});


// Команда /help
bot.command('help', (ctx) => {
    ctx.reply('Доступные команды:\n/start - Приветствие\n/catalog - Каталог товаров\n/search - Поиск товара\n/cart - Корзина\n/add_to_cart [product_id] - Добавить товар в корзину\n/remove_from_cart [product_id] - Удалить товар из корзины\n/checkout - Оформление заказа\n/order_status [order_id] - Статус заказа\n/contact_support - Поддержка\n/promotions - Акции\n/profile - Профиль\n/help - Помощь');
});

// Запуск бота
bot.launch()
    .then(() => {
        console.log('Бот запущен!');
    })
    .catch(err => console.error(err));
