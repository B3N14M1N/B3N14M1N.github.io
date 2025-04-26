// Documentation page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the documentation page
    if (window.location.pathname.includes('documentation.html')) {
        initializeDocumentation();
    }
    
    function initializeDocumentation() {
        // Initialize code highlighting if hljs is available
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
        
        // Sidebar functionality
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
        
        // Close mobile sidebar when clicking navigation links
        const sidebarLinks = document.querySelectorAll('#doc-sidebar .list-group-item');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('show');
                }
                
                // Smooth scroll to target
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Prevent default anchor behavior
                    event.preventDefault();
                }
            });
        });
        
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
        
        // Make sidebar links active when scrolling
        const sections = document.querySelectorAll('.doc-content');
        const navLinks = document.querySelectorAll('#doc-sidebar .list-group-item');
        
        function setActiveLink() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', setActiveLink);
        
        // Initial call to set the active link based on current scroll position
        setActiveLink();
        
        // Resize functionality
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992 && sidebar) {
                sidebar.classList.remove('show');
            }
        });
    }
});