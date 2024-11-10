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
    
    function addLoadingBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 2. Enhanced Table Interactivity
    function enhanceResultsTable() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (!table) return;

            // Add sort functionality
            table.querySelectorAll('th').forEach((th, index) => {
                th.addEventListener('click', () => sortTable(table, index));
            });

            // Add row highlighting
            table.querySelectorAll('tr').forEach(tr => {
                tr.addEventListener('mouseenter', () => {
                    tr.style.backgroundColor = 'var(--highlight-background)';
                });
                tr.addEventListener('mouseleave', () => {
                    tr.style.backgroundColor = '';
                });
            });
        });
    }

    function sortTable(table, column) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isTimeColumn = table.querySelectorAll('th')[column]?.textContent.toLowerCase().includes('time');

        const sortedRows = rows.sort((a, b) => {
            const aCol = a.querySelectorAll('td')[column]?.textContent || '';
            const bCol = b.querySelectorAll('td')[column]?.textContent || '';

            if (isTimeColumn) {
                // Special handling for time values
                return parseFloat(aCol.replace(':', '')) - parseFloat(bCol.replace(':', ''));
            }

            // Handle numeric values
            if (!isNaN(aCol) && !isNaN(bCol)) {
                return parseFloat(aCol) - parseFloat(bCol);
            }

            // Default string comparison
            return aCol.localeCompare(bCol);
        });

        // Clear and re-append sorted rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        sortedRows.forEach(row => tbody.appendChild(row));
    }

    // 3. Floating Stats Bar
    function addFloatingStatsBar() {
        const statsBar = document.createElement('div');
        statsBar.className = 'floating-stats';

        // Get stats from your results table
        const stats = getTableStats();
        statsBar.innerHTML = `
            <div>🏃 Fastest Time: ${stats.fastest}</div>
            <div>👥 Total Runners: ${stats.totalRunners}</div>
            <div>🏆 Teams: ${stats.totalTeams}</div>
        `;

        document.body.appendChild(statsBar);

        // Show stats bar on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 200 && currentScroll > lastScroll) {
                statsBar.classList.add('visible');
            } else {
                statsBar.classList.remove('visible');
            }
            lastScroll = currentScroll;
        });
    }

    function getTableStats() {
        let stats = {
            fastest: 'N/A',
            totalRunners: 0,
            totalTeams: 0
        };
    
        // Find tables within .table-scroll-container
        const tables = document.querySelectorAll('.table-scroll-container table');
        
        // First table should be team scores
        const teamScoresTable = tables[0];
        if (teamScoresTable) {
            // Get team count from team scores table
            const teamRows = teamScoresTable.querySelectorAll('tbody tr');
            // Only count rows that have valid team names (not empty rows)
            stats.totalTeams = Array.from(teamRows)
                .filter(row => row.querySelector('td:nth-child(2)'))
                .length;
        }
    
        // Second table should be results
        const resultsTable = tables[1];
        if (resultsTable) {
            const rows = resultsTable.querySelectorAll('tbody tr');
            stats.totalRunners = rows.length;
    
            // Get fastest time from first row
            const firstTimeCell = resultsTable.querySelector('tbody tr td:nth-child(4)');
            if (firstTimeCell) {
                stats.fastest = firstTimeCell.textContent;
            }
        }
    
        return stats;
    }
    // 4. Add Greeting
    function addDynamicGreeting() {
        const header = document.querySelector('.header');
        if (!header) return;

        const hour = new Date().getHours();
        let greeting = "Welcome to Meet Results";
        
        if (hour < 12) greeting = "Good Morning! " + greeting;
        else if (hour < 17) greeting = "Good Afternoon! " + greeting;
        else greeting = "Good Evening! " + greeting;

        const greetingDiv = document.createElement('div');
        greetingDiv.className = 'greeting';
        greetingDiv.innerHTML = `${greeting} 🏃‍♂️`;
        header.insertBefore(greetingDiv, header.firstChild);
    }

    // Initialize all features
    initTheme();
    initCollapsibles();
    initSearch();
    addLoadingBar();
    enhanceResultsTable();
    addFloatingStatsBar();
    addDynamicGreeting();
});
