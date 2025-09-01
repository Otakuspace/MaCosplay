# PocketBase Purchase List Collection Setup Guide

This guide will help you set up the necessary PocketBase collections for the purchase list functionality.

## Required Collections

### 1. Purchase Orders Collection (`purchase_orders`)

**Collection Settings:**
- Collection Name: `purchase_orders`
- Collection Type: Base
- API Rules: Authenticated users can only access their own orders

**Fields:**
```javascript
{
  "orderNumber": {
    "type": "text",
    "required": true,
    "unique": true,
    "pattern": "^ORD-\\d{4}-\\d{3,}$"
  },
  "user": {
    "type": "relation",
    "required": true,
    "collectionId": "users", // Reference to users collection
    "cascadeDelete": false
  },
  "items": {
    "type": "relation",
    "required": true,
    "collectionId": "purchase_items", // Reference to purchase_items collection
    "cascadeDelete": true,
    "maxSelect": null // Allow multiple items
  },
  "totalAmount": {
    "type": "number",
    "required": true,
    "min": 0
  },
  "status": {
    "type": "select",
    "required": true,
    "values": ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    "maxSelect": 1
  },
  "shippingAddress": {
    "type": "text",
    "required": true
  },
  "estimatedDelivery": {
    "type": "date",
    "required": false
  },
  "trackingNumber": {
    "type": "text",
    "required": false
  },
  "notes": {
    "type": "text",
    "required": false
  }
}
```

**API Rules:**
```javascript
// List/Search Rule (users can only see their own orders)
user = @request.auth.id

// View Rule (users can only view their own orders)
user = @request.auth.id

// Create Rule (users can only create orders for themselves)
user = @request.auth.id

// Update Rule (users can only update their own orders, and only certain fields)
user = @request.auth.id && 
(@request.data.status:isset = false || @request.data.user:isset = false)

// Delete Rule (users can only delete their own pending orders)
user = @request.auth.id && status = "pending"
```

### 2. Purchase Items Collection (`purchase_items`)

**Collection Settings:**
- Collection Name: `purchase_items`
- Collection Type: Base
- API Rules: Linked to purchase orders

**Fields:**
```javascript
{
  "product": {
    "type": "relation",
    "required": true,
    "collectionId": "products", // Reference to products collection
    "cascadeDelete": false
  },
  "productName": {
    "type": "text",
    "required": true
  },
  "productImage": {
    "type": "url",
    "required": false
  },
  "quantity": {
    "type": "number",
    "required": true,
    "min": 1
  },
  "unitPrice": {
    "type": "number",
    "required": true,
    "min": 0
  },
  "totalPrice": {
    "type": "number",
    "required": true,
    "min": 0
  },
  "size": {
    "type": "text",
    "required": false
  },
  "color": {
    "type": "text",
    "required": false
  },
  "customizations": {
    "type": "json",
    "required": false
  }
}
```

**API Rules:**
```javascript
// List/Search Rule (via purchase_orders relation)
@collection.purchase_orders.user ?= @request.auth.id

// View Rule (via purchase_orders relation)
@collection.purchase_orders.user ?= @request.auth.id

// Create Rule (via purchase_orders relation)
@collection.purchase_orders.user ?= @request.auth.id

// Update Rule (via purchase_orders relation)
@collection.purchase_orders.user ?= @request.auth.id

// Delete Rule (via purchase_orders relation)
@collection.purchase_orders.user ?= @request.auth.id
```

### 3. Shopping Cart Collection (`shopping_cart`) - Optional

For temporary storage before creating purchase orders:

**Collection Settings:**
- Collection Name: `shopping_cart`
- Collection Type: Base

**Fields:**
```javascript
{
  "user": {
    "type": "relation",
    "required": true,
    "collectionId": "users",
    "cascadeDelete": true
  },
  "product": {
    "type": "relation",
    "required": true,
    "collectionId": "products",
    "cascadeDelete": false
  },
  "quantity": {
    "type": "number",
    "required": true,
    "min": 1
  },
  "size": {
    "type": "text",
    "required": false
  },
  "color": {
    "type": "text",
    "required": false
  },
  "customizations": {
    "type": "json",
    "required": false
  }
}
```

## Setup Instructions

### Step 1: Access PocketBase Admin Panel
1. Navigate to your PocketBase admin panel (usually `http://localhost:8090/_/`)
2. Login with your admin credentials

### Step 2: Create Collections

#### Create `purchase_orders` Collection:
1. Go to "Collections" tab
2. Click "New Collection"
3. Set name to `purchase_orders`
4. Add all the fields listed above with their respective configurations
5. Set up the API rules as specified

#### Create `purchase_items` Collection:
1. Click "New Collection"
2. Set name to `purchase_items`
3. Add all the fields listed above
4. Set up the API rules as specified

#### Create `shopping_cart` Collection (Optional):
1. Click "New Collection"
2. Set name to `shopping_cart`
3. Add all the fields listed above
4. Set up basic API rules for user access

### Step 3: Configure Relations
1. Ensure the `users` collection exists (should already be created)
2. Ensure the `products` collection exists or create it
3. Verify all relation fields point to the correct collections

### Step 4: Test Collections
1. Use the PocketBase admin panel to create test records
2. Verify the relations work correctly
3. Test the API rules by making requests

## API Integration Examples

### Fetch User's Purchase Orders
```javascript
const orders = await pb.collection('purchase_orders').getList(1, 20, {
    filter: `user = "${userId}"`,
    sort: '-created',
    expand: 'items,items.product'
});
```

### Create New Purchase Order
```javascript
const orderData = {
    orderNumber: generateOrderNumber(),
    user: userId,
    items: itemIds, // Array of purchase_item IDs
    totalAmount: calculateTotal(),
    status: 'pending',
    shippingAddress: userAddress
};

const order = await pb.collection('purchase_orders').create(orderData);
```

### Update Order Status
```javascript
const updatedOrder = await pb.collection('purchase_orders').update(orderId, {
    status: 'confirmed',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
});
```

### Add Item to Shopping Cart
```javascript
const cartItem = await pb.collection('shopping_cart').create({
    user: userId,
    product: productId,
    quantity: 1,
    size: 'M',
    customizations: { color: 'red', notes: 'Special request' }
});
```

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```env
VITE_PB_URL=http://localhost:8090
VITE_AUTH_ADMIN_NAME=your_admin_email
VITE_AUTH_ADMIN_PASS=your_admin_password
```

## Security Considerations

1. **API Rules**: The provided API rules ensure users can only access their own data
2. **Authentication**: All purchase-related operations require user authentication
3. **Validation**: Use the schema validation to ensure data integrity
4. **Sensitive Data**: Never store payment information directly in PocketBase

## Additional Features to Consider

1. **Order History**: Track status changes with timestamps
2. **Payment Integration**: Link with payment providers (Stripe, PayPal, etc.)
3. **Inventory Management**: Track product availability
4. **Email Notifications**: Send order confirmations and status updates
5. **Order Analytics**: Track sales metrics and user behavior

## Migration Script (Optional)

If you need to migrate existing data, here's a sample script:

```javascript
// migration-script.js
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function migrateData() {
    // Authenticate as admin
    await pb.admins.authWithPassword('admin@example.com', 'admin_password');
    
    // Your migration logic here
    console.log('Migration completed');
}

migrateData().catch(console.error);
```

This setup provides a robust foundation for managing purchase orders and shopping cart functionality in your MaCosplay application.