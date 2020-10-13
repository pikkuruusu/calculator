// Variables
let screenDisplay = ['0'];
let firstNumber = null;
let secondNumber = null;

let operator = null;

const textToValidOperator = {
    '+': '+',
    '–': '-',
    'x': '*',
    '÷': '/',
}

// QuerySelectors
const screen = document.querySelector('#screen');
const buttons = document.querySelectorAll('.button');

//TODO We have a rounding problem, sometimes it rounds when it isn't supposed to
const add = (a, b) => a + b;

const substract = (a, b) => a - b;

const multiply = (a, b) => a * b;

const divide = (a, b) => {
    if(b === 0) {
        throw 'Div. by zero' //TODO We need to catch this somehow
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
            try {
                return divide(a, b);
            } catch (error) {
                return error;
            };
            
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
    } else if (e.target.id === 'equals') {
        equals();
    } else if (e.target.id === 'posneg') {
        changePosNeg();
    }
}

const equals = () => {
    screenBlink();
    if ((firstNumber || firstNumber === 0) && operator) {
        // If we don't have second number stored, take it from screenDisplay
        if (!secondNumber) {
            secondNumber = screenDisplayToFloat();
        }
        
        let result = operate(operator, firstNumber, secondNumber);

        // Need to handle if number isn't returned, case div by zero
        if (Number.isNaN(result)) {
            screen.textContent = `${result}`;
            screenDisplay = ['0'];
            firstNumber = null;
            secondNumber = null;
            operator = null;
        } else {
            // Need to handle long numbers
            if ((result + '').replace('.', '').length >= 12) {
                result = result.toExponential(4);
            }
            firstNumber = result;
            screen.textContent = `${result}`;
        }               
    } 
}

const operatorInput = (operatorInput) => {
    screenBlink();

    //We want to be able to do opertions after equal, that is why we need to do this:
    if (firstNumber && secondNumber) {
        secondNumber = null;
        screenDisplay = ['0'];
        operator = textToValidOperator[operatorInput];
        return;
    }

    // We have a firstNumber stored and we want to take the number from screen and operate
    if (firstNumber || firstNumber === 0) {
        secondNumber = screenDisplayToFloat();
        const result = operate(operator, firstNumber, secondNumber); 
        firstNumber = result;
        secondNumber = null;
        // We set the operator again, it might have changed
        operator = textToValidOperator[operatorInput];
        screen.textContent = `${result}`;
        // Do this to allow input if we want to
        screenDisplay = ['0'];
        console.log(result);
    } else {
        // If we dont have a firstNumber stored we do this
        operator = textToValidOperator[operatorInput];
        // Take the screen number, handle the nordic decimal and turn it into a real number
        firstNumber = screenDisplayToFloat();
        // To be able to input new numbers we set screendsipaly to zero
        screenDisplay = ['0'];
    }

}

const digitToScreen = (digit) => {
    // This calculator doesn't want bigger numbers
    if (screenDisplay.length > 11) return;

    //TODO we need to handle too long decimals somehow, maybe somehow with exponentials.

    // Check for multiple zeroes and decimals, if we are waiting for a second number we need to add a zero to screen
    if (screenDisplay[0] === '0' && digit === '0' && !firstNumber) return;
    if (screenDisplay.includes(',') && digit === ',') return;

    // If we already have zero and are not constructing a decimal number, start with an empty array
    if (screenDisplay[0] === '0' && !screenDisplay.includes(',') && digit != ',') screenDisplay = [];

    // Add digit to array and put new number on display
    screenDisplay.push(digit);
    screen.textContent = screenDisplay.join('');
}

const screenDisplayToFloat = () => parseFloat(screenDisplay.join('').replace(',', '.'));

const clear = () => {
    screenBlink();
    screen.textContent = '0';
    screenDisplay = ['0'];
    firstNumber = null;
    secondNumber = null;
    operator = null;
}

const changePosNeg = () => {
    screenDisplay = screen.textContent.split('');

    if (screenDisplay[0] === '0' && screenDisplay.length === 1) return;

    if (screenDisplay[0] === '-') {
        screenDisplay.shift();
    } else {
        screenDisplay.unshift('-');
    }
    screen.textContent = screenDisplay.join('');

    // We want to be able to also change results and operate on them, this allows it
    if (secondNumber) {
        firstNumber = screenDisplayToFloat();
    }  
}

//TODO add a backspace functionality, to erase wrong numbers

const screenBlink = () => {
    screen.classList.add('blink');
    setTimeout(() => screen.classList.remove('blink'), 80)
}

buttons.forEach(button => button.addEventListener('click', handleUserInput));