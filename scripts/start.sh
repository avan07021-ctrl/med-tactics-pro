#!/bin/bash

echo "======================================"
echo "Medical Training Platform"
echo "======================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if server/node_modules exists
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    
    # Check if archive exists
    if [ -f "server-node_modules.tar.gz" ]; then
        echo "Extracting dependencies from archive..."
        tar -xzf server-node_modules.tar.gz -C server
    else
        echo "Installing dependencies from npm..."
        cd server
        npm install --production
        cd ..
    fi
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist directory not found${NC}"
    echo "Make sure all files are extracted properly"
    exit 1
fi

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || echo "localhost")

# Start the server
echo -e "${GREEN}Starting server...${NC}"
echo ""
cd server
node serve.js &
SERVER_PID=$!
cd ..

echo ""
echo -e "${GREEN}✓ Server started successfully!${NC}"
echo ""
echo "Access the application:"
echo -e "  ${BLUE}Local:${NC}   http://localhost:3000"
echo -e "  ${BLUE}Network:${NC} http://$LOCAL_IP:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping server...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
wait $SERVER_PID
