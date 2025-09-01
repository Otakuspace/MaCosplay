// Test script for rental API endpoints
// Run with: node test-rental-api.js

const BASE_URL = 'http://localhost:5173'; // Update this to your dev server URL

async function testAvailabilityCheck() {
    console.log('Testing rental availability check...');
    
    try {
        const response = await fetch(`${BASE_URL}/api/rental/check-availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                outfitId: 'anime-alya-001',
                startDate: '2024-01-15',
                endDate: '2024-01-17'
            })
        });

        const result = await response.json();
        console.log('Availability check result:', result);
        
        if (result.success) {
            console.log('✅ Availability check successful');
            console.log('Is available:', result.data.isAvailable);
            if (result.data.maintenanceMode) {
                console.log('Maintenance reason:', result.data.maintenanceReason);
            }
        } else {
            console.log('❌ Availability check failed:', result.message);
        }
    } catch (error) {
        console.error('❌ Error testing availability check:', error);
    }
}

async function testShippingTracking() {
    console.log('\nTesting shipping tracking...');
    
    try {
        // Test GET request
        const getResponse = await fetch(`${BASE_URL}/api/rental/shipping-tracking?trackingNumber=TH123456789`);
        const getResult = await getResponse.json();
        console.log('GET shipping tracking result:', getResult);
        
        if (getResult.success) {
            console.log('✅ GET shipping tracking successful');
        } else {
            console.log('❌ GET shipping tracking failed:', getResult.message);
        }

        // Test POST request
        const postResponse = await fetch(`${BASE_URL}/api/rental/shipping-tracking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rentalOrderId: 'demo-order-123',
                status: 'in_transit',
                location: 'Bangkok Sorting Center',
                description: 'Package is in transit to delivery center',
                trackingNumber: 'TH123456789'
            })
        });

        const postResult = await postResponse.json();
        console.log('POST shipping tracking result:', postResult);
        
        if (postResult.success) {
            console.log('✅ POST shipping tracking successful');
        } else {
            console.log('❌ POST shipping tracking failed:', postResult.message);
        }
    } catch (error) {
        console.error('❌ Error testing shipping tracking:', error);
    }
}

async function testRentalManagementPage() {
    console.log('\nTesting rental management page...');
    
    try {
        const response = await fetch(`${BASE_URL}/rental-management`);
        console.log('Rental management page status:', response.status);
        
        if (response.ok) {
            console.log('✅ Rental management page accessible');
        } else {
            console.log('❌ Rental management page not accessible');
        }
    } catch (error) {
        console.error('❌ Error testing rental management page:', error);
    }
}

async function runAllTests() {
    console.log('🚀 Starting rental API tests...\n');
    
    await testAvailabilityCheck();
    await testShippingTracking();
    await testRentalManagementPage();
    
    console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    runAllTests();
}

// Export for use in other files
export { testAvailabilityCheck, testShippingTracking, testRentalManagementPage };