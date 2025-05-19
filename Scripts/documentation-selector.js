// Documentation selector page specific functionality

// Documentation Selector Manager to handle displaying available documentation
class DocumentationSelectorManager {
    constructor() {
        // Elements
        this.docCards = document.getElementById('documentation-cards');
        
        // JSON upload elements
        this.toggleUploadBtn = document.getElementById('toggle-upload-btn');
        this.uploadForm = document.getElementById('upload-form');
        this.jsonFileInput = document.getElementById('json-file-input');
        this.jsonTextInput = document.getElementById('json-text-input');
        this.cancelUploadBtn = document.getElementById('cancel-upload-btn');
        this.loadJsonBtn = document.getElementById('load-json-btn');
        
        // Bind event handlers
        this.bindEvents();
    }
    
    bindEvents() {
        // Toggle upload form visibility
        this.toggleUploadBtn.addEventListener('click', () => {
            bootstrap.Collapse.getOrCreateInstance(this.uploadForm).toggle();
        });
        
        // Cancel upload button
        this.cancelUploadBtn.addEventListener('click', () => {
            this.resetUploadForm();
            bootstrap.Collapse.getOrCreateInstance(this.uploadForm).hide();
        });
        
        // Load JSON button
        this.loadJsonBtn.addEventListener('click', () => {
            this.loadDocumentationFromJson();
        });
        
        // File input change - read and display JSON content
        this.jsonFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.jsonTextInput.value = e.target.result;
                };
                reader.readAsText(file);
            }
        });
    }
    
    init() {
        // Generate documentation cards
        this.generateDocumentationCards();
    }
    
    resetUploadForm() {
        this.jsonFileInput.value = '';
        this.jsonTextInput.value = '';
    }
    
    loadDocumentationFromJson() {
        try {
            const jsonContent = this.jsonTextInput.value.trim();
            
            if (!jsonContent) {
                throw new Error("Please provide JSON content or upload a file.");
            }
            
            // Parse JSON
            const docData = JSON.parse(jsonContent);
            
            // Validate required fields
            if (!docData.id || !docData.title || !docData.content) {
                throw new Error("Invalid documentation format. Missing required fields.");
            }
            
            // Store in session storage to be accessible across pages
            sessionStorage.setItem('uploaded_documentation', jsonContent);
            
            // Navigate to documentation page with the uploaded doc
            window.location.href = `documentation.html?doc=${docData.id}&source=upload`;
            
        } catch (error) {
            // Show error message
            alert(`Error loading documentation: ${error.message}`);
        }
    }
    
    generateDocumentationCards() {
        // Clear existing cards
        this.docCards.innerHTML = '';
        
        // Check if we have any documentation to display
        if (!documentationData.documentationIndex || documentationData.documentationIndex.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Create a card for each documentation set
        documentationData.documentationIndex.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card h-100 doc-selector-card">
                    <img src="${doc.thumbnail}" class="card-img-top" alt="${doc.title}">
                    <div class="card-body">
                        <h5 class="card-title">${doc.title}</h5>
                        <p class="card-text">${doc.description}</p>
                    </div>
                    <div class="card-footer">
                        <div class="card-tags">
                            ${doc.tags.map(tag => `<span class="badge bg-primary">${tag}</span>`).join('')}
                        </div>
                        <div class="card-actions">
                            <a href="documentation.html?doc=${doc.id}" class="btn btn-primary">Open Documentation</a>
                        </div>
                    </div>
                </div>
            `;
            this.docCards.appendChild(card);
        });
    }
    
    showEmptyState() {
        this.docCards.innerHTML = `
            <div class="col-12">
                <div class="card py-5 text-center">
                    <div class="card-body">
                        <i class="bi bi-journal-x display-4 text-muted"></i>
                        <h3 class="mt-3 text-muted">No Documentation Available</h3>
                        <p class="text-muted">There are currently no documentation sets available to display.</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    showLoadingState() {
        this.docCards.innerHTML = `
            <div class="col-12">
                <div class="card py-5 text-center">
                    <div class="card-body">
                        <div class="spinner-border text-primary mb-3" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <h3 class="mt-3 text-muted">Loading Documentation...</h3>
                        <p class="text-muted">Please wait while we load available documentation.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize everything when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the documentation selector page
    if (window.location.pathname.includes('documentation-selector.html')) {
        // Setup documentation selector manager
        const docSelectorManager = new DocumentationSelectorManager();
        
        // Show loading state initially
        docSelectorManager.showLoadingState();
        
        // Wait for documentation index to be loaded
        document.addEventListener('documentationIndexLoaded', function() {
            docSelectorManager.init();
        });
        
        // If data is already loaded (cached), initialize immediately
        if (documentationData.documentationIndex && documentationData.documentationIndex.length > 0) {
            docSelectorManager.init();
        }
        
        // Set a timeout to check if data has loaded after a reasonable time
        setTimeout(function() {
            if (!documentationData.documentationIndex || documentationData.documentationIndex.length === 0) {
                docSelectorManager.showEmptyState();
            }
        }, 3000); // 3 seconds timeout
    }
});