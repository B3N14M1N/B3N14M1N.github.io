// Web API documentation data
const webApiData = {
    id: "web-api",
    title: "Web API Documentation",
    description: "Guide to using the REST API for website integration",
    thumbnail: "https://via.placeholder.com/600x400?text=Web+API",
    tags: ["Web", "REST", "API"],
    
    // Content details
    content: {
        title: "Web API Documentation",
        description: "Guide to using the REST API for website integration",
        sections: [
            {
                id: "api-overview",
                title: "API Overview",
                content: [
                    {
                        type: "paragraph",
                        text: "This documentation provides details about the Web API endpoints, authentication requirements, and examples of how to use the API."
                    }
                ]
            },
            {
                id: "authentication",
                title: "Authentication",
                content: [
                    {
                        type: "paragraph",
                        text: "All API requests require an API key for authentication."
                    },
                    {
                        type: "subheading",
                        text: "Getting an API Key"
                    },
                    {
                        type: "paragraph",
                        text: "You can obtain an API key by registering on our developer portal."
                    },
                    {
                        type: "subheading",
                        text: "Using the API Key"
                    },
                    {
                        type: "paragraph",
                        text: "Include the API key in the request header:"
                    },
                    {
                        type: "code",
                        language: "javascript",
                        text: "fetch('https://api.example.com/data', {\n    headers: {\n        'Authorization': 'Bearer YOUR_API_KEY'\n    }\n})"
                    }
                ]
            },
            {
                id: "endpoints",
                title: "API Endpoints",
                content: [
                    {
                        type: "paragraph",
                        text: "The API provides the following endpoints for accessing and manipulating data."
                    },
                    {
                        type: "subSection",
                        title: "User Endpoints",
                        id: "user-endpoints",
                        content: [
                            {
                                type: "code",
                                language: "http",
                                text: "GET /api/users\nGET /api/users/{id}\nPOST /api/users\nPUT /api/users/{id}\nDELETE /api/users/{id}"
                            },
                            {
                                type: "paragraph",
                                text: "These endpoints allow you to retrieve, create, update, and delete user accounts."
                            }
                        ]
                    },
                    {
                        type: "subSection",
                        title: "Content Endpoints",
                        id: "content-endpoints",
                        content: [
                            {
                                type: "code",
                                language: "http",
                                text: "GET /api/content\nGET /api/content/{id}\nPOST /api/content\nPUT /api/content/{id}\nDELETE /api/content/{id}"
                            },
                            {
                                type: "paragraph",
                                text: "These endpoints allow you to retrieve, create, update, and delete content items."
                            }
                        ]
                    }
                ]
            }
        ]
    }
};