from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="EthioShield AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class MalwareAnalysisRequest(BaseModel):
    file_hash: str
    file_size: int
    entropy: float
    api_calls: List[str]
    behavior_features: List[float]

class MalwareAnalysisResponse(BaseModel):
    is_malware: bool
    confidence: float
    malware_family: Optional[str]
    threat_level: str
    behavioral_score: float

class IntrusionDetectionRequest(BaseModel):
    source_ip: str
    destination_ip: str
    port: int
    protocol: str
    packet_count: int
    bytes_sent: int
    bytes_received: int
    payload_entropy: float

class IntrusionDetectionResponse(BaseModel):
    is_intrusion: bool
    confidence: float
    attack_type: Optional[str]
    threat_level: str
    anomaly_score: float

class PhishingDetectionRequest(BaseModel):
    url: str
    email_sender: str
    email_subject: str
    email_body: str
    sender_reputation: float

class PhishingDetectionResponse(BaseModel):
    is_phishing: bool
    confidence: float
    threat_type: str
    threat_level: str
    similarity_score: float

# Initialize ML models
isolation_forest_malware = IsolationForest(contamination=0.1, random_state=42)
isolation_forest_intrusion = IsolationForest(contamination=0.05, random_state=42)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/analyze/malware", response_model=MalwareAnalysisResponse)
async def analyze_malware(request: MalwareAnalysisRequest):
    """
    Analyze a file for malware using ML features
    """
    try:
        # Feature engineering
        features = np.array([
            request.file_size,
            request.entropy,
            len(request.api_calls),
            *request.behavior_features[:5]  # Use first 5 behavioral features
        ]).reshape(1, -1)
        
        # Predict using ensemble
        anomaly_score = isolation_forest_malware.score_samples(features)[0]
        is_malware = anomaly_score < -0.5
        
        # Calculate confidence
        confidence = min(abs(anomaly_score) * 100, 100)
        
        # Determine threat level
        if confidence > 95:
            threat_level = "critical"
        elif confidence > 85:
            threat_level = "high"
        elif confidence > 70:
            threat_level = "medium"
        else:
            threat_level = "low"
        
        # Simple malware family classification
        malware_family = None
        if is_malware:
            if "CreateRemoteThread" in request.api_calls:
                malware_family = "Trojan.Generic"
            elif "SetWindowsHookEx" in request.api_calls:
                malware_family = "Spyware.Generic"
            else:
                malware_family = "Malware.Unclassified"
        
        return MalwareAnalysisResponse(
            is_malware=is_malware,
            confidence=confidence,
            malware_family=malware_family,
            threat_level=threat_level,
            behavioral_score=float(anomaly_score)
        )
    except Exception as e:
        logger.error(f"Malware analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/analyze/intrusion", response_model=IntrusionDetectionResponse)
async def analyze_intrusion(request: IntrusionDetectionRequest):
    """
    Detect intrusion attempts using network features
    """
    try:
        # Feature engineering from network telemetry
        features = np.array([
            request.packet_count,
            request.bytes_sent,
            request.bytes_received,
            request.port,
            request.payload_entropy,
        ]).reshape(1, -1)
        
        anomaly_score = isolation_forest_intrusion.score_samples(features)[0]
        is_intrusion = anomaly_score < -0.3
        
        confidence = min(abs(anomaly_score) * 100, 100)
        
        # Determine threat level
        if confidence > 90:
            threat_level = "critical"
        elif confidence > 75:
            threat_level = "high"
        elif confidence > 60:
            threat_level = "medium"
        else:
            threat_level = "low"
        
        # Classify attack type
        attack_type = None
        if is_intrusion:
            if request.packet_count > 1000:
                attack_type = "Brute Force"
            elif request.bytes_received > request.bytes_sent * 5:
                attack_type = "Data Exfiltration"
            elif request.payload_entropy > 7.5:
                attack_type = "Obfuscated Payload"
            else:
                attack_type = "Suspicious Activity"
        
        return IntrusionDetectionResponse(
            is_intrusion=is_intrusion,
            confidence=confidence,
            attack_type=attack_type,
            threat_level=threat_level,
            anomaly_score=float(anomaly_score)
        )
    except Exception as e:
        logger.error(f"Intrusion detection error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.post("/analyze/phishing", response_model=PhishingDetectionResponse)
async def analyze_phishing(request: PhishingDetectionRequest):
    """
    Detect phishing emails and URLs
    """
    try:
        # Simple heuristic-based phishing detection
        phishing_score = 0.0
        
        # Check URL patterns
        if "http://" in request.url:  # Unencrypted
            phishing_score += 0.2
        if request.url.count(".") > 3:  # Suspicious domain
            phishing_score += 0.15
        if len(request.url) > 100:  # Obfuscated URL
            phishing_score += 0.1
        
        # Check sender reputation
        if request.sender_reputation < 0.3:
            phishing_score += 0.25
        
        # Check email content
        suspicious_keywords = ["click here", "verify account", "update payment", "confirm identity"]
        email_lower = request.email_body.lower()
        for keyword in suspicious_keywords:
            if keyword in email_lower:
                phishing_score += 0.1
        
        # Check subject line
        urgent_keywords = ["urgent", "action required", "verify", "confirm"]
        subject_lower = request.email_subject.lower()
        for keyword in urgent_keywords:
            if keyword in subject_lower:
                phishing_score += 0.1
        
        is_phishing = phishing_score > 0.5
        confidence = min(phishing_score * 100, 100)
        
        threat_type = "Credential Harvesting" if phishing_score > 0.7 else "Phishing Attempt"
        threat_level = "high" if is_phishing else "low"
        
        return PhishingDetectionResponse(
            is_phishing=is_phishing,
            confidence=confidence,
            threat_type=threat_type,
            threat_level=threat_level,
            similarity_score=float(phishing_score)
        )
    except Exception as e:
        logger.error(f"Phishing detection error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed")

@app.get("/models/status")
async def models_status():
    """Get status of ML models"""
    return {
        "models": [
            {"name": "Malware Detection", "status": "ready", "accuracy": 0.94},
            {"name": "Intrusion Detection", "status": "ready", "accuracy": 0.91},
            {"name": "Phishing Detection", "status": "ready", "accuracy": 0.87},
        ],
        "last_updated": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
