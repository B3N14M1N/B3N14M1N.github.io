// SubSection Component Factory
// Creates subsections with nested content for documentation

/**
 * Factory for creating subsection components
 * @extends ComponentFactory
 */
class SubSectionFactory extends ComponentFactory {
    /**
     * @inheritdoc
     */
    canCreate(type) {
        return type === 'subSection';
    }
    
    /**
     * @inheritdoc
     */
    create(item, sectionId, contentRenderer) {
        if (!this.canCreate(item.type)) return null;
        if (!contentRenderer) {
            console.error('SubSectionFactory requires a contentRenderer function');
            return null;
        }
        
        // Create subsection with unique ID combining parent section ID and subsection ID
        const subSection = document.createElement('div');
        subSection.id = `${sectionId}-${item.id}`;
        subSection.className = 'doc-subsection mt-4 pt-2 border-top';
        
        // Create subsection title
        const subSectionTitle = document.createElement('h3');
        subSectionTitle.className = 'mb-3';
        subSectionTitle.textContent = item.title;
        subSection.appendChild(subSectionTitle);
        
        // Recursively render subsection content using the provided renderer function
        if (item.content && Array.isArray(item.content)) {
            contentRenderer(item.content, subSection, `${sectionId}-${item.id}`);
        }
        
        return subSection;
    }
}

// Make the factory available globally
window.SubSectionFactory = SubSectionFactory;