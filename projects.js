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
    function createNavigationIndicators(count, visibleProjects = null) {
        const indicatorsContainer = document.querySelector('.project-navigation-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        // Use either the provided visibleProjects array or create a range from 0 to count-1
        const projectIndices = visibleProjects || Array.from({ length: count }, (_, i) => i);
        
        projectIndices.forEach((projectIndex, dotIndex) => {
            const dot = document.createElement('div');
            dot.className = 'indicator-dot';
            dot.setAttribute('data-index', projectIndex);
            dot.setAttribute('data-position', dotIndex);
            
            dot.addEventListener('click', () => {
                navigateToProject(projectIndex);
            });
            
            indicatorsContainer.appendChild(dot);
        });
    }
    
    // Function to set the active project
    function setActiveProject(index) {
        const projectCols = document.querySelectorAll('.project-col');
        const indicators = document.querySelectorAll('.indicator-dot');
        
        // Find the position of this index in the visible projects
        let dotPosition = -1;
        indicators.forEach((dot, i) => {
            if (parseInt(dot.getAttribute('data-index')) === index) {
                dotPosition = i;
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        projectCols.forEach((col, i) => {
            const colIndex = parseInt(col.getAttribute('data-index'));
            if (colIndex === index) {
                col.classList.add('active');
                // Ensure the active project is visible and centered
                setTimeout(() => {
                    col.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }, 50);
            } else {
                col.classList.remove('active');
            }
        });
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
                <div class="project-image-container">
                    <img src="${project.image || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(project.title)}" 
                        alt="${project.title}" class="card-img-top">
                    <div class="project-image-overlay"></div>
                </div>
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
                // Find the previous visible project
                const visibleProjects = getVisibleProjects();
                const currentPosition = visibleProjects.indexOf(currentProjectIndex);
                
                if (currentPosition > 0) {
                    currentProjectIndex = visibleProjects[currentPosition - 1];
                    navigateToProject(currentProjectIndex);
                }
            });
            
            scrollRightBtn.addEventListener('click', () => {
                // Find the next visible project
                const visibleProjects = getVisibleProjects();
                const currentPosition = visibleProjects.indexOf(currentProjectIndex);
                
                if (currentPosition < visibleProjects.length - 1) {
                    currentProjectIndex = visibleProjects[currentPosition + 1];
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
                    let visibleProjects = [];
                    
                    projectCols.forEach((col) => {
                        const index = parseInt(col.getAttribute('data-index'));
                        if (filterValue === 'all') {
                            col.style.display = 'block';
                            visibleProjects.push(index);
                        } else {
                            if (col.getAttribute('data-category') === filterValue) {
                                col.style.display = 'block';
                                visibleProjects.push(index);
                            } else {
                                col.style.display = 'none';
                            }
                        }
                    });
                    
                    // Update the indicators to only show dots for visible projects
                    createNavigationIndicators(projectCount, visibleProjects);
                    
                    // Navigate to first visible project in the filtered set
                    if (visibleProjects.length > 0) {
                        currentProjectIndex = visibleProjects[0];
                        navigateToProject(currentProjectIndex);
                    }
                });
            });
        }
        
        // Function to get currently visible projects
        function getVisibleProjects() {
            const projectCols = document.querySelectorAll('.project-col');
            const visibleProjects = [];
            
            projectCols.forEach(col => {
                if (col.style.display !== 'none') {
                    visibleProjects.push(parseInt(col.getAttribute('data-index')));
                }
            });
            
            return visibleProjects;
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                // Simulate clicking the left scroll button
                scrollLeftBtn.click();
            } else if (event.key === 'ArrowRight') {
                // Simulate clicking the right scroll button
                scrollRightBtn.click();
            }
        });
        
        // Handle touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        const handleSwipe = () => {
            if (touchStartX - touchEndX > 70) { // Swiped left
                scrollRightBtn.click();
            }
            if (touchEndX - touchStartX > 70) { // Swiped right
                scrollLeftBtn.click();
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