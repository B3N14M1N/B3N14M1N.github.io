// Component Factory Manager
// Coordinates all individual component factories to create the appropriate components

/**
 * Manager class that coordinates between different component factories
 */
class ComponentFactoryManager {
    /**
     * Constructor initializes the available factories
     */
    constructor() {
        this.factories = [];
        
        // Register all available factories
        this.registerFactory(new ParagraphFactory());
        this.registerFactory(new ImageFactory());
        this.registerFactory(new SubheadingFactory());
        this.registerFactory(new ListFactory());
        this.registerFactory(new CodeFactory());
        this.registerFactory(new FaqFactory());
        this.registerFactory(new SubSectionFactory());
    }
    
    /**
     * Registers a factory with the manager
     * @param {ComponentFactory} factory - The factory to register
     */
    registerFactory(factory) {
        if (factory instanceof ComponentFactory) {
            this.factories.push(factory);
        } else {
            console.error('Invalid factory: must be an instance of ComponentFactory');
        }
    }
    
    /**
     * Creates a component based on the provided item data
     * @param {Object} item - The item data from the documentation JSON
     * @param {string} sectionId - The parent section ID (for subsections)
     * @param {Function} contentRendererCallback - Callback function for rendering nested content
     * @returns {HTMLElement|null} The created component or null if not supported
     */
    createComponent(item, sectionId, contentRendererCallback) {
        if (!item || !item.type) {
            console.warn('Invalid item or missing type');
            return null;
        }
        
        // Find a factory that can create this component type
        for (const factory of this.factories) {
            if (factory.canCreate(item.type)) {
                // For subsections, we need to pass the contentRendererCallback
                if (item.type === 'subSection') {
                    return factory.create(item, sectionId, contentRendererCallback);
                } else {
                    return factory.create(item);
                }
            }
        }
        
        // If no factory was found for this type
        console.warn(`No factory found for component type: ${item.type}`);
        return null;
    }
    
    /**
     * Adds event listeners and functionality to components after they've been added to the DOM
     * Currently only handles code blocks
     */
    postProcessComponents() {
        // Add copy functionality to code blocks
        const codeBlocks = document.querySelectorAll('pre');
        codeBlocks.forEach(codeBlock => {
            CodeFactory.addCopyFunctionality(codeBlock);
        });
        
        // Apply syntax highlighting if hljs is available
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    }
}

// Make the factory manager available globally
window.ComponentFactoryManager = ComponentFactoryManager;