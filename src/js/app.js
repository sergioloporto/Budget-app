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

    //  Sum all the values contained in the allItems exp/inc arrays
    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach((el) => {
            sum += el.value;
        });
        data.totals[type] = sum;

    };


    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 // it doesn't exist. Zero would be a wrong value
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

        deleteItem: (type, id) => {
            let ids, index;

            ids = data.allItems[type].map(current => {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: () => {

            // And now calculate the total expenses and incomes
            calculateTotal("exp");
            calculateTotal("inc");

            // Calculate the budget, which is  income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculation of the percentage of the income spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round ((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: () => {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }
        },

        testing: function() {
            console.log(data);
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
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
    };

    return {
        getInput: () => {
            return { //return a variable with an object that contains the input properties
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;

            // Create the HTML string with the placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-${obj.id}">
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
                html = `<div class="item clearfix" id="exp-${obj.id}">
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

        deleteListItem: selectorID => {
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        // Clear all the input fields after adding an exp of inc
        clearFields: () => {
            let fields, fieldsArr;

            fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)
            // Convert the node list to an array to later run a forEach. Slice is stored in the prototype
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach((el) => {
                el.value = "";
            });
            fieldsArr[0].focus(); // Afer adding, make focus to the description
        },

        displayBudget: (obj) => {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "--";
            }
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
        });

        // Event delegation to delete each item. Given to the parent instead than to each element
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };


    const updateBudget = () => {
        // Calculate the budget
        budgetCtrl.calculateBudget();

        // Return the budget
        const budget = budgetCtrl.getBudget();

        // Show the budget in the top part of the page
        UICtrl.displayBudget(budget);
    };

    const updatePercentages = () => {

    };


    const ctrlAddItem = () => {
        let input, newItem;
        // Get the input data
        input = UICtrl.getInput();

        // The button should work only if the fields are filled and the value is a num > 0
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Clear all the fields
            UICtrl.clearFields();

            // Calculate and update the budget
            updateBudget();

            // Calculate and update the percentages on each item
            updatePercentages();
        }
    };

    // Event delegation to delete each item
    const ctrlDeleteItem = event => {
      let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            // Calculate and update the percentages on each item
            updatePercentages();
        }
    };

        return {
            init: function () {
                // Start with zero values in the UI
                UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
            });
                setupEventListeners();
            }
        }

})(budgetController, UIController);

controller.init();