// Voxel-System documentation data
const voxelSystemData = {
    id: "voxel-system",
    title: "Voxel-System Documentation",
    description: "Comprehensive guide and API reference for the Voxel-System project",
    thumbnail: "https://via.placeholder.com/600x400?text=Voxel+System",
    tags: ["Game Development", "C#", "Unity"],
    
    // Content details
    content: {
        title: "Voxel-System Documentation",
        description: "Comprehensive guide and API reference for the Voxel-System project",
        sections: [
            {
                id: "introduction",
                title: "Introduction",
                content: [
                    {
                        type: "paragraph",
                        text: "Welcome to the Voxel-System documentation. This guide will help you understand and utilize the voxel system effectively in your projects. The voxel system is designed to create and manage voxel-based worlds with high performance and flexibility."
                    },
                    {
                        type: "subheading",
                        text: "What is a Voxel?"
                    },
                    {
                        type: "paragraph",
                        text: "A voxel (volumetric pixel) is a value in a regular grid in three-dimensional space. Like pixels in a 2D bitmap, voxels themselves do not typically have their position explicitly encoded along with their values. Instead, the position of a voxel is inferred based upon its position relative to other voxels (i.e., its position in the data structure that makes up a single volumetric image)."
                    },
                    {
                        type: "subheading",
                        text: "Key Features"
                    },
                    {
                        type: "list",
                        items: [
                            "Efficient memory usage",
                            "Fast mesh generation",
                            "Multithreaded chunk loading",
                            "Customizable voxel types",
                            "Procedural terrain generation",
                            "Runtime editing capabilities"
                        ]
                    }
                ]
            },
            {
                id: "getting-started",
                title: "Getting Started",
                content: [
                    {
                        type: "paragraph",
                        text: "Follow these steps to get started with the Voxel-System."
                    },
                    {
                        type: "subheading",
                        text: "Installation"
                    },
                    {
                        type: "paragraph",
                        text: "Clone the repository to your local machine:"
                    },
                    {
                        type: "code",
                        language: "bash",
                        text: "git clone https://github.com/username/Voxel-System.git\ncd Voxel-System"
                    },
                    {
                        type: "subheading",
                        text: "Basic Usage"
                    },
                    {
                        type: "paragraph",
                        text: "Here's a simple example to create a voxel world:"
                    },
                    {
                        type: "code",
                        language: "csharp",
                        text: "// Initialize the voxel system\nVoxelWorld world = new VoxelWorld(new Vector3(16, 16, 16), 1.0f);\n\n// Create a voxel chunk\nVoxelChunk chunk = world.CreateChunk(Vector3.zero);\n\n// Set some voxels\nchunk.SetVoxel(new Vector3Int(0, 0, 0), new Voxel(1, VoxelType.Solid));\nchunk.SetVoxel(new Vector3Int(1, 0, 0), new Voxel(2, VoxelType.Solid));\n\n// Generate mesh for rendering\nchunk.GenerateMesh();"
                    }
                ]
            },
            {
                id: "core-concepts",
                title: "Core Concepts",
                content: [
                    {
                        type: "paragraph",
                        text: "Understanding these core concepts will help you work effectively with the Voxel-System."
                    },
                    {
                        type: "subheading",
                        text: "VoxelWorld"
                    },
                    {
                        type: "paragraph",
                        text: "The VoxelWorld class is the main entry point for working with the voxel system. It manages chunks and provides high-level operations for the voxel environment."
                    },
                    {
                        type: "subheading",
                        text: "VoxelChunk"
                    },
                    {
                        type: "paragraph",
                        text: "A VoxelChunk represents a section of the world containing multiple voxels. Chunks are the primary unit of organization and optimization in the system."
                    },
                    {
                        type: "subheading",
                        text: "Voxel"
                    },
                    {
                        type: "paragraph",
                        text: "The basic building block of the system. Each voxel contains information about its type and properties."
                    }
                ]
            },
            {
                id: "api-reference",
                title: "API Reference",
                content: [
                    {
                        type: "paragraph",
                        text: "Detailed documentation of the classes and methods available in the Voxel-System."
                    },
                    {
                        type: "subheading",
                        text: "VoxelWorld Class"
                    },
                    {
                        type: "code",
                        language: "csharp",
                        text: "public class VoxelWorld\n{\n    // Properties\n    public Vector3 ChunkSize { get; }\n    public float VoxelSize { get; }\n    \n    // Methods\n    public VoxelChunk CreateChunk(Vector3 position);\n    public VoxelChunk GetChunkAt(Vector3 position);\n    public Voxel GetVoxelAt(Vector3 position);\n    public void SetVoxelAt(Vector3 position, Voxel voxel);\n}"
                    },
                    {
                        type: "subheading",
                        text: "VoxelChunk Class"
                    },
                    {
                        type: "code",
                        language: "csharp",
                        text: "public class VoxelChunk\n{\n    // Properties\n    public Vector3 Position { get; }\n    public Vector3Int Size { get; }\n    \n    // Methods\n    public Voxel GetVoxel(Vector3Int localPosition);\n    public void SetVoxel(Vector3Int localPosition, Voxel voxel);\n    public bool IsVoxelSolid(Vector3Int localPosition);\n    public void GenerateMesh();\n}"
                    },
                    {
                        type: "subheading",
                        text: "Voxel Struct"
                    },
                    {
                        type: "code",
                        language: "csharp",
                        text: "public struct Voxel\n{\n    // Properties\n    public int ID { get; }\n    public VoxelType Type { get; }\n    \n    // Constructor\n    public Voxel(int id, VoxelType type);\n}"
                    }
                ]
            },
            {
                id: "examples",
                title: "Examples",
                content: [
                    {
                        type: "paragraph",
                        text: "Practical examples to help you understand how to use the Voxel-System effectively."
                    },
                    {
                        type: "subheading",
                        text: "Generating Procedural Terrain"
                    },
                    {
                        type: "paragraph",
                        text: "Here's an example of generating procedural terrain using Perlin noise:"
                    },
                    {
                        type: "code",
                        language: "csharp",
                        text: "void GenerateTerrain(VoxelChunk chunk, float seed)\n{\n    // Loop through each position in the chunk\n    for (int x = 0; x < chunk.Size.x; x++)\n    {\n        for (int z = 0; z < chunk.Size.z; z++)\n        {\n            // Calculate height using Perlin noise\n            float noiseValue = Mathf.PerlinNoise(\n                (chunk.Position.x + x) * 0.1f + seed,\n                (chunk.Position.z + z) * 0.1f + seed\n            );\n            \n            int height = Mathf.FloorToInt(noiseValue * 10) + 5;\n            \n            // Fill voxels up to the calculated height\n            for (int y = 0; y < chunk.Size.y; y++)\n            {\n                if (y <= height)\n                {\n                    // Determine voxel type based on height\n                    VoxelType type = VoxelType.Solid;\n                    int id = 1; // Stone\n                    \n                    if (y == height)\n                    {\n                        id = 2; // Grass\n                    }\n                    else if (y > height - 3 && y < height)\n                    {\n                        id = 3; // Dirt\n                    }\n                    \n                    chunk.SetVoxel(new Vector3Int(x, y, z), new Voxel(id, type));\n                }\n            }\n        }\n    }\n    \n    // Generate the mesh for rendering\n    chunk.GenerateMesh();\n}"
                    }
                ]
            },
            {
                id: "faq",
                title: "Frequently Asked Questions",
                content: [
                    {
                        type: "faq",
                        items: [
                            {
                                question: "How many voxels can a chunk contain?",
                                answer: "A chunk size is customizable, but the default is 16x16x16 voxels for a total of 4,096 voxels per chunk. This balances performance and memory usage for most applications."
                            },
                            {
                                question: "Is multithreading supported?",
                                answer: "Yes, the system is designed to take advantage of multithreading for mesh generation and chunk loading operations. This significantly improves performance on modern hardware."
                            },
                            {
                                question: "How is memory usage optimized?",
                                answer: "The system uses various optimization techniques such as chunk pooling, compressed voxel storage, and distance-based chunk loading to minimize memory usage while maintaining good performance."
                            },
                            {
                                question: "Can I use custom voxel types?",
                                answer: "Yes, the system supports extending the VoxelType enum and adding custom properties to voxels. You can also create custom rendering behaviors for different voxel types."
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// Auto-register this documentation module
if (typeof registerDocumentation === 'function') {
    registerDocumentation(voxelSystemData);
}