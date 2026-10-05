# EthioShield v3 - Comprehensive User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Threats Management](#threats-management)
4. [Incidents Management](#incidents-management)
5. [Intelligence Feeds](#intelligence-feeds)
6. [AI Response Engine](#ai-response-engine)
7. [Digital Twin Simulator](#digital-twin-simulator)
8. [Security Tools Integration](#security-tools-integration)
9. [Crypto Key Management](#crypto-key-management)
10. [Settings & User Management](#settings--user-management)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Initial Login
1. Navigate to the EthioShield application
2. On the login page, click "Create Demo Account"
3. You'll be logged in with demo credentials (test@ethioshield.com)
4. You'll be redirected to the Threats dashboard

### Navigation
The sidebar on the left contains all major sections:
- **Dashboard**: Real-time threat overview and metrics
- **Threats**: Threat actor tracking, malware analysis, CVE management
- **Incidents**: Incident tracking and timeline management
- **Intelligence**: Threat feeds and external data sources
- **AI Response**: Autonomous threat response configuration
- **Digital Twin**: Network topology simulation and testing
- **Security Tools**: Integrated security platform management
- **Settings**: User profile and system configuration

---

## Dashboard Overview

### Key Metrics
The main dashboard displays four critical metrics:

**Detection Rate**: Percentage of threats successfully detected (target: >98%)

**Blocked Threats**: Total number of threats blocked in the last 24 hours

**System Status**: Overall health indicator (Optimal, Warning, Critical)

**Active Alerts**: Real-time count of unresolved security alerts

### Threat Timeline
A 24-hour timeline shows when threats were detected:
- Green bars: Successful detections
- Blue peaks: High alert volumes
- Red spikes: Critical threats

### Security Tools Widget
Shows status of all integrated security tools:
- Connected: Number of active tools
- Total Alerts: Alerts from all tools combined
- Response Time: Average time to process alerts
- Uptime: System reliability percentage

### Recent Alerts
Table showing the latest alerts with:
- Threat ID and type
- Severity level (CRITICAL, HIGH, MEDIUM, LOW)
- Source IP and target
- Status (New, Investigating, Resolved)

---

## Threats Management

### Viewing Active Threats
1. Click "Threats" in the sidebar
2. You'll see tabs for:
   - **Overview**: Threat statistics and summaries
   - **Campaigns**: Active threat campaigns
   - **Vulnerabilities**: CVE tracking and management

### Active Campaigns Tab
View all active threat campaigns:
- Campaign ID and name
- Threat actor profile
- Affected countries and industries
- Number of victims
- Key indicators

**Actions**:
- Click a campaign to see detailed information
- View affected systems and timeline
- Check mitigation recommendations

### Vulnerabilities Tab (CVE Dashboard)

**Filters Available**:
- **All CVEs**: View entire database
- **Recent**: CVEs from last 7 days (default)
- **Exploited**: Actively exploited vulnerabilities
- **Zero-Days**: Previously unknown vulnerabilities

**Search Functionality**:
1. Use the search box to filter by:
   - CVE ID (e.g., CVE-2024-0567)
   - Product name (e.g., Apache, Windows)
   - Vulnerability description
2. Results update in real-time as you type

**CVE Details**:
- CVSS Score: Severity rating (0-10)
- Affected Products: List of impacted software
- Published Date: Disclosure date
- Exploitation Status: Whether it's being exploited

**Actions**:
- Click on a CVE to see detailed information
- View recommended patches
- Check organizational impact
- Export CVE data for analysis

---

## Incidents Management

### Creating New Incidents
1. Click "Incidents" in the sidebar
2. Click "New Incident" button
3. Fill in incident details:
   - Title: Clear description of the incident
   - Severity: CRITICAL, HIGH, MEDIUM, LOW
   - Affected Systems: List impacted assets
   - Initial Response: First actions taken

### Incident Lifecycle

**Status Tabs**:
- **Investigating**: Initial incident assessment
- **Contained**: Threat isolated, no spread
- **Resolved**: Incident fully remediated

### Incident Details
Each incident shows:
- Timeline of events
- Affected systems and users
- Threat actor attribution
- Response actions taken
- Estimated impact

### Actions on Incidents
1. **Assign**: Assign incident to team member
2. **Escalate**: Raise severity level
3. **Update Status**: Move between lifecycle stages
4. **Add Notes**: Document investigation progress
5. **Generate Report**: Create incident summary

---

## Intelligence Feeds

### Accessing Intelligence
1. Click "Intelligence" in the sidebar
2. View threat feeds from multiple sources:
   - External threat reports
   - Malware signatures
   - Phishing indicators
   - Compromised credentials

### Threat Feed Data
Each feed entry contains:
- **Type**: Malware, Phishing, Intrusion, etc.
- **Severity**: Risk level assessment
- **Confidence**: Source reliability (0-100%)
- **Indicators**: IP addresses, URLs, file hashes
- **Mitigation**: Recommended countermeasures
- **References**: Source documentation

### Exporting Intelligence Data
1. Click the "Export" button at the top
2. Threat intelligence data exports as JSON
3. File includes timestamps and metadata
4. Can be imported into other security tools

### Feed Filtering
- Filter by threat type
- Filter by severity level
- Filter by date range
- Filter by source

---

## AI Response Engine

### Response Console
The AI Response Console provides:
- Natural language threat analysis
- Automated response recommendations
- Real-time threat assessment
- AI-powered insights

**How to Use**:
1. Click "AI Response" in sidebar
2. Type threat details or paste logs
3. AI analyzes and provides recommendations
4. Review and approve suggested actions

### Action History
View all automated responses and actions taken:

**For Each Action**:
- Action ID and type (e.g., "Block IP")
- Status: Success/Failure
- Execution time and timestamp
- Affected systems (firewalls, IPS, etc.)
- Result details

**View Details**:
1. Click "View Details" on any action
2. See full execution logs
3. View affected systems
4. Check if action succeeded

### Response Policies

**Policy Management**:
1. Click the "Policies" tab
2. View all configured response policies
3. Each policy shows:
   - Policy name and ID
   - Trigger conditions
   - Automated actions
   - Confidence threshold
   - Status (Enabled/Disabled)

**Creating New Policies**:
1. Click "New Policy" button
2. Fill in policy details:
   - Policy name
   - Description
   - Severity level
   - Triggers (conditions that activate policy)
   - Actions (automated responses)
   - Confidence threshold (minimum confidence to trigger)
3. Add multiple triggers and actions as needed
4. Click "Save Policy"

**Editing Policies**:
1. Click the edit icon on a policy card
2. Modify policy details
3. Save changes

**Policy Examples**:

**Policy: Critical Zero-Day Immediate Response**
- Triggers: Zero-day vulnerability detected
- Actions: Block IP, Isolate system, Alert team
- Confidence: 95%+
- Severity: CRITICAL

**Policy: High CVSS Patch Deployment**
- Triggers: CVE with CVSS 9.0+ published
- Actions: Notify admins, Schedule patch, Prep rollback
- Confidence: 85%+
- Severity: HIGH

---

## Digital Twin Simulator

### Accessing the Simulator
1. Click "Digital Twin" in sidebar
2. Network topology displays with all systems

### Network Visualization
The digital twin shows:
- Firewall, Web Servers, Databases
- API Gateways, Cache Layers, DNS Servers
- Connection relationships
- Node status indicators

### Simulation Controls

**Play/Pause Button**:
- Click to start simulation
- Network displays active with threat animations
- Shows real-time threat progression
- Statistics update in real-time

**Reset Button**:
- Clears all simulated threats
- Resets network to default state
- Stops the simulation
- Can be restarted immediately

### Simulated Threats
While running, the simulator shows:
- **DDoS Attack**: Attacking firewall (45% progress)
- **Brute Force**: Targeting web server (30% progress)
- **SQL Injection**: Database attack attempt (15% progress)

Each threat shows:
- Name and severity
- Target system
- Progress bar
- Estimated completion time

### Statistics Panel
- **Online Nodes**: Active systems (6/6)
- **Active Threats**: Currently simulated threats (3)
- **Security Score**: Network security rating (94%)

### Use Cases
- **Training**: Learn threat response procedures
- **Testing**: Verify incident response capabilities
- **Planning**: Test network architecture changes
- **Documentation**: Capture security posture

---

## Security Tools Integration

### Integrated Tools

Five recommended security tools are integrated:

#### 1. Wazuh (SIEM)
- **Status**: Connected
- **Capabilities**: Log analysis, file integrity, compliance
- **Setup Time**: 30-45 minutes
- **Difficulty**: Medium

#### 2. Suricata (IDS/IPS)
- **Status**: Connected
- **Capabilities**: Network monitoring, threat detection
- **Setup Time**: 20-30 minutes
- **Difficulty**: Medium

#### 3. VirusTotal
- **Status**: Connected
- **Capabilities**: File analysis, URL reputation
- **Setup Time**: 5-10 minutes
- **Difficulty**: Easy

#### 4. TheHive (Incident Management)
- **Status**: Connected
- **Capabilities**: Case management, observables
- **Setup Time**: 45-60 minutes
- **Difficulty**: Hard

#### 5. SHODAN (Device Intelligence)
- **Status**: Connected
- **Capabilities**: Asset discovery, vulnerability scanning
- **Setup Time**: 5-10 minutes
- **Difficulty**: Easy

### Adding New Tools
1. Click "Add New Tool" button
2. Fill in tool details:
   - Tool name
   - Category (SIEM, IDS/IPS, etc.)
   - API URL
   - API Key
3. Click "Add Tool"
4. Tool appears in appropriate category

### Tool Management

**For Each Tool**:
- Click "Configure" to update settings
- Click "View Alerts" to see tool-specific alerts
- Toggle "Enable/Disable" status
- View last sync timestamp

### Setup Guide
1. Click "Setup Guide" tab
2. Select a tool to view installation instructions
3. Each guide includes:
   - Prerequisites checklist
   - Step-by-step installation
   - Configuration commands (with copy buttons)
   - Test command to verify setup
   - Link to full documentation

---

## Crypto Key Management

### Managing Keys
1. Click "Crypto" in sidebar (from Digital Twin or settings)
2. View all encryption keys

### Key Operations
- **Generate New Key**: Create new RSA/ECC keys
- **Import Key**: Add external keys
- **Export Key**: Save key for backup
- **Rotate Key**: Replace active key

### Key Details
For each key:
- Key ID and type (RSA, ECC)
- Size (2048, 4096 bits)
- Algorithm (FIPS-approved)
- Creation date
- Status (Active, Rotation Scheduled, Retired)

### Post-Quantum Cryptography
EthioShield uses post-quantum algorithms:
- **KYBER**: Key encapsulation
- **DILITHIUM**: Digital signatures
- **Hybrid mode**: Supports both classical and quantum-safe

---

## Settings & User Management

### User Profile
1. Click "Settings" in sidebar
2. View profile information:
   - Username and email
   - Account status
   - Last login
   - API tokens

### System Configuration

**Notification Settings**:
- Email alerts for critical threats
- Slack integration
- Webhook endpoints

**API Configuration**:
- Generate API keys for programmatic access
- Set rate limits
- Configure allowed IP addresses

**Data Export**:
- Export threat intelligence
- Export incident reports
- Export audit logs

### User Management (Admin Only)
- Add new users
- Manage roles (Admin, Analyst, Viewer)
- Reset passwords
- Disable accounts

---

## Troubleshooting

### Common Issues

#### Application Won't Load
1. Clear browser cache
2. Try incognito/private mode
3. Check internet connection
4. Verify JavaScript is enabled
5. Try different browser

#### Login Issues
1. Verify credentials are correct
2. Clear browser cookies
3. Try "Create Demo Account"
4. Check if account is disabled
5. Try password reset

#### Tool Connection Failures
**Wazuh Connection Error**:
1. Verify Wazuh server is running
2. Check API endpoint URL (default: port 55000)
3. Verify API credentials
4. Check firewall rules
5. Review Wazuh logs

**VirusTotal API Error**:
1. Verify API key is correct
2. Check rate limits (quota exceeded?)
3. Verify API key has required permissions
4. Test with curl command

**Suricata Integration Issues**:
1. Verify Suricata is running
2. Check eve.json log file path
3. Verify network interface configuration
4. Review Suricata logs in /var/log/suricata/

#### CVE Search Returns No Results
1. Try different filter (use "All CVEs")
2. Check search query syntax
3. Verify CVE database is loaded
4. Try broader search terms

#### Digital Twin Simulator Not Running
1. Click the Play button to start
2. Network topology should show animations
3. If not responsive, refresh page
4. Reset simulator with Reset button

#### Export Functions Not Working
1. Check pop-up blocker settings
2. Verify download folder is writable
3. Try downloading to different location
4. Check browser console for errors

### Performance Issues

**Slow Dashboard Loading**:
1. Reduce date range filter
2. Disable some widgets
3. Clear browser cache
4. Close other browser tabs
5. Check internet connection speed

**Slow CVE Search**:
1. Use more specific search terms
2. Filter by recent CVEs first
3. Limit number of results shown
4. Check browser memory usage

### Getting Help

**Debug Information**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages
4. Take screenshots of errors

**Support Contacts**:
- Admin: Contact your EthioShield administrator
- Help: Check in-app help sections
- Documentation: Review setup guides
- Logs: Check application logs in settings

### System Requirements

**Browser Requirements**:
- Chrome/Edge: Version 90+
- Firefox: Version 88+
- Safari: Version 14+
- JavaScript enabled
- Cookies enabled

**Network Requirements**:
- Stable internet connection
- Minimum 5 Mbps bandwidth
- Firewall allows necessary ports
- No aggressive proxy filtering

**Client Requirements**:
- 2GB RAM minimum
- 100MB disk space
- Modern graphics card recommended

---

## Advanced Usage

### API Integration
EthioShield provides REST API for programmatic access:

**Authentication**:
```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" https://ethioshield.example.com/api/
```

**Getting Threats**:
```bash
curl https://ethioshield.example.com/api/threats/active
```

**Creating Incident**:
```bash
curl -X POST https://ethioshield.example.com/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security Incident",
    "severity": "HIGH",
    "description": "Details here"
  }'
```

### Automation and Workflows
1. Use API to automate threat response
2. Integrate with SIEM tools
3. Create custom playbooks
4. Set up automated alerts

### Best Practices

**Threat Management**:
- Review threats daily
- Prioritize by severity
- Track campaign progress
- Document responses

**Incident Management**:
- Document all incidents
- Keep timeline updated
- Communicate with team
- Perform post-incident review

**Tool Integration**:
- Test connections regularly
- Monitor tool health
- Update API credentials
- Review logs for errors

**Security Posture**:
- Review CVEs regularly
- Keep patches current
- Monitor for zero-days
- Test response procedures

---

## Contact & Support

For additional support or questions:
1. Check this user guide
2. Review setup guides for specific tools
3. Contact your system administrator
4. Check application logs for errors
5. Visit documentation portal

**Support Channels**:
- In-app help documentation
- System administrator
- Security team leads
- Knowledge base articles

---

## Version Information
- **Product**: EthioShield v3
- **Release Date**: 2024
- **Last Updated**: Current
- **Status**: Production Ready

---

**Thank you for using EthioShield!**
