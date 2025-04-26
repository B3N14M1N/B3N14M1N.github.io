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

// Automatically detect and load all documentation files from the Data folder
function loadDocumentationFiles() {
    // In a non-ES module environment, we need to manually include the data files
    // We'll use the direct variable references from the included files
    
    // Register the voxel system documentation (declared in voxel-system.js)
    if (typeof voxelSystemData !== 'undefined') {
        registerDocumentation(voxelSystemData);
    }
    
    // Register the web API documentation (declared in web-api.js)
    if (typeof webApiData !== 'undefined') {
        registerDocumentation(webApiData);
    }
    
    // You can add more documentation registrations here as you create new files
    // The pattern is to check if the corresponding global variable exists and register it
}

// Initialize the data loading
loadDocumentationFiles();