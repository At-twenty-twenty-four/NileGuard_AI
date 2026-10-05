use actix_web::{web, App, HttpServer, HttpResponse, middleware};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use chrono::Utc;
use uuid::Uuid;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use hex;

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuditLogEntry {
    pub id: String,
    pub timestamp: String,
    pub action: String,
    pub resource_type: String,
    pub resource_id: String,
    pub user_id: Option<String>,
    pub ip_address: String,
    pub changes: serde_json::Value,
    pub signature: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditLogRequest {
    pub action: String,
    pub resource_type: String,
    pub resource_id: String,
    pub user_id: Option<String>,
    pub ip_address: String,
    pub changes: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CryptoKeyRequest {
    pub algorithm: String,
    pub key_size: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CryptoKeyResponse {
    pub key_id: String,
    pub algorithm: String,
    pub public_key: String,
    pub created_at: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignatureRequest {
    pub message: String,
    pub key_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignatureResponse {
    pub signature: String,
    pub algorithm: String,
    pub key_id: String,
}

pub struct AppState {
    audit_logs: Mutex<Vec<AuditLogEntry>>,
    crypto_keys: Mutex<Vec<CryptoKeyResponse>>,
}

// Health check endpoint
async fn health() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "EthioShield Security Service",
        "timestamp": Utc::now().to_rfc3339(),
        "version": "1.0.0"
    }))
}

// Create audit log entry with cryptographic signature
async fn create_audit_log(
    state: web::Data<AppState>,
    req: web::Json<AuditLogRequest>,
) -> HttpResponse {
    let log_entry = AuditLogEntry {
        id: Uuid::new_v4().to_string(),
        timestamp: Utc::now().to_rfc3339(),
        action: req.action.clone(),
        resource_type: req.resource_type.clone(),
        resource_id: req.resource_id.clone(),
        user_id: req.user_id.clone(),
        ip_address: req.ip_address.clone(),
        changes: req.changes.clone(),
        signature: generate_signature(
            &format!("{}{}{}", req.action, req.resource_type, req.resource_id)
        ),
    };

    match state.audit_logs.lock() {
        Ok(mut logs) => {
            logs.push(log_entry.clone());
            HttpResponse::Created().json(log_entry)
        }
        Err(_) => HttpResponse::InternalServerError().json(
            serde_json::json!({"error": "Failed to acquire lock"})
        ),
    }
}

// Retrieve audit logs
async fn get_audit_logs(state: web::Data<AppState>) -> HttpResponse {
    match state.audit_logs.lock() {
        Ok(logs) => HttpResponse::Ok().json(logs.clone()),
        Err(_) => HttpResponse::InternalServerError().json(
            serde_json::json!({"error": "Failed to retrieve logs"})
        ),
    }
}

// Generate cryptographic keys (simulated - real implementation uses CRYSTALS-Kyber)
async fn generate_pqc_key(
    state: web::Data<AppState>,
    req: web::Json<CryptoKeyRequest>,
) -> HttpResponse {
    let key = CryptoKeyResponse {
        key_id: format!("pqc-key-{}", Uuid::new_v4().to_string()),
        algorithm: req.algorithm.clone(),
        public_key: generate_mock_public_key(&req.algorithm),
        created_at: Utc::now().to_rfc3339(),
        status: "active".to_string(),
    };

    match state.crypto_keys.lock() {
        Ok(mut keys) => {
            keys.push(key.clone());
            HttpResponse::Created().json(key)
        }
        Err(_) => HttpResponse::InternalServerError().json(
            serde_json::json!({"error": "Failed to generate key"})
        ),
    }
}

// List all cryptographic keys
async fn list_pqc_keys(state: web::Data<AppState>) -> HttpResponse {
    match state.crypto_keys.lock() {
        Ok(keys) => HttpResponse::Ok().json(keys.clone()),
        Err(_) => HttpResponse::InternalServerError().json(
            serde_json::json!({"error": "Failed to retrieve keys"})
        ),
    }
}

// Sign data with cryptographic key
async fn sign_data(req: web::Json<SignatureRequest>) -> HttpResponse {
    let signature = generate_signature(&req.message);
    
    HttpResponse::Ok().json(SignatureResponse {
        signature,
        algorithm: "HMAC-SHA256".to_string(),
        key_id: req.key_id.clone(),
    })
}

// Verify signature
async fn verify_signature(req: web::Json<SignatureRequest>) -> HttpResponse {
    let expected_sig = generate_signature(&req.message);
    let is_valid = expected_sig == req.signature.clone();

    HttpResponse::Ok().json(serde_json::json!({
        "valid": is_valid,
        "timestamp": Utc::now().to_rfc3339()
    }))
}

// Helper function to generate HMAC-SHA256 signature
fn generate_signature(message: &str) -> String {
    let secret = b"ethioshield-security-secret";
    let mut mac = HmacSha256::new_from_slice(secret)
        .expect("HMAC can take key of any size");
    mac.update(message.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

// Helper function to generate mock PQC public key
fn generate_mock_public_key(algorithm: &str) -> String {
    // In production, this would generate actual CRYSTALS-Kyber, Dilithium, etc keys
    format!(
        "{}:{}",
        algorithm,
        hex::encode(uuid::Uuid::new_v4().as_bytes())
    )
}

// Get cryptography service status
async fn crypto_status() -> HttpResponse {
    HttpResponse::Ok().json(serde_json::json!({
        "algorithms": [
            {
                "name": "CRYSTALS-Kyber",
                "status": "ready",
                "key_sizes": [512, 768, 1024]
            },
            {
                "name": "CRYSTALS-Dilithium",
                "status": "ready",
                "key_sizes": [2560, 4896, 6396]
            },
            {
                "name": "SPHINCS+",
                "status": "ready",
                "key_sizes": [4096, 8192]
            }
        ],
        "timestamp": Utc::now().to_rfc3339(),
        "version": "1.0.0"
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let state = web::Data::new(AppState {
        audit_logs: Mutex::new(Vec::new()),
        crypto_keys: Mutex::new(Vec::new()),
    });

    println!("Starting EthioShield Security Service...");
    println!("Listening on http://0.0.0.0:8001");

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(middleware::Logger::default())
            .route("/health", web::get().to(health))
            .route("/audit/logs", web::post().to(create_audit_log))
            .route("/audit/logs", web::get().to(get_audit_logs))
            .route("/crypto/keys/generate", web::post().to(generate_pqc_key))
            .route("/crypto/keys", web::get().to(list_pqc_keys))
            .route("/crypto/sign", web::post().to(sign_data))
            .route("/crypto/verify", web::post().to(verify_signature))
            .route("/crypto/status", web::get().to(crypto_status))
    })
    .bind("0.0.0.0:8001")?
    .run()
    .await
}
