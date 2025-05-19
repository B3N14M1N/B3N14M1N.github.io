// Subheading Component Factory
// Creates subheading components for documentation

/**
 * Factory for creating subheading components
 * @extends ComponentFactory
 */
class SubheadingFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'subheading';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
        const h3 = document.createElement('h3');
        h3.className = item.className || '';
        h3.textContent = item.text;
        return h3;
    }
}

// Make the factory available globally
window.SubheadingFactory = SubheadingFactory;