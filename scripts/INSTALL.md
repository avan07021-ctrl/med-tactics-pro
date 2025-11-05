# Medical Training Platform - Installation Guide

## Prerequisites

Before installing, make sure you have:
- **Node.js 18 or higher** - [Download here](https://nodejs.org/)
- At least 500MB of free disk space

## Installation Steps

### 1. Extract the Archive

**Windows:**
```bash
# Right-click on medical-training-app.tar.gz
# Select "Extract All..." or use 7-Zip/WinRAR
```

**Linux/Mac:**
```bash
tar -xzf medical-training-app.tar.gz
cd medical-training-package
```

### 2. Extract Server Dependencies

The package includes pre-built server dependencies to avoid requiring internet connection during installation.

**Windows:**
```bash
tar -xzf server-node_modules.tar.gz -C server
```

**Linux/Mac:**
```bash
tar -xzf server-node_modules.tar.gz -C server
```

### 3. Launch the Application

**Windows:**
```bash
# Double-click start.bat
# OR run in Command Prompt:
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

## Accessing the Application

Once the server starts, you'll see:

```
╔════════════════════════════════════════════════════════════╗
║   Medical Training Platform                                 ║
║   Server running on http://localhost:3000                   ║
║                                                             ║
║   Access from other devices on network:                     ║
║   http://<your-ip-address>:3000                             ║
╚════════════════════════════════════════════════════════════╝
```

Open your browser and navigate to:
- **Local access:** http://localhost:3000
- **Network access:** http://YOUR-IP-ADDRESS:3000

## Configuration

### Database Connection

The application comes pre-configured to connect to a Supabase backend. If you need to connect to a different database:

1. Create a `.env` file in the root directory
2. Add your database credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Restart the server

### Change Port

To run on a different port:

**Windows:**
```bash
set PORT=8080
start.bat
```

**Linux/Mac:**
```bash
PORT=8080 ./start.sh
```

## Network Access

To access from other devices on your network:

1. Find your computer's IP address:
   - **Windows:** `ipconfig` in Command Prompt
   - **Linux/Mac:** `ifconfig` or `ip addr`

2. Make sure firewall allows connections on port 3000

3. Access from other devices: `http://YOUR-IP:3000`

## Troubleshooting

### Server Won't Start

**Error: "Node.js is not installed"**
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

**Error: "dist directory not found"**
- Make sure you extracted all files from the archive
- Check that you're running the script from the correct directory

**Error: "Port 3000 already in use"**
- Change the port using the `PORT` environment variable
- Or stop the application using that port

### Cannot Access from Network

1. Check firewall settings:
   - **Windows:** Allow Node.js through Windows Firewall
   - **Linux:** `sudo ufw allow 3000`

2. Verify you're using the correct IP address

3. Make sure both devices are on the same network

### Application Loads but Features Don't Work

- Check that `.env` file has correct Supabase credentials
- Verify internet connection (required for database access)
- Check browser console for errors (F12)

## System Requirements

### Minimum Requirements
- **OS:** Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **CPU:** 2 GHz dual-core processor
- **RAM:** 4 GB
- **Storage:** 500 MB free space
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Requirements
- **CPU:** 2.5 GHz quad-core processor
- **RAM:** 8 GB
- **Network:** Stable internet connection for database access

## Stopping the Server

**Windows:**
- Press `Ctrl+C` in the Command Prompt window
- Or close the Command Prompt window

**Linux/Mac:**
- Press `Ctrl+C` in the terminal

## Uninstallation

To remove the application:
1. Stop the server (Ctrl+C)
2. Delete the `medical-training-package` folder
3. Delete the original `medical-training-app.tar.gz` file

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console/terminal output for error messages
3. Contact your system administrator

## Version Information

- **Application Version:** 1.0.0
- **Node.js Required:** 18.x or higher
- **Last Updated:** 2025
