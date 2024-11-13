import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const loading = document.getElementById('loading');

let currentInput = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button.textContent));
});

async function handleButtonClick(value) {
    if (value >= '0' && value <= '9' || value === '.') {
        currentInput += value;
        updateDisplay();
    } else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '') {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
                currentInput = '';
                operator = value;
            } else {
                await performCalculation();
                operator = value;
            }
        }
    } else if (value === '=') {
        if (currentInput !== '' && firstOperand !== null) {
            await performCalculation();
            operator = '';
        }
    } else if (value === 'Clear') {
        clear();
    }
}

async function performCalculation() {
    if (firstOperand === null || operator === '' || currentInput === '') return;

    const secondOperand = parseFloat(currentInput);
    let result;

    loading.classList.remove('hidden');

    try {
        switch (operator) {
            case '+':
                result = await backend.add(firstOperand, secondOperand);
                break;
            case '-':
                result = await backend.subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = await backend.multiply(firstOperand, secondOperand);
                break;
            case '/':
                if (secondOperand === 0) {
                    throw new Error('Division by zero');
                }
                result = await backend.divide(firstOperand, secondOperand);
                break;
        }

        currentInput = result.toString();
        firstOperand = null;
        updateDisplay();
    } catch (error) {
        console.error('Calculation error:', error);
        currentInput = 'Error';
        updateDisplay();
    } finally {
        loading.classList.add('hidden');
    }
}

function updateDisplay() {
    display.value = currentInput;
}

function clear() {
    currentInput = '';
    operator = '';
    firstOperand = null;
    updateDisplay();
}
