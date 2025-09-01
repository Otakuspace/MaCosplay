#!/bin/bash

# PocketBase startup script
echo "Checking if PocketBase is running..."

# Check if PocketBase is already running
if curl -s http://127.0.0.1:8090/api/health > /dev/null 2>&1; then
    echo "✅ PocketBase is already running on http://127.0.0.1:8090"
    echo "You can access the admin panel at: http://127.0.0.1:8090/_/"
    exit 0
fi

echo "❌ PocketBase is not running"

# Check if PocketBase executable exists
if [ -f "./pocketbase" ]; then
    echo "Found PocketBase executable, starting..."
    ./pocketbase serve --http="127.0.0.1:8090" &
    echo "✅ PocketBase started in background"
    echo "You can access the admin panel at: http://127.0.0.1:8090/_/"
    echo "Default admin credentials: admin@example.com / 1234567890"
else
    echo "❌ PocketBase executable not found"
    echo ""
    echo "To install PocketBase:"
    echo "1. Download from: https://pocketbase.io/docs/"
    echo "2. Extract to this directory"
    echo "3. Run this script again"
    echo ""
    echo "Or run manually:"
    echo "./pocketbase serve --http=\"127.0.0.1:8090\""
fi