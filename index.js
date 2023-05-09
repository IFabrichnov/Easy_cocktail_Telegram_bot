const { Telegraf, Markup, Extra } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const text = require('./help_text');
const ingredientMenu = require('./keyboard');

const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

// команда /start отправляет сообщение с меню
bot.command('start', (ctx) => {
    ctx.replyWithHTML('<b>Выберите ингредиенты:</b>', ingredientMenu);
});

// команда /help
bot.command('help', (ctx) => {
    const helpMessage = text.commands;
    ctx.replyWithHTML(helpMessage);
});

bot.on('callback_query', async (ctx) => {
    const ingredient = ctx.callbackQuery.data;
    getRandomCocktailByIngredient(ingredient);
    // функция рандомно выдающая коктейль по ингредиенту
    function getRandomCocktailByIngredient(ingredient) {
        axios
            .get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.data)
            .then(data => {
                const cocktails = data.drinks;
                const randomIndex = Math.floor(Math.random() * cocktails.length);
                const randomCocktailId = cocktails[randomIndex].idDrink;
                axios
                    .get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomCocktailId}`)
                    .then(response => response.data)
                    .then(data => {
                        const cocktail = data.drinks[0];
                        console.log(cocktail.strDrink);
                        console.log(cocktail.strInstructions);
                        console.log(cocktail.strDrinkThumb);

                        const message = `<b>${cocktail.strDrink}</b>\n${cocktail.strInstructions}`;
                        ctx.replyWithPhoto({ url: cocktail.strDrinkThumb }, { caption: message, parse_mode: 'HTML' });
                    });
            })
            .catch(error => {
                console.log('Error fetching cocktails:', error);
            });
    }
});


bot.launch();
// Включить плавную остановку
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));