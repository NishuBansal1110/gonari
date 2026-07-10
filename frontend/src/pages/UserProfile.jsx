import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Heart, History, User, Phone, Briefcase } from 'lucide-react';
import { sosApi, rideApi } from '../services/api';

export default function UserProfile() {
  const [contacts, setContacts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: 'Family' });
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      if (user.role === 'RIDER') {
        const contactsRes = await sosApi.getContacts();
        setContacts(contactsRes.data);
      }
      const historyRes = await rideApi.getHistory();
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setError('');

    if (!newContact.name || !newContact.phone) {
      setError('Please provide Name and Phone number.');
      return;
    }

    try {
      await sosApi.addContact(newContact);
      setNewContact({ name: '', phone: '', relation: 'Family' });
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to add emergency contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) return;
    try {
      await sosApi.deleteContact(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error deleting emergency contact.');
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
    <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh]">
      
      {/* Account Info Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* User Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-safety-pink to-safety-purple flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-extrabold text-gray-200">{user.name}</h2>
          <span className="mt-1 text-xs bg-safety-pink/20 text-safety-pink px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
            {user.role}
          </span>

          <div className="w-full mt-6 p-4 rounded-2xl bg-gray-950/60 border border-white/5 text-left text-xs flex flex-col gap-3 text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-safety-pink" />
              <span>Email: <strong>{user.email}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-safety-pink" />
              <span>Verified Gender: <strong>{user.gender}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-safety-pink" />
              <span>Approval Status: <strong>{user.verificationStatus}</strong></span>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Management (Riders Only) */}
        {user.role === 'RIDER' && (
          <div className="glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-200 text-sm flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-safety-pink animate-pulse" />
              Emergency Contacts
            </h3>

            {/* List */}
            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {contacts.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No emergency contacts added yet.</p>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="p-3 bg-gray-950/60 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-gray-300">{c.name}</h4>
                      <p className="text-gray-500 mt-0.5">{c.phone} • {c.relation}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <hr className="border-white/5" />

            {/* Form */}
            <form onSubmit={handleAddContact} className="flex flex-col gap-3 text-xs">
              <span className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Add Trusted Contact</span>
              {error && <div className="text-red-400 font-semibold">{error}</div>}
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Contact Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  className="glass-input px-3 py-2 rounded-xl text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  className="glass-input px-3 py-2 rounded-xl text-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                  className="glass-input px-3 py-2 rounded-xl text-white flex-1"
                >
                  <option value="Family" className="bg-gray-900">Family</option>
                  <option value="Friend" className="bg-gray-900">Friend</option>
                  <option value="Guardian" className="bg-gray-900">Guardian</option>
                  <option value="Other" className="bg-gray-900">Other</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-safety-pink text-white font-bold hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Ride History Panel */}
      <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col gap-5">
        <h3 className="font-extrabold text-gray-200 text-lg flex items-center gap-2 border-b border-white/5 pb-3">
          <History className="w-5 h-5 text-safety-pink" />
          Completed Ride History
        </h3>

        <div className="flex flex-col gap-4 overflow-y-auto max-h-[550px] pr-2">
          {history.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              No trip records found. Start booking to see your ride logs.
            </div>
          ) : (
            history.map((ride) => (
              <div key={ride.id} className="p-4 bg-gray-950/60 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-center sm:justify-start sm:gap-4">
                    <span className="font-bold text-gray-300">Trip ID: #{ride.id.substring(ride.id.length - 8)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ride.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {ride.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-gray-400 mt-1">
                    <div className="flex gap-1.5">
                      <span className="text-gray-500">From:</span>
                      <span className="line-clamp-1">{ride.pickupAddress}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-gray-500">To:</span>
                      <span className="line-clamp-1">{ride.dropAddress}</span>
                    </div>
                    {user.role === 'RIDER' ? (
                      <div className="flex gap-1.5">
                        <span className="text-gray-500">Driver:</span>
                        <span>{ride.driverName || 'N/A'} ({ride.vehicleNumber || 'N/A'})</span>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <span className="text-gray-500">Rider:</span>
                        <span>{ride.riderName || 'N/A'} ({ride.riderPhone || 'N/A'})</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                  <div className="text-sm font-extrabold text-safety-pink">₹ {ride.fare}</div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    {ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
