import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ToggleLeft, ToggleRight, Bell, ShieldCheck, MapPin, KeyRound, Play, CheckCircle, Navigation } from 'lucide-react';
import api, { driverApi, rideApi } from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Fix Leaflet default icon hashing issue in Vite
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const pickupIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const dropIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-magenta.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const driverIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function DriverDashboard() {
  const [online, setOnline] = useState(false);
  const [driverProfile, setDriverProfile] = useState(null);
  
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const [driverLoc, setDriverLoc] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isSimulating, setIsSimulating] = useState(false);
  
  const stompClientRef = useRef(null);
  const simIntervalRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 1. Fetch driver profile availability
    const fetchDriverData = async () => {
      try {
        const profileRes = await driverApi.getStatus();
        setDriverProfile(profileRes.data);
        setOnline(profileRes.data.available);
        if (profileRes.data.currentLocation) {
          setDriverLoc({
            lat: profileRes.data.currentLocation.coordinates[1],
            lng: profileRes.data.currentLocation.coordinates[0],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    // 2. Fetch active ride if any
    const fetchActiveRide = async () => {
      try {
        const activeRes = await rideApi.getActive();
        if (activeRes.data) {
          setActiveRide(activeRes.data);
          setOnline(false); // Make offline in UI if active ride exists
          setDriverLoc({ lat: activeRes.data.pickupLat, lng: activeRes.data.pickupLng });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDriverData();
    fetchActiveRide();
    setupWebSocket();

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const setupWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to Driver STOMP sockets');

        // Subscribe to incoming ride requests matching this driver
        client.subscribe(`/topic/drivers/${user.userId}/requests`, (message) => {
          const request = JSON.parse(message.body);
          setIncomingRequest(request);
          // Play notification sound
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/911/911-84.wav');
            audio.play();
          } catch (e) {}
        });
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  const handleToggleOnline = async () => {
    try {
      const updated = await driverApi.updateStatus(!online);
      setOnline(!online);
      setDriverProfile(updated.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to update online status. Verify admin verification.');
    }
  };

  const handleAcceptRide = async () => {
    if (!incomingRequest) return;
    try {
      const accepted = await rideApi.accept(incomingRequest.id);
      setActiveRide(accepted.data);
      setIncomingRequest(null);
      setOnline(false);
      setDriverLoc({ lat: accepted.data.pickupLat, lng: accepted.data.pickupLng });
    } catch (err) {
      console.error(err);
      alert('Failed to accept ride.');
    }
  };

  const handleStartRide = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const started = await rideApi.start(activeRide.id, otp);
      setActiveRide(started.data);
      setOtp('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Invalid OTP. Verify and try again.');
    }
  };

  const handleCompleteRide = async () => {
    try {
      const completed = await rideApi.complete(activeRide.id);
      setActiveRide(null);
      setOnline(true); // Turn online back on automatically
      setIsSimulating(false);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      alert('Ride Completed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to complete ride.');
    }
  };

  // Simulated GPS tracker movement from point A to B
  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      return;
    }

    setIsSimulating(true);
    const startPoint = { lat: driverLoc.lat, lng: driverLoc.lng };
    const endPoint = activeRide.status === 'ACCEPTED' 
      ? { lat: activeRide.pickupLat, lng: activeRide.pickupLng } 
      : { lat: activeRide.dropLat, lng: activeRide.dropLng };

    let steps = 30;
    let currentStep = 0;

    const latDelta = (endPoint.lat - startPoint.lat) / steps;
    const lngDelta = (endPoint.lng - startPoint.lng) / steps;

    simIntervalRef.current = setInterval(() => {
      currentStep++;
      const nextLat = startPoint.lat + latDelta * currentStep;
      const nextLng = startPoint.lng + lngDelta * currentStep;

      setDriverLoc({ lat: nextLat, lng: nextLng });

      // Publish location updates over WebSocket / HTTP REST
      api.post('/location/update', {
        lat: nextLat,
        lng: nextLng,
        rideId: activeRide.id,
      }).catch(err => console.error(err));

      if (currentStep >= steps) {
        clearInterval(simIntervalRef.current);
        setIsSimulating(false);
      }
    }, 1500); // update every 1.5 seconds
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh]">
      
      {/* Side Control Board */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Toggle Availability Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-200">Online Availability</h2>
            <button
              onClick={handleToggleOnline}
              disabled={!!activeRide}
              className={`transition-colors focus:outline-none ${activeRide ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {online ? (
                <ToggleRight className="w-14 h-8 text-safety-pink" />
              ) : (
                <ToggleLeft className="w-14 h-8 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-gray-950/60 p-4 rounded-2xl border border-white/5">
            <div className={`w-3.5 h-3.5 rounded-full ${online ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-xs font-semibold text-gray-300">
              {online ? 'Online & Available to match female riders' : 'Offline / On active trip'}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <ToggleLeft className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Incoming Ride Request Popup Card */}
        {incomingRequest && (
          <div className="glass-card p-6 rounded-3xl border border-safety-pink/30 glow-effect-pink shadow-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-safety-pink font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                New Ride Request Match
              </span>
              <span className="text-xs font-black text-gray-300">₹ {incomingRequest.fare}</span>
            </div>

            <div className="text-sm font-semibold text-gray-200">
              Matched Rider: {incomingRequest.riderName}
            </div>

            <div className="flex flex-col gap-2 p-3 bg-gray-950/60 rounded-2xl text-xs text-gray-400">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="line-clamp-2">Pickup: {incomingRequest.pickupAddress}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <MapPin className="w-4 h-4 text-safety-pink shrink-0" />
                <span className="line-clamp-2">Drop: {incomingRequest.dropAddress}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAcceptRide}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-md hover:shadow-lg transition-all"
              >
                Accept Match
              </button>
              <button
                onClick={() => setIncomingRequest(null)}
                className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 text-xs font-bold transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Active Trip Details Card */}
        {activeRide && (
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Trip Panel</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safety-pink/20 text-safety-pink uppercase">
                {activeRide.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-safety-pink to-safety-purple flex items-center justify-center text-white text-sm font-bold">
                {activeRide.riderName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-200 text-sm">{activeRide.riderName}</h4>
                <p className="text-gray-400 text-xs">Fare: ₹ {activeRide.fare} • Phone: {activeRide.riderPhone}</p>
              </div>
            </div>

            {/* OTP Verification form to start trip */}
            {activeRide.status === 'ACCEPTED' && (
              <form onSubmit={handleStartRide} className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-950/60 border border-white/5">
                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-safety-pink" />
                  Enter Rider OTP to Begin Trip
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    className="glass-input px-3.5 py-2 rounded-xl text-center font-extrabold tracking-widest text-sm text-white w-28 uppercase"
                    placeholder="0000"
                  />
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl font-semibold bg-gradient-to-r from-safety-pink to-safety-purple text-white text-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Verify & Start
                  </button>
                </div>
              </form>
            )}

            {/* Location Simulation and Trip Completion options */}
            {activeRide.status === 'ONGOING' && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={toggleSimulation}
                  className={`w-full py-3 rounded-xl font-bold border transition-all text-xs flex items-center justify-center gap-2 ${
                    isSimulating 
                      ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 animate-pulse'
                      : 'border-white/10 hover:border-safety-pink/40 bg-gray-950/20 text-gray-300 hover:text-white'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  {isSimulating ? 'Simulating Ride Motion...' : 'Simulate Vehicle Coordinates'}
                </button>

                <button
                  onClick={handleCompleteRide}
                  className="w-full py-3.5 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-green-600/20 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Ride Match
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Interactive Map Panel */}
      <div className="lg:col-span-2 relative h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <MapContainer center={[driverLoc.lat, driverLoc.lng]} zoom={14} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[driverLoc.lat, driverLoc.lng]} icon={driverIcon}>
            <Popup>
              <span className="font-bold text-xs text-gray-800">Your Current Position</span>
            </Popup>
          </Marker>

          {activeRide && (
            <>
              <Marker position={[activeRide.pickupLat, activeRide.pickupLng]} icon={pickupIcon}>
                <Popup>
                  <span className="font-bold text-xs text-gray-800">Rider Pickup Point</span>
                </Popup>
              </Marker>

              <Marker position={[activeRide.dropLat, activeRide.dropLng]} icon={dropIcon}>
                <Popup>
                  <span className="font-bold text-xs text-gray-800">Rider Destination</span>
                </Popup>
              </Marker>

              <Polyline
                positions={[
                  [driverLoc.lat, driverLoc.lng],
                  activeRide.status === 'ACCEPTED'
                    ? [activeRide.pickupLat, activeRide.pickupLng]
                    : [activeRide.dropLat, activeRide.dropLng],
                ]}
                color="#8b5cf6"
                weight={3}
                dashArray="5, 10"
              />
            </>
          )}
        </MapContainer>
      </div>

    </div>
  );
}
