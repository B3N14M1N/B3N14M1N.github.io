// Projects page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the projects page
    if (window.location.pathname.includes('projects.html')) {
        loadProjects();
    }
    
    // Function to load projects using the external projectsData variable
    function loadProjects() {
        // Use the projects from project-data.js
        const projects = projectsData;
        const projectsContainer = document.getElementById('projects-container');
        
        if (projectsContainer && projects.length > 0) {
            // Clear existing content
            projectsContainer.innerHTML = '';
            
            // Add the projects to the container
            projects.forEach((project, index) => {
                const projectCol = createProjectCard(project, index);
                projectsContainer.appendChild(projectCol);
            });
            
            console.log(`Loaded ${projects.length} projects`);
            
            // Create navigation indicators
            createNavigationIndicators(projects.length);
            
            // Set the first project as active
            setActiveProject(0);
            
            // Load categories dynamically after projects are loaded
            loadCategories(projects);
            
            // Setup project controls
            setupProjectControls(projects.length);
        }
    }
    
    // Function to create navigation indicators
    function createNavigationIndicators(count) {
        const indicatorsContainer = document.querySelector('.project-navigation-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            dot.setAttribute('data-index', i);
            
            dot.addEventListener('click', () => {
                navigateToProject(i);
            });
            
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // Function to set the active project
    function setActiveProject(index) {
        const projectCols = document.querySelectorAll('.project-col');
        const indicators = document.querySelectorAll('.indicator-dot');
        
        projectCols.forEach((col, i) => {
            if (i === index) {
                col.classList.add('active');
            } else {
                col.classList.remove('active');
            }
        });
        
        indicators.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Center the active project
        const activeProject = projectCols[index];
        if (activeProject) {
            activeProject.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    // Navigate to specific project index
    function navigateToProject(index) {
        setActiveProject(index);
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
    function createProjectCard(project, index) {
        const colDiv = document.createElement('div');
        colDiv.className = 'project-col col-12 col-md-6 col-lg-4';
        colDiv.setAttribute('data-index', index);
        
        // Add data attribute for category filtering
        if (project.category) {
            colDiv.setAttribute('data-category', project.category);
        }
        
        // Add data attributes for tags filtering
        if (project.tags && project.tags.length) {
            project.tags.forEach(tag => {
                // Sanitize tag name for valid HTML attribute
                const sanitizedTag = tag.toLowerCase()
                                       .replace(/[^a-z0-9]/g, '-')
                                       .replace(/-+/g, '-')
                                       .replace(/^-|-$/g, '');
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
    
    // Setup project filtering and navigation
    function setupProjectControls(projectCount) {
        const scrollLeftBtn = document.getElementById('scroll-left');
        const scrollRightBtn = document.getElementById('scroll-right');
        const filterButtons = document.querySelectorAll('.project-categories .btn');
        
        // Track current active project
        let currentProjectIndex = 0;
        
        // Navigation buttons
        if (scrollLeftBtn && scrollRightBtn) {
            scrollLeftBtn.addEventListener('click', () => {
                if (currentProjectIndex > 0) {
                    currentProjectIndex--;
                    navigateToProject(currentProjectIndex);
                }
            });
            
            scrollRightBtn.addEventListener('click', () => {
                if (currentProjectIndex < projectCount - 1) {
                    currentProjectIndex++;
                    navigateToProject(currentProjectIndex);
                }
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
                    let firstVisibleIndex = -1;
                    
                    projectCols.forEach((col, index) => {
                        if (filterValue === 'all') {
                            col.style.display = 'block';
                            if (firstVisibleIndex === -1) firstVisibleIndex = index;
                        } else {
                            if (col.getAttribute('data-category') === filterValue) {
                                col.style.display = 'block';
                                if (firstVisibleIndex === -1) firstVisibleIndex = index;
                            } else {
                                col.style.display = 'none';
                            }
                        }
                    });
                    
                    // Navigate to first visible project in the filtered set
                    if (firstVisibleIndex !== -1) {
                        currentProjectIndex = firstVisibleIndex;
                        navigateToProject(currentProjectIndex);
                    }
                });
            });
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                if (currentProjectIndex > 0) {
                    currentProjectIndex--;
                    navigateToProject(currentProjectIndex);
                }
            } else if (event.key === 'ArrowRight') {
                if (currentProjectIndex < projectCount - 1) {
                    currentProjectIndex++;
                    navigateToProject(currentProjectIndex);
                }
            }
        });
        
        // Handle touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        const handleSwipe = () => {
            if (touchStartX - touchEndX > 70) { // Swiped left
                if (currentProjectIndex < projectCount - 1) {
                    currentProjectIndex++;
                    navigateToProject(currentProjectIndex);
                }
            }
            if (touchEndX - touchStartX > 70) { // Swiped right
                if (currentProjectIndex > 0) {
                    currentProjectIndex--;
                    navigateToProject(currentProjectIndex);
                }
            }
        };
        
        document.querySelector('.projects-container').addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.querySelector('.projects-container').addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
});