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
        
        // Initial URL state extraction (now using hash fragments)
        const hash = window.location.hash;
        const docId = this.getQueryParam('doc');
        let sectionId = hash.substring(1); // Remove the # character
        
        // Store initial state
        this.initialDocId = docId;
        this.initialSectionId = sectionId;
        
        // Flags
        this.scrollTrackingActive = false;
        this.isManualNavigation = false;
        this.isScrolling = false;
        this.isInitialLoad = true;
        this.isLoadingDoc = false;
        this.isUploadedDoc = false;
    }
    
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    init() {
        // Check if a specific documentation is requested
        const docId = this.getQueryParam('doc');
        const source = this.getQueryParam('source');
        let sectionId = null;
        
        // Get section from hash if available
        if (window.location.hash) {
            sectionId = window.location.hash.substring(1); // Remove the # character
        }
        
        // Initialize event listeners
        this.initEventListeners();
        
        if (docId) {
            // Check if this is an uploaded documentation
            if (source === 'upload') {
                this.loadUploadedDocumentation(docId, sectionId);
            } else {
                // Try to load the requested documentation
                this.loadDocumentationById(docId, sectionId);
            }
        } else {
            // If no valid documentation ID is provided, redirect to the selector page
            window.location.href = 'documentation-selector.html';
        }
    }
    
    loadUploadedDocumentation(docId, sectionId = null, updateHistory = true) {
        try {
            // Get the uploaded documentation from session storage
            const jsonData = sessionStorage.getItem('uploaded_documentation');
            
            if (!jsonData) {
                throw new Error('No uploaded documentation found');
            }
            
            // Parse the JSON data
            const doc = JSON.parse(jsonData);
            
            // Validate the document structure
            if (!doc.id || !doc.title || !doc.content) {
                throw new Error('Invalid documentation format');
            }
            
            // Make sure the IDs match
            if (doc.id !== docId) {
                throw new Error('Documentation ID mismatch');
            }
            
            // Set flag that we're using uploaded documentation
            this.isUploadedDoc = true;
            
            // Update current documentation
            this.currentDoc = docId;
            this.currentSection = sectionId;
            
            // Update title and description
            this.docTitle.textContent = doc.title;
            this.docDescription.textContent = doc.description || '';
            
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
            this.generateTableOfContents(doc.content);
            
            // Generate content
            this.generateDocumentationContent(doc.content);
            
            // Setup scroll tracking for active section
            this.setupScrollTracking();
            
            // Scroll to section if specified after a short delay to let content render
            setTimeout(() => {
                if (sectionId) {
                    this.scrollToSection(sectionId);
                    this.setActiveLink(sectionId);
                } else if (doc.content.sections && doc.content.sections.length > 0) {
                    // Default to first section if no section specified
                    this.setActiveLink(doc.content.sections[0].id);
                }
                
                // Update URL if needed
                if (updateHistory) {
                    const url = `?doc=${docId}&source=upload${sectionId ? '#' + sectionId : ''}`;
                    
                    const state = {
                        docId,
                        sectionId,
                        source: 'upload'
                    };
                    
                    // Use pushState to add a browser history entry
                    history.pushState(state, '', url);
                }
                
                // Store initial content state after a short delay
                setTimeout(() => {
                    this.storeInitialState();
                    this.isInitialLoad = false;
                }, 300);
                
                // Refresh syntax highlighting
                if (typeof hljs !== 'undefined') {
                    hljs.highlightAll();
                    this.addCopyButtons();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error loading uploaded documentation:', error);
            // Show error message
            alert(`Error loading documentation: ${error.message}`);
            // Redirect to selector page on error
            window.location.href = 'documentation-selector.html';
        }
    }
    
    async loadDocumentationById(docId, sectionId = null, updateHistory = true) {
        if (this.isLoadingDoc) {
            return; // Prevent multiple simultaneous loads
        }
        
        this.isLoadingDoc = true;
        
        try {
            // Try to load the documentation using our async loader
            const doc = await loadDocumentation(docId);
            
            if (!doc) {
                throw new Error(`Documentation with ID ${docId} not found`);
            }
            
            // Update current documentation
            this.currentDoc = docId;
            this.currentSection = sectionId;
            
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
            
            // Scroll to section if specified after a short delay to let content render
            setTimeout(() => {
                if (sectionId) {
                    this.scrollToSection(sectionId);
                    this.setActiveLink(sectionId);
                } else if (doc.sections && doc.sections.length > 0) {
                    // Default to first section if no section specified
                    this.setActiveLink(doc.sections[0].id);
                }
                
                // Update URL if needed
                if (updateHistory) {
                    const url = `?doc=${docId}${sectionId ? '#' + sectionId : ''}`;
                    
                    const state = {
                        docId,
                        sectionId
                    };
                    
                    // Use pushState to add a browser history entry
                    history.pushState(state, '', url);
                }
                
                // Store initial content state after a short delay
                setTimeout(() => {
                    this.storeInitialState();
                    this.isInitialLoad = false;
                }, 300);
                
                // Refresh syntax highlighting
                if (typeof hljs !== 'undefined') {
                    hljs.highlightAll();
                    this.addCopyButtons();
                }
            }, 100);
            
        } catch (error) {
            console.error('Error loading documentation:', error);
            // Redirect to selector page on error
            window.location.href = 'documentation-selector.html';
        } finally {
            this.isLoadingDoc = false;
        }
    }
    
    storeInitialState() {
        // Store the initial state of the page so we can restore it when navigating back
        const state = {
            docId: this.currentDoc,
            sectionId: this.currentSection || this.getDefaultSectionId()
        };
        
        // Replace current history entry with state
        // This ensures proper state restoration when navigating back to this page
        history.replaceState(state, '', window.location.href);
    }
    
    getDefaultSectionId() {
        // Get the first section id if available from the current documentation
        const doc = documentationData[this.currentDoc];
        return doc && doc.sections && doc.sections.length > 0 ? doc.sections[0].id : null;
    }
    
    initEventListeners() {
        // Listen for hash changes
        window.addEventListener('hashchange', (event) => {
            // Only handle if not during manual navigation
            if (!this.isManualNavigation) {
                const hash = window.location.hash;
                const sectionId = hash.substring(1);
                
                if (sectionId && this.currentDoc) {
                    // Scroll to the section without adding to history
                    this.scrollToSection(sectionId);
                    this.setActiveLink(sectionId);
                }
            }
        });
        
        // Handle popstate events (back/forward browser buttons)
        window.addEventListener('popstate', (event) => {
            // When user presses back/forward, restore the state
            if (event.state) {
                const { docId, sectionId } = event.state;
                
                // Prevent scroll tracking during state restoration
                this.isManualNavigation = true;
                
                // Check if we need to reload the documentation
                if (docId !== this.currentDoc) {
                    this.loadDocumentationById(docId, sectionId, false);
                } else if (sectionId) {
                    // Just scroll to section
                    this.scrollToSection(sectionId);
                    this.setActiveLink(sectionId);
                }
                
                setTimeout(() => {
                    this.isManualNavigation = false;
                }, 100);
            } else if (window.location.hash) {
                // Handle case where there's a hash but no state
                const sectionId = window.location.hash.substring(1);
                if (sectionId) {
                    this.isManualNavigation = true;
                    this.scrollToSection(sectionId);
                    this.setActiveLink(sectionId);
                    setTimeout(() => {
                        this.isManualNavigation = false;
                    }, 100);
                }
            } else {
                // If no state and no hash, we might be back at initial page load
                // Check if we need to redirect to selector
                const docId = this.getQueryParam('doc');
                if (!docId) {
                    window.location.href = 'documentation-selector.html';
                }
            }
        });
        
        // Stop propagation on TOC links to prevent body click handler from firing
        this.docTocList.addEventListener('click', (event) => {
            event.stopPropagation();
        });
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
            sectionLink.href = `#${section.id}`;
            sectionLink.className = 'list-group-item list-group-item-action';
            sectionLink.textContent = section.title;
            sectionLink.setAttribute('data-section-id', section.id);
            
            // Handle click on section link
            sectionLink.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Mark as manual navigation
                this.isManualNavigation = true;
                
                // Set section as active
                this.setActiveLink(section.id);
                
                // Scroll to section
                this.scrollToSection(section.id);
                
                // Update URL with hash fragment
                const url = `?doc=${this.currentDoc}#${section.id}`;
                const state = {
                    docId: this.currentDoc,
                    sectionId: section.id
                };
                
                history.pushState(state, '', url);
                
                // Reset flags after short delay
                setTimeout(() => {
                    this.isManualNavigation = false;
                }, 100);
            });
            
            this.docTocList.appendChild(sectionLink);
            
            // Add subsections if available
            if (section.content) {
                this.addSubsectionsToToc(section);
            }
        });
    }
    
    addSubsectionsToToc(section) {
        // Find subSections in the content
        section.content.forEach(item => {
            if (item.type === 'subSection') {
                // Create subsection link with indentation
                const subsectionLink = document.createElement('a');
                const combinedId = `${section.id}-${item.id}`;
                
                subsectionLink.href = `#${combinedId}`;
                subsectionLink.className = 'list-group-item list-group-item-action ps-4';
                subsectionLink.innerHTML = `<small>→ ${item.title}</small>`;
                subsectionLink.setAttribute('data-section-id', combinedId);
                
                // Handle click on subsection link
                subsectionLink.addEventListener('click', (event) => {
                    event.preventDefault();
                    
                    // Mark as manual navigation
                    this.isManualNavigation = true;
                    
                    // Scroll to subsection
                    this.scrollToSection(combinedId);
                    
                    // Set subsection as active
                    this.setActiveLink(combinedId);
                    
                    // Update URL with hash fragment
                    const url = `?doc=${this.currentDoc}#${combinedId}`;
                    const state = {
                        docId: this.currentDoc,
                        sectionId: combinedId
                    };
                    
                    history.pushState(state, '', url);
                    
                    // Reset flags after short delay
                    setTimeout(() => {
                        this.isManualNavigation = false;
                    }, 100);
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
                    
                case 'image':
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'doc-image-container';
                    
                    const img = document.createElement('img');
                    img.src = item.url;
                    img.alt = item.alt || item.caption || 'Documentation image';
                    img.className = 'doc-image';
                    
                    imgContainer.appendChild(img);
                    
                    // Add caption if provided
                    if (item.caption) {
                        const caption = document.createElement('figcaption');
                        caption.className = 'doc-image-caption';
                        caption.textContent = item.caption;
                        imgContainer.appendChild(caption);
                    }
                    
                    parentElement.appendChild(imgContainer);
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
            
            // Temporarily disable scroll tracking during programmatic scrolling
            this.isScrolling = true;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Re-enable scroll tracking after animation completes
            setTimeout(() => {
                this.isScrolling = false;
            }, 500);
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
        // Skip scroll handling during programmatic scrolling or manual navigation
        if (this.isScrolling || this.isManualNavigation || this.isInitialLoad) {
            return;
        }
        
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
        
        // If found a visible section, update the active link and URL hash
        if (currentSectionId) {
            this.setActiveLink(currentSectionId);
            
            // Use replaceState to update URL without affecting browser history
            const url = `?doc=${this.currentDoc}#${currentSectionId}`;
            const state = {
                docId: this.currentDoc,
                sectionId: currentSectionId
            };
            
            history.replaceState(state, '', url);
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
                const textToCopy = code.innerText || code.textContent;
                
                let copySuccess = false;
                
                // Try using the Clipboard API first (modern browsers)
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            copySuccess = true;
                            showCopySuccess();
                        })
                        .catch(err => {
                            console.error('Error with Clipboard API:', err);
                            fallbackCopyMethod();
                        });
                } else {
                    // Fallback for browsers without Clipboard API
                    fallbackCopyMethod();
                }
                
                // Fallback copy method using textarea
                function fallbackCopyMethod() {
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    
                    // Make the textarea out of viewport
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    
                    // Focus and select the text
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        // Execute the copy command
                        const successful = document.execCommand('copy');
                        copySuccess = successful;
                        if (successful) {
                            showCopySuccess();
                        } else {
                            showCopyError('Copy command failed');
                        }
                    } catch (err) {
                        console.error('Fallback copy error:', err);
                        showCopyError('Copy not supported');
                    }
                    
                    // Remove the textarea
                    document.body.removeChild(textArea);
                }
                
                // Show success feedback
                function showCopySuccess() {
                    copyButton.innerHTML = '<i class="bi bi-clipboard-check"></i> Copied!';
                    copyButton.classList.add('copied');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                        copyButton.classList.remove('copied');
                    }, 2000);
                }
                
                // Show error feedback
                function showCopyError(errorMsg) {
                    copyButton.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Error!';
                    console.error('Copy failed:', errorMsg);
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                    }, 2000);
                }
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