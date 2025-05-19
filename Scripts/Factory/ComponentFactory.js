// Base Component Factory
// This serves as the foundation for all documentation component factories

/**
 * Base class for all component factories
 * Each component factory should extend this class and implement the create method
 */
class ComponentFactory {
    /**
     * Determines if this factory can create a component of the given type
     * @param {string} type - The type of component to check
     * @returns {boolean} True if this factory can create components of this type
     */
    canCreate(type) {
        return false; // Base factory doesn't create any components directly
    }
    
    /**
     * Creates a component based on the provided item data
     * @param {Object} item - The item data from the documentation JSON
     * @returns {HTMLElement|null} The created component or null if not supported
     */
    create(item) {
        return null; // Base implementation returns null
    }
}

// Make the factory available globally
window.ComponentFactory = ComponentFactory;