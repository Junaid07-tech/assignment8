

const loginCard = document.querySelector(".login-card");
const registerCard = document.querySelector(".register-card");
const dashboard = document.querySelector(".dashboard-wrapper");
const txModal = document.querySelector(".tx-modal-container");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const addTransactionForm = document.getElementById("addTransactionForm");

const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");

const addBtn = document.querySelector(".add-transaction-btn");
const closeModalBtn = document.getElementById("closeTxModalBtn");
const logoutBtn = document.querySelector(".logout-btn");
const resetBtn = document.querySelector(".reset-btn");

const darkToggle = document.getElementById("darkModeToggle");

const tableBody = document.querySelector(".transactions-table tbody");
const cardValues = document.querySelectorAll(".card-value");
const userName = document.querySelector(".user-name");

const searchInput = document.querySelector(".search-box input");
const typeFilter = document.getElementById("typeFilter");

let users = JSON.parse(localStorage.getItem("users")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editIndex = -1;
let chart;


// === REGISTER PAGE OPEN KE LIYE CODE ===

registerLink.addEventListener("click", (e) => {
    e.preventDefault();

    loginCard.style.display = "none";
    registerCard.style.display = "block";
});

loginLink.addEventListener("click", (e) => {
    e.preventDefault();

    registerCard.style.display = "none";
    loginCard.style.display = "block";
});


// === REGISTER KE LIYE CODE ===

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let username =
        document.getElementById("registerUsername").value.trim();

    let password =
        document.getElementById("registerPassword").value.trim();

    let userExists = users.find(
        user => user.username === username
    );

    if (userExists) {
        alert("User already exists");
        return;
    }

    users.push({
        username,
        password
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registration Successful");

    registerForm.reset();

    registerCard.style.display = "none";
    loginCard.style.display = "block";
});


// === LOGIN KE LIYE CODE ===

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let username =
        document.getElementById("loginUsername").value.trim();

    let password =
        document.getElementById("loginPassword").value.trim();

    let validUser = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (validUser) {

        localStorage.setItem("currentUser", username);

        userName.textContent = username;

        loginCard.style.display = "none";
        dashboard.style.display = "grid";

        renderAll();

    } else {
        alert("Invalid Credentials");
    }

});


// === LOGOUT KE LIYE CODE ====

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    dashboard.style.display = "none";
    loginCard.style.display = "block";

});


// === ADD TRANSACTION MODAL KE LIYE CODE ====

addBtn.addEventListener("click", () => {

    dashboard.style.display = "none";
    txModal.style.display = "block";

});

closeModalBtn.addEventListener("click", () => {

    txModal.style.display = "none";
    dashboard.style.display = "grid";

});


// === ADD / EDIT TRANSACTION KE LIYE CODE ===

 addTransactionForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let transaction = {

        type: document.getElementById("txModalType").value,

        description:
            document.getElementById("txModalDescription").value,

        amount:
            Number(document.getElementById("txModalAmount").value),

        date:
            document.getElementById("txModalDate").value,

        category:
            document.getElementById("txModalCategory").value

    };

    if (editIndex === -1) {

        transactions.push(transaction);

    } else {

        transactions[editIndex] = transaction;
        editIndex = -1;

    }

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    addTransactionForm.reset();

    txModal.style.display = "none";
    dashboard.style.display = "grid";

    renderAll();

});


// === RENDER TABLE KE LIYE CODE ===

function renderTransactions(data = transactions) {

    tableBody.innerHTML = "";

    data.forEach((transaction, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${transaction.date}</td>

            <td>${transaction.description}</td>

            <td>${transaction.category}</td>

            <td>${transaction.type === "income" ? "+" : "-"}$${transaction.amount}</td>

            <td>

                <button onclick="editTransaction(${index})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${index})">
                    Delete
                </button>

            </td>

        </tr>

        `;
    });

}


// === EDIT KE LIYE CODE ====

function editTransaction(index) {

    editIndex = index;

    let t = transactions[index];

    document.getElementById("txModalType").value = t.type;
    document.getElementById("txModalDescription").value = t.description;
    document.getElementById("txModalAmount").value = t.amount;
    document.getElementById("txModalDate").value = t.date;
    document.getElementById("txModalCategory").value = t.category;

    dashboard.style.display = "none";
    txModal.style.display = "block";

}


// ==== DELETE KE LIYE CODE ===

function deleteTransaction(index) {

    transactions.splice(index, 1);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    renderAll();

}


// === SUMMARY CARDS KE LIYE CODE ===

function updateCards() {

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }

    });

    let balance = income - expense;

    cardValues[0].innerText = `$${balance}`;
    cardValues[1].innerText = `$${income}`;
    cardValues[2].innerText = `$${expense}`;
    cardValues[3].innerText = transactions.length;

}


// === CHART KE LIYE CODE ====

function initChart() {

    let ctx = document.getElementById("cashFlowChart");

    chart = new Chart(ctx, {

        type: "bar",

        data: {
            labels: ["Cash Flow"],

            datasets: [
                {
                    label: "Income",
                    data: [],
                    backgroundColor: "green"
                },
                {
                    label: "Expense",
                    data: [],
                    backgroundColor: "red"
                }
            ]
        }

    });

}function updateChart() {

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {

        if (t.type === "income")
            income += t.amount;
        else
            expense += t.amount;

    });

    chart.data.datasets[0].data = [income]; // Green
    chart.data.datasets[1].data = [expense]; // Red

    chart.update();
}

// == DARK MODE KE LIYE CODE ==

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");
    darkToggle.checked = true;

}

darkToggle.addEventListener("change", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

});


// === RESET DATA KE LIYE CODE ====

resetBtn.addEventListener("click", () => {

    if (confirm("Reset all data?")) {

        transactions = [];

        localStorage.removeItem("transactions");

        renderAll();

    }

});


// === SEARCH KE LIYE CODE ===

searchInput.addEventListener("input", filterData);
typeFilter.addEventListener("change", filterData);

function filterData() {

    let search = searchInput.value.toLowerCase();
    let type = typeFilter.value;

    let filtered = transactions.filter(t => {

        let matchSearch =
            t.description.toLowerCase().includes(search);

        let matchType =
            type === "all" || t.type === type;

        return matchSearch && matchType;
    });

    renderTransactions(filtered);
}




function renderAll() {

    renderTransactions();
    updateCards();
    updateChart();

}


// === AUTO LOGIN KE LIYE CODE ===

window.addEventListener("DOMContentLoaded", () => {

    initChart();

    let currentUser =
        localStorage.getItem("currentUser");

    if (currentUser) {

        loginCard.style.display = "none";
        dashboard.style.display = "grid";

        userName.textContent = currentUser;

        renderAll();

    }

});