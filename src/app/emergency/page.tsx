"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Use environment variable, not localhost (Vercel will fail otherwise)
const SOCKET_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    : "";

export default function EmergencyPage() {
  const [selectedDoctors, setSelectedDoctors] = useState<any[]>([]);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showAmbulances, setShowAmbulances] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [callDoctor, setCallDoctor] = useState("");
  const [callStatus, setCallStatus] = useState("Connecting…");

  const videoRoomRef = useRef<HTMLDivElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, RTCPeerConnection>>({});
  const socketRef = useRef<any>(null);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const ambulanceMarkers = useRef<any[]>([]);
  const userMarker = useRef<any>(null);

  const doctors = {
    video: [
      { name: "Dr. Aisha Khan", specialization: "Cardiologist", location: "Delhi", available: true },
      { name: "Dr. Meera Singh", specialization: "Neurologist", location: "Bengaluru", available: true },
      { name: "Dr. Rajesh Verma", specialization: "Pediatrician", location: "Mumbai", available: true }
    ],
    audio: [
      { name: "Dr. Sunita Sharma", specialization: "General Physician", location: "Hyderabad", available: true },
      { name: "Dr. Karan Verma", specialization: "ENT", location: "Jaipur", available: true },
      { name: "Dr. Aman Gill", specialization: "Dermatologist", location: "Chennai", available: true }
    ]
  };

  const ambulances = [
    { id: "amb1", name: "Ambulance 1", hospital: "PGI Chandigarh", lat: 30.7333, lng: 76.7794, phone: "7565664455" },
    { id: "amb2", name: "Ambulance 2", hospital: "Fortis Mohali", lat: 30.7046, lng: 76.7179, phone: "8765432109" }
  ];

  // Initialize socket + map
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Socket connect
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected to socket", socket.id);
    });

    // Initialize map
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([30.7333, 76.7794], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(mapInstance.current);
    }

    return () => {
      socketRef.current?.disconnect();
      mapInstance.current?.remove();
    };
  }, []);

  const showDoctors = (type: "video" | "audio") => {
    setSelectedDoctors(doctors[type].filter((d) => d.available));
    setShowDoctorList(true);
    setShowAmbulances(false);
  };

  const showAmbulanceList = () => {
    setShowDoctorList(false);
    setShowAmbulances(true);

    const map = mapInstance.current;
    if (!map) return;

    ambulanceMarkers.current.forEach((m) => map.removeLayer(m));
    ambulanceMarkers.current = [];

    ambulances.forEach((a) => {
      const marker = L.marker([a.lat, a.lng]).addTo(map);
      marker.bindPopup(<b>${a.name}</b><br/>${a.hospital});
      ambulanceMarkers.current.push(marker);
    });

    if (ambulances[0]) {
      map.setView([ambulances[0].lat, ambulances[0].lng], 11);
    }
  };

  // WebRTC simplified call handler
  const startCall = async (roomName: string, isVideo: boolean) => {
    setCallModal(true);
    setCallStatus("Connecting…");
    setCallDoctor(roomName.replace("doctor-", "").replace(/-/g, " "));

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true
      });

      localStreamRef.current = localStream;

      const videoRoom = videoRoomRef.current;
      if (videoRoom) videoRoom.innerHTML = "";

      const localVideo = document.createElement("video");
      localVideo.srcObject = localStream;
      localVideo.muted = true;
      localVideo.autoplay = true;
      localVideo.playsInline = true;
      videoRoom?.appendChild(localVideo);

      const socket = socketRef.current;
      if (!socket) throw new Error("Socket not connected");

      socket.emit("join-room", roomName);

      socket.on("user-connected", async (userId: string) => {
        const pc = new RTCPeerConnection();
        peersRef.current[userId] = pc;

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        pc.ontrack = (e) => {
          const remoteVideo = document.createElement("video");
          // @ts-ignore
          remoteVideo.srcObject = e.streams[0];
          remoteVideo.autoplay = true;
          remoteVideo.playsInline = true;
          videoRoom?.appendChild(remoteVideo);
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) socket.emit("signal", { to: userId, signal: { candidate: e.candidate } });
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("signal", { to: userId, signal: { sdp: offer } });
      });

      socket.on("signal", async (data: any) => {
        let pc = peersRef.current[data.from];
        if (!pc) {
          pc = new RTCPeerConnection();
          peersRef.current[data.from] = pc;

          localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

          pc.ontrack = (e) => {
            const remoteVideo = document.createElement("video");
            // @ts-ignore
            remoteVideo.srcObject = e.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            videoRoom?.appendChild(remoteVideo);
          };

          pc.onicecandidate = (e) => {
            if (e.candidate) socket.emit("signal", { to: data.from, signal: { candidate: e.candidate } });
          };
        }

        if (data.signal.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.signal.sdp));

          if (data.signal.sdp.type === "offer") {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("signal", { to: data.from, signal: { sdp: answer } });
          }
        }

        if (data.signal.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
        }
      });

      socket.on("user-disconnected", (id: string) => {
        if (peersRef.current[id]) {
          peersRef.current[id].close();
          delete peersRef.current[id];
        }
      });

      setCallStatus("Connected ✅");
    } catch (err) {
      console.error(err);
      setCallStatus("Failed to connect");
    }
  };

  const connectDoctor = (name: string, type: "video" | "audio") => {
    const roomName = "doctor-" + name.replace(/\s+/g, "-");
    startCall(roomName, type === "video");
  };

  const endCall = () => {
    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};

    const videoRoom = videoRoomRef.current;
    if (videoRoom) videoRoom.innerHTML = "";

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    setCallModal(false);
  };

  const bookAmbulance = (ambId: string) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const selected = ambulances.find((a) => a.id === ambId);

        socketRef.current?.emit("ambulance-book", {
          ambulanceId: ambId,
          userLocation: { latitude, longitude }
        });

        alert(Ambulance requested: ${selected?.name}. Sharing your location.);

        const map = mapInstance.current;
        if (map) {
          if (userMarker.current) map.removeLayer(userMarker.current);

          userMarker.current = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41]
            })
          }).addTo(map);

          userMarker.current.bindPopup("Your location").openPopup();

          if (selected) {
            map.setView([(latitude + selected.lat) / 2, (longitude + selected.lng) / 2], 12);
          }
        }
      },
      (err) => {
        alert("Unable to get location: " + err.message);
      }
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        body { margin: 0; font-family: "Segoe UI", sans-serif; }
        nav { width:100%; display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.1); position:sticky; top:0; z-index:10; }
        nav h1 { font-size:28px; font-weight:bold; background:linear-gradient(90deg,#2563eb,#16a34a,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin:0; }
        nav .links { display:flex; gap:20px; flex-wrap:wrap; }
        nav .links a { text-decoration:none; font-weight:500; color:#374151; transition:0.3s; }
        nav .links a:hover { color:#2563eb; }
        .page-title { font-size:42px; color:#1e40af; margin:40px 0 30px 0; text-align:center; width:100%; }
        .emergency-container { display:flex; gap:70px; padding:0 40px; }
        .emergency-buttons { display:flex; flex-direction:column; gap:20px; }
        .emergency-buttons button { width:250px; padding:18px; font-size:20px; font-weight:bold; border:none; border-radius:30px; color:white; cursor:pointer; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.1); }
        .video-btn { background:linear-gradient(90deg,#93c5fd,#60a5fa); }
        .audio-btn { background:linear-gradient(90deg,#6ee7b7,#34d399); }
        .ambulance-btn { background:linear-gradient(90deg,#fda4af,#f87171); }
        .item { background:#fff; border-radius:15px; padding:15px; box-shadow:0 3px 8px rgba(0,0,0,0.1); margin-bottom:10px; }
        .call-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:999; }
        .call-box { background:#fff; border-radius:20px; padding:20px; width:90%; max-width:880px; display:flex; flex-direction:column; text-align:center; }
        #video-room video { width: 45%; border-radius: 10px; }
        #map { height: 400px; width: 100%; margin-top: 20px; border-radius: 15px; }
      `}</style>

      <nav>
        <h1>PHN System</h1>
        <div className="links">
          <a href="/">Home</a>
        </div>
      </nav>

      <h1 className="page-title">Emergency Services</h1>

      <div className="emergency-container">
        <div className="emergency-buttons">
          <button className="video-btn" onClick={() => showDoctors("video")}>
            🎥 Video Call
          </button>
          <button className="audio-btn" onClick={() => showDoctors("audio")}>
            📞 Audio Call
          </button>
          <button className="ambulance-btn" onClick={showAmbulanceList}>
            🚑 Need Ambulance?
          </button>
        </div>

        <div style={{ flexGrow: 1 }}>
          {showDoctorList &&
            selectedDoctors.map((doc, index) => (
              <div key={index} className="item">
                <strong>{doc.name}</strong>
                <br />
                Specialization: {doc.specialization}
                <br />
                Location: {doc.location}
                <br />
                <button
                  style={{
                    marginTop: 6,
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: 10,
                    background: "#34d399",
                    color: "white",
                    cursor: "pointer"
                  }}
                  onClick={() => connectDoctor(doc.name, "video")}
                >
                  📞 Call Now
                </button>
              </div>
            ))}

          {showAmbulances &&
            ambulances.map((a) => (
              <div key={a.id} className="item">
                <strong>{a.name}</strong>
                <br />
                Hospital: {a.hospital}
                <br />
                Phone: <a href={tel:${a.phone}}>{a.phone}</a>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    a.hospital
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📍 View on Map
                </a>

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#ef4444",
                      color: "white",
                      border: "none"
                    }}
                    onClick={() => bookAmbulance(a.id)}
                  >
                    Book Ambulance
                  </button>

                  <a
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#2563eb",
                      color: "white",
                      textDecoration: "none"
                    }}
                    href={tel:${a.phone}}
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}

          <div id="map" ref={mapRef}></div>
        </div>
      </div>

      {callModal && (
        <div className="call-modal">
          <div className="call-box">
            <h3>{callDoctor}</h3>
            <div>{callStatus}</div>

            <div
              id="video-room"
              ref={videoRoomRef}
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 10
              }}
            ></div>

            <div style={{ marginTop: 15 }}>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer"
                }}
                onClick={endCall}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}

      <footer
        style={{
          marginTop: 40,
          background: "#1e40af",
          color: "white",
          width: "100%",
          padding: 15,
          textAlign: "center"
        }}
      >
        © 2025 PHN System |{" "}
        <a style={{ color: "#93c5fd", margin: "0 10px" }} href="/privacy">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a style={{ color: "#93c5fd", margin: "0 10px" }} href="/terms">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}