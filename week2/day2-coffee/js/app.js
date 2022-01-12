const searchEmailInput = document.getElementById("searchEmailInput");
const searchButton = document.getElementById("searchButton");
const newOrderButton = document.getElementById("newOrderButton");

const ordersContainer = document.getElementById("ordersContainer");

const newOrderDisplay = document.getElementById("newOrderDisplay");
const newOrderForm = document.getElementById("newOrderForm");
const newOrderCancelButton = document.getElementById("newOrderCancelButton");
const emailInput = document.getElementById("emailInput");
const typeInput = document.getElementById("typeInput");
const sizeOption = document.getElementById("sizeOption");
const priceInput = document.getElementById("priceInput");
const newOrderSubmitButton = document.getElementById("newOrderSubmitButton");

const baseURL = "https://troubled-peaceful-hell.glitch.me/orders";

function resetNewOrder() {
    newOrderDisplay.classList.remove("new-order-active");
    emailInput.value = "";
    typeInput.value = "";
    sizeOption.value = "small";
    priceInput.value = "1.95";
}

function fixPrice(price) {
    try {
        const fixedPrice = parseFloat(price).toFixed(2);
        return `$${fixedPrice}`;
    } catch {
        return "Unknown";
    }
}

function toTitleCase(str) {
    const words = str.split(" ");
    const titleCaseWords = words.map((word) => {
        const letters = word.split("");
        const properCapLetters = letters.map((letter, index) =>
            index > 0 ? letter.toLowerCase() : letter.toUpperCase()
        );
        return properCapLetters.join("");
    });

    return titleCaseWords.join(" ");
}

function executeGetRequest(url, callback) {
    const request = new XMLHttpRequest();
    request.onload = function () {
        const response = JSON.parse(this.responseText);
        callback(response);
    };

    request.open("GET", url);
    request.send();
}

function getAllOrders(callback) {
    executeGetRequest(baseURL, (orders) => {
        callback(orders);
    });
}

function getOrder(emailAddress, callback) {
    let reqURL = `${baseURL}/${emailAddress}`;
    executeGetRequest(reqURL, (order) => {
        callback(order);
    });
}

function createOrder(callback) {
    const reqBody = {
        email: emailInput.value,
        type: typeInput.value,
        size: sizeOption.value,
        price: priceInput.value,
    };

    const request = new XMLHttpRequest();
    request.onload = function () {
        callback();
    };

    request.open("POST", baseURL);
    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(reqBody));
}

function deleteOrder(emailAddress, callback) {
    let reqURL = `${baseURL}/${emailAddress}`;
    const request = new XMLHttpRequest();
    request.onload = function () {
        callback();
    };

    request.open("DELETE", reqURL);
    request.send();
}

function displayOrders(orders) {
    const orderItems = orders.map(
        (order) =>
            `<div class="order">
        <h3>${order.type} (${toTitleCase(order.size)})</h3>
        <p><i>${order.email}</i></p>
        <p><b>${fixPrice(order.price)}</b></p>
        <button
            class="cancel-button"
            onclick="deleteOrder('${order.email}', () => {
                getAllOrders((orders) => {
                    displayOrders(orders);
                });
            })"
        >
            x
        </button>
    </div>`
    );

    if (orderItems.length > 0) {
        ordersContainer.innerHTML = orderItems.join("");
    } else {
        ordersContainer.innerHTML = "No orders found!";
    }
}

newOrderDisplay.addEventListener("click", (event) => {
    if (event.target === newOrderDisplay) {
        resetNewOrder();
    }
});

newOrderCancelButton.addEventListener("click", resetNewOrder);

newOrderButton.addEventListener("click", () => {
    newOrderDisplay.classList.add("new-order-active");
});

searchButton.addEventListener("click", () => {
    const { value: searchTerm } = searchEmailInput;

    if (searchTerm) {
        getOrder(searchTerm, (order) => {
            // displayOrders expects array
            displayOrders([order]);
        });
    } else {
        getAllOrders((orders) => {
            displayOrders(orders);
        });
    }
});

newOrderSubmitButton.addEventListener("click", (event) => {
    if (newOrderForm.checkValidity()) {
        event.preventDefault();
        createOrder(() => {
            resetNewOrder();
            getAllOrders((orders) => {
                displayOrders(orders);
            });
        });
    }
});

getAllOrders((orders) => {
    displayOrders(orders);
});
