# Rental System Setup Guide

This guide explains how to set up the rental system collections in PocketBase to support cosplay outfit availability checking and shipping tracking.

## Required Collections

### 1. rental_orders

**Purpose**: Store rental order information

**Fields**:
- `orderNumber` (text, required) - Unique order identifier
- `outfitId` (relation, required) - Reference to itemList collection
- `renterId` (relation, required) - Reference to users collection (person renting)
- `ownerId` (relation, required) - Reference to users collection (costume owner)
- `rentalPeriod` (json, required) - Object with startDate and endDate
- `totalAmount` (number, required) - Total rental cost
- `depositAmount` (number, optional) - Security deposit amount
- `status` (select, required) - Order status
  - Options: pending, confirmed, preparing, shipped, delivered, in_use, returning, returned, completed, cancelled
- `shippingAddress` (text, required) - Delivery address
- `shippingMethod` (select, required) - Delivery method
  - Options: pickup, delivery, meetup
- `estimatedDelivery` (date, optional) - Expected delivery date
- `trackingNumber` (text, optional) - Shipping tracking number
- `shippingStatus` (select, required) - Current shipping status
  - Options: pending, label_created, picked_up, in_transit, out_for_delivery, delivered, return_to_sender, exception
- `notes` (text, optional) - Additional notes

**Rules**:
- Only authenticated users can create records
- Users can only view their own rentals (renterId = @request.auth.id) or their owned costumes (ownerId = @request.auth.id)

### 2. shipping_updates

**Purpose**: Track shipping status updates

**Fields**:
- `rentalOrderId` (relation, required) - Reference to rental_orders collection
- `status` (select, required) - Shipping status
  - Options: pending, label_created, picked_up, in_transit, out_for_delivery, delivered, return_to_sender, exception
- `location` (text, optional) - Current location
- `description` (text, required) - Status description
- `timestamp` (date, required) - When the update occurred
- `trackingNumber` (text, optional) - Associated tracking number

**Rules**:
- Only authenticated users can create records
- Users can only view updates for their own rentals

### 3. rental_availability

**Purpose**: Track outfit availability and maintenance status

**Fields**:
- `outfitId` (relation, required) - Reference to itemList collection
- `isAvailable` (bool, required) - Whether outfit is available for rent
- `availableFrom` (date, optional) - When outfit becomes available
- `availableUntil` (date, optional) - When outfit becomes unavailable
- `currentRental` (relation, optional) - Reference to active rental_orders
- `maintenanceMode` (bool, required) - Whether outfit is under maintenance
- `maintenanceReason` (text, optional) - Reason for maintenance

**Rules**:
- Only authenticated users can create/update records
- Users can only manage availability for their own outfits

## Setup Instructions

### 1. Create Collections in PocketBase Admin

1. Log into your PocketBase admin panel
2. Go to "Collections" in the sidebar
3. Click "New collection" for each of the above collections
4. Add the fields as specified above
5. Set up the rules for each collection

### 2. Update Existing itemList Collection

Add a new field to the existing `itemList` collection:
- `rentalEnabled` (bool, default: true) - Whether this item can be rented

### 3. API Endpoints

The following API endpoints are available:

#### Check Rental Availability
```
POST /api/rental/check-availability
Body: {
  "outfitId": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

#### Shipping Tracking
```
GET /api/rental/shipping-tracking?rentalOrderId=string&trackingNumber=string
POST /api/rental/shipping-tracking
Body: {
  "rentalOrderId": "string",
  "status": "string",
  "location": "string",
  "description": "string",
  "trackingNumber": "string"
}
```

## Usage Examples

### Checking Availability

```javascript
const response = await fetch('/api/rental/check-availability', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    outfitId: 'anime-alya-001',
    startDate: '2024-01-15',
    endDate: '2024-01-17'
  })
});

const result = await response.json();
console.log(result.data.isAvailable); // true/false
```

### Creating Shipping Update

```javascript
const response = await fetch('/api/rental/shipping-tracking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rentalOrderId: 'order-123',
    status: 'in_transit',
    location: 'Bangkok Sorting Center',
    description: 'Package is in transit to delivery center',
    trackingNumber: 'TH123456789'
  })
});
```

## Components

### RentalAvailabilityChecker
A component that allows users to check availability for a specific date range.

```svelte
<RentalAvailabilityChecker
  outfitId="anime-alya-001"
  outfitName="Anime Alya Cosplay"
  on:availabilityChecked={handleAvailabilityChecked}
  on:rentalRequested={handleRentalRequested}
/>
```

### ShippingTracking
A component that displays shipping tracking information.

```svelte
<ShippingTracking
  rentalOrderId="order-123"
  trackingNumber="TH123456789"
/>
```

### RentalAvailabilityBadge
A small badge component showing availability status.

```svelte
<RentalAvailabilityBadge
  availability={availabilityData}
  showDetails={true}
  size="md"
/>
```

## Integration with Existing Pages

To integrate these features into existing outfit detail pages:

1. Add the `RentalAvailabilityChecker` component to outfit detail pages
2. Add shipping tracking to order management pages
3. Update the existing purchase system to handle rental orders

## Testing

You can test the features by visiting `/rental-management` which provides a demo interface for:
- Checking rental availability
- Tracking shipping
- Viewing recent availability checks

## Notes

- The system is designed to work with the existing `itemList` collection
- Shipping tracking supports multiple courier services
- Availability checking considers maintenance mode and conflicting rentals
- All components support both Thai and English interfaces