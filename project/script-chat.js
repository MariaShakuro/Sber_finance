document.addEventListener("DOMContentLoaded", () => {
    // Элементы интерфейса
    const chatWindowElement = document.getElementById('chat-window');
    const userInputElement = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const languageSelect = document.getElementById('language-select');

    // Установка языка по умолчанию
    const defaultLanguage = 'ru';
    let currentLanguage = localStorage.getItem('userLang') ||
        (languageSelect ? languageSelect.value : defaultLanguage);

    // Обновление языка при изменении селектора
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', () => {
            currentLanguage = languageSelect.value;
            localStorage.setItem('userLang', currentLanguage);
        });
    }

    // Переводы для интерфейса
    const translations = {
        welcome: {
            ru: "Привет, я финансовый помощник! Чем могу помочь? 😊",
            en: "Hello, I'm your financial assistant! How can I help? 😊",
            fr: "Bonjour, je suis votre assistant financier ! Comment puis-je vous aider? 😊",
            be: "Прывітанне, я ваш фінансавы памочнік! Чым магу дапамагчы? 😊"
        },
        userPrefix: {
            ru: "Вы",
            en: "You",
            fr: "Vous",
            be: "Вы"
        },
        defaultResponse: {
            ru: "Я пока умею анализировать транзакции, помогать с накоплениями и кредитами",
            en: "I can currently analyze transactions, help with savings and loans",
            fr: "Je peux actuellement analyser les transactions, aider avec l'épargne et les prêts",
            be: "Я пакуль магу аналізаваць транзакцыі, дапамагаць з назапашваннямі і крэдытамі"
        }
    };

    // Приветственное сообщение
    chatWindowElement.innerHTML += `<p><strong>${translations.welcome[currentLanguage]}</strong></p>`;

    // Обработчики событий
    sendBtn.addEventListener('click', sendMessage);
    userInputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Функция определения языка ввода
    function detectInputLanguage(text) {
        const patterns = {
            ru: /[а-яё]/i,         // Русские символы
            be: /[ўі]/i,            // Белорусские специфические символы
            fr: /[éèàùêâîôûëïüç]/i, // Французские диакритики
            en: /[a-z]/i            // Английские символы
        };

        // Проверяем наличие характерных символов для каждого языка
        for (const [lang, regex] of Object.entries(patterns)) {
            if (regex.test(text)) return lang;
        }

        return null; // Если не удалось определить
    }

    // Главная функция отправки сообщений
    async function sendMessage() {
        const userInput = userInputElement.value.trim();
        if (!userInput || !chatWindowElement) return;

        // Определяем язык ввода и выбираем язык ответа
        const detectedLanguage = detectInputLanguage(userInput);
        const responseLanguage = detectedLanguage || currentLanguage;

        // Отображаем сообщение пользователя с префиксом на нужном языке
        chatWindowElement.innerHTML += `<p>${translations.userPrefix[responseLanguage]}: ${userInput}</p>`;
        userInputElement.value = '';

        // Обработка команд
        const input = userInput.toLowerCase();
        if (input.includes("transaction") || input.includes("транзакц") || input.includes("transact")) {
            handleTransactions(responseLanguage);
        }
        else if (input.includes("goal") || input.includes("цел") || input.includes("накоп") || input.includes("économ")) {
            askSavingsGoal(responseLanguage);
        }
        else if (input.includes("credit") || input.includes("кредит") || input.includes("loan") || input.includes("prêt")) {
            showCreditOptions(responseLanguage);
        }
        else if (input.includes("2")) {
            askSavingsGoal(responseLanguage);
        }
        else if (input.includes("3")) {
            showCreditOptions(responseLanguage);
        }
        else {
            chatWindowElement.innerHTML += `<p>${translations.defaultResponse[responseLanguage]}</p>`;
        }

        chatWindowElement.scrollTop = chatWindowElement.scrollHeight;
    }

    // Обработка транзакций
    function handleTransactions(responseLang) {
        const data = {
            transactions: [
                { date: "2024-12-01", amount: -500, description: "Продукты" },
                { date: "2024-11-20", amount: -2000, description: "Аренда" },
                { date: "2024-11-15", amount: -100, description: "Кафе" },
                { date: "2024-10-30", amount: 1500, description: "Зарплата" }
            ]
        };

        const analysisResult = analyzeTransactions(data.transactions, responseLang);
        chatWindowElement.innerHTML += analysisResult;
    }

    // Анализ расходов с переводами
    function analyzeTransactions(transactions, responseLang) {
        const categories = {};
        transactions.forEach(tx => {
            categories[tx.description] = (categories[tx.description] || 0) + Math.abs(tx.amount);
        });

        const maxCategory = Object.keys(categories).reduce((a, b) =>
            categories[a] > categories[b] ? a : b
        );

        const currencySymbols = {
            ru: "руб.",
            en: "USD",
            fr: "€",
            be: "руб."
        };

        const analysisTranslations = {
            ru: {
                title: "🔍 <strong>Анализ ваших расходов:</strong>",
                mainExpense: "1️⃣ <strong>Основная статья расходов:</strong> ${maxCategory} (${categories[maxCategory]} ${currencySymbols.ru})",
                setGoal: "2️⃣ Поставить цель накопления 🎯",
                credit: "3️⃣ Рассчитать кредит 🏦"
            },
            en: {
                title: "🔍 <strong>Analysis of your expenses:</strong>",
                mainExpense: "1️⃣ <strong>Main expense category:</strong> ${maxCategory} (${categories[maxCategory]} ${currencySymbols.en})",
                setGoal: "2️⃣ Set a savings goal 🎯",
                credit: "3️⃣ Calculate a loan 🏦"
            },
            fr: {
                title: "🔍 <strong>Analyse de vos dépenses:</strong>",
                mainExpense: "1️⃣ <strong>Dépense principale:</strong> ${maxCategory} (${categories[maxCategory]} ${currencySymbols.fr})",
                setGoal: "2️⃣ Définir un objectif d'épargne 🎯",
                credit: "3️⃣ Calculer un prêt 🏦"
            },
            be: {
                title: "🔍 <strong>Аналіз вашых выдаткаў:</strong>",
                mainExpense: "1️⃣ <strong>Асноўная артыкул выдаткаў:</strong> ${maxCategory} (${categories[maxCategory]} ${currencySymbols.be})",
                setGoal: "2️⃣ Паставіць мэту назапашвання 🎯",
                credit: "3️⃣ Разлічыць крэдыт 🏦"
            }
        };

        const t = analysisTranslations[responseLang] || analysisTranslations.ru;

        return `
            <p>${t.title}</p>
            <p>${eval('`' + t.mainExpense + '`')}</p>
            <p>${t.setGoal}</p>
            <p>${t.credit}</p>
        `;
    }

    // Цели накопления с переводами
    function askSavingsGoal(responseLang) {
        const translations = {
            ru: "🧐 На что вы хотите накопить?",
            en: "🧐 What do you want to save for?",
            fr: "🧐 Pour quoi voulez-vous économiser?",
            be: "🧐 На што вы хочаце назапасіць?"
        };

        chatWindowElement.innerHTML += `<p>${translations[responseLang] || translations.ru}</p>`;
    }

    // Кредитные продукты с переводами
    function showCreditOptions(responseLang) {
        const creditTranslations = {
            ru: {
                title: "💳 Доступные кредитные продукты:",
                auto: "Автокредиты",
                consumer: "Потребительские кредиты",
                cards: "Кредитные карты",
                refinance: "Рефинансирование",
                clarify: "❓ Уточните интересующий продукт"
            },
            en: {
                title: "💳 Available credit products:",
                auto: "Auto loans",
                consumer: "Consumer loans",
                cards: "Credit cards",
                refinance: "Refinancing",
                clarify: "❓ Specify the product you are interested in"
            },
            fr: {
                title: "💳 Produits de crédit disponibles:",
                auto: "Prêts auto",
                consumer: "Crédits à la consommation",
                cards: "Cartes de crédit",
                refinance: "Refinancement",
                clarify: "❓ Précisez le produit qui vous intéresse"
            },
            be: {
                title: "💳 Даступныя крэдытныя прадукты:",
                auto: "Аўтакрэдыты",
                consumer: "Спажывецкія крэдыты",
                cards: "Крэдытныя карты",
                refinance: "Рэфінансаванне",
                clarify: "❓ Удакладніце цікавы прадукт"
            }
        };

        const t = creditTranslations[responseLang] || creditTranslations.ru;

        chatWindowElement.innerHTML += `
            <p>${t.title}</p>
            <ul>
                <li>${t.auto}</li>
                <li>${t.consumer}</li>
                <li>${t.cards}</li>
                <li>${t.refinance}</li>
            </ul>
            <p>${t.clarify}</p>
        `;
    }
});