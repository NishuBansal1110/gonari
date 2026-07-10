import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, MessageSquare } from 'lucide-react';
import { contactUsApi } from '../services/api';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactUsApi(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent">
          Get in Touch With Safety Team
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Have safety feedback, corporate booking queries, or need help? Send us a message and our safety desks will revert shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Info Cards */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/5 flex gap-4">
            <div className="p-3 rounded-xl bg-safety-pink/10 text-safety-pink h-fit">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">Location</h4>
              <p className="text-gray-400 text-xs mt-1">Shesafe House, Double Road, Indiranagar, Bangalore, India</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 flex gap-4">
            <div className="p-3 rounded-xl bg-safety-pink/10 text-safety-pink h-fit">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">Safety Email</h4>
              <p className="text-gray-400 text-xs mt-1">safety@gonari.com</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/5 flex gap-4">
            <div className="p-3 rounded-xl bg-safety-pink/10 text-safety-pink h-fit">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">Helpline Desk</h4>
              <p className="text-gray-400 text-xs mt-1">1800-SHE-SAFE (Corporate Helpdesk)</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-safety-pink" />
            Send a Safety Message
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-white"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input px-4 py-3 rounded-xl text-sm text-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="glass-input px-4 py-3 rounded-xl text-sm text-white resize-none"
                placeholder="How can our safety team support you?"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-2 w-fit px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-safety-pink to-safety-purple text-white shadow-glow-pink hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 transition-all"
            >
              {status === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs font-semibold">
                Thank you! Your message has been sent successfully. Our safety desks will check it.
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                Failed to send message. Please try again.
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
