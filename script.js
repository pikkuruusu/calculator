// Variables
let screenDisplay = ['0'];

// QuerySelectors
const screen = document.querySelector('#screen');
const buttons = document.querySelectorAll('.button');

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

const handleUserInput = (e) => {
    let userInput = e.target.textContent;
    if (userInput === 'AC') {
        clear();
    } else {
        digitToScreen(userInput);
    }
    
}

const digitToScreen = (digit) => {
    // This calculator doesn't want bigger numbers
    if (screenDisplay.length > 11) return;

    // Check for multiple zeroes and decimals
    if (screenDisplay[0] === '0' && digit === '0') return;
    if (screenDisplay.includes(',') && digit === ',') return;

    // If we already have zero and are not constructing a decimal number, start with an empty array
    if (screenDisplay[0] === '0' && !screenDisplay.includes(',') && digit != ',') screenDisplay = [];

    // Add digit to array and put new number on display
    screenDisplay.push(digit);
    screen.textContent = screenDisplay.join('');
}

const clear = () => {
    screen.textContent = '0';
    screenDisplay = ['0'];
}

buttons.forEach(button => button.addEventListener('click', handleUserInput));

