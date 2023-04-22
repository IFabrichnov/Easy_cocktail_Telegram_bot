const { Telegraf, Markup, Extra } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const text = require('./const');

const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// массив для хранения выбранных ингредиентов
const selectedIngredients = [];

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
                { text: 'Оливки', callback_data: 'olives' },
            ],
            [
                { text: 'Начать поиск', callback_data: 'search' },
                { text: 'Очистить', callback_data: 'clear' },
            ],
        ],
    },
};

// функция для поиска коктейлей, которые содержат все ингредиенты из переданного массива
async function findCocktails(ingredients) {
    try {
        // преобразуем ингредиенты в нижний регистр
        const ingredientsLowerCase = ingredients.map(ingredient => ingredient.toLowerCase());
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientsLowerCase.join(',')}`);
        const data = response.data;
        // получаем id коктейлей
        const cocktailIds = data.drinks.map(cocktail => cocktail.idDrink);
        // получаем информацию о коктейлях по их id
        const cocktails = await Promise.all(cocktailIds.map(async (id) => {
            const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = response.data;
            return data.drinks[0];
        }));
        return cocktails;
    } catch (err) {
        console.error(err);
        return [];
    }
}

// команда /start отправляет сообщение с меню
bot.command('start', (ctx) => {
    ctx.replyWithHTML('<b>Выберите ингредиенты:</b>', ingredientMenu);
});


bot.on('callback_query', async (ctx) => {
    const ingredient = ctx.callbackQuery.data;
    console.log(`Выбран ингредиент: ${ingredient}`);
    // Пример вызова функции для получения случайного коктейля с ингредиентом "vodka"
    getRandomCocktailByIngredient(ingredient);
//
//     if (ingredient === 'clear') {
//         // очищаем массив выбранных ингредиентов
//         selectedIngredients.length = 0;
//         // восстанавливаем исходное меню с кнопками ингредиентов
//         await ctx.editMessageReplyMarkup(ingredientMenu);
//     } else if (ingredient !== 'search' && !selectedIngredients.includes(ingredient)) {
//         // добавляем ингредиент в массив
//         selectedIngredients.push(ingredient);
//         console.log(`Выбранные ингредиенты: ${selectedIngredients}`);
//         // удаляем кнопку, чтобы пользователь не мог добавить один и тот же ингредиент дважды
//         const updatedInlineKeyboard = ingredientMenu.reply_markup.inline_keyboard.map(row => {
//             return row.filter(btn => !selectedIngredients.includes(btn.callback_data));
//         });
//         await ctx.editMessageReplyMarkup({
//         inline_keyboard: updatedInlineKeyboard.filter(row => row.length > 0)
//         });
//     } else if (selectedIngredients.length > 0) {
//     // запускаем поиск коктейлей, если выбраны ингредиенты и нажата кнопка "Начать поиск"
//     const cocktails = await findCocktails(selectedIngredients);
//     console.log(`Найдены коктейли`, cocktails);
//     if (cocktails.length === 0) {
//         ctx.reply('Коктейли с выбранными ингредиентами не найдены.');
//     } else {
//         let message = 'Найдены следующие коктейли:\n\n';
//         for (let cocktail of cocktails) {
//             message += `<b>${cocktail.strDrink}</b>\n${cocktail.strInstructions}\n\n`;
//         }
//         ctx.replyWithHTML(message);
//     }
//     // clean
//     selectedIngredients.length = 0;
// }
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
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));