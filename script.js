const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const filter = document.getElementById("filter");
const clearAllBtn = document.getElementById("clear-all");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorage.getItem("transactions") !== null
  ? localStorageTransactions
  : [];

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

function getFilteredTransactions() {
  const selectedFilter = filter.value;

  if (selectedFilter === "income") {
    return transactions.filter(transaction => transaction.amount > 0);
  }

  if (selectedFilter === "expense") {
    return transactions.filter(transaction => transaction.amount < 0);
  }

  return transactions;
}

function addTransactionDOM(transaction) {
  const signClass = transaction.amount < 0 ? "minus" : "plus";
  const operator = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");
  item.classList.add(signClass);

  item.innerHTML = `
    <div class="transaction-info">
      <span class="transaction-name">${transaction.text}</span>
      <span class="transaction-date">${formatDate(transaction.createdAt)}</span>
      <span class="transaction-value">${operator} ${formatCurrency(Math.abs(transaction.amount))}</span>
    </div>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">✕</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0);
  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0);

  balance.innerText = formatCurrency(total);
  moneyPlus.innerText = formatCurrency(income);
  moneyMinus.innerText = formatCurrency(Math.abs(expense));
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";

  const filteredTransactions = getFilteredTransactions();

  if (filteredTransactions.length === 0) {
    list.innerHTML = `<div class="empty-message">Nenhuma transação encontrada.</div>`;
  } else {
    filteredTransactions
      .slice()
      .reverse()
      .forEach(addTransactionDOM);
  }

  updateValues();
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Preencha a descrição e o valor da transação.");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value.trim(),
    amount: +amount.value,
    createdAt: new Date().toISOString()
  };

  transactions.push(transaction);

  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  init();
}

function clearAllTransactions() {
  if (transactions.length === 0) {
    alert("Não há transações para remover.");
    return;
  }

  const confirmDelete = confirm("Tem certeza que deseja apagar todas as transações?");

  if (!confirmDelete) {
    return;
  }

  transactions = [];
  updateLocalStorage();
  init();
}

form.addEventListener("submit", addTransaction);
filter.addEventListener("change", init);
clearAllBtn.addEventListener("click", clearAllTransactions);

init();
