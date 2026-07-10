import React from 'react';
import { ShieldAlert, Zap, Phone, CheckCircle2, UserCheck, Eye } from 'lucide-react';

export default function WhyChooseUs() {
  const cards = [
    {
      icon: UserCheck,
      title: 'Women & Girls Only',
      desc: 'Signup requires document verification. Only verified women can book, and only verified female drivers can drive.',
    },
    {
      icon: ShieldAlert,
      title: 'SOS Panic Button',
      desc: 'Instantly alerts your emergency contacts and our safety desk with your exact GPS coordinates and ride details.',
    },
    {
      icon: Eye,
      title: 'Share My Ride',
      desc: 'Family and friends can track your live location in real time via a public link, with no login required.',
    },
    {
      icon: CheckCircle2,
      title: 'OTP Ride Lock',
      desc: 'To prevent incorrect pick-ups, rides can only begin when the driver inputs the unique OTP generated on your app.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      desc: 'Leverages STOMP over WebSocket to provide lag-free marker movement, keeping riders and drivers synced.',
    },
    {
      icon: Phone,
      title: '24/7 Helpline Support',
      desc: 'Dedicated safety dispatch team monitoring abnormal routing or vehicle stops to offer support.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent">
          Designed for Absolute Security
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          We have engineered every step of our ride flow to minimize risk and maximize comfort for our community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col hover:border-safety-pink/20 transition-all duration-300">
            <div className="p-3 rounded-xl bg-safety-pink/10 text-safety-pink mb-4 w-fit">
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-200 mb-2">{card.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
