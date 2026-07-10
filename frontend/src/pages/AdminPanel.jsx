import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, FileText, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';

export default function AdminPanel() {
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDriver, setSelectedDriver] = useState(null);

  const fetchPendingDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getPending();
      setPendingDrivers(response.data);
      if (response.data.length > 0) {
        setSelectedDriver(response.data[0]);
      } else {
        setSelectedDriver(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to fetch pending drivers. Access restricted to admin roles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDrivers();
  }, []);

  const handleVerify = async (userId, action) => {
    try {
      if (action === 'approve') {
        await adminApi.approveDriver(userId);
      } else {
        await adminApi.rejectDriver(userId);
      }
      alert(`Driver has been ${action === 'approve' ? 'APPROVED' : 'REJECTED'} successfully.`);
      fetchPendingDrivers();
    } catch (err) {
      console.error(err);
      alert('Error changing driver verification status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safety-pink/20 border-t-safety-pink rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 min-h-[80vh] flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-200 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-safety-pink" />
            Admin ID Audit & Safety Panel
          </h1>
          <p className="text-gray-400 text-xs mt-1">Review driver documentation and selfies side-by-side to approve/reject status.</p>
        </div>
        <button
          onClick={fetchPendingDrivers}
          className="p-3 rounded-2xl bg-gray-800 border border-white/10 hover:border-safety-pink text-gray-300 hover:text-white transition-all shadow-md"
          title="Refresh pending list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {pendingDrivers.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-white/5 text-center text-gray-400">
          🎉 All driver registrations have been audited. No pending approvals.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List panel */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <h3 className="font-bold text-gray-300 text-sm mb-1">Pending Driver Verification Requests ({pendingDrivers.length})</h3>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2">
              {pendingDrivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedDriver?.id === driver.id
                      ? 'bg-safety-pink/10 border-safety-pink/40 shadow-glow-pink'
                      : 'bg-gray-900/60 border-white/5 hover:border-white/10'
                  }`}
                >
                  <h4 className="font-bold text-gray-200 text-sm">{driver.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">{driver.email}</p>
                  <p className="text-gray-500 text-xs">{driver.phone}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Details / Review panel */}
          {selectedDriver && (
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6">
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-200">{selectedDriver.name}</h2>
                  <p className="text-gray-400 text-xs mt-1">Identity document matches gender: {selectedDriver.gender}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(selectedDriver.id, 'approve')}
                    className="p-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Check className="w-4 h-4" />
                    Approve Driver
                  </button>
                  <button
                    onClick={() => handleVerify(selectedDriver.id, 'reject')}
                    className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 text-xs"
                  >
                    <X className="w-4 h-4" />
                    Reject Request
                  </button>
                </div>
              </div>

              {/* Side-by-side preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Government ID */}
                <div className="flex flex-col gap-2 p-4 bg-gray-950/60 rounded-2xl border border-white/5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-safety-pink" />
                    Government ID Document
                  </span>
                  <div className="w-full h-64 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                    {selectedDriver.govtIdDocUrl ? (
                      <img
                        src={selectedDriver.govtIdDocUrl}
                        alt="Government ID"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">No Document Uploaded</span>
                    )}
                  </div>
                </div>

                {/* Selfie */}
                <div className="flex flex-col gap-2 p-4 bg-gray-950/60 rounded-2xl border border-white/5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-safety-pink" />
                    Verification Selfie Match
                  </span>
                  <div className="w-full h-64 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                    {selectedDriver.selfieUrl ? (
                      <img
                        src={selectedDriver.selfieUrl}
                        alt="Verification Selfie"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">No Selfie Uploaded</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
