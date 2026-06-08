# PacketSentinel

## SOC Monitoring & Network Forensics Dashboard

PacketSentinel is a SOC-style cybersecurity monitoring and network forensics dashboard designed to simulate packet monitoring, threat visualization, and incident investigation workflows.

---

# Features

* PCAP file upload system
* Dynamic security alert generation
* SOC monitoring dashboard
* Traffic visualization charts
* AI-style threat summary
* Incident investigation panel
* Live monitoring simulation

---

# Tech Stack

## Frontend

* React.js
* Recharts

## Backend

* FastAPI
* Python

---

# Project Structure


PacketSentinel/
│
├── frontend/
├── backend/
└── README.md


---

# How to Run the Project

## 1. Clone Repository


git clone https://github.com/Ayush-prog-d/PacketSentinel.git


---

## 2. Start Backend

Open terminal:

cd backend


Create virtual environment:


python -m venv .venv


Activate virtual environment:

### Windows


.\.venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Run backend:


uvicorn app.main:app --reload


Backend runs on:


http://127.0.0.1:8000

---

## 3. Start Frontend

Open another terminal:

cd frontend


Install dependencies:

npm install


Run frontend:

npm start


Frontend runs on:

http://localhost:3000


---

# Future Scope

* Real-time packet monitoring
* SIEM integration
* Machine learning anomaly detection
* Threat intelligence feeds
* Advanced packet parsing

---

# Team

Developed by Team Sentinel Core
