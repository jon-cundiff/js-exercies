const btnAll = document.getElementById("btnAll");
const btnStarters = document.getElementById("btnStarters");
const btnEntrees = document.getElementById("btnEntrees");
const btnDesserts = document.getElementById("btnDesserts");
const dishesContainer = document.getElementById("dishesContainer");

const buttons = [btnAll, btnStarters, btnEntrees, btnDesserts];

function constructDishesHTML(filterCourse) {
    let dishesList = dishes;

    if (filterCourse) {
        dishesList = dishes.filter(function (dish) {
            return dish.course === filterCourse;
        });
    }

    const dishItems = dishesList.map(function (dish) {
        return `<div class="dish">
            <div class="img-container">
                <img src="${dish.imageURL}" />
            </div>
            <div class="dish-text">
                <label>${dish.title}</label>
                <i>${dish.description}</i>
                <strong>$${dish.price}</strong>
            </div>
        </div>`;
    });

    dishesContainer.innerHTML = dishItems.join("");
}

// Loop through each button to add event listener, only difference between
// each button is the course to filter by. Obtained from "data-filter"
// attribute in index.html
buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        // read from html attribute "data-filter"
        const filterText = this.dataset.filter;
        constructDishesHTML(filterText);

        buttons.forEach(function (button) {
            if (btn !== button) {
                button.classList.remove("active");
            }
        });

        btn.classList.add("active");
    });
});

constructDishesHTML();
