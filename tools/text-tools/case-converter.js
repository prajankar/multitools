export default function initializeTextCaseConverter(container) {
    // Create text case converter HTML
    container.innerHTML = `
        <div class="text-case-converter">
            <div class="form-group mb-3">
                <label for="inputText" class="form-label">Input Text</label>
                <textarea class="form-control" id="inputText" rows="5" placeholder="Enter your text here..."></textarea>
            </div>
            
            <div class="btn-group mb-3 d-flex flex-wrap">
                <button class="btn btn-primary" data-case="upper">UPPERCASE</button>
                <button class="btn btn-primary" data-case="lower">lowercase</button>
                <button class="btn btn-primary" data-case="title">Title Case</button>
                <button class="btn btn-primary" data-case="sentence">Sentence case</button>
                <button class="btn btn-primary" data-case="camel">camelCase</button>
                <button class="btn btn-primary" data-case="pascal">PascalCase</button>
                <button class="btn btn-primary" data-case="snake">snake_case</button>
                <button class="btn btn-primary" data-case="kebab">kebab-case</button>
            </div>

            <div class="form-group mb-3">
                <label for="outputText" class="form-label">Output Text</label>
                <textarea class="form-control" id="outputText" rows="5" readonly></textarea>
            </div>

            <div class="d-flex justify-content-end">
                <button class="btn btn-success" id="copyButton">
                    <i class="fas fa-copy me-2"></i>Copy to Clipboard
                </button>
            </div>
        </div>
    `;

    const inputText = container.querySelector('#inputText');
    const outputText = container.querySelector('#outputText');
    const copyButton = container.querySelector('#copyButton');

    // Case conversion functions
    const caseConverters = {
        upper: (text) => text.toUpperCase(),
        lower: (text) => text.toLowerCase(),
        title: (text) => text.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()),
        sentence: (text) => text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase()),
        camel: (text) => text.toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
        pascal: (text) => text.toLowerCase()
            .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase()),
        snake: (text) => text.toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, ''),
        kebab: (text) => text.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-]/g, '')
    };

    // Add event listeners for case conversion buttons
    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button || !button.dataset.case) return;

        const caseType = button.dataset.case;
        const converter = caseConverters[caseType];
        if (converter) {
            outputText.value = converter(inputText.value);
        }
    });

    // Add copy to clipboard functionality
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputText.value);
            copyButton.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy me-2"></i>Copy to Clipboard';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    });

    // Real-time conversion as user types
    inputText.addEventListener('input', () => {
        const activeCase = container.querySelector('button.active')?.dataset.case;
        if (activeCase && caseConverters[activeCase]) {
            outputText.value = caseConverters[activeCase](inputText.value);
        }
    });

    // Toggle active state of buttons
    container.querySelectorAll('[data-case]').forEach(button => {
        button.addEventListener('click', () => {
            container.querySelectorAll('[data-case]').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
} 