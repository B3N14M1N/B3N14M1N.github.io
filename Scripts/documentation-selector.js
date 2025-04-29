// Documentation selector page specific functionality

// Documentation Selector Manager to handle displaying available documentation
class DocumentationSelectorManager {
    constructor() {
        // Elements
        this.docCards = document.getElementById('documentation-cards');
    }
    
    init() {
        // Generate documentation cards
        this.generateDocumentationCards();
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