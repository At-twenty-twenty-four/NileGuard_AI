# EthioShield v3 - Quick Start Guide

## Welcome to EthioShield!

This quick reference will get you started with all the features implemented in v3.

---

## Access the Application

**URL**: http://localhost:3000

**Login**: 
- Email: `test@ethioshield.com`
- Password: `Demo123!`

Or click "Create Demo Account" on login page

---

## Main Features Quick Links

### 1. Threats Dashboard
**Location**: Sidebar > Threats
**Features**:
- CVE Search (use "All CVEs" filter for comprehensive results)
- Campaign tracking
- Threat actor profiles

**CVE Search Filters**:
- All CVEs - Complete database
- Recent - Last 7 days
- Exploited - Currently being used in attacks
- Zero-Days - Previously unknown vulnerabilities

### 2. Response Management
**Location**: Sidebar > AI Response
**Features**:

**Tabs**:
1. **AI Response Engine** - Threat analysis and recommendations
2. **Action History** - View all automated responses
   - Click "View Details" for complete execution logs
3. **Policies** - Manage automated response rules
   - Click "New Policy" to create custom policies
   - Click edit icon to modify existing policies

**Create Policy**:
1. Go to Response > Policies tab
2. Click "New Policy"
3. Fill in policy details
4. Add triggers and actions
5. Click "Save Policy"

### 3. Digital Twin Simulator
**Location**: Sidebar > Digital Twin
**Features**:
- Network topology visualization
- Simulated threat scenarios
- Real-time statistics

**Controls**:
- **Pause Button**: Stops simulation (click to resume)
- **Reset Button**: Clears all threats and resets network
- **Statistics**: Shows online nodes, active threats, security score

**Default State**: Simulator starts RUNNING automatically

### 4. Security Tools Integration
**Location**: Sidebar > Security Tools

**Two Main Tabs**:

#### Tab 1: Integrated Tools
- Displays 5 connected security tools
- Shows status, alerts, uptime
- Click "Configure" to update tool settings
- Click "View Alerts" for tool-specific alerts

#### Tab 2: Setup Guide
- Step-by-step installation guides
- Click "View Setup Guide" on any tool
- Copy-to-clipboard commands
- All prerequisites listed

**Add New Tool**:
1. Click "Add New Tool" button
2. Enter tool name
3. Select category
4. Provide API URL and key
5. Click "Add Tool"

---

## Recommended Tools

### 1. Wazuh (SIEM)
- **Difficulty**: Medium
- **Setup Time**: 30-45 minutes
- **Purpose**: Log analysis and threat detection

### 2. Suricata (IDS/IPS)
- **Difficulty**: Medium
- **Setup Time**: 20-30 minutes
- **Purpose**: Network monitoring

### 3. VirusTotal
- **Difficulty**: Easy
- **Setup Time**: 5-10 minutes
- **Purpose**: File and URL analysis

### 4. TheHive
- **Difficulty**: Hard
- **Setup Time**: 45-60 minutes
- **Purpose**: Incident management

### 5. SHODAN
- **Difficulty**: Easy
- **Setup Time**: 5-10 minutes
- **Purpose**: Device intelligence

---

## Key Actions

### View CVE Details
1. Go to Threats > Vulnerabilities tab
2. Search for CVE or product name
3. Click on CVE to see full details
4. View affected products and patch info

### Check Action History
1. Go to AI Response > Action History tab
2. See all executed security actions
3. Click "View Details" on any action
4. View full execution logs and affected systems

### Manage Response Policies
1. Go to AI Response > Policies tab
2. Create new: Click "New Policy"
3. Edit existing: Click edit icon
4. Delete: Click delete icon
5. Enable/disable: Toggle on policy card

### Access Documentation
1. **Full User Guide**: Click Settings > Help
2. **Setup Guides**: Security Tools > Setup Guide tab > Click tool > "Read" button
3. **Quick Reference**: You're reading it!

---

## Common Tasks

### Task: Search for a Specific CVE
```
1. Go to Threats
2. Click "Vulnerabilities" tab
3. Use search box: type CVE ID (e.g., CVE-2024-0567)
4. Results update in real-time
5. Click CVE to see full details
```

### Task: Create a Response Policy
```
1. Go to AI Response
2. Click "Policies" tab
3. Click "New Policy"
4. Enter policy name and description
5. Set severity level
6. Add triggers (conditions)
7. Add actions (automated responses)
8. Set confidence threshold
9. Click "Save Policy"
```

### Task: View Threat Simulation
```
1. Go to Digital Twin
2. Network displays with all nodes
3. Right side shows active threats
4. Simulation auto-runs (starts already playing)
5. Click "Pause" to stop, "Reset" to clear
```

### Task: Add New Security Tool
```
1. Go to Security Tools
2. Click "Add New Tool" button
3. Enter tool name
4. Select category
5. Provide API endpoint URL
6. Enter API key
7. Click "Add Tool"
```

### Task: Get Tool Setup Instructions
```
1. Go to Security Tools
2. Click "Setup Guide" tab
3. Click "View Setup Guide" on desired tool
4. Follow step-by-step instructions
5. Copy commands to clipboard as needed
6. Click "Read" for full documentation
```

---

## Troubleshooting Quick Tips

**CVE Search returning no results?**
- Try "All CVEs" filter instead of "Recent"
- Use broader search terms
- Check CVE database has loaded

**Digital Twin not responding?**
- Click Reset button
- Refresh the page
- Check browser console for errors

**Tool integration failing?**
- Verify API URL is correct
- Check API key validity
- Test tool connectivity first

**Policy not saving?**
- Fill in all required fields
- Add at least one trigger
- Add at least one action
- Check form for validation errors

---

## Key Files

All documentation is available in the `/public` directory:

- **USER_GUIDE.md** - Complete 642-line user guide
- **SECURITY_TOOLS_INTEGRATION_GUIDE.md** - Tool setup guides
- **QUICK_START.md** - This file

---

## Features Checklist

- [x] CVE Search with all filters working
- [x] Action History with detailed modal
- [x] Policy CRUD operations
- [x] Digital Twin simulator running by default
- [x] Add New Tool functionality
- [x] Setup guides for all tools
- [x] Documentation reader
- [x] Complete user guide (642 lines)
- [x] Network topology running by default
- [x] Reset button functional

---

## Navigation Tips

**Sidebar Navigation**:
- Dashboard - Overview and metrics
- Threats - CVE and campaign management
- Incidents - Incident tracking
- Intelligence - External threat feeds
- AI Response - Response policies and history
- Digital Twin - Network simulation
- Security Tools - Tool management
- Settings - User profile

**Tab Navigation**:
Many sections have tabs at the top:
- Click to switch between views
- Arrow keys to navigate tabs
- Each tab independent state

---

## Get Started Now

1. **Login** to the application
2. **Browse** each section in the sidebar
3. **Read** the full USER_GUIDE for details
4. **View** SETUP GUIDES for tool integration
5. **Create** your first response policy

---

## Support Resources

1. **In-App Help**: Check each section for info
2. **Setup Guides**: Security Tools > Setup Guide
3. **Full User Guide**: /public/USER_GUIDE.md
4. **Documentation**: /public/docs/

---

**Happy securing!**

Last Updated: June 24, 2026
