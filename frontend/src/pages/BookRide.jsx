import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Car, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { rideApi, driverApi } from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Fix Leaflet default icon hashing issue in Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for pickup, drop, and driver
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

export default function BookRide() {
  const navigate = useNavigate();
  
  const [pickup, setPickup] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
  const [drop, setDrop] = useState({ lat: 12.9900, lng: 77.6100 });
  const [pickupAddress, setPickupAddress] = useState('Indiranagar Metro Station, Bangalore');
  const [dropAddress, setDropAddress] = useState('Commercial Street, Bangalore');
  
  const [selectionMode, setSelectionMode] = useState('pickup'); // pickup or drop
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [fare, setFare] = useState(150);
  const [activeRide, setActiveRide] = useState(null);
  
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, requesting, matched, accepted
  const [error, setError] = useState('');
  
  const stompClientRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // 1. Fetch active ride if any
    const checkActiveRide = async () => {
      try {
        const response = await rideApi.getActive();
        if (response.data) {
          setActiveRide(response.data);
          // If active ride exists, redirect to tracking or update state
          if (response.data.status === 'ACCEPTED' || response.data.status === 'ONGOING') {
            navigate(`/tracking?rideId=${response.data.id}`);
          } else if (response.data.status === 'REQUESTED') {
            setBookingStatus('requesting');
            setActiveRide(response.data);
            setupRideWebSocket(response.data.id);
          }
        }
      } catch (err) {
        console.error("Error checking active rides: ", err);
      }
    };

    checkActiveRide();
    fetchNearbyDrivers(pickup.lat, pickup.lng);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  // Calculate simulated fare based on Euclidean distance
  useEffect(() => {
    const latDiff = pickup.lat - drop.lat;
    const lngDiff = pickup.lng - drop.lng;
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32; // In km approx
    const baseFare = 50;
    const perKmRate = 15;
    const estimated = Math.round(baseFare + dist * perKmRate);
    setFare(Math.max(60, estimated));
  }, [pickup, drop]);

  const fetchNearbyDrivers = async (lat, lng) => {
    try {
      const response = await driverApi.getNearby(lat, lng, 10.0);
      setNearbyDrivers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Subscribe to ride updates
  const setupRideWebSocket = (rideId) => {
    const socket = new SockJS('https://gonari-13.onrender.com/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket for booking updates');
        client.subscribe(`/topic/ride/${rideId}`, (message) => {
          const updatedRide = JSON.parse(message.body);
          setActiveRide(updatedRide);
          if (updatedRide.status === 'ACCEPTED') {
            setBookingStatus('accepted');
            setTimeout(() => {
              navigate(`/tracking?rideId=${updatedRide.id}`);
            }, 1500);
          }
        });
      },
    });
    client.activate();
    stompClientRef.current = client;
  };

  const handleRequestRide = async () => {
    setBookingStatus('requesting');
    setError('');

    try {
    console.log("Sending request...");

    const response = await rideApi.request({
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropLat: drop.lat,
        dropLng: drop.lng,
        pickupAddress,
        dropAddress,
        fare,
    });

    console.log("Full Response:", response);
    console.log("Response Data:", response.data);

    const newRide = response.data;

    console.log("Ride ID:", newRide.id);

    setActiveRide(newRide);

    console.log("Navigating...");

    navigate(`/tracking?rideId=${newRide.id}`);

} catch (err) {
    console.log("ERROR OCCURRED");
    console.log(err);
    console.log(err.response);
    console.log(err.response?.data);

    setBookingStatus("idle");
    setError(err.response?.data || "Failed");
}
  };

  // Interactive Map Event Handler for clicks
  function MapEventsHandler() {
    useMapEvents({
      click(e) {
        if (bookingStatus !== 'idle') return; // Cannot edit during active requests

        if (selectionMode === 'pickup') {
          setPickup({ lat: e.latlng.lat, lng: e.latlng.lng });
          setPickupAddress(`Map Coordinates: [${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}]`);
          fetchNearbyDrivers(e.latlng.lat, e.latlng.lng);
        } else {
          setDrop({ lat: e.latlng.lat, lng: e.latlng.lng });
          setDropAddress(`Map Coordinates: [${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}]`);
        }
      },
    });
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh]">
      
      {/* Booking Side Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-5">
          <h2 className="text-xl font-extrabold text-gray-200 flex items-center gap-2">
            <Car className="w-5 h-5 text-safety-pink" />
            Book a Safety Ride
          </h2>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {bookingStatus === 'idle' && (
            <div className="flex flex-col gap-4">
              
              {/* Pickup selection toggle */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectionMode('pickup')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectionMode === 'pickup'
                        ? 'bg-safety-pink/10 border-safety-pink text-safety-pink shadow-glow-pink'
                        : 'border-white/5 bg-gray-950/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    Select Pickup Location
                  </button>
                  <button
                    onClick={() => setSelectionMode('drop')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectionMode === 'drop'
                        ? 'bg-safety-pink/10 border-safety-pink text-safety-pink shadow-glow-pink'
                        : 'border-white/5 bg-gray-950/20 text-gray-400 hover:text-white'
                    }`}
                  >
                    Select Drop Location
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-950/60 border border-white/5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Pickup Point</span>
                      <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">{pickupAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-gray-950/60 border border-white/5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-safety-pink shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Drop Point</span>
                      <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">{dropAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimate Details */}
              <div className="p-4 rounded-2xl bg-safety-pink/5 border border-safety-pink/10 flex items-center justify-between mt-2">
                <div>
                  <span className="text-xs text-gray-400">Estimated Fare</span>
                  <div className="text-2xl font-extrabold text-safety-pink mt-0.5">₹ {fare}</div>
                </div>
                <div className="text-right text-[10px] text-gray-500 font-bold">
                  Includes women safety surcharge<br />Only verified female driver
                </div>
              </div>

              <button
                onClick={handleRequestRide}
                className="w-full py-4 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Request Gonari Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {bookingStatus === 'requesting' && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-safety-pink/20 border-t-safety-pink animate-spin mb-6"></div>
              <h3 className="font-extrabold text-lg text-white mb-2">Finding Nearest Female Driver</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                Notifying nearby verified drivers. Driver will verify gender and details before accepting request.
              </p>
              
              <div className="mt-6 w-full p-3.5 rounded-2xl bg-gray-950/60 border border-white/5 text-left text-xs flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pickup:</span>
                  <span className="text-gray-300 font-medium line-clamp-1">{pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OTP Code:</span>
                  <span className="text-safety-pink font-extrabold tracking-widest bg-safety-pink/10 px-2 py-0.5 rounded-md">
                    {activeRide?.otp}
                  </span>
                </div>
              </div>
            </div>
          )}

          {bookingStatus === 'accepted' && (
            <div className="flex flex-col items-center py-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-xl text-green-400 mb-2">Driver Matched!</h3>
              <p className="text-xs text-gray-400">
                Verified driver has accepted your ride request. Initializing tracking screen...
              </p>
            </div>
          )}

        </div>

        {/* Info panel */}
        <div className="glass-card p-5 rounded-2xl border border-white/5 text-xs text-gray-400 leading-relaxed">
          💡 <strong>Tip</strong>: Click anywhere on the map to set pickup or drop markers. You can change selection modes with the buttons above.
        </div>
      </div>

      {/* Map Display Panel */}
      <div className="lg:col-span-2 relative h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <MapContainer center={[pickup.lat, pickup.lng]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Pickup Marker */}
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup>
              <span className="font-bold text-xs text-gray-800">Pickup Location</span>
            </Popup>
          </Marker>

          {/* Drop Marker */}
          <Marker position={[drop.lat, drop.lng]} icon={dropIcon}>
            <Popup>
              <span className="font-bold text-xs text-gray-800">Drop Location</span>
            </Popup>
          </Marker>

          {/* Nearby Drivers Map Icons */}
          {nearbyDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={[driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0]]}
              icon={driverIcon}
            >
              <Popup>
                <div className="text-xs text-gray-800">
                  <strong className="block">Available Driver</strong>
                  Vehicle: {driver.vehicleType}<br />
                  Rating: ★ {driver.rating.toFixed(1)}
                </div>
              </Popup>
            </Marker>
          ))}

          <MapEventsHandler />
        </MapContainer>

        <div className="absolute top-4 right-4 z-40 bg-gray-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs font-semibold text-gray-200">
          <Navigation className="w-3.5 h-3.5 text-safety-pink animate-spin-slow" />
          <span>Showing {nearbyDrivers.length} nearby female drivers</span>
        </div>
      </div>

    </div>
  );
}
