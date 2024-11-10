document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const initTheme = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    };

    // Enhanced collapsible sections
    const initCollapsibles = () => {
        const collapsibles = document.querySelectorAll('.collapsible');
        
        collapsibles.forEach(collapsible => {
            const header = collapsible.querySelector('.collapsible-header');
            const content = collapsible.querySelector('.collapsible-content');
            
            if (!header || !content) return;

            // Set initial state
            content.style.display = collapsible.classList.contains('active') ? 'block' : 'none';

            header.addEventListener('click', () => {
                const isActive = collapsible.classList.contains('active');
                
                // Close other sections
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

            // Keyboard accessibility
            header.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click();
                }
            });
        });
    };

    // Enhanced search functionality
    const initSearch = () => {
        const searchInput = document.getElementById('search');
        if (!searchInput) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            // Debounce search for better performance
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase();
                const meetCards = document.querySelectorAll('.meet-card');
                
                meetCards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    const isVisible = text.includes(searchTerm);
                    
                    // Toggle visibility with animation
                    if (isVisible) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });
            }, 300);
        });
    };

    // Initialize all features
    initTheme();
    initCollapsibles();
    initSearch();
});
