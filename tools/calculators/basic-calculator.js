export default function initializeBasicCalculator(container) {
    // Create calculator HTML
    container.innerHTML = `
        <div class="calculator">
            <div class="form-group mb-3">
                <input type="text" class="form-control form-control-lg text-end" id="display" readonly>
            </div>
            <div class="calculator-grid">
                <div class="row g-2 mb-2">
                    <div class="col-3"><button class="btn btn-light w-100" data-type="clear">C</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">(</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">)</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">÷</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">7</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">8</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">9</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">×</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">4</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">5</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">6</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">-</button></div>
                </div>
                <div class="row g-2 mb-2">
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">1</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">2</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">3</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="operator">+</button></div>
                </div>
                <div class="row g-2">
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">0</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="number">.</button></div>
                    <div class="col-3"><button class="btn btn-light w-100" data-type="backspace">⌫</button></div>
                    <div class="col-3"><button class="btn btn-primary w-100" data-type="equals">=</button></div>
                </div>
            </div>
        </div>
    `;

    // Calculator state
    let displayValue = '';
    const display = container.querySelector('#display');

    // Add event listeners
    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const type = button.dataset.type;
        const value = button.textContent;

        switch (type) {
            case 'number':
                displayValue += value;
                break;
            case 'operator':
                displayValue += value;
                break;
            case 'equals':
                try {
                    // Replace × and ÷ with * and / for evaluation
                    const expression = displayValue.replace(/×/g, '*').replace(/÷/g, '/');
                    displayValue = String(eval(expression));
                } catch (error) {
                    displayValue = 'Error';
                }
                break;
            case 'clear':
                displayValue = '';
                break;
            case 'backspace':
                displayValue = displayValue.slice(0, -1);
                break;
        }

        display.value = displayValue;
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (container.contains(document.activeElement)) {
            if (/[\d\+\-\*\/\(\)\.]/.test(key)) {
                displayValue += key;
                display.value = displayValue;
            } else if (key === 'Enter') {
                try {
                    displayValue = String(eval(displayValue));
                    display.value = displayValue;
                } catch (error) {
                    displayValue = 'Error';
                    display.value = displayValue;
                }
            } else if (key === 'Backspace') {
                displayValue = displayValue.slice(0, -1);
                display.value = displayValue;
            } else if (key === 'Escape') {
                displayValue = '';
                display.value = displayValue;
            }
        }
    });
} 