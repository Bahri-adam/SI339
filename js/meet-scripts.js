// Handle collapsible sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialize collapsible sections
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        const header = collapsible.querySelector('.collapsible-header');
        const content = collapsible.querySelector('.collapsible-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                const isActive = collapsible.classList.contains('active');
                
                // Close all other sections first
                collapsibles.forEach(other => {
                    if (other !== collapsible && other.classList.contains('active')) {
                        other.classList.remove('active');
                        other.querySelector('.collapsible-content').style.display = 'none';
                    }
                });
                
                // Toggle current section
                collapsible.classList.toggle('active');
                content.style.display = isActive ? 'none' : 'block';
            });
        }
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
        
        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const meetCards = document.querySelectorAll('.meet-card');
            
            meetCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
});
