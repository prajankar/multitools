export default function initializeScientificCalculator(container) {
    // Create scientific calculator HTML
    container.innerHTML = `
        <div class="scientific-calculator">
            <div class="form-group mb-3">
                <input type="text" class="form-control form-control-lg text-end" id="display" readonly>
                <small class="text-muted" id="expression"></small>
            </div>
            <div class="calculator-grid">
                <div class="row g-2 mb-2">
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">sin</button></div>
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">cos</button></div>
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">tan</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">^</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="constant">π</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="constant">e</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">asin</button></div>
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">acos</button></div>
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">atan</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="function">√</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">(</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">)</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">log</button></div>
                    <div class="col-2"><button class="btn btn-secondary w-100" data-type="function">ln</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="clear">C</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="backspace">⌫</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">÷</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">×</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">7</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">8</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">9</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">-</button></div>
                    <div class="col-4"><button class="btn btn-primary w-100" data-type="equals">=</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">4</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">5</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="number">6</button></div>
                    <div class="col-2"><button class="btn btn-light w-100" data-type="operator">+</button></div>
                    <div class="col-4 h-100" rowspan="2"></div>
                </div>
                <div class="row g-2">
                    <div class="col-6">
                        <div class="row g-2">
                            <div class="col-4"><button class="btn btn-light w-100" data-type="number">1</button></div>
                            <div class="col-4"><button class="btn btn-light w-100" data-type="number">2</button></div>
                            <div class="col-4"><button class="btn btn-light w-100" data-type="number">3</button></div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="row g-2">
                            <div class="col-4"><button class="btn btn-light w-100" data-type="number">0</button></div>
                            <div class="col-4"><button class="btn btn-light w-100" data-type="number">.</button></div>
                            <div class="col-4"><button class="btn btn-light w-100" data-type="operator">±</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Calculator state
    let displayValue = '';
    let expressionValue = '';
    const display = container.querySelector('#display');
    const expression = container.querySelector('#expression');

    // Mathematical constants
    const constants = {
        'π': Math.PI,
        'e': Math.E
    };

    // Mathematical functions
    const functions = {
        'sin': Math.sin,
        'cos': Math.cos,
        'tan': Math.tan,
        'asin': Math.asin,
        'acos': Math.acos,
        'atan': Math.atan,
        'log': Math.log10,
        'ln': Math.log,
        '√': Math.sqrt
    };

    // Add event listeners
    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const type = button.dataset.type;
        const value = button.textContent;

        switch (type) {
            case 'number':
                displayValue += value;
                expressionValue += value;
                break;
            case 'operator':
                if (value === '±') {
                    if (displayValue.startsWith('-')) {
                        displayValue = displayValue.slice(1);
                        expressionValue = expressionValue.slice(1);
                    } else {
                        displayValue = '-' + displayValue;
                        expressionValue = '-' + expressionValue;
                    }
                } else {
                    displayValue += value;
                    expressionValue += value === '×' ? '*' : value === '÷' ? '/' : value;
                }
                break;
            case 'function':
                if (value === '√') {
                    displayValue += '√(';
                    expressionValue += 'Math.sqrt(';
                } else {
                    displayValue += value + '(';
                    expressionValue += `Math.${value}(`;
                }
                break;
            case 'constant':
                displayValue += value;
                expressionValue += constants[value];
                break;
            case 'equals':
                try {
                    // Evaluate the expression
                    const result = Function('"use strict";return (' + expressionValue + ')')();
                    displayValue = String(result);
                    expressionValue = String(result);
                } catch (error) {
                    displayValue = 'Error';
                    expressionValue = '';
                }
                break;
            case 'clear':
                displayValue = '';
                expressionValue = '';
                break;
            case 'backspace':
                displayValue = displayValue.slice(0, -1);
                expressionValue = expressionValue.slice(0, -1);
                break;
        }

        display.value = displayValue;
        expression.textContent = expressionValue;
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (container.contains(document.activeElement)) {
            if (/[\d\+\-\*\/\(\)\.]/.test(key)) {
                displayValue += key;
                expressionValue += key;
                display.value = displayValue;
                expression.textContent = expressionValue;
            } else if (key === 'Enter') {
                try {
                    const result = Function('"use strict";return (' + expressionValue + ')')();
                    displayValue = String(result);
                    expressionValue = String(result);
                    display.value = displayValue;
                    expression.textContent = expressionValue;
                } catch (error) {
                    displayValue = 'Error';
                    expressionValue = '';
                    display.value = displayValue;
                    expression.textContent = expressionValue;
                }
            } else if (key === 'Backspace') {
                displayValue = displayValue.slice(0, -1);
                expressionValue = expressionValue.slice(0, -1);
                display.value = displayValue;
                expression.textContent = expressionValue;
            } else if (key === 'Escape') {
                displayValue = '';
                expressionValue = '';
                display.value = displayValue;
                expression.textContent = expressionValue;
            }
        }
    });
} 