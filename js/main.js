// Tool categories and their corresponding tools
const toolsData = {
    calculators: [
        { id: 'basic-calculator', name: 'Basic Calculator', icon: 'calculator', file: 'calculators/basic-calculator.js' },
        { id: 'scientific-calculator', name: 'Scientific Calculator', icon: 'square-root-variable', file: 'calculators/scientific-calculator.js' },
        { id: 'bmi-calculator', name: 'BMI Calculator', icon: 'weight-scale', file: 'calculators/bmi-calculator.js' },
        // Add more calculators
    ],
    converters: [
        { id: 'length-converter', name: 'Length Converter', icon: 'ruler', file: 'converters/length-converter.js' },
        { id: 'weight-converter', name: 'Weight Converter', icon: 'scale-balanced', file: 'converters/weight-converter.js' },
        { id: 'temperature-converter', name: 'Temperature Converter', icon: 'temperature-half', file: 'converters/temperature-converter.js' },
        // Add more converters
    ],
    'text-tools': [
        { id: 'text-case-converter', name: 'Text Case Converter', icon: 'font', file: 'text-tools/case-converter.js' },
        { id: 'word-counter', name: 'Word Counter', icon: 'calculator', file: 'text-tools/word-counter.js' },
        { id: 'lorem-generator', name: 'Lorem Ipsum Generator', icon: 'text-width', file: 'text-tools/lorem-generator.js' },
        // Add more text tools
    ],
    // Add more categories
};

// Current active category
let currentCategory = 'calculators';

// DOM Elements
const toolsGrid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchTools');
const categoryLinks = document.querySelectorAll('#toolCategories a');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load initial category
    loadTools(currentCategory);
    
    // Set up category click handlers
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            setActiveCategory(category);
            loadTools(category);
        });
    });
    
    // Set up search functionality
    searchInput.addEventListener('input', debounce(searchTools, 300));
});

// Load tools for a specific category
function loadTools(category) {
    const tools = toolsData[category] || [];
    toolsGrid.innerHTML = tools.map(tool => createToolCard(tool)).join('');
    
    // Add click handlers to tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => loadTool(card.dataset.toolId));
    });
}

// Create HTML for a tool card
function createToolCard(tool) {
    return `
        <div class="col-md-4 col-sm-6">
            <div class="card tool-card h-100" data-tool-id="${tool.id}">
                <div class="card-body text-center">
                    <i class="fas fa-${tool.icon} tool-icon"></i>
                    <h5 class="card-title">${tool.name}</h5>
                    <button class="btn btn-primary mt-2">Open Tool</button>
                </div>
            </div>
        </div>
    `;
}

// Load a specific tool
async function loadTool(toolId) {
    // Find the tool data
    let tool;
    for (const category in toolsData) {
        tool = toolsData[category].find(t => t.id === toolId);
        if (tool) break;
    }
    
    if (!tool) return;
    
    try {
        // Load the tool's JavaScript file
        const module = await import(`../tools/${tool.file}`);
        
        // Clear the tools grid and show the tool interface
        toolsGrid.innerHTML = `
            <div class="col-12">
                <div class="tool-content">
                    <h2>${tool.name}</h2>
                    <div id="tool-container"></div>
                </div>
            </div>
        `;
        
        // Initialize the tool
        module.default(document.getElementById('tool-container'));
    } catch (error) {
        console.error('Error loading tool:', error);
        toolsGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Error loading tool. Please try again later.
                </div>
            </div>
        `;
    }
}

// Set active category in the sidebar
function setActiveCategory(category) {
    categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
            link.classList.add('active');
        }
    });
    currentCategory = category;
}

// Search tools across all categories
function searchTools() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
        loadTools(currentCategory);
        return;
    }
    
    const matchingTools = [];
    for (const category in toolsData) {
        const tools = toolsData[category];
        const matches = tools.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm)
        );
        matchingTools.push(...matches);
    }
    
    toolsGrid.innerHTML = matchingTools.map(tool => createToolCard(tool)).join('');
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 