const { Telegraf, Markup } = require("telegraf");
const { Admin, Product } = require("../api/models/models");
require("dotenv").config();
const bot = new Telegraf("8026160087:AAE_s7_9tChz_njiq9QbYV-_VvDZ8Y-tC0s");

async function sendNewProductNotification(product) {
  console.log("DICK DICK DICK");
  console.log("Получен продукт:", product); // Логируем весь объект продукта

  try {
    const priceOptions = product.priceVariants.map(
      (item) => `${item.price}руб\n`
    );
    console.log("Сформированы варианты цен:", priceOptions); // Логируем массив цен

    const message = `🎉 Новый товар!
          *${product.name}*
          Категория: ${product.category}
          
          💸 Цена: 
          ${priceOptions}
  
          🌍 Страна: ${product.country}
          📝 Описание: ${product.description}
          
          🖼 [Посмотреть изображение](${product.imageLink})`;

    const users = await Admin.findAll({ where: { role: "USER" } });
    console.log("Найдено пользователей:", users.length); // Логируем количество пользователей

    if (users.length === 0) return;

    for (const user of users) {
      try {
        const chatId = parseInt(user.username); // Если username хранит chatId
        if (!isNaN(chatId)) {
          console.log("Отправляем фото пользователю:", chatId); // Логируем отправку фото
          await bot.telegram.sendPhoto(
            chatId,
            { photo: product.imageLink },
            {
              caption: message,
              parse_mode: "Markdown",
            }
          );
        } else {
          console.error(`Некорректный chatId: ${user.username}`);
        }
      } catch (error) {
        console.error(
          `Ошибка отправки уведомления пользователю ${user.username}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Ошибка при отправке уведомлений:", error.message);
  }
}

// Команда /start
bot.start(async (ctx) => {
  try {
    const chatId = ctx.message.chat.id.toString();
    const username = ctx.message.chat.username || chatId; // Сохраняем chatId, если username нет

    await Admin.findOrCreate({
      where: { username },
      defaults: { role: "USER", password: "default_password" },
    });

    await ctx.reply(
      "Добро пожаловать! Вы можете запросить каталог товаров командой /catalog."
    );
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error.message);
  }
});

// Команда /catalog
bot.command("catalog", async (ctx) => {
  try {
    const products = await Product.findAll();
    if (products.length === 0) {
      return ctx.reply("Каталог пуст.");
    }

    const buttons = products.map((product) => [
      Markup.button.callback(product.name, `product_${product.id}`),
    ]);

    await ctx.reply("Выберите товар:", Markup.inlineKeyboard(buttons));
  } catch (error) {
    console.error("Ошибка при получении каталога:", error.message);
    await ctx.reply("Произошла ошибка при загрузке каталога.");
  }
});

// Обработчик кнопок товаров
bot.on("callback_query", async (ctx) => {
  try {
    const productId = ctx.callbackQuery.data.split("_")[1];
    const product = await Product.findByPk(productId);

    if (!product) {
      return ctx.reply("Товар не найден.");
    }

    const message = `*${product.name}*
Категория: ${product.category}

💸 Цена: 
${product.priceVariants.map(
  (item) => `${(Number(item.weight) / 1000).toFixed(2)}кг - ${item.price}руб`
)}

🌍 Страна: ${product.country}
📝 Описание: ${product.description}`;

    console.log(product);

    await ctx.replyWithPhoto(
      { url: `${product.imageLink}` },
      { caption: message, parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Ошибка при получении информации о товаре:", error.message);
    await ctx.reply("Произошла ошибка при загрузке информации о товаре.");
  }
});

bot
  .launch()
  .then(() => console.log("Бот запущен!"))
  .catch((err) => console.error("Ошибка запуска бота:", err));

module.exports = { bot, sendNewProductNotification };
