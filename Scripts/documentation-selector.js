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
        
        // Create a card for each documentation set
        documentationData.documentationIndex.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${doc.thumbnail}" class="card-img-top" alt="${doc.title}">
                    <div class="card-body">
                        <h5 class="card-title">${doc.title}</h5>
                        <p class="card-text">${doc.description}</p>
                        <div class="d-flex flex-wrap gap-2 mb-3">
                            ${doc.tags.map(tag => `<span class="badge bg-primary">${tag}</span>`).join('')}
                        </div>
                        <a href="documentation.html?doc=${doc.id}" class="btn btn-primary">Open Documentation</a>
                    </div>
                </div>
            `;
            this.docCards.appendChild(card);
        });
    }
}

// Initialize everything when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the documentation selector page
    if (window.location.pathname.includes('documentation-selector.html')) {
        // Wait for documentation index to be loaded
        document.addEventListener('documentationIndexLoaded', function() {
            // Setup documentation selector manager
            const docSelectorManager = new DocumentationSelectorManager();
            docSelectorManager.init();
        });
        
        // If data is already loaded (cached), initialize immediately
        if (documentationData.documentationIndex && documentationData.documentationIndex.length > 0) {
            const docSelectorManager = new DocumentationSelectorManager();
            docSelectorManager.init();
        }
    }
});