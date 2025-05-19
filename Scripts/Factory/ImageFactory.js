// Image Component Factory
// Creates image components with optional captions for documentation

/**
 * Factory for creating image components
 * @extends ComponentFactory
 */
class ImageFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'image';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
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
        
        return imgContainer;
    }
}

// Make the factory available globally
window.ImageFactory = ImageFactory;