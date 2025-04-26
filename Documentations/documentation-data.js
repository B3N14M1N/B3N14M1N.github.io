// Dynamic documentation loader

// This will hold all our documentation data
const documentationData = {};

// This array will hold the metadata for all documentation sets
// It's populated as we load documentation modules
documentationData.documentationIndex = [];

/**
 * Register a documentation module to make it available in the system
 * @param {Object} docModule - The documentation module to register
 */
function registerDocumentation(docModule) {
    // Extract the metadata for the documentation index
    const metadata = {
        id: docModule.id,
        title: docModule.title,
        description: docModule.description,
        thumbnail: docModule.thumbnail,
        tags: docModule.tags
    };
    
    // Add to the index array
    documentationData.documentationIndex.push(metadata);
    
    // Store the full documentation content
    documentationData[docModule.id] = docModule.content;
}

// Expose the registration function globally so data files can use it
window.registerDocumentation = registerDocumentation;

// Initialize function - called when the page loads
function initDocumentationSystem() {
    console.log("Documentation system initialized");
    // No need to explicitly register modules here, they will register themselves
}

// Initialize the data loading
document.addEventListener('DOMContentLoaded', initDocumentationSystem);