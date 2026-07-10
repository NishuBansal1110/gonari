import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, PhoneCall } from 'lucide-react';
import { sosApi } from '../services/api';

export default function SOSButton({ rideId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const triggerSOS = async () => {
    setStatus('sending');
    
    // Capture user's location via browser Geolocation API
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Triggering SOS with default coordinates.");
      submitSOS(12.9716, 77.5946); // Default Bangalore coordinates
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        submitSOS(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Failed to get precise GPS location. Triggering SOS with fallback coordinates.");
        submitSOS(12.9716, 77.5946);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const submitSOS = async (lat, lng) => {
    try {
      await sosApi.trigger({
        rideId: rideId || '',
        lat,
        lng,
      });
      setStatus('success');
      // Auto close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl animate-pulse-glow hover:scale-105 active:scale-95 transition-all duration-300"
        title="Emergency SOS Panic Button"
      >
        <ShieldAlert className="w-8 h-8" />
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-gray-900 border border-red-500/30 p-6 shadow-2xl relative overflow-hidden">
            
            {/* Design accents */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {status === 'idle' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="font-extrabold text-2xl text-red-500 mb-2">Emergency SOS</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Are you in immediate danger? Triggering SOS will capture your live GPS coordinates, alert your emergency contacts, and notify our 24/7 safety command center.
                </p>

                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={triggerSOS}
                    className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold shadow-lg hover:shadow-red-600/30 transition-all text-lg"
                  >
                    YES, TRIGGER PANIC ALERT
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-all"
                  >
                    No, Cancel
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                  <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                  <span>You can also call the police directly at <strong>112</strong></span>
                </div>
              </div>
            )}

            {status === 'sending' && (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-16 h-16 rounded-full border-4 border-red-500/30 border-t-red-600 animate-spin mb-4"></div>
                <h3 className="font-extrabold text-xl text-white mb-2">Activating Safety Protocol</h3>
                <p className="text-gray-400 text-sm">Retrieving GPS location and sending emergency alerts...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-2xl text-green-500 mb-2">Alert Dispatched</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your safety alerts and live location have been sent to emergency contacts and our safety team. Stay calm, help is on the way.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
                  <X className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-xl text-red-500 mb-2">Trigger Failed</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Could not connect to the safety server. Please check your internet connection or call emergency helpline 112 directly.
                </p>
                <button
                  onClick={triggerSOS}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
                >
                  Retry SOS Dispatch
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
