// Documentation page specific functionality

// Documentation Manager to handle loading and rendering documentation
class DocumentationManager {
    constructor() {
        // Elements
        this.docTitle = document.getElementById('documentation-title');
        this.docDescription = document.getElementById('documentation-description');
        this.docContent = document.getElementById('documentation-content');
        this.docTocList = document.getElementById('doc-toc-list');
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
        
        // Flag to track if scroll tracking is active
        this.scrollTrackingActive = false;
    }
    
    init() {
        // Check if a specific documentation is requested
        const docId = this.urlParams.get('doc');
        const sectionId = this.urlParams.get('section');
        
        if (docId && documentationData[docId]) {
            // Load the requested documentation
            this.loadDocumentation(docId, sectionId);
        } else {
            // If no valid documentation ID is provided, redirect to the selector page
            window.location.href = 'documentation-selector.html';
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
            
            if (docId && documentationData[docId]) {
                this.loadDocumentation(docId, sectionId, false);
            } else {
                // If no valid documentation ID is provided, redirect to the selector page
                window.location.href = 'documentation-selector.html';
            }
        });
    }
    
    loadDocumentation(docId, sectionId = null, updateHistory = true) {
        // Get documentation data
        const doc = documentationData[docId];
        if (!doc) {
            // If documentation doesn't exist, redirect to selector
            window.location.href = 'documentation-selector.html';
            return;
        }
        
        // Update current documentation
        this.currentDoc = docId;
        
        // Update title and description
        this.docTitle.textContent = doc.title;
        this.docDescription.textContent = doc.description;
        
        // Check for saved sidebar state
        const savedSidebarState = localStorage.getItem('sidebarCollapsed');
        if (savedSidebarState === 'true') {
            this.contentWrapper.classList.add('sidebar-collapsed');
            this.docHeader.classList.add('sidebar-collapsed');
            this.sidebar.classList.add('collapsed');
            
            if (document.getElementById('sidebar-icon')) {
                document.getElementById('sidebar-icon').classList.remove('bi-chevron-left');
                document.getElementById('sidebar-icon').classList.add('bi-chevron-right');
            }
        }
        
        // Generate table of contents
        this.generateTableOfContents(doc);
        
        // Generate content
        this.generateDocumentationContent(doc);
        
        // Setup scroll tracking for active section
        this.setupScrollTracking();
        
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
        backLink.href = 'documentation-selector.html';
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
    
    setupScrollTracking() {
        // Remove any existing scroll listener to prevent duplicates
        if (this.scrollTrackingActive) {
            window.removeEventListener('scroll', this.handleScroll);
            this.scrollTrackingActive = false;
        }
        
        // Create a bound version of the handleScroll method
        this.handleScroll = this.updateActiveSection.bind(this);
        
        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll);
        this.scrollTrackingActive = true;
    }
    
    updateActiveSection() {
        // Get all documentation sections
        const sections = document.querySelectorAll('.doc-content');
        let currentSectionId = null;
        
        // Find the section that's currently most visible in the viewport
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the section is visible in the viewport
            const visibleTop = Math.max(0, sectionTop);
            const visibleBottom = Math.min(viewportHeight, sectionTop + sectionHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // If at least 30% of section height or 200px is visible and it's near the top of viewport
            if ((visibleHeight > sectionHeight * 0.3 || visibleHeight > 200) && sectionTop < viewportHeight / 2) {
                currentSectionId = section.id;
            }
        });
        
        // Also check subsections
        const subsections = document.querySelectorAll('.doc-subsection');
        subsections.forEach(subsection => {
            const rect = subsection.getBoundingClientRect();
            // Similar logic as above but with stricter viewport position
            if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                currentSectionId = subsection.id;
            }
        });
        
        // If found a visible section, update the active link
        if (currentSectionId) {
            this.setActiveLink(currentSectionId, false);
        }
    }
    
    setActiveLink(sectionId, updateUrl = true) {
        // Remove active class from all links
        document.querySelectorAll('#doc-toc-list .list-group-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`#doc-toc-list [data-section-id="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Update URL if needed and if this is a user-initiated action (not from scrolling)
            if (updateUrl && this.currentDoc) {
                // Parse section id to determine if it's a subsection
                const parts = sectionId.split('-');
                let url;
                
                if (parts.length > 1) {
                    // It's a subsection
                    const mainSection = parts[0];
                    const subsection = parts.slice(1).join('-');
                    url = `?doc=${this.currentDoc}&section=${mainSection}&subsection=${subsection}`;
                } else {
                    // It's a main section
                    url = `?doc=${this.currentDoc}&section=${sectionId}`;
                }
                
                history.replaceState({docId: this.currentDoc, sectionId: sectionId}, '', url);
            }
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
    // Only run this code on the documentation page (not the selector)
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