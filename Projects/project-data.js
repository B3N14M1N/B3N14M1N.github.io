// Project data loader for the portfolio website

// Create an empty array to hold project data
let projectsData = [];

// Cache key for localStorage
const PROJECTS_CACHE_KEY = 'cached_projects_data';
// Cache expiration time (in milliseconds) - 1 hour
const CACHE_EXPIRATION = 60 * 60 * 1000;

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

/**
 * Load cached project data from localStorage if available and not expired
 * @returns {boolean} True if cache was loaded successfully
 */
function loadCachedProjectsData() {
    try {
        const cachedData = localStorage.getItem(PROJECTS_CACHE_KEY);
        if (!cachedData) return false;
        
        const { data, timestamp } = JSON.parse(cachedData);
        
        // Check if cache has expired
        if (Date.now() - timestamp > CACHE_EXPIRATION) {
            console.log('Projects cache expired, fetching fresh data');
            return false;
        }
        
        // Use the cached data
        projectsData = data;
        console.log('Loaded projects data from cache');
        
        // Dispatch an event to notify that projects data is loaded
        const event = new CustomEvent('projectsDataLoaded');
        document.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error('Error loading cached projects data:', error);
        return false;
    }
}

/**
 * Save projects data to localStorage cache
 */
function cacheProjectsData(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(cacheData));
        console.log('Projects data cached successfully');
    } catch (error) {
        console.error('Error caching projects data:', error);
    }
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
        
        // Cache the fetched data
        cacheProjectsData(projectsData);
        
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
document.addEventListener('DOMContentLoaded', () => {
    // Try to load cached data first
    if (!loadCachedProjectsData()) {
        // If no valid cache exists, fetch fresh data
        loadProjectsData();
    } else {
        // Even if we loaded from cache, fetch fresh data in the background
        // This ensures the cache stays updated for next time
        setTimeout(() => loadProjectsData(), 100);
    }
});