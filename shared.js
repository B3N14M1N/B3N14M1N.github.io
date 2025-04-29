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
            toggleTheme();
        });
    }

    // Load shared components
    loadSharedComponents();
    
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Handle footer positioning based on content
    handleFooterPosition();
    
    // Check window resize for footer positioning
    window.addEventListener('resize', function() {
        handleFooterPosition();
    });
});

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
}

// Update UI based on theme
function updateThemeUI(theme) {
    // Update theme toggle button icons
    const themeIcons = document.querySelectorAll('[id="theme-icon"]');
    themeIcons.forEach(icon => {
        if (theme === 'dark') {
            icon.classList.remove('bi-sun-fill');
            icon.classList.add('bi-moon-fill');
        } else {
            icon.classList.remove('bi-moon-fill');
            icon.classList.add('bi-sun-fill');
        }
    });
    
    // Update navbar classes
    const navbars = document.querySelectorAll('.navbar');
    navbars.forEach(navbar => {
        if (theme === 'dark') {
            navbar.classList.add('navbar-dark');
            navbar.classList.remove('navbar-light');
        } else {
            navbar.classList.add('navbar-light');
            navbar.classList.remove('navbar-dark');
        }
    });
}

// Function to load shared components like header, footer, etc.
function loadSharedComponents() {
    // Determine if we're in a subdirectory by checking the current path
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/Pages/');
    
    // Set the appropriate path to the components
    const componentBasePath = isInSubfolder ? '../components/' : 'components/';
    
    // Load navbar
    loadComponent('navbar-placeholder', componentBasePath + 'navbar.html', function() {
        setupNavbar(isInSubfolder);
    });
    
    // Load footer
    loadComponent('footer-placeholder', componentBasePath + 'footer.html');
}

// Set up navbar links and active state based on current page
function setupNavbar(isInSubfolder) {
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // Get navbar elements
    const navbarHomeLink = document.getElementById('navbar-home-link');
    const navHome = document.getElementById('nav-home');
    const navProjects = document.getElementById('nav-projects');
    const navDocumentation = document.getElementById('nav-documentation');
    
    // Set the home link href with explicit navigation
    if (navbarHomeLink) {
        const homeHref = isInSubfolder ? '../index.html' : 'index.html';
        navbarHomeLink.href = homeHref;
        navbarHomeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = homeHref;
        });
    }
    
    // Set the nav links hrefs with explicit navigation
    if (navHome) {
        const homeHref = isInSubfolder ? '../index.html' : 'index.html';
        navHome.href = homeHref;
        navHome.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = homeHref;
        });
    }
    
    if (navProjects) {
        const projectsHref = isInSubfolder ? 'projects.html' : 'Pages/projects.html';
        navProjects.href = projectsHref;
        navProjects.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = projectsHref;
        });
    }
    
    if (navDocumentation) {
        const docHref = isInSubfolder ? 'documentation-selector.html' : 'Pages/documentation-selector.html';
        navDocumentation.href = docHref;
        navDocumentation.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = docHref;
        });
    }
    
    // Set active class based on current page
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        navHome?.classList.add('active');
    } else if (currentPath.includes('projects.html')) {
        navProjects?.classList.add('active');
    } else if (currentPath.includes('documentation') || currentPath.includes('documentation-selector.html')) {
        navDocumentation?.classList.add('active');
    }
    
    // Set up theme toggle in navbar
    const navbarThemeToggle = document.getElementById('theme-toggle');
    if (navbarThemeToggle) {
        navbarThemeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
}

// Handle footer positioning
function handleFooterPosition() {
    // Check if content is taller than viewport height minus footer
    const body = document.body;
    const html = document.documentElement;
    const footer = document.querySelector('.footer-component');
    
    if (!footer) return;
    
    // Get the footer height
    const footerHeight = footer.offsetHeight;
    
    // Calculate the height of the body content
    const contentHeight = Math.max(
        body.scrollHeight, 
        body.offsetHeight, 
        html.clientHeight, 
        html.scrollHeight, 
        html.offsetHeight
    );
    
    // Compare with the viewport height
    const viewportHeight = window.innerHeight;
    
    // If content is taller than viewport, make footer relative
    if (contentHeight > viewportHeight + 20) { // Add small buffer
        body.classList.add('large-content-page');
    } else {
        body.classList.remove('large-content-page');
        // Update body padding to match footer height
        body.style.paddingBottom = footerHeight + 'px';
    }
}

// Generic function to load any component
function loadComponent(placeholderId, componentPath, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    
    // Fetch the component HTML
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
            // Call the callback if provided
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
            placeholder.innerHTML = '<p>Error loading component. Please try again later.</p>';
        });
}