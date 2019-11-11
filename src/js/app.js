////////////////////////////
//        BUDGET CONTROLLER
////////////////////////////
let budgetController = (function () {


})();


////////////////////////////
//      UI CONTROLLER
////////////////////////////
const UIController = (function () {

    const DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };

    return {
        getInput: function () {
            return { //return a variable with an object that contains the input properties
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value,
            };
        },
        // Send the strings to the other controllers
        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();


////////////////////////////
//   GLOBAL APP CONTROLLER
////////////////////////////
const controller = (function (budgetCtrl, UICtrl) {

    const DOM = UICtrl.getDOMstrings();

    const ctrlAddItem = function() {
        var input = UICtrl.getInput();
        console.log(input);
    };

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", (event) => {
        // With graceful dergadation to meet the ECMA specification and to have good browser support
        let key = event.key || event.keyCode || event.which;
        if (key === "Enter" || key === 13) {
            ctrlAddItem();
        }
    })

})(budgetController, UIController);