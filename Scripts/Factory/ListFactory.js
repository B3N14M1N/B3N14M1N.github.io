// List Component Factory
// Creates unordered list components for documentation

/**
 * Factory for creating list components
 * @extends ComponentFactory
 */
class ListFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'list';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
        const ul = document.createElement('ul');
        item.items.forEach(listItem => {
            const li = document.createElement('li');
            li.textContent = listItem;
            ul.appendChild(li);
        });
        return ul;
    }
}

// Make the factory available globally
window.ListFactory = ListFactory;