const messages = {
    "ru": "Привет, я помощник Сберик. Чем могу помочь? 😊",
    "en": "Hello, I am Sberik Assistant. How can I help? 😊",
    "fr": "Bonjour, je suis l'assistant Sberik. Comment puis-je vous aider? 😊",
    "be": "Прывітанне, я памочнік Сберык. Чым магу дапамагчы? 😊"
};

// Функция выбора языка и скрытия всплывающего окна
function setLanguage(lang) {
    localStorage.setItem('userLang', lang);
    document.getElementById("language-selector").style.display = "none"; // Скрываем окно
    document.getElementById("prompt").innerText = messages[lang]; // Устанавливаем приветствие
}

// При загрузке страницы проверяем, был ли выбран язык ранее
document.addEventListener("DOMContentLoaded", () => {
    localStorage.removeItem('userLang'); // Очистка сохраненного языка при обновлении
    const savedLang = localStorage.getItem('userLang');
    if (savedLang) {
        document.getElementById("language-selector").style.display = "none"; // Скрываем окно
        document.getElementById("prompt").innerText = messages[savedLang]; // Устанавливаем приветствие
    } else {
        document.getElementById("language-selector").style.display = "block"; // Показываем окно
    }
});
