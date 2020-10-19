// Variables
let screenDisplay = ['0'];
let firstNumber = null;
let secondNumber = null;
let operator = null;
let acceptDigit = true;

// QuerySelectors
const screen = document.querySelector('#screen');
const buttons = document.querySelectorAll('.button');

// Operations
const add = (a, b) => a + b;
const substract = (a, b) => Number((a - b).toFixed(16));
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if(b === 0) {
        throw 'Div. by zero'
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

//Functionality
const handleUserInput = (input) => {
    if (input.class === 'function') {
        if (input.key === 'AC') clear();
        if (input.key === 'Backspace') deleteDigit();
        if (input.key === 'posneg') changePosNeg();
        if (input.key === 'Enter') equals();
    } else if (input.class === 'digit'){
        digitToScreen(input.key);
    } else if (input.class === 'operator') {
        operatorInput(input.key);
    }
}

const clear = () => {
    screenBlink();
    screen.textContent = '0';
    screenDisplay = ['0'];
    firstNumber = null;
    secondNumber = null;
    operator = null;
    acceptDigit = true;
};

const deleteDigit = () => {
    if (!acceptDigit) {
        clear();
        return;
    }

    if (firstNumber && screenDisplay[0] === '0' && screenDisplay.length === 1) return;

    if (screenDisplay.length === 1) {
        screenDisplay[0] = '0';
        screen.textContent = screenDisplay.join('');
        return;
    };

    if (!firstNumber || !secondNumber) {
        screenDisplay.pop();
        screen.textContent = screenDisplay.join('');
    };
};

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
};

const equals = () => {
    screenBlink();
    if (!firstNumber && !secondNumber) return;
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
                result = result.toExponential(6);
            }
            firstNumber = result;
            screen.textContent = `${result}`;
            // We don't want to accept digits after an equals, if we don't know what to do
            acceptDigit = false;
        }               
    } 
}

const digitToScreen = (digit) => {
    // This calculator doesn't want bigger numbers
    if (screenDisplay.length > 11) return;
    if (!acceptDigit) {
        screenBlink();
        return;
    }

    // Check for multiple zeroes and decimals, if we are waiting for a second number we need to add a zero to screen
    if (screenDisplay[0] === '0' && digit === '0' && !firstNumber) return;
    if (screenDisplay.includes(',') && digit === ',') return;

    // If we already have zero and are not constructing a decimal number, start with an empty array
    if (screenDisplay[0] === '0' && !screenDisplay.includes(',') && digit != ',') screenDisplay = [];

    // Add digit to array and put new number on display
    screenDisplay.push(digit);
    screen.textContent = screenDisplay.join('');
}

const operatorInput = (operatorInput) => {
    screenBlink();
    //This shit needs refactoring
    acceptDigit = true;
    //We want to be able to do opertions after equal, that is why we need to do this:
    if ((firstNumber || firstNumber === 0) && secondNumber) {
        secondNumber = null;
        screenDisplay = ['0'];
        operator = operatorInput;
        return;
    }

    // We have a firstNumber stored and we want to take the number from screen and operate
    if (firstNumber || firstNumber === 0) {
        secondNumber = screenDisplayToFloat();
        const result = operate(operator, firstNumber, secondNumber); 
        firstNumber = result;
        secondNumber = null;
        // We set the operator again, it might have changed
        operator = operatorInput;
        screen.textContent = `${result}`;
        // Do this to allow input if we want to
        screenDisplay = ['0'];
        console.log(result);
    } else {
        // If we dont have a firstNumber stored we do this
        operator = operatorInput;
        // Take the screen number, handle the nordic decimal and turn it into a real number
        firstNumber = screenDisplayToFloat();
        // To be able to input new numbers we set screendsipaly to zero
        screenDisplay = ['0'];
    }
}

//Helper functions
const screenBlink = () => {
    screen.classList.add('blink');
    setTimeout(() => screen.classList.remove('blink'), 80);
};

const screenDisplayToFloat = () => parseFloat(screenDisplay.join('').replace(',', '.'));

const createInputObject = function(element) {
    let input = {
        class: '',
        key: element.getAttribute("data-key"),
    };

    const classes = element.getAttribute("class");

    classes.includes('digit') ? input.class = 'digit' 
    : classes.includes('operator') ? input.class = 'operator'
    : classes.includes('function') ? input.class = 'function'
    : input.class = null;

    return input;
}

const handleKeyboardButton = function(e) {
    let key = e.key;
    if (key === '.') key = ',';
    const button = document.querySelector(`.button[data-key="${key}"]`)
    return button;
}

// Event listeners
buttons.forEach(button => button.addEventListener('click', function() {
    const input = createInputObject(this);
    handleUserInput(input);
    }));


window.addEventListener('keydown', (e) => {
    let button = handleKeyboardButton(e);
    if (!button) return;
    button.classList.add("active");

    const input = createInputObject(button);
    handleUserInput(input);
});

window.addEventListener('keyup', (e) => {
    let button = handleKeyboardButton(e);
    if (!button) return;

    button.classList.remove("active");
});