#!/bin/bash

echo "======================================"
echo "Medical Training Platform - Packaging"
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}[1/6]${NC} Installing dependencies..."
npm install || { echo -e "${RED}Error: Failed to install dependencies${NC}"; exit 1; }

# Step 2: Build the application
echo -e "${BLUE}[2/6]${NC} Building application..."
npm run build || { echo -e "${RED}Error: Build failed${NC}"; exit 1; }

# Step 3: Create package directory
echo -e "${BLUE}[3/6]${NC} Creating package directory..."
PACKAGE_DIR="medical-training-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Step 4: Copy files
echo -e "${BLUE}[4/6]${NC} Copying files..."
cp -r dist "$PACKAGE_DIR/"
cp -r server "$PACKAGE_DIR/"
cp scripts/start.sh "$PACKAGE_DIR/"
cp scripts/start.bat "$PACKAGE_DIR/"
cp scripts/INSTALL.md "$PACKAGE_DIR/"

# Create node_modules archive for server
echo -e "${BLUE}[5/6]${NC} Creating server dependencies archive..."
cd server
npm install --production
cd ..
tar -czf "$PACKAGE_DIR/server-node_modules.tar.gz" -C server node_modules
rm -rf server/node_modules

# Step 5: Create final archive
echo -e "${BLUE}[6/6]${NC} Creating final archive..."
tar -czf medical-training-app.tar.gz "$PACKAGE_DIR"

echo -e "${GREEN}✓ Package created successfully!${NC}"
echo -e "${GREEN}✓ File: medical-training-app.tar.gz${NC}"
echo ""
echo "Package contents:"
echo "  - dist/                  (built application)"
echo "  - server/                (HTTP server)"
echo "  - server-node_modules.tar.gz (server dependencies)"
echo "  - start.sh               (Linux/Mac launcher)"
echo "  - start.bat              (Windows launcher)"
echo "  - INSTALL.md             (installation guide)"
echo ""
echo "To test locally:"
echo "  cd $PACKAGE_DIR"
echo "  tar -xzf server-node_modules.tar.gz -C server"
echo "  ./start.sh"
