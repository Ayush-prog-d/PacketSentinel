
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {

  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [live, setLive] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [threatSummary, setThreatSummary] = useState("");
  

  // =========================
  // FETCH ALERTS
  // =========================
  const fetchAlerts = async () => {

    try {

      const res = await API.get("/alerts");

      console.log("ALERTS:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setAlerts([...data]);

    } catch (err) {

      console.error("Error fetching alerts:", err);

    }
  };

  // =========================
  // FETCH TRAFFIC
  // =========================
  const fetchTraffic = async () => {

    try {

      const res = await API.get("/traffic-summary");

      console.log("TRAFFIC:", res.data);

      setTrafficData(res.data);

    } catch (err) {

      console.error("Error fetching traffic:", err);

    }
  };
  const clearData = async () => {

  try {

    await API.post("/reset-data");

    await fetchAlerts();
    await fetchTraffic();
    await fetchStats();

  } catch (err) {

    console.error("Clear failed:", err);

  }
};

  // =========================
  // FETCH DASHBOARD STATS
  // =========================
  const fetchStats = async () => {

    try {

      const res = await API.get("/dashboard-stats");

      console.log("STATS:", res.data);

      setStats(res.data);

    } catch (err) {

      console.error("Error fetching stats:", err);

    }
  };
  const generateThreatSummary = () => {

  if (!alerts || alerts.length === 0) {

    setThreatSummary("No active threats detected.");
    return;
  }

  const highCount = alerts.filter(
    (a) => a.severity.toLowerCase() === "high"
  ).length;

  let risk = "LOW";

  if (highCount >= 5) {
    risk = "HIGH";
  } else if (highCount >= 2) {
    risk = "MEDIUM";
  }

  const summary = `
Potential suspicious network activity detected across monitored traffic.

Total Alerts: ${alerts.length}

High Severity Alerts: ${highCount}

Risk Level: ${risk}

Recommended Analyst Action:
Investigate outbound traffic patterns and review affected systems for anomalies.
`;

  setThreatSummary(summary);
};
  


  // =========================
  // FILE UPLOAD
  // =========================
  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a PCAP file");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {

      await API.post("/upload-pcap", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Upload successful");

      // REFRESH EVERYTHING
      await fetchAlerts();
      await fetchTraffic();
      await fetchStats();

    } catch (err) {

      console.error("Upload failed:", err);

    }
  };

  // =========================
  // LIVE REFRESH
  // =========================
  useEffect(() => {

    fetchAlerts();
    fetchTraffic();
    fetchStats();

  }, []);
 
  useEffect(() => {

    if (live) {

      const interval = setInterval(() => {

        fetchAlerts();
        fetchTraffic();
        fetchStats();

      }, 5000);

      return () => clearInterval(interval);
    }

  }, [live]);
  useEffect(() => {

  generateThreatSummary();

}, [alerts]);
 
  // =========================
  // SEVERITY COLORS
  // =========================
  const getSeverityColor = (severity) => {

    switch (severity?.toLowerCase()) {

      case "high":
        return "red";

      case "medium":
        return "orange";

      case "low":
        return "lightgreen";

      default:
        return "white";
    }
  };
  const pieData = trafficData
  ? [
      {
        name: "HTTP",
        value: trafficData.protocols.HTTP
      },
      {
        name: "HTTPS",
        value: trafficData.protocols.HTTPS
      },
      {
        name: "DNS",
        value: trafficData.protocols.DNS
      }
    ]
  : [];

  
return (

  <div
    style={{
      backgroundColor: "#0f172a",
      minHeight: "100vh",
      color: "#e2e8f0",
      padding: "30px",
      fontFamily: "'Segoe UI', sans-serif"
    }}
  >

    {/* ========================= */}
    {/* HEADER */}
    {/* ========================= */}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}
    >

      <div>

        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            color: "#e2e8f0"
          }}
        >
          PacketSentinel
        </h1>

        <p
          style={{
            marginTop: "5px",
            color: "#94a3b8"
          }}
        >
          Security Operations Center Dashboard
        </p>

      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "10px 16px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >

        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: live ? "#22c55e" : "#ef4444",
            display: "inline-block"
          }}
        />

        <span
          style={{
            color: "#e2e8f0",
            fontWeight: "bold"
          }}
        >
          {live ? "Live Monitoring Active" : "Manual Monitoring"}
        </span>

      </div>

    </div>

    {/* ========================= */}
    {/* CONTROL PANEL */}
    {/* ========================= */}

    <div
      style={{
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "30px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}
    >

      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        style={{
          color: "#e2e8f0",
          backgroundColor: "#0f172a",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #334155"
        }}
      />

      <button
        onClick={handleUpload}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Upload PCAP
      </button>

      <button
        onClick={clearData}
        style={{
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Clear Dashboard
      </button>

      <button
        onClick={() => setLive(!live)}
        style={{
          backgroundColor: live ? "#22c55e" : "#475569",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          marginLeft: "auto"
        }}
      >
        {live ? "Live Monitoring ON" : "Live Monitoring OFF"}
      </button>

    </div>

    {/* ========================= */}
    {/* DASHBOARD CARDS */}
    {/* ========================= */}

    {stats && (

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "10px"
            }}
          >
            Total Alerts
          </p>

          <h1
            style={{
              margin: 0,
              color: "#e2e8f0"
            }}
          >
            {stats.total_alerts}
          </h1>

        </div>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "10px"
            }}
          >
            High Severity
          </p>

          <h1
            style={{
              margin: 0,
              color: "#ef4444"
            }}
          >
            {stats.high_severity_alerts}
          </h1>

        </div>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "10px"
            }}
          >
            Medium Severity
          </p>

          <h1
            style={{
              margin: 0,
              color: "#f59e0b"
            }}
          >
            {stats.medium_severity_alerts}
          </h1>

        </div>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >

          <p
            style={{
              color: "#94a3b8",
              marginBottom: "10px"
            }}
          >
            Low Severity
          </p>

          <h1
            style={{
              margin: 0,
              color: "#22c55e"
            }}
          >
            {stats.low_severity_alerts}
          </h1>

        </div>

      </div>
    )}

    {/* ========================= */}
    {/* GRAPH + AI SUMMARY */}
    {/* ========================= */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "30px"
      }}
    >

      {/* PIE CHART */}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Traffic Distribution
        </h2>

        <PieChart width={400} height={300}>

          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >

            <Cell fill="#3b82f6" />
            <Cell fill="#22c55e" />
            <Cell fill="#f59e0b" />

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </div>

      {/* AI SUMMARY */}

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          AI Threat Summary
        </h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            color: "#e2e8f0",
            fontFamily: "'Segoe UI', sans-serif",
            lineHeight: "1.6"
          }}
        >
          {threatSummary}
        </pre>

      </div>

    </div>

    {/* ========================= */}
    {/* ALERT TABLE */}
    {/* ========================= */}

    <div
      style={{
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        overflow: "hidden",
        marginBottom: "30px"
      }}
    >

      <h2>Security Alerts</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px"
        }}
      >

        <thead>

          <tr
            style={{
              borderBottom: "1px solid #334155"
            }}
          >

            <th>Alert Type</th>
            <th>Severity</th>
            <th>Source IP</th>
            <th>Destination IP</th>
            <th>Description</th>

          </tr>

        </thead>

        <tbody>

          {alerts && alerts.length > 0 ? (

            alerts.map((a, i) => (

              <tr
                key={i}
                onClick={() => setSelectedAlert(a)}
                style={{
                  borderBottom: "1px solid #334155",
                  cursor: "pointer",
                  transition: "0.2s ease"
                }}

                onMouseEnter={(e) =>
                  e.currentTarget.style.backgroundColor = "#273449"
                }

                onMouseLeave={(e) =>
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              >

                <td>{a.alert_type}</td>

                <td
                  style={{
                    color:
                      a.severity === "High"
                        ? "#ef4444"
                        : a.severity === "Medium"
                        ? "#f59e0b"
                        : "#22c55e",

                    fontWeight: "bold"
                  }}
                >
                  {a.severity}
                </td>

                <td>{a.source_ip}</td>

                <td>{a.destination_ip}</td>

                <td>{a.description}</td>

              </tr>
            ))

          ) : (

            <tr>

              <td colSpan="5">
                No alerts available
              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>

    {/* ========================= */}
    {/* INVESTIGATION PANEL */}
    {/* ========================= */}

    {selectedAlert && (

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "350px",
          height: "100vh",
          backgroundColor: "#111827",
          padding: "20px",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.5)",
          overflowY: "auto"
        }}
      >

        <h2>Incident Investigation</h2>

        <hr />

        <p>
          <strong>Alert Type:</strong>
          {" "}
          {selectedAlert.alert_type}
        </p>

        <p>
          <strong>Severity:</strong>
          {" "}
          {selectedAlert.severity}
        </p>

        <p>
          <strong>Source IP:</strong>
          {" "}
          {selectedAlert.source_ip}
        </p>

        <p>
          <strong>Destination IP:</strong>
          {" "}
          {selectedAlert.destination_ip}
        </p>

        <p>
          <strong>Description:</strong>
          {" "}
          {selectedAlert.description}
        </p>

        <p>
          <strong>Timestamp:</strong>
          {" "}
          {selectedAlert.timestamp}
        </p>

        <p>
          <strong>Recommended Action:</strong>
          {" "}
          {selectedAlert.recommended_action}
        </p>

        <button
          onClick={() => setSelectedAlert(null)}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Close Investigation
        </button>

      </div>
    )}

  </div>
);


}

export default App;

