// Collapsible sections
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const section = header.parentElement;
        section.classList.toggle('active');
        
        // Add animation class
        const content = section.querySelector('.collapsible-content');
        content.classList.add('slide-in');
    });
});

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function updateTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeToggle.setAttribute('aria-label', 
        isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
}

// Initialize theme based on system preference
updateTheme(prefersDark.matches);

// Listen for system theme changes
prefersDark.addEventListener('change', (e) => updateTheme(e.matches));

// Handle manual toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    updateTheme(isDark);
});
