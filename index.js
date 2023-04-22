const { Telegraf, Markup, Extra } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const text = require('./const');

const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// создаем меню с кнопками ингредиентов
const ingredientMenu = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'Водка', callback_data: 'vodka' },
                { text: 'Лимонный сок', callback_data: 'lemon-juice' },
            ],
            [
                { text: 'Лёд', callback_data: 'ice' },
                { text: 'Спрайт', callback_data: 'sprite' },
                { text: 'Сахарный сироп', callback_data: 'simple-syrup' },
            ],
            [
                { text: 'Мята', callback_data: 'mint' },
                { text: 'Лайм', callback_data: 'lime juce' },
                { text: 'Виски', callback_data: 'whiskey' },
            ],
            [
                { text: 'Ангостура', callback_data: 'angostura' },
                { text: 'Апельсиновая кожура', callback_data: 'orange-peel' },
                { text: 'Джин', callback_data: 'gin' },
            ],
            [
                { text: 'Вермут', callback_data: 'vermouth' },
            ]
        ],
    },
};

// команда /start отправляет сообщение с меню
bot.command('start', (ctx) => {
    ctx.replyWithHTML('<b>Выберите ингредиенты:</b>', ingredientMenu);
});

bot.on('callback_query', async (ctx) => {
    const ingredient = ctx.callbackQuery.data;
    getRandomCocktailByIngredient(ingredient);
    // функция рандомно выдающая коктейль по ингредиенту
    function getRandomCocktailByIngredient(ingredient) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.json())
            .then(data => {
                const cocktails = data.drinks;
                const randomIndex = Math.floor(Math.random() * cocktails.length);
                const randomCocktailId = cocktails[randomIndex].idDrink;
                fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomCocktailId}`)
                    .then(response => response.json())
                    .then(data => {
                        const cocktail = data.drinks[0];
                        // Выводим информацию о случайном коктейле
                        console.log(cocktail.strDrink);
                        console.log(cocktail.strInstructions);
                        console.log(cocktail.strDrinkThumb);

                        // let message = 'Найдены следующие коктейли:\n\n';
                        const message = `<b>${cocktail.strDrink}</b>\n${cocktail.strInstructions}`;
                        ctx.replyWithPhoto({ url: cocktail.strDrinkThumb }, { caption: message, parse_mode: 'HTML' });
                    });
            });
    }
});



bot.launch();
// Включить плавную остановку
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));