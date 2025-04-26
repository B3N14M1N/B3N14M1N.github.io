// Documentation page specific functionality

// Documentation Manager to handle loading and rendering documentation
class DocumentationManager {
    constructor() {
        // Elements
        this.docTitle = document.getElementById('documentation-title');
        this.docDescription = document.getElementById('documentation-description');
        this.docSelector = document.getElementById('documentation-selector');
        this.docContent = document.getElementById('documentation-content');
        this.docTocList = document.getElementById('doc-toc-list');
        this.docCards = document.getElementById('documentation-cards');
        this.sidebar = document.getElementById('doc-sidebar');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.mobileToggle = document.getElementById('doc-mobile-toggle');
        this.contentWrapper = document.getElementById('doc-content-wrapper');
        this.docHeader = document.getElementById('doc-header');
        
        // State
        this.currentDoc = null;
        this.currentSection = null;
        
        // URL parameters
        this.urlParams = new URLSearchParams(window.location.search);
    }
    
    init() {
        // Check if a specific documentation is requested
        const docId = this.urlParams.get('doc');
        const sectionId = this.urlParams.get('section');
        
        if (docId && documentationData[docId]) {
            // Load the requested documentation
            this.loadDocumentation(docId, sectionId);
        } else {
            // Show documentation selector
            this.showDocumentationSelector();
        }
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Listen for URL changes (for navigation within documentation)
        window.addEventListener('popstate', (event) => {
            const params = new URLSearchParams(window.location.search);
            const docId = params.get('doc');
            const sectionId = params.get('section');
            
            if (docId) {
                this.loadDocumentation(docId, sectionId, false);
            } else {
                this.showDocumentationSelector();
            }
        });
    }
    
    showDocumentationSelector() {
        // Reset title and description
        this.docTitle.textContent = 'Documentation';
        this.docDescription.textContent = 'Select a documentation set to begin';
        
        // Show selector, hide content
        this.docSelector.style.display = 'block';
        this.docContent.innerHTML = '';
        this.docTocList.innerHTML = '';
        
        // Reset content wrapper padding (no need for sidebar space)
        if (this.contentWrapper) {
            this.contentWrapper.classList.remove('sidebar-collapsed');
            // Remove any padding meant for the sidebar
            this.contentWrapper.style.paddingLeft = '1rem';
        }
        
        if (this.docHeader) {
            this.docHeader.classList.remove('sidebar-collapsed');
            // Reset header padding as well
            this.docHeader.style.paddingLeft = '1rem';
        }
        
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
                        <a href="?doc=${doc.id}" class="btn btn-primary">Open Documentation</a>
                    </div>
                </div>
            `;
            this.docCards.appendChild(card);
        });
    }
    
    loadDocumentation(docId, sectionId = null, updateHistory = true) {
        // Get documentation data
        const doc = documentationData[docId];
        if (!doc) {
            // If documentation doesn't exist, show selector
            this.showDocumentationSelector();
            return;
        }
        
        // Update current documentation
        this.currentDoc = docId;
        
        // Update title and description
        this.docTitle.textContent = doc.title;
        this.docDescription.textContent = doc.description;
        
        // Hide selector, show content
        this.docSelector.style.display = 'none';
        
        // Show sidebar and its toggle button when a documentation is loaded
        if (this.sidebar) this.sidebar.style.display = 'block';
        if (this.sidebarToggle) this.sidebarToggle.style.display = 'flex';
        if (this.mobileToggle) this.mobileToggle.style.display = 'flex';
        
        // Reset content wrapper padding for sidebar
        if (this.contentWrapper) {
            this.contentWrapper.style.paddingLeft = '';  // Remove inline style to use CSS default
            
            // Check for saved sidebar state
            const savedSidebarState = localStorage.getItem('sidebarCollapsed');
            if (savedSidebarState === 'true') {
                this.contentWrapper.classList.add('sidebar-collapsed');
            }
        }
        
        // Update header padding for sidebar
        if (this.docHeader) {
            this.docHeader.style.paddingLeft = '';  // Remove inline style to use CSS default
            
            // Check for saved sidebar state
            const savedSidebarState = localStorage.getItem('sidebarCollapsed');
            if (savedSidebarState === 'true') {
                this.docHeader.classList.add('sidebar-collapsed');
            }
        }
        
        // Generate table of contents
        this.generateTableOfContents(doc);
        
        // Generate content
        this.generateDocumentationContent(doc);
        
        // Scroll to section if specified
        if (sectionId) {
            this.scrollToSection(sectionId);
            this.setActiveLink(sectionId);
        } else if (doc.sections && doc.sections.length > 0) {
            // Default to first section
            this.setActiveLink(doc.sections[0].id);
        }
        
        // Update URL if needed
        if (updateHistory) {
            const url = sectionId 
                ? `?doc=${docId}&section=${sectionId}` 
                : `?doc=${docId}`;
            history.pushState({docId, sectionId}, '', url);
        }
        
        // Refresh syntax highlighting
        if (typeof hljs !== 'undefined') {
            setTimeout(() => {
                hljs.highlightAll();
                this.addCopyButtons();
            }, 100);
        }
    }
    
    generateTableOfContents(doc) {
        // Clear existing TOC
        this.docTocList.innerHTML = '';
        
        // Add a "Back to Documentation" link
        const backLink = document.createElement('a');
        backLink.href = 'documentation.html';
        backLink.className = 'list-group-item list-group-item-action d-flex align-items-center';
        backLink.innerHTML = '<i class="bi bi-arrow-left-circle me-2"></i> All Documentation';
        this.docTocList.appendChild(backLink);
        
        // Add sections to TOC
        doc.sections.forEach(section => {
            // Main section link
            const sectionLink = document.createElement('a');
            sectionLink.href = `?doc=${this.currentDoc}&section=${section.id}`;
            sectionLink.className = 'list-group-item list-group-item-action';
            sectionLink.textContent = section.title;
            sectionLink.setAttribute('data-section-id', section.id);
            
            // Prevent default link behavior
            sectionLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.loadDocumentation(this.currentDoc, section.id);
            });
            
            this.docTocList.appendChild(sectionLink);
            
            // Add subsections if available
            if (section.content) {
                this.addSubsectionsToToc(section, this.currentDoc);
            }
        });
    }
    
    addSubsectionsToToc(section, docId) {
        // Find subSections in the content
        section.content.forEach(item => {
            if (item.type === 'subSection') {
                // Create subsection link with indentation
                const subsectionLink = document.createElement('a');
                subsectionLink.href = `?doc=${docId}&section=${section.id}&subsection=${item.id}`;
                subsectionLink.className = 'list-group-item list-group-item-action ps-4';
                subsectionLink.innerHTML = `<small>→ ${item.title}</small>`;
                subsectionLink.setAttribute('data-section-id', `${section.id}-${item.id}`);
                
                // Prevent default link behavior
                subsectionLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.scrollToSection(`${section.id}-${item.id}`);
                    this.setActiveLink(`${section.id}-${item.id}`);
                    
                    // Update URL
                    const url = `?doc=${docId}&section=${section.id}&subsection=${item.id}`;
                    history.pushState({docId, sectionId: section.id, subsectionId: item.id}, '', url);
                });
                
                this.docTocList.appendChild(subsectionLink);
            }
        });
    }
    
    generateDocumentationContent(doc) {
        // Clear existing content
        this.docContent.innerHTML = '';
        
        // Generate sections
        doc.sections.forEach(section => {
            const sectionElement = document.createElement('section');
            sectionElement.id = section.id;
            sectionElement.className = 'doc-content mb-5';
            
            // Add section title
            const titleElement = document.createElement('h2');
            titleElement.className = 'mb-4';
            titleElement.textContent = section.title;
            sectionElement.appendChild(titleElement);
            
            // Add section content
            if (section.content) {
                this.renderContentItems(section.content, sectionElement, section.id);
            }
            
            this.docContent.appendChild(sectionElement);
        });
    }
    
    renderContentItems(contentItems, parentElement, sectionId) {
        contentItems.forEach(item => {
            switch (item.type) {
                case 'paragraph':
                    const p = document.createElement('p');
                    p.innerHTML = item.text;
                    parentElement.appendChild(p);
                    break;
                    
                case 'subheading':
                    const h3 = document.createElement('h3');
                    h3.className = item.className || '';
                    h3.textContent = item.text;
                    parentElement.appendChild(h3);
                    break;
                    
                case 'list':
                    const ul = document.createElement('ul');
                    item.items.forEach(listItem => {
                        const li = document.createElement('li');
                        li.textContent = listItem;
                        ul.appendChild(li);
                    });
                    parentElement.appendChild(ul);
                    break;
                    
                case 'code':
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    code.className = item.language ? `language-${item.language}` : '';
                    code.textContent = item.text;
                    pre.appendChild(code);
                    parentElement.appendChild(pre);
                    break;
                    
                case 'faq':
                    item.items.forEach((faqItem, index) => {
                        const card = document.createElement('div');
                        card.className = 'card mb-3';
                        card.innerHTML = `
                            <div class="card-body">
                                <h5 class="card-title">${faqItem.question}</h5>
                                <p class="card-text">${faqItem.answer}</p>
                            </div>
                        `;
                        parentElement.appendChild(card);
                    });
                    break;
                    
                case 'subSection':
                    // Create subsection with unique ID combining parent section ID and subsection ID
                    const subSection = document.createElement('div');
                    subSection.id = `${sectionId}-${item.id}`;
                    subSection.className = 'doc-subsection mt-4 pt-2 border-top';
                    
                    const subSectionTitle = document.createElement('h3');
                    subSectionTitle.className = 'mb-3';
                    subSectionTitle.textContent = item.title;
                    subSection.appendChild(subSectionTitle);
                    
                    // Recursively render subsection content
                    if (item.content) {
                        this.renderContentItems(item.content, subSection, `${sectionId}-${item.id}`);
                    }
                    
                    parentElement.appendChild(subSection);
                    break;
                    
                default:
                    console.warn(`Unknown content type: ${item.type}`);
            }
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerOffset = 80;
            const sectionPosition = section.getBoundingClientRect().top;
            const offsetPosition = sectionPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveLink(sectionId) {
        // Remove active class from all links
        document.querySelectorAll('#doc-toc-list .list-group-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`#doc-toc-list [data-section-id="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    addCopyButtons() {
        // Select all <pre> elements that contain code blocks
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach((codeBlock) => {
            // Skip if already has a copy button
            if (codeBlock.querySelector('.copy-code-button')) {
                return;
            }
            
            // Create the copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-button';
            copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
            copyButton.ariaLabel = 'Copy code to clipboard';
            
            // Insert the button at the beginning of the code block
            codeBlock.insertBefore(copyButton, codeBlock.firstChild);
            
            // Add click event to copy the code
            copyButton.addEventListener('click', () => {
                const code = codeBlock.querySelector('code');
                const textToCopy = code.innerText;
                
                // Use the Clipboard API to copy text
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Give user feedback that code was copied
                        copyButton.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
                        copyButton.classList.add('copied');
                        
                        // Reset button after 2 seconds
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                            copyButton.classList.remove('copied');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        copyButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Error!';
                        
                        // Reset button after 2 seconds
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                        }, 2000);
                    });
            });
        });
    }
}

// Sidebar functionality
function setupSidebar() {
    const sidebar = document.getElementById('doc-sidebar');
    const contentWrapper = document.getElementById('doc-content-wrapper');
    const docHeader = document.getElementById('doc-header');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarIcon = document.getElementById('sidebar-icon');
    const mobileToggle = document.getElementById('doc-mobile-toggle');
    
    if (!sidebar || !contentWrapper) return;
    
    // Toggle sidebar function
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        contentWrapper.classList.toggle('sidebar-collapsed');
        if (docHeader) docHeader.classList.toggle('sidebar-collapsed');
        
        if (sidebarIcon) {
            if (sidebar.classList.contains('collapsed')) {
                sidebarIcon.classList.remove('bi-chevron-left');
                sidebarIcon.classList.add('bi-chevron-right');
                // Save state to localStorage
                localStorage.setItem('sidebarCollapsed', 'true');
            } else {
                sidebarIcon.classList.remove('bi-chevron-right');
                sidebarIcon.classList.add('bi-chevron-left');
                // Save state to localStorage
                localStorage.setItem('sidebarCollapsed', 'false');
            }
        }
    }
    
    // Check saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
        sidebar.classList.add('collapsed');
        contentWrapper.classList.add('sidebar-collapsed');
        if (docHeader) docHeader.classList.add('sidebar-collapsed');
        if (sidebarIcon) {
            sidebarIcon.classList.remove('bi-chevron-left');
            sidebarIcon.classList.add('bi-chevron-right');
        }
    }
    
    // Toggle sidebar on mobile function
    function toggleMobileSidebar() {
        sidebar.classList.toggle('show');
    }
    
    // Add click event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileSidebar);
    }
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 992 && 
            sidebar && 
            mobileToggle &&
            !sidebar.contains(event.target) && 
            !mobileToggle.contains(event.target) &&
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
    
    // Resize functionality
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992 && sidebar) {
            sidebar.classList.remove('show');
        }
    });
}

// Initialize everything when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the documentation page
    if (window.location.pathname.includes('documentation.html')) {
        // Initialize code highlighting if hljs is available
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
        
        // Setup documentation manager
        const docManager = new DocumentationManager();
        docManager.init();
        
        // Setup sidebar functionality
        setupSidebar();
    }
});