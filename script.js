// Variables
let screenDisplay = [];

// QuerySelectors
const screen = document.querySelector('#screen');
const buttons = document.querySelectorAll('.digit');

const add = (a, b) => a + b;

const substract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => {
    if(b === 0) {
        throw 'Division by zero'
    } else {
        return a / b;
    }
}

const operate = (operator, a, b) => {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return substract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            throw 'Invalid operator';
    }
}

const digitToScreen = function() {
    // This calculator doesn't like big numbers
    if (screenDisplay.length > 11) return;

    // Check for multiple zeroes and decimals
    if (screenDisplay[0] === '0' && this.textContent === '0') return;
    if (screenDisplay.includes(',') && this.textContent === ',') return;

    // If we already have zero, start with an empty array
    if (screenDisplay[0] === '0') screenDisplay = [];

    screenDisplay.push(this.textContent);
    screen.textContent = screenDisplay.join('');
}


buttons.forEach(button => button.addEventListener('click', digitToScreen));

