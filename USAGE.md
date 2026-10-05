# EthioShield Usage Guide

## Getting Started

The login issue has been **FIXED**! The app now properly navigates to the dashboard after successful authentication.

### Demo Credentials
- **Email:** `test@ethioshield.com`
- **Password:** `password123`

## How the Fixed Login Works

1. **Enter Credentials**
   - Email: `test@ethioshield.com`
   - Password: `password123`

2. **Click "Sign In"**
   - The button shows "Loading..." while authenticating
   - This process now **completes successfully** and navigates to the dashboard

3. **Dashboard Opens**
   - You're now logged into the EthioShield platform
   - The sidebar shows all available sections
   - Real-time threat metrics are displayed

## Navigation

From the dashboard, you can access:

### Main Sections
- **Dashboard** - Overview of threats and system status
- **Threats** - Detailed threat analysis and intelligence
- **Incidents** - Security incident tracking
- **Intelligence** - Threat actor profiles and OSINT data
- **AI Response** - Autonomous defense console
- **Digital Twin** - Network topology simulator
- **Crypto** - Post-quantum cryptography management
- **Settings** - Configuration and preferences

### Language Support
Click the "EN" button in the top right to switch between:
- English (EN)
- Amharic (AM)

## Features

### Threat Dashboard
- Detection Rate metrics
- Blocked Threats counter
- System Status indicator
- 24-Hour Timeline chart
- Threat categorization (Intrusion, Malware, Phishing)
- Recent alerts with AI confidence scores

### Threat Intelligence
- Threat actor profiles
- Malware database
- Attack patterns and IOCs
- Historical threat data

### Autonomous Response
- SentinelAI-X decision logs
- Automated response actions
- Threat containment history
- Policy enforcement tracking

### Digital Twin Simulator
- Virtual network topology
- Threat propagation simulation
- Attack scenario testing
- Network vulnerability assessment

### Post-Quantum Cryptography
- ML-KEM key exchange
- ML-DSA digital signatures
- SLH-DSA hashing
- Quantum-resistant key management

## Logging Out

1. Click the **user icon** in the top right corner
2. Select **"Logout"**
3. You'll be returned to the login page

## Troubleshooting

### "Loading..." stuck on login?
This has been fixed! The app now properly completes the login process.

### "Demo credentials not working"
- Try clicking "Create Demo Account" first
- Make sure caps lock is off
- Verify you're entering: `test@ethioshield.com` / `password123`

### Page not updating after login?
- Refresh the browser (F5)
- Clear browser cache if needed
- Restart the dev server

## Running on Ubuntu

See `UBUNTU_SETUP.md` for complete setup instructions for Linux systems.

## Deployment

For production deployment to Vercel:
1. See `DEPLOYMENT.md` for detailed instructions
2. Configure environment variables for your Neon database
3. Set up Vercel project and connect GitHub repo
4. Deploy with `vercel deploy`

## Platform Architecture

- **Frontend:** Next.js 16 with React 19
- **Backend:** Python FastAPI + Rust Axum
- **Database:** PostgreSQL (Neon)
- **Authentication:** Better Auth
- **UI Framework:** Tailwind CSS + shadcn/ui

## Support

For issues or questions, refer to:
- `PLATFORM_GUIDE.md` - Detailed platform documentation
- `README.md` - General overview
- `PROJECT_SUMMARY.md` - Architecture and implementation details
