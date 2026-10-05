# EthioShield Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### Step 2: Set Environment Variables
```bash
# Generate auth secret
AUTH_SECRET=$(openssl rand -base64 32)

# Create .env.local
cat > .env.local << EOF
NEON_AUTH_COOKIE_SECRET=$AUTH_SECRET
DATABASE_URL=postgresql://user:password@localhost/ethioshield
PYTHON_AI_SERVICE_URL=http://localhost:8000
RUST_SECURITY_SERVICE_URL=http://localhost:8001
BETTER_AUTH_URL=http://localhost:3000
EOF
```

### Step 3: Start Frontend
```bash
pnpm dev
```

Open `http://localhost:3000`

---

## 🔐 Demo Access

**Email:** test@ethioshield.com  
**Password:** password123

---

## 📊 Dashboard Overview

### Main Dashboard
Shows:
- 24 active threats
- 98.7% detection rate
- 156 blocked threats
- Real-time threat timeline

### Navigation
- **Threats**: Browse APT profiles and malware database
- **Incidents**: Track security incidents by status
- **AI Response**: Execute autonomous threat responses
- **Digital Twin**: Network simulation (Phase 4)

---

## 🎯 Key Features Demo

### 1. Threat Intelligence
1. Click "Threats" in sidebar
2. View APT profiles (APT-33, Lazarus, Turla, etc.)
3. Search malware database (Shamoon, Emotet, Mirai)
4. See CVSS scores and attack tactics

### 2. Autonomous AI Response
1. Click "AI Response" in sidebar
2. Review active threats with confidence scores
3. Click "Execute" on suggested actions
4. View action history with rollback options

### 3. Multilingual Support
1. Click language icon in header
2. Switch between English and Amharic
3. All UI labels translate instantly

---

## 🛠️ Development Backend Services

### Python AI Service
```bash
cd services/python_ai
pip install -r requirements.txt
python main.py  # Runs on localhost:8000

# Test endpoint
curl -X POST http://localhost:8000/analyze/malware \
  -H "Content-Type: application/json" \
  -d '{
    "file_hash": "abc123",
    "file_size": 1024,
    "entropy": 7.2,
    "api_calls": ["CreateRemoteThread"],
    "behavior_features": [0.5, 0.6, 0.7, 0.8, 0.9]
  }'
```

### Rust Security Service
```bash
cd services/rust_security
cargo run --release  # Runs on localhost:8001

# Test endpoint
curl -X POST http://localhost:8001/audit/logs \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_alert",
    "resource_type": "threat",
    "resource_id": "THR-001",
    "user_id": "user-123",
    "ip_address": "192.168.1.1",
    "changes": {"severity": "critical"}
  }'
```

---

## 📱 Pages Overview

| URL | Purpose |
|-----|---------|
| `/` | Main dashboard & login |
| `/threats` | Threat intelligence hub |
| `/incidents` | Security incident tracking |
| `/response` | AI autonomous response console |
| `/settings` | User preferences (Phase 6) |

---

## 🔌 API Quick Reference

### Analyze Threat
```bash
POST /api/threats/analyze
{
  "type": "intrusion|malware|phishing",
  "data": { ... }
}
```

### Create Audit Log
```bash
POST /api/audit/log
{
  "action": "create|update|delete",
  "resourceType": "threat|incident|user",
  "resourceId": "id-123",
  "changes": { ... }
}
```

### Generate PQC Key
```bash
POST /api/crypto/keys
{
  "algorithm": "CRYSTALS-Kyber",
  "keySize": 1024
}
```

---

## 🎨 Customization

### Change Color Theme
Edit `/app/globals.css` design tokens:
```css
:root {
  --primary: #0ea5e9;  /* Cyan */
  --accent: #06b6d4;   /* Teal */
  --background: #0f172a; /* Dark Blue */
}
```

### Add New Threat Actor
Edit `/components/threats/threat-actors-list.tsx`:
```typescript
const threatActors = [
  {
    name: 'New APT Group',
    country: 'Country',
    sophistication: 'Expert',
    cvss: 9.5,
    // ... more fields
  },
];
```

---

## 🚨 Common Issues

### Database Connection Error
```
Error: No database connection string provided
```
**Solution:** Set `DATABASE_URL` in `.env.local`

### Python Service Not Found
```
Error: Failed to connect to localhost:8000
```
**Solution:** Start Python AI service: `python services/python_ai/main.py`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
pnpm dev
```

---

## 📊 Performance Tips

1. **Use Vercel Edge Functions** for low-latency threat detection
2. **Cache threat intelligence** with Redis
3. **Compress database queries** with connection pooling
4. **Enable Turbopack** for faster hot reload
5. **Use SWR** for client-side data fetching

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env.local` with real credentials
2. ✅ Use strong auth secrets (40+ characters)
3. ✅ Rotate cryptographic keys quarterly
4. ✅ Review audit logs weekly
5. ✅ Enable MFA for production accounts

---

## 📚 Next Steps

1. **Explore Threat Intelligence**: Browse 100+ known threats
2. **Test AI Detection**: Submit test files for malware analysis
3. **Review Audit Logs**: Check security action history
4. **Configure Policies**: Set response rules (Phase 6)
5. **Deploy to Production**: Use Vercel + AWS deployment

---

## 💡 Tips & Tricks

- **Keyboard Shortcut**: Press `?` for help menu
- **Search**: Use `/` to quickly navigate pages
- **Filters**: Click filter icon to narrow results
- **Export**: Right-click report for export options
- **Dark Mode**: Toggle in header (automatic on night mode)

---

## 📞 Support

- **Documentation**: See `PLATFORM_GUIDE.md`
- **Issues**: GitHub Issues
- **Chat**: Slack #ethioshield
- **Email**: support@ethioshield.com

---

**Happy threat hunting! 🛡️**
