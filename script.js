// Variables
let screenDisplay = [];

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
    // This calculator doesn't like big numbers
    if (screenDisplay.length > 11) return;

    // Check for multiple zeroes and decimals
    if (screenDisplay[0] === '0' && digit === '0') return;
    if (screenDisplay.includes(',') && digit === ',') return;

    // If we already have zero, start with an empty array
    if (screenDisplay[0] === '0' && digit != ',') screenDisplay = []; //TODO HANDLE IF FIRST INPUT IS DECIMAL AND IF DECIMAL WHERE FIRST DIGIT IS ZERO

    screenDisplay.push(digit);
    screen.textContent = screenDisplay.join('');
}

const clear = () => {
    screen.textContent = '0';
    screenDisplay = [];
}

buttons.forEach(button => button.addEventListener('click', handleUserInput));

