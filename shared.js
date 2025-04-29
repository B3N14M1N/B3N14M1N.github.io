// Common script functionality used across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-bs-theme', savedTheme);
        updateThemeUI(savedTheme);
    } else {
        // Use device preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDarkMode ? 'dark' : 'light';
        document.body.setAttribute('data-bs-theme', theme);
        updateThemeUI(theme);
    }

    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    // Update UI based on theme
    function updateThemeUI(theme) {
        // Update theme toggle button icon
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
            } else {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
            }
        }
        
        // Update navbar classes
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (theme === 'dark') {
                navbar.classList.add('navbar-dark');
                navbar.classList.remove('navbar-light');
            } else {
                navbar.classList.add('navbar-light');
                navbar.classList.remove('navbar-dark');
            }
        }
    }
    
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Load shared components
    loadSharedComponents();
});

// Function to load shared components like header, footer, etc.
function loadSharedComponents() {
    // Determine if we're in a subdirectory by checking the current path
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/Pages/');
    
    // Set the appropriate path to the footer component
    const footerPath = isInSubfolder ? '../components/footer.html' : 'components/footer.html';
    
    // Load footer
    loadComponent('footer-placeholder', footerPath);
}

// Generic function to load any component
function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    
    // Get the correct path based on current page location
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/Pages/');
    let adjustedPath = componentPath;
    
    // If not adjusting path in componentPath parameter, we can do it here
    // This allows us to use the same function call regardless of page location
    if (!adjustedPath.startsWith('../') && isInSubfolder) {
        adjustedPath = '../' + adjustedPath;
    }
    
    // Fetch the component HTML
    fetch(adjustedPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading component:', error);
            placeholder.innerHTML = '<p>Error loading component. Please try again later.</p>';
        });
}