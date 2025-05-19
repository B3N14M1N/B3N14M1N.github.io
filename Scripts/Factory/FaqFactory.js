// FAQ Component Factory
// Creates FAQ items for documentation

/**
 * Factory for creating FAQ components
 * @extends ComponentFactory
 */
class FaqFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'faq';
    }
    
    /**
     * @inheritdoc
     */
    create(item) {
        if (!this.canCreate(item.type)) return null;
        
        const faqContainer = document.createElement('div');
        faqContainer.className = 'faq-container';
        
        // Create a card for each FAQ item
        item.items.forEach((faqItem, index) => {
            const card = document.createElement('div');
            card.className = 'card mb-3';
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${faqItem.question}</h5>
                    <p class="card-text">${faqItem.answer}</p>
                </div>
            `;
            faqContainer.appendChild(card);
        });
        
        return faqContainer;
    }
}

// Make the factory available globally
window.FaqFactory = FaqFactory;