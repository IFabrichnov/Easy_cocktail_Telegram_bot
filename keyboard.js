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

module.exports = ingredientMenu;