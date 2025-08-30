// Simple test script to verify the image checking API
async function testImageAPI() {
    const testItemIds = [
        'anime-alya-001',
        'makima-cosplay-002', 
        'venti-outfit-003',
        'custom-item-123'
    ];

    console.log('Testing Image API...\n');

    for (const itemId of testItemIds) {
        try {
            const response = await fetch(`http://localhost:5173/api/check-images?itemId=${itemId}`);
            const result = await response.json();
            
            console.log(`\n=== Testing Item ID: ${itemId} ===`);
            console.log(`Status: ${response.status}`);
            console.log(`Available Images: ${result.count || 0}`);
            
            if (result.availableImages && result.availableImages.length > 0) {
                console.log('Found images:');
                result.availableImages.forEach(img => {
                    console.log(`  - ${img.type}: ${img.path}`);
                });
            } else {
                console.log('No item-specific images found, will use fallbacks');
            }
        } catch (error) {
            console.error(`Error testing ${itemId}:`, error.message);
        }
    }

    console.log('\n=== Test URLs ===');
    testItemIds.forEach(itemId => {
        console.log(`http://localhost:5173/store/demo/${itemId}`);
    });
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = (await import('node-fetch')).default;
    global.fetch = fetch;
    testImageAPI();
} else {
    // Browser environment
    testImageAPI();
}