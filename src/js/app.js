////////////////////////////
//        BUDGET CONTROLLER
////////////////////////////
let budgetController = ( function() {

    // Start the ES5 function constructor
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Start the ES5 function constructor
    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            let newItem, ID;

            if (data.allItems[type].length > 0) {
                // The id of the new item is the last id + 1.
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create a new item according to the type
            if (type === "exp") {
                newItem = new Expense(ID, des, val)
            } else if (type === "inc") {
                newItem = new Income(ID, des, val)
            }

            // Add to the allItems object, to the specific exp or inc array
            data.allItems[type].push(newItem);
            return newItem // Give access to the newly created item to the other modules
        },
        testing: function () {
            console.log("aaaa");
        }
    }



})();


////////////////////////////
//      UI CONTROLLER
////////////////////////////
const UIController = (() => {

    const DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    };

    return {
        getInput: () => {
            return { //return a variable with an object that contains the input properties
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;

            // Create the HTML string with the placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            } else if (type === "exp"){
                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }

            document.querySelector(element).insertAdjacentHTML("beforeend", html);
        },




        // Send the strings to the other controllers
        getDOMstrings: () => {
            return DOMstrings;
        }
    }

})();


////////////////////////////
//   GLOBAL APP CONTROLLER
////////////////////////////
const controller = ((budgetCtrl, UICtrl) => {

    var setupEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", (event) => {
            // With graceful degradation to meet the ECMA specification and to have good browser support
            let key = event.key || event.keyCode || event.which;
            if (key === "Enter" || key === 13) {
                ctrlAddItem();
            }
        })
    };

    const ctrlAddItem = () => {
        let input, newItem;
        // Get the input data
        input = UICtrl.getInput();

        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        UICtrl.addListItem(newItem, input.type);
    };

        return {
            init: function () {
                setupEventListeners();
            }
        }

})(budgetController, UIController);

controller.init();