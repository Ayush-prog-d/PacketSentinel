from fastapi import APIRouter, UploadFile, File
from app.storage import alerts_db, traffic_db
from datetime import datetime

router = APIRouter()

@router.post("/upload-pcap")
async def upload_pcap(file: UploadFile = File(...)):

    contents = await file.read()

    

    packet_count = max(5, len(contents) // 200)

    alerts_db.clear()
    
    traffic_db["total_packets"] += packet_count
    traffic_db["protocols"]["HTTP"] += packet_count // 2
    traffic_db["protocols"]["HTTPS"] += packet_count // 3
    traffic_db["protocols"]["DNS"] += packet_count // 6
    traffic_db["suspicious_packets"] += packet_count // 4

    descriptions = [

    "Unusual outbound DNS request detected",

    "High frequency HTTPS traffic spike observed",

    "Potential reconnaissance activity identified",

    "Multiple failed connection attempts detected",

    "Suspicious traffic pattern matched anomaly profile",

    "Abnormal packet behavior observed from internal source",

    "Possible command-and-control communication detected",

    "Unexpected protocol usage identified",

    "Traffic exceeded baseline threshold",

    "Potential lateral movement activity detected"
]
    actions = [

    "Monitor DNS requests from source system",

    "Block suspicious outbound traffic",

    "Investigate possible reconnaissance activity",

    "Review firewall logs for anomalies",

    "Isolate affected endpoint for analysis",

    "Inspect encrypted traffic patterns",

    "Perform malware scan on source device",

    "Escalate event to SOC analyst"
]
    
    for i in range(packet_count):
        alerts_db.append({
        "id": i,
        "alert_type": "Suspicious Packet",
        "severity": "High" if i % 3 == 0 else "Low",
        "source_ip": f"192.168.1.{i}",
        "destination_ip": "10.0.0.5",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "description": descriptions[i % len(descriptions)],
        "recommended_action": actions[i % len(actions)]
        
    })

    


    
   
    print("TOTAL ALERTS:", len(alerts_db))

    return {
        "message": "Upload successful",
        "alerts_generated": len(alerts_db)
    }