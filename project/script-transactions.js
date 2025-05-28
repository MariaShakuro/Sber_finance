document.addEventListener("DOMContentLoaded", () => {
    fetch('transactions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const balanceElement = document.getElementById('balance');
            if (balanceElement) {
                balanceElement.innerText = data.balance;
            }

            const list = document.getElementById('transactions-list');
            if (list) {
                data.transactions.forEach(tx => {
                    const item = document.createElement('li');
                    item.innerText = `${tx.date} — ${tx.description}: ${tx.amount} BYN`;
                    list.appendChild(item);
                });
            }
        })
        .catch(error => console.error("Ошибка загрузки JSON:", error));

    const nextPageButton = document.getElementById('nextPage');
    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            window.location.href = 'page1.html'; // Переход на страницу выбора запросов
        });
    }
});