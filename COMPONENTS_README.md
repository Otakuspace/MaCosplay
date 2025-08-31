# ItemList & ItemCard Components

This document describes the new ItemList and ItemCard components that properly display item data including tags from the `item.tags` array.

## Overview

The components have been refactored to:
1. **Properly display tags data** from the `item.tags` array instead of hardcoded values
2. **Separate concerns** with ItemCard handling individual items and ItemList managing the grid layout
3. **Provide better customization** options for different display scenarios
4. **Maintain consistency** across the application

## Components

### ItemCard.svelte

A reusable component for displaying individual items with full tag support.

**Location:** `src/lib/components/ItemCard.svelte`

**Props:**
- `item: ItemListRecord` - The item data to display
- `showRating: boolean` - Whether to show the rating badge (default: true)
- `showTags: boolean` - Whether to show tags (default: true)
- `showLocation: boolean` - Whether to show location (default: true)
- `showPrice: boolean` - Whether to show price (default: true)
- `showStoreInfo: boolean` - Whether to show store information (default: true)
- `compact: boolean` - Whether to use compact styling (default: false)
- `itemHeight: string` - CSS class for item height (default: 'h-48 sm:h-64')
- `clickable: boolean` - Whether the item is clickable (default: true)

**Events:**
- `itemClick: { item: ItemListRecord }` - Fired when the item is clicked
- `storeClick: { item: ItemListRecord }` - Fired when the store button is clicked
- `imageClick: { item: ItemListRecord }` - Fired when the image is clicked

**Features:**
- Displays Size and Status as special tag types with distinct colors
- Shows custom tags from `item.tags` array
- Handles tag overflow with "+X more" indicator
- Responsive design with dark mode support
- Optimized image loading with fallback

### ItemList.svelte

A grid layout component that displays multiple items using ItemCard components.

**Location:** `src/lib/components/ItemList.svelte`

**Props:**
- `items: ItemListRecord[]` - Array of items to display
- `loading: boolean` - Whether to show loading skeleton (default: false)
- `showRating: boolean` - Whether to show rating badges (default: true)
- `showTags: boolean` - Whether to show tags (default: true)
- `showLocation: boolean` - Whether to show location (default: true)
- `showPrice: boolean` - Whether to show prices (default: true)
- `showStoreInfo: boolean` - Whether to show store information (default: true)
- `gridCols: string` - CSS classes for grid columns (default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5')
- `itemHeight: string` - CSS class for item height (default: 'h-48 sm:h-64')
- `compact: boolean` - Whether to use compact styling (default: false)

**Events:**
- `itemClick: { item: ItemListRecord }` - Fired when any item is clicked
- `storeClick: { item: ItemListRecord }` - Fired when any store button is clicked
- `imageClick: { item: ItemListRecord }` - Fired when any image is clicked

**Features:**
- Responsive grid layout
- Loading skeleton states
- Empty state handling
- Event forwarding to parent components

## Usage Examples

### Basic ItemList Usage

```svelte
<script>
  import ItemList from '$lib/components/ItemList.svelte';
  
  let items = [/* your items array */];
  
  function handleItemClick(event) {
    const item = event.detail.item;
    // Handle item click
  }
</script>

<ItemList 
  {items}
  on:itemClick={handleItemClick}
/>
```

### Customized ItemList

```svelte
<ItemList 
  {items}
  showRating={false}
  showTags={true}
  showLocation={false}
  showPrice={true}
  showStoreInfo={true}
  gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  itemHeight="h-64"
  compact={true}
  on:itemClick={handleItemClick}
  on:storeClick={handleStoreClick}
  on:imageClick={handleImageClick}
/>
```

### Individual ItemCard Usage

```svelte
<script>
  import ItemCard from '$lib/components/ItemCard.svelte';
  
  let item = {/* your item data */};
</script>

<ItemCard 
  {item}
  showTags={true}
  showPrice={true}
  compact={false}
  on:itemClick={handleItemClick}
/>
```

## Tags Display

The components now properly display tags from the `item.tags` array:

### Tag Types

1. **Size Tag** (Blue): Shows item size (e.g., "ขนาด M")
2. **Status Tag** (Purple): Shows item status (e.g., "พร้อมเช่า")
3. **Custom Tags** (Gray): Shows tags from `item.tags` array

### Tag Overflow

When there are more than 3 custom tags, the component shows:
- First 3 tags
- A "+X more" indicator for remaining tags

### Example Tags Output

```svelte
<!-- Size and Status -->
<span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
  ขนาด M
</span>
<span class="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
  พร้อมเช่า
</span>

<!-- Custom tags from item.tags -->
<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
  genshin-impact
</span>
<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
  raiden-shogun
</span>
<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
  cosplay
</span>

<!-- Overflow indicator -->
<span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
  +2
</span>
```

## Data Structure

The components expect items to follow the `ItemListRecord` type:

```typescript
type ItemListRecord = {
  id: string;
  Name?: string;
  Desc?: string;
  Image?: string;
  Province?: string;
  Size?: string;
  Status?: string;
  price?: number;
  price_pri?: number;
  price_test?: number;
  public?: boolean;
  tags?: string[];  // This is now properly used!
  user?: string;
  userStore?: string;
  expand?: {
    userStore?: {
      Name?: string;
      slug?: string;
    };
  };
};
```

## Migration from Old Implementation

The old shop page has been updated to use these new components. The main changes are:

1. **Replaced hardcoded item display** with ItemList component
2. **Proper tags display** from `item.tags` array
3. **Better event handling** for item interactions
4. **Improved maintainability** with separated concerns

## Demo Page

A demo page is available at `/components-demo` to showcase:
- All component features
- Interactive controls for display options
- Sample data with various tag configurations
- Component behavior demonstration

## Benefits

1. **Proper Tags Support**: Now displays actual tags from the database
2. **Reusable Components**: Can be used across different parts of the application
3. **Better Maintainability**: Separated concerns and cleaner code structure
4. **Consistent UI**: Unified design across all item displays
5. **Flexible Configuration**: Easy to customize for different use cases
6. **Type Safety**: Full TypeScript support with proper types

## Future Enhancements

Potential improvements for future versions:
- Tag filtering and search functionality
- Tag color customization
- Tag click handlers for filtering
- Tag management in admin interfaces
- Tag analytics and trending