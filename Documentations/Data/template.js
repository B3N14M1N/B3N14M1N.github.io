// Documentation template - Copy this when creating a new documentation file
// Remember to rename the variable and update all the content

// Replace "templateData" with a meaningful name for your documentation
const templateData = {
    // Required metadata (must have all these fields)
    id: "unique-template-id", // Use a unique, URL-friendly ID (no spaces, lowercase)
    title: "Documentation Title",
    description: "Brief description of what this documentation covers",
    thumbnail: "https://via.placeholder.com/600x400?text=Your+Title", // URL to thumbnail image
    tags: ["Tag1", "Tag2", "Tag3"], // Relevant tags/categories
    
    // Content details
    content: {
        title: "Documentation Title", // Same as above, used in the documentation view
        description: "Brief description of what this documentation covers", // Same as above
        sections: [
            {
                id: "section-1", // Unique ID for this section (URL-friendly)
                title: "Section 1 Title",
                content: [
                    {
                        type: "paragraph",
                        text: "Your paragraph text here. You can use <strong>HTML</strong> tags for formatting."
                    },
                    {
                        type: "subheading", 
                        text: "Subheading Example"
                    },
                    {
                        type: "image",
                        url: "https://via.placeholder.com/800x400?text=Documentation+Image",
                        alt: "Example documentation image",
                        caption: "This is an example image with a caption below it"
                    },
                    {
                        type: "list",
                        items: [
                            "List item 1",
                            "List item 2",
                            "List item 3"
                        ]
                    },
                    {
                        type: "code",
                        language: "javascript", // Language for syntax highlighting
                        text: "// Example code\nfunction example() {\n  console.log('Hello world');\n}"
                    }
                ]
            },
            {
                id: "section-2",
                title: "Section 2 Title",
                content: [
                    {
                        type: "paragraph",
                        text: "Another paragraph example."
                    },
                    {
                        type: "subSection", // Creates a nested section
                        title: "Subsection Example",
                        id: "subsection-example", 
                        content: [
                            {
                                type: "paragraph",
                                text: "Content inside a subsection."
                            },
                            {
                                type: "image",
                                url: "https://via.placeholder.com/600x300?text=Subsection+Image",
                                caption: "Images can also be added inside subsections"
                            }
                        ]
                    }
                ]
            }
            // Add more sections as needed
        ]
    }
};

/* ===== IMPORTANT: Self-registration code ===== */
/* DO NOT modify this - it registers your documentation with the system */
if (typeof registerDocumentation === 'function') {
    registerDocumentation(templateData);
}