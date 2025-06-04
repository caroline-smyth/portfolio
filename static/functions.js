// Color scheme configuration
const colorSchemes = [
    {
        name: 'default',
        nextBgColor: '#f0f4f8' // Background color of the next scheme
    },
    {
        name: 'scheme2',
        nextBgColor: '#1a202c'
    },
    {
        name: 'scheme3',
        nextBgColor: '#ffffff'
    }
];

// Get the saved scheme index from localStorage or default to 0
let currentSchemeIndex = parseInt(localStorage.getItem('colorSchemeIndex')) || 0;

// Function to update the color scheme
function updateColorScheme() {
    const root = document.documentElement;
    const currentScheme = colorSchemes[currentSchemeIndex];
    
    // Remove all theme classes
    root.removeAttribute('data-theme');
    
    // Add the new theme class if it's not the default
    if (currentScheme.name !== 'default') {
        root.setAttribute('data-theme', currentScheme.name);
    }
    
    // Update the toggle button's background color to show the next scheme
    const nextIndex = (currentSchemeIndex + 1) % colorSchemes.length;
    const toggleButton = document.getElementById('colorSchemeToggle');
    if (toggleButton) {
        toggleButton.style.backgroundColor = colorSchemes[nextIndex].nextBgColor;
    }
}

// Function to initialize the color scheme toggle (only on pages that have it)
function initializeColorSchemeToggle() {
    const toggleButton = document.getElementById('colorSchemeToggle');
    if (toggleButton) {
        // Set initial button color
        const nextIndex = (currentSchemeIndex + 1) % colorSchemes.length;
        toggleButton.style.backgroundColor = colorSchemes[nextIndex].nextBgColor;
        
        // Add click event listener
        toggleButton.addEventListener('click', () => {
            currentSchemeIndex = (currentSchemeIndex + 1) % colorSchemes.length;
            // Save the new index to localStorage
            localStorage.setItem('colorSchemeIndex', currentSchemeIndex);
            updateColorScheme();
        });
    }
}

// Initialize the color scheme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply the saved color scheme immediately
    updateColorScheme();
    // Initialize the toggle button if it exists
    initializeColorSchemeToggle();
}); 