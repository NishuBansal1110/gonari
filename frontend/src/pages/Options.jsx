import React from 'react';
import { Bike, Car, ShieldAlert, Award } from 'lucide-react';

export default function Options() {
  const options = [
    {
      icon: Bike,
      title: 'Gonari Bike',
      desc: 'Quick, traffic-friendly, and cost-effective. Perfect for single female commuters looking for rapid transit.',
      price: '₹ 12/km',
    },
    {
      icon: Car,
      title: 'Gonari Auto',
      desc: 'The traditional auto-rickshaw experience, driven exclusively by verified women drivers. Great for short local hops.',
      price: '₹ 15/km',
    },
    {
      icon: Car,
      title: 'Gonari Mini',
      desc: 'Comfortable hatchbacks with fully verified safety lock systems. Perfect for daily commutes or carrying luggage.',
      price: '₹ 18/km',
    },
    {
      icon: Car,
      title: 'Gonari Prime',
      desc: 'Spacious sedans with top-rated female driver captains. Recommended for family travel and airport drops.',
      price: '₹ 22/km',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent">
          Tailored Ride Options
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          Choose the ride option that fits your travel style. Every tier comes with our signature women-only driver match and active GPS tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {options.map((option, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 flex gap-5 hover:border-safety-pink/20 transition-all duration-300">
            <div className="p-4 rounded-2xl bg-safety-pink/10 text-safety-pink h-fit">
              <option.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-200 mb-1">{option.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{option.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Base rate from</span>
                <span className="text-sm font-extrabold text-safety-pink">{option.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
