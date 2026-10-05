# EthioShield Platform - Deployment Guide

## Overview

EthioShield is an enterprise-grade cybersecurity platform combining threat intelligence, autonomous AI defense (SentinelAI-X), and post-quantum cryptography. This guide covers production deployment on cloud infrastructure.

## Architecture

The platform follows a hybrid architecture:
- **Frontend**: Next.js 16 on Vercel (cloud-first)
- **API Layer**: Next.js API Routes for orchestration
- **Python AI Service**: FastAPI for threat detection (malware, intrusion, phishing)
- **Rust Security Core**: Axum for post-quantum cryptography and audit logging
- **Database**: PostgreSQL (Neon) for persistent storage
- **Authentication**: Better Auth with email+password

## Prerequisites

1. **Vercel Account** - For frontend hosting
2. **Neon PostgreSQL** - Connected integration for database
3. **AWS Account** (optional) - For Python/Rust backend services
4. **Environment Variables** - Properly configured

## Step 1: Database Setup

### Using Neon (Recommended)

1. Ensure Neon integration is connected to your project
2. Run database migrations:

```bash
npx drizzle-kit push
```

3. This creates:
   - `users` table for authentication
   - `sessions` table for session management
   - `threats` table for threat data
   - `alerts` table for security alerts
   - `audit_logs` table for compliance

## Step 2: Environment Variables

Set these in your Vercel project settings:

### Required Variables
```
DATABASE_URL=your_neon_connection_string
NEON_AUTH_COOKIE_SECRET=your_32_char_secret
BETTER_AUTH_URL=https://your-domain.com
```

Generate a secure auth secret:
```bash
openssl rand -base64 32
```

### Optional Variables
```
# Python AI Service
PYTHON_AI_SERVICE_URL=http://your-python-service:8000
# Rust Security Core
RUST_SECURITY_SERVICE_URL=http://your-rust-service:3001
```

## Step 3: Frontend Deployment (Vercel)

### Option A: Using GitHub Integration (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Vercel auto-deploys on every commit

```bash
# Deploy from CLI
vercel deploy --prod
```

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel deploy --prod
```

## Step 4: Backend Services Deployment

### Python AI Service

#### Using AWS ECS (Containerized)

1. **Build Docker Image**:
```bash
cd services/python_ai
docker build -t ethioshield-ai:latest .
```

2. **Push to AWS ECR**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com
docker tag ethioshield-ai:latest {AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ethioshield-ai:latest
docker push {AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ethioshield-ai:latest
```

3. **Create ECS Task Definition** - Point to ECR image, set environment:
```json
{
  "name": "NEON_DATABASE_URL",
  "value": "your_neon_url"
}
```

4. **Deploy ECS Service** - Auto-scaling group with load balancer

#### Local Development

```bash
cd services/python_ai
pip install -r requirements.txt
python main.py
# Server runs on http://localhost:8000
```

### Rust Security Core

#### Using AWS ECS or Fly.io

1. **Build and Deploy**:
```bash
cd services/rust_security
cargo build --release
docker build -t ethioshield-security:latest .
```

2. **Push to Registry** (similar to Python service)

3. **Deploy** - Set environment variables:
```
DATABASE_URL=your_neon_url
SERVICE_PORT=3001
LOG_LEVEL=info
```

## Step 5: Database Migrations

Run Drizzle migrations automatically:

```bash
npx drizzle-kit push
```

Or manually sync schema:

```bash
npx drizzle-kit generate
```

## Step 6: SSL/TLS Configuration

### Using Vercel (Automatic)
- Vercel automatically provisions SSL certificates
- HTTPS enabled by default

### Custom Domain
1. Add domain in Vercel dashboard
2. Configure DNS records as instructed
3. SSL provisioned automatically (usually within 48 hours)

## Step 7: Monitoring & Logging

### Vercel Analytics
- Automatically enabled
- Real-time Core Web Vitals
- Edge function analytics

### Logging
- Check logs: `vercel logs --prod`
- Integration with services monitoring

## Step 8: Production Checklist

Before going live:

- [ ] Environment variables set in Vercel
- [ ] Database connected and migrated
- [ ] Auth secret generated (32+ chars)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Python/Rust services deployed (if using)
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] Dark theme rendering correctly
- [ ] Multilingual (EN/AM) working
- [ ] Telemetry/monitoring active

## Scaling Considerations

### Frontend (Vercel)
- Auto-scales globally via CDN
- Serverless functions auto-scale
- No manual scaling needed

### Python AI Service
- ECS auto-scaling: min 2, max 10 instances
- Load balancer distributes requests
- CloudWatch monitors CPU/memory

### Rust Security Core
- Similar auto-scaling setup
- Handles cryptographic operations
- Consider reserved instances for consistency

### Database
- Neon auto-scales read replicas
- Monitor connection pool usage
- Archive old logs to S3 for compliance

## Security Best Practices

1. **Secrets Management**
   - Use Vercel Environment Variables for secrets
   - Never commit .env files
   - Rotate secrets quarterly

2. **Database**
   - Enable Neon automatic backups
   - Use RLS policies for data isolation
   - Regular security audits

3. **Authentication**
   - Enforce strong passwords
   - Enable rate limiting on auth endpoints
   - Monitor suspicious login attempts

4. **API Security**
   - Use HTTPS only (enforced)
   - API keys for service-to-service auth
   - Regular penetration testing

## Cost Estimation (Monthly)

| Component | Cost |
|-----------|------|
| Vercel Pro | $20 |
| Neon Postgres | $50-200 |
| AWS ECS (Python) | $200-500 |
| AWS ECS (Rust) | $200-500 |
| CloudWatch/Monitoring | $50-100 |
| **Total** | **$520-1,320** |

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Neon dashboard for connection limits
```

### AI Service Not Responding
```bash
# Check ECS task logs
aws logs tail /ecs/ethioshield-ai --follow

# Verify endpoint
curl http://your-service-url/health
```

### Authentication Failures
- Verify BETTER_AUTH_SECRET is set correctly
- Check BETTER_AUTH_URL matches your domain
- Clear cookies and retry

## Support & Monitoring

- **Vercel Dashboard**: Real-time deployment status
- **Neon Console**: Database performance metrics
- **AWS CloudWatch**: Backend service logs
- **Application Logs**: Built-in audit logging

## Next Steps

1. Deploy frontend to Vercel
2. Configure backend services
3. Run load testing
4. Set up monitoring alerts
5. Enable audit logging for compliance
6. Train security team on platform

---

For production support, contact the EthioShield security team.
