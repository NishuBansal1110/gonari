import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, FileText, Camera, Shield, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api';

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() || 'RIDER';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole,
    gender: 'FEMALE',
    govtIdDocUrl: '',
    selfieUrl: '',
    vehicleType: 'MINI',
    vehicleNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: initialRole }));
  }, [initialRole]);

  // Convert file to base64
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation: must choose female (or admin can sign up)
    if (formData.gender !== 'FEMALE' && formData.role !== 'ADMIN') {
      setError("Gonari is a platform exclusively for women and girls. Gender selection must be 'Female'.");
      setLoading(false);
      return;
    }

    if (formData.role === 'DRIVER' && (!formData.govtIdDocUrl || !formData.selfieUrl || !formData.vehicleNumber)) {
      setError("Drivers must upload Govt ID, Selfie, and provide Vehicle details.");
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.signup(formData);
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      window.dispatchEvent(new Event('storage'));

      if (userData.role === 'DRIVER') {
        alert("Account created successfully! Driver registration is PENDING admin approval. You can log in, but cannot accept rides until approved.");
        navigate('/driver');
      } else {
        navigate('/book');
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Sign up failed. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-6 overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-safety-pink/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative">
        
        {/* Header/Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-safety-pink to-safety-purple text-white shadow-glow-pink mb-4">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-200">Join Gonari Safety Platform</h2>
          <p className="text-gray-400 text-xs mt-1">Exclusively for women, girls, and families</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-950/60 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'RIDER' })}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'RIDER' ? 'bg-gradient-to-r from-safety-pink to-safety-purple text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Rider Account
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'DRIVER' })}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                formData.role === 'DRIVER' ? 'bg-gradient-to-r from-safety-pink to-safety-purple text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Driver Account
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input pl-11 pr-4 py-3 rounded-xl text-xs text-white w-full"
                  placeholder="Aisha Sharma"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input pl-11 pr-4 py-3 rounded-xl text-xs text-white w-full"
                  placeholder="aisha@example.com"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="glass-input pl-11 pr-4 py-3 rounded-xl text-xs text-white w-full"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-input pl-11 pr-4 py-3 rounded-xl text-xs text-white w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Gender restriction check (locked to Female) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400">Gender Identity</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="glass-input px-4 py-3 rounded-xl text-xs text-white w-full cursor-pointer"
            >
              <option value="FEMALE" className="bg-gray-900">Female (Enforced for safety)</option>
              <option value="MALE" className="bg-gray-900">Male (Not allowed)</option>
              <option value="OTHER" className="bg-gray-900">Other (Non-binary / Female identifying)</option>
            </select>
          </div>

          {/* DRIVER SPECIAL FIELDS */}
          {formData.role === 'DRIVER' && (
            <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-300">
              <h3 className="text-xs font-bold text-safety-pink tracking-wider uppercase">Driver Document Uploads</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="glass-input px-4 py-3 rounded-xl text-xs text-white w-full"
                  >
                    <option value="BIKE" className="bg-gray-900">Bike (Safety Ride)</option>
                    <option value="AUTO" className="bg-gray-900">Auto Rikshaw</option>
                    <option value="MINI" className="bg-gray-900">Mini Hatchback</option>
                    <option value="PRIME" className="bg-gray-900">Prime Sedan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-400">Vehicle Number</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="glass-input px-4 py-3 rounded-xl text-xs text-white w-full"
                    placeholder="KA 03 MX 9876"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Govt ID */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-safety-pink" />
                    Government ID Document
                  </span>
                  <label className="cursor-pointer border border-dashed border-white/20 hover:border-safety-pink/50 rounded-xl p-3.5 flex flex-col items-center justify-center bg-gray-950/40 text-center transition-all">
                    {formData.govtIdDocUrl ? (
                      <span className="text-xs text-green-400 font-semibold">✓ Govt ID Uploaded</span>
                    ) : (
                      <>
                        <span className="text-xs text-gray-400 font-medium">Upload Aadhaar / DL</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">JPEG / PNG / PDF</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'govtIdDocUrl')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selfie */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-safety-pink" />
                    Live Selfie Verification
                  </span>
                  <label className="cursor-pointer border border-dashed border-white/20 hover:border-safety-pink/50 rounded-xl p-3.5 flex flex-col items-center justify-center bg-gray-950/40 text-center transition-all">
                    {formData.selfieUrl ? (
                      <span className="text-xs text-green-400 font-semibold">✓ Selfie Uploaded</span>
                    ) : (
                      <>
                        <span className="text-xs text-gray-400 font-medium">Take/Upload Selfie</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">Face matching check</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'selfieUrl')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-4 rounded-xl font-bold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-safety-pink hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
