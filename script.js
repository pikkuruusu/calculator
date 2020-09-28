// Variables
let screenDisplay = ['0'];
let firstNumber;
let secondNumber;

let operator = {
    activeOperator: false,
    waitingForSecondNumber: false,
    currentOperator: '',
};


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
    // THIS NEEDS REFACTORING
    if (userInput === 'AC') {
        clear();
    } else if (e.target.classList.contains('digit')) {
        digitToScreen(userInput);
    } else if (e.target.classList.contains('operator')) {
        operatorInput(userInput);
    }
    
}

const operatorInput = (operatorInput) => {
    operator.currentOperator = operatorInput;
    operator.waitingForSecondNumber = true;
    // Take the screen number, handle the nordic decimal and turn it into a real number
    firstNumber = parseFloat(screenDisplay.join('').replace(',', '.'));
    console.log(firstNumber);
    //TODO we need to maybe store that we have the first number, maybe?
    // How to handle equals
}

const digitToScreen = (digit) => {
    // TODO We need to handle if we are waiting for second number


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

