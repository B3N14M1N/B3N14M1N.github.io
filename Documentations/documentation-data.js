// Dynamic documentation loader using JSON data

// This will hold all our documentation data
const documentationData = {};

// Initialize with empty array
documentationData.documentationIndex = [];

/**
 * Get the appropriate base path for documentation data based on the current page location
 * @returns {string} The base path to use for fetch requests
 */
function getDocBasePath() {
    // Check if we're on a page in the Pages directory (needs to go up one level)
    const currentPath = window.location.pathname;
    if (currentPath.includes('/Pages/')) {
        return '../';
    }
    return '';
}

/**
 * Load the documentation index and populate the documentationData object
 */
async function loadDocumentationIndex() {
    try {
        const basePath = getDocBasePath();
        // Fetch the documentation index with the correct path
        const response = await fetch(`${basePath}Documentations/documentation-index.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load documentation index: ${response.status}`);
        }
        
        // Parse JSON and store in documentationData
        documentationData.documentationIndex = await response.json();
        console.log('Documentation index loaded successfully');
        
        // Dispatch an event to notify that documentation index is loaded
        const event = new CustomEvent('documentationIndexLoaded');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error loading documentation index:', error);
        // Keep as empty array if loading failed
        documentationData.documentationIndex = [];
        
        // Still dispatch event so UI doesn't hang
        const event = new CustomEvent('documentationIndexLoaded');
        document.dispatchEvent(event);
    }
}

/**
 * Load a specific documentation module by its ID
 * @param {string} docId - The ID of the documentation to load
 * @returns {Promise<Object>} The loaded documentation data
 */
async function loadDocumentation(docId) {
    // Check if we've already loaded this module
    if (documentationData[docId]) {
        return documentationData[docId];
    }
    
    try {
        const basePath = getDocBasePath();
        // Fetch the documentation data with the correct path
        const response = await fetch(`${basePath}Documentations/Data/${docId}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load documentation ${docId}: ${response.status}`);
        }
        
        // Parse JSON and store in documentationData
        const data = await response.json();
        documentationData[docId] = data.content;
        console.log(`Documentation ${docId} loaded successfully`);
        
        return documentationData[docId];
    } catch (error) {
        console.error(`Error loading documentation ${docId}:`, error);
        return null;
    }
}

// Make functions available globally
window.loadDocumentation = loadDocumentation;

// Initialize the data loading
document.addEventListener('DOMContentLoaded', loadDocumentationIndex);