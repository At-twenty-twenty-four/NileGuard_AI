# EthioShield Security Tools Integration Guide

Complete setup and installation guide for recommended security tools integration with EthioShield platform.

---

## Table of Contents

1. [Wazuh - Threat Detection](#wazuh---threat-detection)
2. [Suricata - Network IDS/IPS](#suricata---network-idsips)
3. [VirusTotal - Malware Analysis](#virustotal---malware-analysis)
4. [TheHive - Incident Management](#thehive---incident-management)
5. [SHODAN - IoT/Device Intelligence](#shodan---iotdevice-intelligence)

---

## Wazuh - Threat Detection

Wazuh is an open-source security monitoring platform that integrates with EthioShield for real-time threat detection and log analysis.

### Prerequisites
- Linux server (Ubuntu 20.04+ or CentOS 7+)
- Minimum 4GB RAM, 20GB disk space
- Network connectivity to EthioShield platform

### Installation Steps

#### 1. Install Wazuh Manager

```bash
# Download and install Wazuh
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -
echo "deb https://packages.wazuh.com/4.x/apt/ stable main" | tee /etc/apt/sources.list.d/wazuh.list
apt-get update
apt-get install -y wazuh-manager

# Start Wazuh service
systemctl enable wazuh-manager
systemctl start wazuh-manager
```

#### 2. Generate API Credentials

```bash
# Access Wazuh API
curl -u wazuh:wazuh https://localhost:55000/security/users
```

#### 3. Configure EthioShield Integration

In EthioShield, navigate to **Security Tools > Add Integration**:

- **Tool**: Wazuh Manager
- **API Endpoint**: `https://YOUR_WAZUH_SERVER:55000`
- **Username**: `wazuh`
- **Password**: [Your Wazuh password]
- **API Key**: [Generate in Wazuh API]

#### 4. Configure Wazuh Agent on Target Systems

```bash
# On each monitored system
apt-get install -y wazuh-agent

# Configure agent
nano /var/ossec/etc/ossec.conf
# Add manager IP: <manager_ip>YOUR_WAZUH_SERVER</manager_ip>

# Start agent
systemctl enable wazuh-agent
systemctl start wazuh-agent
```

#### 5. Verify Integration

```bash
# In EthioShield dashboard
# Should see: "Wazuh Manager - Connected ✓"
```

### Key Features
- Real-time log analysis from 1000+ agents
- File integrity monitoring (FIM)
- Rootkit detection
- Vulnerability detection
- CIS hardening audit

---

## Suricata - Network IDS/IPS

Suricata is an open-source network threat detection engine providing IDS/IPS capabilities.

### Prerequisites
- Network access to monitor traffic
- Linux server (Ubuntu 20.04+)
- 2GB RAM minimum
- Network interface in promiscuous mode

### Installation Steps

#### 1. Install Suricata

```bash
# Add repository
sudo add-apt-repository ppa:oisf/suricata-stable
sudo apt-get update

# Install Suricata
sudo apt-get install -y suricata

# Verify installation
suricata --version
```

#### 2. Configure Network Interface

```bash
# Find your interface
ip link show

# Edit Suricata config
sudo nano /etc/suricata/suricata.yaml

# Find and update:
# af-packet:
#   - interface: eth0
#     cluster-id: 99
#     cluster-type: cluster_flow
```

#### 3. Download Threat Rules

```bash
# Install rules manager
sudo apt-get install -y suricata-update

# Update rules (requires ET Pro account or use free Emerging Threats)
sudo suricata-update update-sources
sudo suricata-update enable-source et/open

# Apply rules
sudo suricata-update
```

#### 4. Start Suricata Service

```bash
sudo systemctl enable suricata
sudo systemctl start suricata

# Monitor logs
tail -f /var/log/suricata/eve.json
```

#### 5. Integrate with EthioShield

In EthioShield, **Security Tools > Add Integration**:

- **Tool**: Suricata IDS/IPS
- **Eve Socket Path**: `/var/run/suricata/eve.sock`
- **Log Path**: `/var/log/suricata/eve.json`
- **Threat Feed**: Emerging Threats Rules
- **Update Frequency**: Hourly

#### 6. Configure IPS Mode (Optional)

```bash
# Edit config to enable IPS
sudo nano /etc/suricata/suricata.yaml

# Change:
# - af-packet:
#     - interface: eth0
#       defrag: yes
#       flow-timeouts:
#         default: 30
#         tcp.established: 300
#         tcp.closed: 0
```

### Key Features
- Multi-threaded architecture
- Lua scripting for custom detection
- DNS-over-HTTPS detection
- TLS/SSL certificate analysis
- JSON event logging (EVE format)

---

## VirusTotal - Malware Analysis

VirusTotal provides file and URL scanning against 70+ antivirus engines.

### Prerequisites
- VirusTotal API Key (Free or Premium)
- Network access to virustotal.com
- SSL/TLS certificate validation

### Installation & Configuration Steps

#### 1. Register and Get API Key

1. Go to [VirusTotal.com](https://www.virustotal.com)
2. Create a free account or sign in
3. Navigate to **Settings > API Key**
4. Copy your API key

#### 2. Configure in EthioShield

In EthioShield, **Security Tools > Add Integration**:

- **Tool**: VirusTotal
- **API Endpoint**: `https://www.virustotal.com/api/v3`
- **API Key**: [Your VirusTotal API key]
- **Rate Limit**: 4 requests/min (free), 500/min (premium)
- **File Size Limit**: 650MB

#### 3. Test Integration

```bash
# Via EthioShield API
curl -X POST http://localhost:3000/api/security-tools/virustotal-scan \
  -H "Content-Type: application/json" \
  -d '{
    "file_hash": "d131dd02c5e6eec4693d61472e7b0525",
    "type": "file"
  }'
```

#### 4. Configure Automated Scanning

In EthioShield **Settings > Automation**:

- **Enable Auto-Scan**: Toggle On
- **Scan Trigger**: File upload, Log detection
- **Quarantine on Detection**: Enable
- **Notification**: Email on threat found

### API Usage Limits

| Plan | Requests/Min | File Upload | Supported |
|------|-------------|------------|-----------|
| Free | 4 | 30MB | ✓ |
| Premium | 500 | 650MB | ✓ |

### Key Features
- Multi-engine antivirus detection
- URL reputation analysis
- File similarity clustering
- Behavioral sandboxing
- Intelligence feeds

---

## TheHive - Incident Management

TheHive is an open-source incident management and response platform.

### Prerequisites
- Elasticsearch 7.0+
- MongoDB 4.0+
- Java 11+
- 4GB RAM, 20GB storage

### Installation Steps

#### 1. Install Elasticsearch

```bash
# Add repository
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list

# Install
apt-get update
apt-get install -y elasticsearch

# Start service
systemctl enable elasticsearch
systemctl start elasticsearch
```

#### 2. Install MongoDB

```bash
# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Install
apt-get update
apt-get install -y mongodb-org

# Start service
systemctl enable mongod
systemctl start mongod
```

#### 3. Install TheHive

```bash
# Add repository
curl https://raw.githubusercontent.com/TheHive-Project/TheHive/master/PGP-PUBLIC-KEY | apt-key add -
echo 'deb https://deb.thehive-project.org release main' | tee /etc/apt/sources.list.d/thehive-project.list

# Install
apt-get update
apt-get install -y thehive

# Start service
systemctl enable thehive
systemctl start thehive
```

#### 4. Configure TheHive

Edit `/etc/thehive/application.conf`:

```conf
play.server.pidfile.path = "/dev/null"
play.server.provider = play.core.server.NettyServerProvider
play.server.netty.maxHeaderSize = 262144

elasticsearch {
  search = ["127.0.0.1:9300"]
  index = "thehive"
  version = 7
}

play.modules.enabled += org.elastic.play.elasticsearch.ElasticsearchModule
play.modules.enabled += connectors.cortex.CortexModule

storage {
  provider = mongodb
  mongodb = "mongodb://127.0.0.1:27017/thehive"
}
```

#### 5. Integrate with EthioShield

In EthioShield, **Security Tools > Add Integration**:

- **Tool**: TheHive Platform
- **API Endpoint**: `http://localhost:9000`
- **API Key**: [Generate in TheHive]
- **Organization**: EthioShield
- **Webhook URL**: `https://your-ethioshield.com/api/webhooks/thehive`

#### 6. Create API Key in TheHive

1. Access TheHive at `http://localhost:9000`
2. Default login: `admin@thehive.local` / `secret`
3. Go to **Admin > Users**
4. Create API key for EthioShield

### Key Features
- Incident timeline management
- Task assignment and tracking
- Evidence collection
- Case templates
- Integration with Cortex for analysis

---

## SHODAN - IoT/Device Intelligence

SHODAN is a search engine for Internet-connected devices, providing device fingerprinting and vulnerability info.

### Prerequisites
- SHODAN API Key (Free or Premium)
- Network connectivity
- Valid SSL certificates

### Installation & Configuration Steps

#### 1. Get SHODAN API Key

1. Visit [SHODAN.io](https://www.shodan.io)
2. Create account
3. Go to **Account > API Key**
4. Copy your API key

#### 2. Configure in EthioShield

In EthioShield, **Security Tools > Add Integration**:

- **Tool**: SHODAN Intelligence
- **API Endpoint**: `https://api.shodan.io`
- **API Key**: [Your SHODAN API key]
- **Rate Limit**: 1 request/sec (free), unlimited (premium)
- **Cache Results**: Enable (recommended)

#### 3. Set Up Device Monitoring

In EthioShield **Security Tools > Device Scanner**:

- **Network Range**: Define CIDR ranges (e.g., 10.0.0.0/24)
- **Scan Frequency**: Daily/Weekly
- **Auto-Flag High Risk**: Enable
- **Vulnerability Check**: Enable

#### 4. Create Detection Rules

In EthioShield **Threat Rules > New Rule**:

```json
{
  "name": "Exposed Database Server",
  "source": "SHODAN",
  "conditions": {
    "service": "mongodb",
    "open_port": 27017,
    "authentication": "None"
  },
  "severity": "critical",
  "action": "alert"
}
```

#### 5. Test Integration

```bash
# Test via EthioShield API
curl -X POST http://localhost:3000/api/security-tools/shodan-search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "city:Ethiopia product:nginx",
    "limit": 10
  }'
```

### Device Monitoring Use Cases

- Exposed SSH servers (port 22)
- Unprotected MongoDB instances (port 27017)
- Public Redis instances (port 6379)
- Default credentials detection
- Outdated software versions

### Key Features
- Global device fingerprinting
- Historical data since 2009
- Vulnerability matching
- Real-time alerts
- API for custom queries

---

## Integration Testing Checklist

After configuring all tools, verify connectivity:

```bash
# Check all integrations status
curl http://localhost:3000/api/security-tools/status \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .

# Expected output:
# {
#   "tools": [
#     {"name": "Wazuh", "status": "connected", "last_check": "2024-01-20T14:30:00Z"},
#     {"name": "Suricata", "status": "connected", "events": 1542},
#     {"name": "VirusTotal", "status": "connected", "api_quota": 95},
#     {"name": "TheHive", "status": "connected", "cases": 12},
#     {"name": "SHODAN", "status": "connected", "devices_indexed": 543}
#   ]
# }
```

## Troubleshooting

### Wazuh Connection Issues
- Verify firewall rules on port 55000
- Check Wazuh service: `systemctl status wazuh-manager`
- Validate credentials in EthioShield

### Suricata Event Loss
- Check EVE socket permissions: `ls -la /var/run/suricata/`
- Verify Suricata running: `systemctl status suricata`
- Check disk space for eve.json logs

### VirusTotal Rate Limiting
- Upgrade to premium API (500 req/min)
- Implement request queuing in EthioShield
- Use file hashing for duplicate checks

### TheHive Connectivity
- Verify Elasticsearch running: `curl localhost:9200`
- Check MongoDB: `mongo admin --eval "db.adminCommand('ping')"`
- Validate API key permissions

### SHODAN Results Empty
- Verify network ranges are correct
- Check API rate limits: `curl https://api.shodan.io/api/info?key=YOUR_KEY`
- Ensure devices are actually exposed

---

## Security Best Practices

1. **API Key Management**
   - Store keys in environment variables
   - Rotate keys regularly
   - Use separate keys per environment (dev/prod)
   - Enable key expiration where available

2. **Network Security**
   - Use TLS 1.3 for all connections
   - Implement IP whitelisting
   - Use VPN for remote integrations
   - Enable CORS restrictions

3. **Data Handling**
   - Encrypt sensitive data at rest
   - Log all API calls with sanitization
   - Implement data retention policies
   - Regular backups of integration configs

4. **Access Control**
   - Limit tool access by role
   - Audit integration usage
   - Require approval for new tools
   - Implement MFA for tool management

---

## Support & Resources

- **Wazuh Documentation**: https://documentation.wazuh.com
- **Suricata Manual**: https://suricata.readthedocs.io
- **VirusTotal API**: https://developers.virustotal.com
- **TheHive Project**: https://thehive-project.org
- **SHODAN Help**: https://shodan.io/help

For issues, contact: support@ethioshield.com
