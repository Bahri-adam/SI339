// Search functionality
const searchInput = document.getElementById('search');
const meetCards = document.querySelectorAll('.meet-card');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        meetCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const date = card.querySelector('.meet-date').textContent.toLowerCase();
            const details = card.querySelector('.meet-details')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || date.includes(searchTerm) || details.includes(searchTerm)) {
                card.style.display = '';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });
    });
}

// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

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
