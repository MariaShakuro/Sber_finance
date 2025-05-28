// script-page1.js

function openChat(promptText) {
    localStorage.setItem('chatPrompt', promptText);
    // Переход на страницу чата. Убедитесь, что это правильное имя файла.
    window.location.href = 'chat.html';
}