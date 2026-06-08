from app.storage import alerts_db
def analyze_packets(packet_data):

    alerts = [alerts_db.extend(alerts)]

    for packet in packet_data:

        protocol = packet["protocol"]
        packet_size = packet["packet_size"]

        # DNS Detection
        if "DNS" in protocol:

            alerts.append({
                "alert_type": "Suspicious DNS Activity",
                "severity": "High",
                "source_ip": packet["src_ip"],
                "destination_ip": packet["dst_ip"],
                "description": "Potential DNS tunneling detected"
            })

        # ICMP Detection
        elif "ICMP" in protocol:

            alerts.append({
                "alert_type": "ICMP Communication",
                "severity": "Medium",
                "source_ip": packet["src_ip"],
                "destination_ip": packet["dst_ip"],
                "description": "Possible covert ICMP communication"
            })

        # Large Packet Detection
        elif packet_size > 1000:

            alerts.append({
                "alert_type": "Large Data Transfer",
                "severity": "Medium",
                "source_ip": packet["src_ip"],
                "destination_ip": packet["dst_ip"],
                "description": "Potential data exfiltration activity"
            })

    return alerts