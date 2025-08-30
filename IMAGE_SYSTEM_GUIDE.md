# Image Display System for Store Items

## Overview
This system displays images for store items based on their unique item ID in the route `/store/storeID/outfitID`.

## How It Works

### 1. Route Structure
- **Route**: `/store/[shopID]/[outfitID]`
- **Example**: `/store/demo/anime-alya-001`
- The `outfitID` parameter is used as the item ID for image loading

### 2. Image URL Construction
The system constructs image URLs using the following pattern:
```
https://file.macosplay.com/mxj3660ce5olheb/{itemID}/{imageName}
```

### 3. Supported Image Names
For each item ID, the system looks for these image files:
- `{itemID}/main.jpg` or `{itemID}/main.png` - Main product image
- `{itemID}/detail1.jpg` or `{itemID}/detail1.png` - Detail view 1
- `{itemID}/detail2.jpg` or `{itemID}/detail2.png` - Detail view 2
- `{itemID}/back.jpg` or `{itemID}/back.png` - Back view
- `{itemID}/side.jpg` or `{itemID}/side.png` - Side view
- `{itemID}/accessories.jpg` or `{itemID}/accessories.png` - Accessories
- `{itemID}/full.jpg` or `{itemID}/full.png` - Full outfit view

### 4. Fallback System
If item-specific images are not found, the system falls back to:
1. Example images from `/images/Example/` directory
2. Placeholder image with error message

### 5. Features

#### Dynamic Image Loading
- Automatically checks for item-specific images on page load
- Uses API endpoint `/api/check-images?itemId={itemID}` for efficient checking
- Shows loading spinner while checking image availability

#### Image Gallery
- Supports multiple images per item
- Navigation arrows for browsing images
- Thumbnail grid for quick selection
- Image counter display

#### Error Handling
- Graceful fallback to example images
- Error indicators for failed image loads
- Loading states for better UX

#### Admin Features
- Image management panel (toggle with "Manage Images" button)
- Drag & drop image upload interface
- Image upload progress tracking
- Support for JPG, PNG, WebP formats (max 5MB each)

### 6. Testing
Use these demo URLs to test different item IDs:
- `/store/demo/anime-alya-001` - Anime character cosplay
- `/store/demo/makima-cosplay-002` - Makima character cosplay
- `/store/demo/venti-outfit-003` - Venti character cosplay
- `/store/demo/custom-item-123` - Generic custom item

### 7. Implementation Details

#### Files Modified/Created:
1. `/src/routes/store/[shopID]/[outfitID]/+page.svelte` - Main outfit display page
2. `/src/routes/store/[shopID]/[outfitID]/+page.server.ts` - Server-side data loading
3. `/src/routes/api/check-images/+server.ts` - Image availability API
4. `/src/routes/components/ImageManager.svelte` - Image management component

#### Key Functions:
- `getImageUrl(image: string)` - Constructs proper image URLs
- `getImageWithFallback(image: string, index: number)` - Returns image URL with fallback logic
- `handleImageError(event: Event, index: number)` - Handles image loading errors
- `checkItemImages()` - Checks for item-specific images via API

### 8. Debug Information
The page includes a debug panel showing:
- Current item ID
- Current image path
- Full image URL
- Total image count
- Loading status

## Usage Examples

### For Item ID "anime-alya-001":
The system will look for:
- `https://file.macosplay.com/mxj3660ce5olheb/anime-alya-001/main.jpg`
- `https://file.macosplay.com/mxj3660ce5olheb/anime-alya-001/detail1.jpg`
- etc.

If not found, falls back to example images like `/images/Example/Anime_alya_cos.png`

### For Item ID "custom-item-123":
The system will look for:
- `https://file.macosplay.com/mxj3660ce5olheb/custom-item-123/main.jpg`
- `https://file.macosplay.com/mxj3660ce5olheb/custom-item-123/detail1.jpg`
- etc.

## Future Enhancements
- Real image upload to PocketBase backend
- Image optimization and resizing
- Advanced image management (delete, reorder)
- Bulk image operations
- Image SEO optimization