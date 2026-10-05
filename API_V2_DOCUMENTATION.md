# EthioShield v2 REST API Documentation

## Overview
EthioShield v2 implements a comprehensive RESTful API with standardized response formats, proper error handling, and OpenAPI/Swagger documentation.

## Base URL
```
https://api.ethioshield.com/v2
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All responses follow a standardized format:
```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-06-24T12:00:00Z",
  "requestId": "uuid"
}
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

### Threats (Security Alerts)
- `GET /threats` - List all threats
- `GET /threats/:id` - Get specific threat
- `POST /threats` - Create threat alert
- `PUT /threats/:id` - Update threat
- `DELETE /threats/:id` - Delete threat
- `GET /threats/statistics` - Get threat statistics

### Threat Actors
- `GET /actors` - List threat actors
- `GET /actors/:id` - Get actor details
- `POST /actors` - Create threat actor profile
- `GET /actors/:id/campaigns` - Get actor campaigns
- `GET /actors/:id/infrastructure` - Get actor infrastructure

### Malware Analysis
- `GET /malware` - List malware records
- `POST /malware/analyze` - Analyze file hash
- `GET /malware/:hash` - Get malware details
- `POST /malware/upload` - Upload malware sample

### Incidents
- `GET /incidents` - List incidents
- `POST /incidents` - Create incident
- `GET /incidents/:id` - Get incident details
- `PUT /incidents/:id` - Update incident status
- `POST /incidents/:id/timeline` - Add incident event

### Autonomous Response
- `GET /response/actions` - List autonomous actions
- `POST /response/actions` - Log autonomous action
- `GET /response/recommendations` - Get AI recommendations
- `POST /response/execute` - Execute response action

### Intelligence
- `GET /intelligence/feeds` - List threat feeds
- `GET /intelligence/iocs` - Get indicators of compromise
- `POST /intelligence/ingest` - Ingest STIX feed

### Crypto & Keys
- `GET /crypto/keys` - List PQC keys
- `POST /crypto/keys/generate` - Generate new PQC key
- `POST /crypto/encrypt` - Encrypt data
- `POST /crypto/decrypt` - Decrypt data

### Settings
- `GET /settings` - Get system settings
- `PUT /settings` - Update settings
- `GET /settings/audit-logs` - Get audit logs

## Error Codes
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid parameters
- 401 Unauthorized - Authentication required
- 403 Forbidden - Access denied
- 404 Not Found - Resource not found
- 429 Too Many Requests - Rate limited
- 500 Internal Server Error
- 503 Service Unavailable

## Rate Limiting
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated
- Header: `X-RateLimit-Remaining`

## Pagination
```
GET /threats?page=1&limit=50&sort=createdAt&order=desc
```

Response includes:
```json
{
  "data": [],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 50,
    "pages": 20
  }
}
```

## Webhooks
POST to configured webhook URL on:
- Threat detected
- Incident created
- Autonomous action taken
- Malware identified
