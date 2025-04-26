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
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    // Update UI based on theme
    function updateThemeUI(theme) {
        // Update theme toggle button
        if (theme === 'dark') {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
            themeToggle.classList.remove('btn-outline-dark');
            themeToggle.classList.add('btn-outline-light');
        } else {
            themeIcon.classList.remove('bi-moon-fill');
            themeIcon.classList.add('bi-sun-fill');
            themeToggle.classList.remove('btn-outline-light');
            themeToggle.classList.add('btn-outline-dark');
        }
        
        // Update navbar
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
    
    // Load projects dynamically if on projects page
    if (window.location.pathname.includes('projects.html')) {
        loadProjects();
    }
    
    // Function to load projects from JSON
    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const projects = await response.json();
            const projectsContainer = document.getElementById('projects-container');
            
            if (projectsContainer && projects.length > 0) {
                projectsContainer.innerHTML = '';
                
                projects.forEach(project => {
                    const projectCard = createProjectCard(project);
                    projectsContainer.appendChild(projectCard);
                });
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            // If there's an error, we'll leave the static projects as fallback
        }
    }
    
    // Function to create project card
    function createProjectCard(project) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6 col-lg-4 mb-4';
        
        const cardHTML = `
            <div class="project-card">
                <img src="${project.image || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(project.title)}" 
                    alt="${project.title}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${project.title}</h5>
                    <p class="card-text">${project.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="btn-group">
                            ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn btn-sm btn-outline-primary">${project.demoText || 'Demo'}</a>` : ''}
                            ${project.repoUrl ? `<a href="${project.repoUrl}" class="btn btn-sm btn-primary">Repository</a>` : ''}
                        </div>
                        <small class="text-muted">${project.year || ''}</small>
                    </div>
                </div>
            </div>
        `;
        
        colDiv.innerHTML = cardHTML;
        return colDiv;
    }
    
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
});