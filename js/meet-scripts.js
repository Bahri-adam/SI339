document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme with accessibility
    const initTheme = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Add accessibility attributes
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeToggle.click();
            }
        });

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', `Switch to ${newTheme === 'dark' ? 'light' : 'dark'} mode`);
        });
    };

    // Enhanced accessible collapsible sections
    const initCollapsibles = () => {
        const collapsibles = document.querySelectorAll('.collapsible');
        
        collapsibles.forEach((collapsible, index) => {
            const header = collapsible.querySelector('.collapsible-header');
            const content = collapsible.querySelector('.collapsible-content');
            
            if (!header || !content) return;

            // Add accessibility attributes
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            header.setAttribute('aria-expanded', 'false');
            
            // Generate unique ID for the content section
            const contentId = `collapsible-content-${index}`;
            content.id = contentId;
            header.setAttribute('aria-controls', contentId);

            // Set initial state
            content.style.display = collapsible.classList.contains('active') ? 'block' : 'none';

            const toggleSection = () => {
                const isActive = collapsible.classList.contains('active');
                
                // Close other sections
                collapsibles.forEach(other => {
                    if (other !== collapsible && other.classList.contains('active')) {
                        const otherHeader = other.querySelector('.collapsible-header');
                        const otherContent = other.querySelector('.collapsible-content');
                        other.classList.remove('active');
                        otherContent.style.display = 'none';
                        otherHeader.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current section
                collapsible.classList.toggle('active');
                content.style.display = isActive ? 'none' : 'block';
                header.setAttribute('aria-expanded', !isActive);
            };

            // Add click and keyboard handlers
            header.addEventListener('click', toggleSection);
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleSection();
                }
            });
        });
    };

    // Enhanced search functionality
    const initSearch = () => {
        const searchInput = document.getElementById('search');
        if (!searchInput) return;

        // Add accessibility attributes
        searchInput.setAttribute('aria-label', 'Search meets');
        searchInput.setAttribute('role', 'searchbox');

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            // Debounce search for better performance
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase();
                const meetCards = document.querySelectorAll('.meet-card');
                let visibleCount = 0;
                
                meetCards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    const isVisible = text.includes(searchTerm);
                    
                    if (isVisible) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });

                // Announce results to screen readers
                const resultsAnnouncement = document.getElementById('search-results-count') || 
                    document.createElement('div');
                resultsAnnouncement.id = 'search-results-count';
                resultsAnnouncement.className = 'sr-only';
                resultsAnnouncement.setAttribute('aria-live', 'polite');
                resultsAnnouncement.textContent = `Found ${visibleCount} matching results`;
                
                if (!document.getElementById('search-results-count')) {
                    document.body.appendChild(resultsAnnouncement);
                }
            }, 300);
        });
    };
    
    function addLoadingBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-label', 'Page scroll progress');
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
            progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
        });
    }

    function enhanceResultsTable() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (!table) return;

            // Add sort functionality with keyboard support
            table.querySelectorAll('th').forEach((th, index) => {
                th.setAttribute('role', 'button');
                th.setAttribute('tabindex', '0');
                th.setAttribute('aria-label', `Sort by ${th.textContent}`);
                th.setAttribute('aria-sort', 'none');

                // Add keyboard support
                th.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        sortTable(table, index);
                    }
                });

                th.addEventListener('click', () => sortTable(table, index));
            });

            // Add row highlighting with keyboard focus
            table.querySelectorAll('tbody tr').forEach(tr => {
                tr.setAttribute('tabindex', '0');
                
                tr.addEventListener('focus', () => {
                    tr.style.backgroundColor = 'var(--highlight-background)';
                });
                
                tr.addEventListener('blur', () => {
                    tr.style.backgroundColor = '';
                });
                
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

        const th = table.querySelectorAll('th')[column];
        const currentSort = th.getAttribute('aria-sort');
        const isAscending = currentSort !== 'ascending';

        // Update aria-sort on all headers
        table.querySelectorAll('th').forEach(header => {
            header.setAttribute('aria-sort', 'none');
        });

        // Set new sort direction
        th.setAttribute('aria-sort', isAscending ? 'ascending' : 'descending');

        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isTimeColumn = th.textContent.toLowerCase().includes('time');

        const sortedRows = rows.sort((a, b) => {
            const aCol = a.querySelectorAll('td')[column]?.textContent || '';
            const bCol = b.querySelectorAll('td')[column]?.textContent || '';
            
            if (isTimeColumn) {
                return parseFloat(aCol.replace(':', '')) - parseFloat(bCol.replace(':', ''));
            }

            if (!isNaN(aCol) && !isNaN(bCol)) {
                return parseFloat(aCol) - parseFloat(bCol);
            }

            return aCol.localeCompare(bCol);
        });

        if (!isAscending) {
            sortedRows.reverse();
        }

        // Clear and re-append sorted rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        sortedRows.forEach(row => tbody.appendChild(row));

        // Announce sort to screen readers
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `Table sorted by ${th.textContent} in ${isAscending ? 'ascending' : 'descending'} order`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function addFloatingStatsBar() {
        const statsBar = document.createElement('div');
        statsBar.className = 'floating-stats';
        statsBar.setAttribute('role', 'complementary');
        statsBar.setAttribute('aria-label', 'Meet Statistics');

        const stats = getTableStats();
        statsBar.innerHTML = `
            <div role="text">🏃 Fastest Time: ${stats.fastest}</div>
            <div role="text">👥 Total Runners: ${stats.totalRunners}</div>
            <div role="text">🏆 Teams: ${stats.totalTeams}</div>
        `;

        document.body.appendChild(statsBar);

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 200 && currentScroll > lastScroll) {
                statsBar.classList.add('visible');
                statsBar.setAttribute('aria-hidden', 'false');
            } else {
                statsBar.classList.remove('visible');
                statsBar.setAttribute('aria-hidden', 'true');
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
    
        const teamTable = document.querySelector('.table-scroll-container table');
        if (teamTable) {
            const teamRows = teamTable.querySelectorAll('tbody tr');
            stats.totalTeams = teamRows.length;
        }
    
        const resultsTable = document.querySelectorAll('.table-scroll-container table')[1];
        if (resultsTable) {
            const rows = resultsTable.querySelectorAll('tbody tr');
            stats.totalRunners = rows.length;
    
            const firstTimeCell = resultsTable.querySelector('tbody tr td:nth-child(4)');
            if (firstTimeCell) {
                stats.fastest = firstTimeCell.textContent;
            }
        }
    
        return stats;
    }

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
        greetingDiv.setAttribute('role', 'status');
        greetingDiv.setAttribute('aria-live', 'polite');
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
