# Running EthioShield on Ubuntu

This guide will help you run the EthioShield platform on your Ubuntu computer.

## Prerequisites

Before starting, ensure you have the following installed:

### 1. Node.js and npm/pnpm
```bash
# Update package manager
sudo apt update
sudo apt upgrade -y

# Install Node.js (recommended: LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm (package manager used by this project)
npm install -g pnpm

# Verify installations
node --version
npm --version
pnpm --version
```

### 2. Git (optional, for cloning the repository)
```bash
sudo apt install -y git
```

### 3. Python 3 (optional, for backend AI services)
```bash
sudo apt install -y python3 python3-pip python3-venv
```

### 4. Rust (optional, for security services)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

## Step 1: Download the Project

### Option A: Clone from Git (if using version control)
```bash
git clone <your-repo-url>
cd v0-project
```

### Option B: Extract ZIP/Download Files
```bash
# Extract the project files to your desired location
cd /path/to/v0-project
```

## Step 2: Install Dependencies

```bash
# Navigate to project directory
cd /path/to/v0-project

# Install all npm dependencies
pnpm install

# This will install:
# - Next.js framework
# - React components
# - Database drivers (Neon)
# - UI components (shadcn/ui)
# - All other required packages
```

## Step 3: Setup Environment Variables

Create a `.env.local` file in the project root:

```bash
nano .env.local
```

Add the following environment variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database

# Authentication
BETTER_AUTH_URL=http://localhost:3000
NEON_AUTH_COOKIE_SECRET=your-secret-key-here

# Generate a secret with:
# openssl rand -base64 32

# Optional: For production builds
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting DATABASE_URL from Neon:

1. Go to https://neon.tech
2. Sign up/login
3. Create a new project
4. Copy the connection string
5. Paste it as `DATABASE_URL` in `.env.local`

**OR** For local testing without Neon:

```env
# You can skip database setup initially for UI testing
DATABASE_URL=postgresql://localhost/ethioshield
```

## Step 4: Initialize the Database (Optional)

If using Neon or PostgreSQL:

```bash
# Run Drizzle migrations
pnpm run db:push
```

## Step 5: Create Demo User (Optional)

```bash
# Call the seed endpoint to create demo user
curl -X POST http://localhost:3000/api/seed/demo-user
```

## Step 6: Start the Development Server

```bash
# Start development server
pnpm dev

# Output will show:
# ▲ Next.js 16.0.0
# Local:        http://localhost:3000
```

The app will be available at: **http://localhost:3000**

## Step 7: Login with Demo Credentials

- **Email:** test@ethioshield.com
- **Password:** password123

Or click "Create Demo Account" button on login page.

---

## Production Build

To run a production-ready build:

```bash
# Build the project
pnpm build

# Start production server
pnpm start

# The app will run on http://localhost:3000
```

---

## Docker (Optional)

### Build Docker Image

```bash
# Create a Dockerfile in the project root
docker build -t ethioshield:latest .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e NEON_AUTH_COOKIE_SECRET=your_secret \
  ethioshield:latest
```

### Using Docker Compose

```bash
docker-compose up --build
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
sudo lsof -i :3000
sudo kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Dependencies Installation Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Connection Error
```bash
# Verify your DATABASE_URL is correct
echo $DATABASE_URL

# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1"
```

### Build Errors
```bash
# Clean build
pnpm run build --verbose

# Check for TypeScript errors
pnpm exec tsc --noEmit
```

---

## Development Tips

### Hot Reload
The development server automatically reloads when you save files.

### View Build Output
```bash
# Check for build warnings/errors
pnpm build

# View application logs
pnpm dev > app.log 2>&1
tail -f app.log
```

### Database Inspection
```bash
# If using Neon, use their web dashboard
# Or connect with psql
psql $DATABASE_URL

# List tables
\dt

# Exit
\q
```

### Format Code
```bash
# Run Prettier formatter
pnpm exec prettier --write .
```

---

## System Requirements

- **CPU:** 2+ cores
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB for dependencies + project files
- **Ubuntu Version:** 20.04 LTS or newer

---

## Performance Optimization

### Development Mode
For faster development, the app runs in development mode with HMR:
```bash
pnpm dev
```

### Production Mode
For production deployment:
```bash
pnpm build
pnpm start
```

### Monitor CPU/Memory
```bash
# View resource usage
top
# or
htop  # (install with: sudo apt install htop)
```

---

## Next Steps

1. Access the app at http://localhost:3000
2. Login with demo credentials
3. Explore the dashboard, threat intelligence, and other features
4. Customize the platform for your needs
5. Deploy to a cloud provider (Vercel, AWS, DigitalOcean, etc.)

---

## Support & Documentation

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Neon Docs:** https://neon.tech/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com

---

## Quick Reference Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm exec prettier --write .

# Run linter
pnpm exec eslint .

# Type check
pnpm exec tsc --noEmit
```

Enjoy using EthioShield on your Ubuntu system!
