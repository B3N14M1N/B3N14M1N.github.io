// Project data loader for the portfolio website

// Create an empty array to hold project data
let projectsData = [];

/**
 * Get the appropriate base path for project data based on the current page location
 * @returns {string} The base path to use for fetch requests
 */
function getProjectBasePath() {
    // Check if we're on a page in the Pages directory (needs to go up one level)
    const currentPath = window.location.pathname;
    if (currentPath.includes('/Pages/')) {
        return '../';
    }
    return '';
}

// Function to fetch projects data
async function loadProjectsData() {
    try {
        const basePath = getProjectBasePath();
        const response = await fetch(`${basePath}Projects/Data/projects.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load projects data: ${response.status}`);
        }
        
        projectsData = await response.json();
        console.log('Projects data loaded successfully');
        
        // Dispatch an event to notify that projects data is loaded
        const event = new CustomEvent('projectsDataLoaded');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error loading projects data:', error);
        
        // Fallback to empty array if data cannot be loaded
        projectsData = [];
        
        // Still dispatch event so UI doesn't hang
        const event = new CustomEvent('projectsDataLoaded');
        document.dispatchEvent(event);
    }
}

// Initialize data loading when the page is ready
document.addEventListener('DOMContentLoaded', loadProjectsData);