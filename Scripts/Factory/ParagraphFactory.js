// Paragraph Component Factory
// Creates paragraph components for documentation

/**
 * Factory for creating paragraph components
 * @extends ComponentFactory
 */
class ParagraphFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'paragraph';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
        const p = document.createElement('p');
        p.innerHTML = item.text;
        return p;
    }
}

// Make the factory available globally
window.ParagraphFactory = ParagraphFactory;