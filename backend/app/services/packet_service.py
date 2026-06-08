from scapy.all import rdpcap
from scapy.layers.inet import IP


def process_pcap(file_path):

    packets = rdpcap(file_path)

    extracted_packets = []

    for packet in packets:

        if packet.haslayer(IP):

            packet_info = {
                "src_ip": packet[IP].src,
                "dst_ip": packet[IP].dst,
                "protocol": packet.summary(),
                "packet_size": len(packet)
            }

            extracted_packets.append(packet_info)

    return extracted_packets[:20]