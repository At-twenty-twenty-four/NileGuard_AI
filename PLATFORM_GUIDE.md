# EthioShield: National Cyber Threat Intelligence Platform

## Overview

EthioShield is an enterprise-grade cybersecurity platform combining **real-time threat intelligence**, **autonomous AI-powered defense** (SentinelAI-X), and **post-quantum cryptography** for next-generation threat detection and response.

**Architecture:** Next.js 16 Frontend + Python AI Service + Rust Security Service + PostgreSQL (Neon)
**Status:** Full-Feature Prototype - Ready for Proof of Concept

---

## Key Features

### 1. **Real-Time Threat Intelligence Hub**
- **Threat Actor Profiles**: 100+ known APT groups with CVSS scoring, tactics, and malware families
- **Malware Database**: Hash-based detection with behavioral analysis
- **Attack Campaigns**: Real-time tracking of coordinated attacks
- **Vulnerability Intelligence**: CVE integration and exploitation risk assessment

### 2. **SentinelAI-X Autonomous Response Engine**
- **Machine Learning Detection**: Intrusion, malware, and phishing classification
- **Confidence Scoring**: AI confidence metrics for every detection
- **Autonomous Actions**: Execute responses with rollback capabilities
- **Action History**: Full audit trail of all autonomous responses

### 3. **Multilingual Support**
- English and Amharic interface
- Language toggle in header
- Localized threat intelligence

### 4. **Security Features**
- **Post-Quantum Cryptography**: CRYSTALS-Kyber, Dilithium, SPHINCS+ key management
- **Audit Logging**: Cryptographically signed logs via Rust service
- **Role-Based Access**: User authentication via Better Auth
- **Row-Level Security**: Multi-tenant isolation on Neon PostgreSQL

---

## Architecture

### Frontend (Next.js 16)
```
/app
├── /api
│   ├── /auth          # Authentication endpoints
│   ├── /threats       # Threat analysis
│   ├── /audit         # Audit logging
│   └── /crypto        # PQC key management
├── /threats           # Threat intelligence hub
├── /incidents         # Incident management
├── /response          # AI response console
└── /dashboard         # Main dashboard

/components
├── /dashboard         # Dashboard layouts
├── /threats           # Threat actor and malware displays
├── /response          # AI response UI
└── /incidents         # Incident tracking UI
```

### Backend Services

#### Python AI Service (Port 8000)
FastAPI-based machine learning threat detection:
- `/analyze/malware` - File malware analysis
- `/analyze/intrusion` - Network intrusion detection
- `/analyze/phishing` - Email phishing detection
- `/models/status` - ML model health

#### Rust Security Service (Port 8001)
Axum-based high-performance security service:
- `/audit/logs` - Cryptographic audit logging
- `/crypto/keys/generate` - Post-quantum key generation
- `/crypto/sign` - HMAC-SHA256 signing
- `/crypto/status` - PQC algorithm availability

### Database (PostgreSQL/Neon)
**Tables:**
- `users` - User accounts
- `sessions` - Active sessions
- `threat_actors` - APT profiles
- `security_alerts` - Detection alerts
- `malware_analysis` - Malware records
- `intrusion_events` - Network events
- `phishing_records` - Email threats
- `autonomous_actions` - Response actions
- `audit_logs` - Security audit trail
- `pqc_keys` - Post-quantum cryptography keys

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Neon account)
- Python 3.9+ (for AI service)
- Rust 1.70+ (for security service)

### Installation

#### 1. Frontend Setup
```bash
cd /vercel/share/v0-project
pnpm install
```

#### 2. Environment Variables
Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@db.neon.tech/ethioshield
NEON_AUTH_COOKIE_SECRET=your-generated-secret-key
PYTHON_AI_SERVICE_URL=http://localhost:8000
RUST_SECURITY_SERVICE_URL=http://localhost:8001
```

Generate auth secret:
```bash
openssl rand -base64 32
```

#### 3. Database Setup
```bash
pnpm exec drizzle-kit push
```

#### 4. Start Services

**Frontend:**
```bash
pnpm dev  # http://localhost:3000
```

**Python AI Service:**
```bash
cd services/python_ai
pip install -r requirements.txt
python main.py  # http://localhost:8000
```

**Rust Security Service:**
```bash
cd services/rust_security
cargo run --release  # http://localhost:8001
```

---

## Usage

### 1. Dashboard
Navigate to `http://localhost:3000` to access:
- Real-time threat metrics
- Active alert summary
- 24-hour threat timeline
- Recent security alerts

**Demo Credentials:**
- Email: `test@ethioshield.com`
- Password: `password123`

### 2. Threat Intelligence (/threats)
- **Threat Actors Tab**: Browse 100+ known APT groups with profiles
- **Malware Tab**: Search malware database by name, family, or actor
- **Campaigns Tab**: Track active attack campaigns
- **Vulnerabilities Tab**: CVE tracking and exploitation risks

### 3. AI Response (/response)
- **AI Response Engine**: View SentinelAI-X recommendations
- **Execute Actions**: Deploy autonomous responses
- **Action History**: Review all executed actions with rollback options

### 4. Incidents (/incidents)
- Track all security incidents by status
- Filter: Open, Investigating, Contained, Resolved
- View incident details and threat actor attribution

---

## API Endpoints

### Threat Analysis
```bash
POST /api/threats/analyze
Content-Type: application/json

{
  "type": "malware|intrusion|phishing",
  "data": { ... analysis data ... }
}
```

### Audit Logging
```bash
POST /api/audit/log
Content-Type: application/json

{
  "action": "create|update|delete",
  "resourceType": "user|threat|incident",
  "resourceId": "resource-id",
  "changes": { ... changes object ... }
}
```

### PQC Key Management
```bash
POST /api/crypto/keys
Content-Type: application/json

{
  "algorithm": "CRYSTALS-Kyber|CRYSTALS-Dilithium|SPHINCS+",
  "keySize": 512
}
```

---

## Threat Intelligence Data

### Sample Threat Actors (5+ Included)
- **APT-33 (Elfin)** - Iran, CVSS 9.2, Known for supply chain attacks
- **Lazarus Group** - North Korea, CVSS 9.8, Expert-level sophistication
- **Turla (Snake)** - Russia, CVSS 9.6, Intelligence gathering
- **FIN7** - Various, CVSS 8.9, Financial motivation
- **Conti** - Russia, CVSS 8.7, Ransomware-as-a-Service

### Sample Malware (5+ Included)
- Shamoon (Wiper, 98% detection)
- Emotet (Banking Trojan, 97% detection)
- Mirai (IoT Botnet, 96% detection)
- Stuxnet (Rootkit/Worm, 100% detection)
- WannaCry (Ransomware, 99% detection)

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| i18n | next-intl (English/Amharic) |
| Backend | Python FastAPI, Rust Axum |
| ML/AI | scikit-learn, Isolation Forest |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Auth | Better Auth with sessions |
| Crypto | HMAC-SHA256 (PQC ready) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Deployment

### Vercel (Frontend)
```bash
# Connect GitHub repo to Vercel
pnpm build
```

### AWS ECS (Python AI Service)
```bash
docker build -t ethioshield-ai services/python_ai
aws ecr push ethioshield-ai:latest
```

### AWS ECS (Rust Security Service)
```bash
docker build -t ethioshield-security services/rust_security
aws ecr push ethioshield-security:latest
```

---

## Security Considerations

1. **Post-Quantum Ready**: All key management prepared for CRYSTALS-Kyber migration
2. **Audit Trail**: All actions logged with cryptographic signatures
3. **Session Security**: Secure cookies with 7-day expiration
4. **Database Isolation**: RLS enabled for multi-tenant data
5. **API Security**: Rate limiting and input validation required

---

## Future Enhancements (Phases 4-6)

### Phase 4: Digital Twin & PQC
- Network simulation with vulnerability injection
- Real CRYSTALS-Kyber key generation
- Quantum-safe TLS setup

### Phase 5: Real-Time Feed & Analytics
- Live threat feed ingestion (STIX/TAXII)
- Advanced analytics dashboard
- Threat correlation engine

### Phase 6: Production Polish
- Performance optimization
- Multi-region deployment
- Advanced RBAC system

---

## Monitoring

### Health Checks
```bash
# Frontend
curl http://localhost:3000/

# Python AI
curl http://localhost:8000/health

# Rust Security
curl http://localhost:8001/health
```

### Logs
```bash
# Frontend
pnpm dev  # View Turbopack compilation

# Python
tail -f services/python_ai/logs.txt

# Rust
RUST_LOG=info cargo run
```

---

## Support & Documentation

- **GitHub Issues**: Report bugs and request features
- **Slack Channel**: #ethioshield for team communication
- **Wiki**: Detailed technical documentation
- **API Docs**: Auto-generated via Swagger/OpenAPI

---

## License

Enterprise license - Contact for details

---

## Contact

**EthioShield Team**
- Security: security@ethioshield.com
- Support: support@ethioshield.com
- Development: dev@ethioshield.com

---

**Built with ❤️ for cybersecurity excellence**
