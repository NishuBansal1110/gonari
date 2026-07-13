import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, Phone, CheckCircle, ShieldAlert, Share2, Clipboard } from 'lucide-react';
import { rideApi } from '../services/api';
import SOSButton from '../components/SOSButton';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Leaflet default icons overrides
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

export default function LiveTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const rideId = searchParams.get('rideId');

  const [ride, setRide] = useState(null);
  const [driverLoc, setDriverLoc] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);

  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!rideId) {
      navigate('/book');
      return;
    }

    const fetchRide = async () => {
      try {
        const response = await rideApi.getActive();
        if (response.data && response.data.id === rideId) {
          setRide(response.data);
          setDriverLoc({ lat: response.data.pickupLat, lng: response.data.pickupLng }); // Start at pickup
        } else {
          // If no active ride returned by endpoint matches, query details or fall back
          // (Let's assume getActive handles it, or redirect if finished)
          const historyResponse = await rideApi.getHistory();
          const match = historyResponse.data.find(r => r.id === rideId);
          if (match) {
            setRide(match);
            if (match.status === 'COMPLETED') {
              setShowRating(true);
            }
          } else {
            navigate('/book');
          }
        }
      } catch (err) {
        console.error("Error fetching ride: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
    setupWebSockets();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [rideId]);

  const setupWebSockets = () => {
    const socket = new SockJS('https://gonari-13.onrender.com/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to Tracking WebSocket channels');

        // 1. Subscribe to location updates
        client.subscribe(`/topic/ride/${rideId}/location`, (message) => {
          const locUpdate = JSON.parse(message.body);
          setDriverLoc({ lat: locUpdate.lat, lng: locUpdate.lng });
        });

        // 2. Subscribe to ride state changes
        client.subscribe(`/topic/ride/${rideId}`, (message) => {
          const updatedRide = JSON.parse(message.body);
          setRide(updatedRide);
          if (updatedRide.status === 'COMPLETED') {
            setShowRating(true);
          }
        });
      },
    });

    client.activate();
    stompClientRef.current = client;
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/tracking?rideId=${rideId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRatingSubmit = () => {
    alert(`Thank you for rating your ride ★ ${rating}! We work constantly to improve women safety.`);
    setShowRating(false);
    navigate('/book');
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safety-pink/20 border-t-safety-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Ride details could not be found.</p>
        <button onClick={() => navigate('/book')} className="px-5 py-2.5 rounded-xl bg-safety-pink text-white font-semibold">
          Back to Booking
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh]">
      
      {/* Tracking Side Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Ride Status Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Trip Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safety-pink/20 text-safety-pink uppercase">
              {ride.status}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-gray-200">
            {ride.status === 'ACCEPTED' ? 'Driver is arriving' : ride.status === 'ONGOING' ? 'On the way to destination' : 'Trip Finished'}
          </h2>

          <div className="p-3.5 rounded-2xl bg-gray-950/60 border border-white/5 flex flex-col gap-2.5 text-xs text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">Pickup Address:</span>
              <span className="font-medium text-right max-w-[200px] line-clamp-1">{ride.pickupAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Destination:</span>
              <span className="font-medium text-right max-w-[200px] line-clamp-1">{ride.dropAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ride Fare:</span>
              <span className="font-extrabold text-safety-pink">₹ {ride.fare}</span>
            </div>
            {ride.status === 'ACCEPTED' && (
              <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-2">
                <span className="text-gray-500">Provide OTP to Driver:</span>
                <span className="text-sm font-black bg-safety-pink/10 text-safety-pink px-2.5 py-0.5 rounded-lg tracking-widest border border-safety-pink/20">
                  {ride.otp}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Driver Details Card */}
        {ride.driverId && (
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-safety-pink to-safety-purple flex items-center justify-center text-white text-lg font-bold shadow-md">
              {ride.driverName?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-200 text-sm">{ride.driverName}</h4>
                <div className="flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                {ride.vehicleType} • {ride.vehicleNumber}
              </p>
            </div>
            <a
              href={`tel:${ride.driverPhone}`}
              className="p-3 rounded-2xl bg-gray-800 border border-white/10 hover:border-safety-pink text-gray-300 hover:text-white transition-all shadow-md"
              title="Call driver"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Share and Safety Deck Links */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
          <h3 className="font-bold text-gray-300 text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4 text-safety-pink" />
            Safety Sharing Deck
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Share this link with friends or family. They can monitor your vehicle coordinates and active trip path.
          </p>

          <button
            onClick={copyShareLink}
            className="w-full py-3 rounded-xl border border-white/10 hover:border-safety-pink/40 bg-gray-950/20 text-gray-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs">Link Copied!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                <span className="text-xs">Copy Tracking URL</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Interactive Map Panel */}
      <div className="lg:col-span-2 relative h-[500px] lg:h-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <MapContainer center={[ride.pickupLat, ride.pickupLng]} zoom={14} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[ride.pickupLat, ride.pickupLng]} icon={pickupIcon}>
            <Popup>
              <span className="font-bold text-xs text-gray-800">Pickup: {ride.pickupAddress}</span>
            </Popup>
          </Marker>

          <Marker position={[ride.dropLat, ride.dropLng]} icon={dropIcon}>
            <Popup>
              <span className="font-bold text-xs text-gray-800">Destination: {ride.dropAddress}</span>
            </Popup>
          </Marker>

          {/* Real-time Driver Location Marker */}
          {driverLoc && (
            <Marker position={[driverLoc.lat, driverLoc.lng]} icon={driverIcon}>
              <Popup>
                <span className="font-bold text-xs text-gray-800">Driver Location</span>
              </Popup>
            </Marker>
          )}

          {/* Draw trip path */}
          {driverLoc && (
            <Polyline
              positions={[
                [driverLoc.lat, driverLoc.lng],
                [ride.dropLat, ride.dropLng],
              ]}
              color="#d946ef"
              dashArray="5, 10"
              weight={3}
            />
          )}
        </MapContainer>

        {/* SOS Button Integration */}
        <SOSButton rideId={ride.id} />
      </div>

      {/* Trip Completed Rating Popup */}
      {showRating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-gray-900 border border-white/10 p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-gray-200 mb-2">Trip Completed!</h3>
            <p className="text-gray-400 text-xs mb-6">
              You have arrived safely. Please rate your driver to help keep our network verified and secure.
            </p>

            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-amber-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              onClick={handleRatingSubmit}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink transition-all"
            >
              Submit Rating & Exit
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
