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
        // Update theme toggle button icon
        if (theme === 'dark') {
            themeIcon.classList.remove('bi-sun-fill');
            themeIcon.classList.add('bi-moon-fill');
        } else {
            themeIcon.classList.remove('bi-moon-fill');
            themeIcon.classList.add('bi-sun-fill');
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
    
    // Load projects dynamically if on projects page
    if (window.location.pathname.includes('projects.html')) {
        loadProjects();
    }
    
    // Function to load projects (using hardcoded data)
    function loadProjects() {
        // Hardcoded projects data
        const projects = [
            {
                "id": 1,
                "title": "Voxel System",
                "description": "A system for creating, managing, and rendering voxel-based environments and objects. Built with performance and extensibility in mind.",
                "image": "https://via.placeholder.com/600x400?text=Voxel+System",
                "year": "2024",
                "demoUrl": "documentation.html",
                "demoText": "Documentation",
                "repoUrl": "https://github.com/b3n14m1n/Voxel-System",
                "tags": ["Game Development", "C#", "Unity"],
                "category": "Game Development"
            },
            {
                "id": 2,
                "title": "Game Development Project",
                "description": "A 2D/3D game built with Unity, featuring interesting mechanics and innovative gameplay. Includes procedural generation and custom physics.",
                "image": "https://via.placeholder.com/600x400?text=Game+Project",
                "year": "2023",
                "demoUrl": "#",
                "demoText": "Play Online",
                "repoUrl": "#",
                "tags": ["Gaming", "Unity", "C#"],
                "category": "Game Development"
            },
            {
                "id": 3,
                "title": "Web Development Project",
                "description": "A responsive website built with modern web technologies like HTML5, CSS3, and JavaScript. Features clean design and smooth user experience.",
                "image": "https://via.placeholder.com/600x400?text=Web+Project",
                "year": "2023",
                "demoUrl": "#",
                "demoText": "Live Demo",
                "repoUrl": "#",
                "tags": ["Web", "JavaScript", "CSS"],
                "category": "Web"
            },
            {
                "id": 4,
                "title": "Personal Portfolio",
                "description": "This very website! A responsive portfolio showcasing my projects and skills, featuring dynamic theme switching and content loading.",
                "image": "https://via.placeholder.com/600x400?text=Portfolio+Site",
                "year": "2024",
                "repoUrl": "https://github.com/b3n14m1n/b3n14m1n.github.io",
                "tags": ["Web", "JavaScript", "Bootstrap"],
                "category": "Web"
            }
        ];

        const projectsContainer = document.getElementById('projects-container');
        
        if (projectsContainer && projects.length > 0) {
            // Clear existing content
            projectsContainer.innerHTML = '';
            
            // Add the projects to the container
            projects.forEach(project => {
                const projectCol = createProjectCard(project);
                projectsContainer.appendChild(projectCol);
            });
            
            console.log(`Loaded ${projects.length} projects`);
            
            // Load categories dynamically after projects are loaded
            loadCategories(projects);
            
            // Setup project filters and scrolling
            setupProjectControls();
        }
    }
    
    // Function to dynamically load categories from projects
    function loadCategories(projects) {
        const categoriesContainer = document.querySelector('.project-categories');
        if (!categoriesContainer) return;
        
        // Clear existing categories
        categoriesContainer.innerHTML = '';
        
        // Add "All" category button
        const allButton = document.createElement('button');
        allButton.className = 'btn btn-sm btn-outline-primary mx-1 active';
        allButton.setAttribute('data-filter', 'all');
        allButton.textContent = 'All';
        categoriesContainer.appendChild(allButton);
        
        // Get unique categories
        const categories = [...new Set(projects.map(project => project.category))];
        
        // Add category buttons
        categories.forEach(category => {
            if (category) {
                const button = document.createElement('button');
                button.className = 'btn btn-sm btn-outline-primary mx-1';
                button.setAttribute('data-filter', category);
                button.textContent = category;
                categoriesContainer.appendChild(button);
            }
        });
    }
    
    // Function to create project card
    function createProjectCard(project) {
        const colDiv = document.createElement('div');
        colDiv.className = 'project-col col-10 col-md-6 col-lg-4';
        
        // Add data attribute for category filtering
        if (project.category) {
            colDiv.setAttribute('data-category', project.category);
        }
        
        // Add data attributes for tags filtering
        // Add data attribute for category filtering
        if (project.category) {
            colDiv.setAttribute('data-category', project.category);
        }
        
        // Add data attributes for tags filtering
        if (project.tags && project.tags.length) {
            project.tags.forEach(tag => {
                // Sanitize tag name for valid HTML attribute by removing special characters
                const sanitizedTag = tag.toLowerCase()
                                       .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with dash
                                       .replace(/-+/g, '-')        // Replace multiple dashes with single dash
                                       .replace(/^-|-$/g, '');     // Remove leading/trailing dashes
                colDiv.setAttribute(`data-tag-${sanitizedTag}`, true);
            });
        }
        
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
                        <small class="project-year">${project.year || ''}</small>
                    </div>
                </div>
            </div>
        `;
        
        colDiv.innerHTML = cardHTML;
        return colDiv;
    }
    
    // Setup project filtering and scrolling
    function setupProjectControls() {
        const scrollLeftBtn = document.getElementById('scroll-left');
        const scrollRightBtn = document.getElementById('scroll-right');
        const projectsContainer = document.querySelector('.projects-scroll-container');
        const filterButtons = document.querySelectorAll('.project-categories .btn');
        
        // Horizontal scrolling buttons
        if (scrollLeftBtn && scrollRightBtn && projectsContainer) {
            scrollLeftBtn.addEventListener('click', () => {
                projectsContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
            
            scrollRightBtn.addEventListener('click', () => {
                projectsContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
        
        // Project filtering
        if (filterButtons.length) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    // Get the filter value
                    const filterValue = button.getAttribute('data-filter');
                    
                    // Filter projects
                    const projectCols = document.querySelectorAll('.project-col');
                    projectCols.forEach(col => {
                        if (filterValue === 'all') {
                            col.style.display = 'block';
                        } else {
                            if (col.getAttribute('data-category') === filterValue) {
                                col.style.display = 'block';
                            } else {
                                col.style.display = 'none';
                            }
                        }
                    });
                });
            });
        }
    }
    
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
});