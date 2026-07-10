import React from 'react';
import { ShieldAlert, Heart, Landmark, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent">
          Our Mission & Safety Standard
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
          Gonari was born out of a simple need: a travel space where women and girls can travel with absolute security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-safety-pink/10 text-safety-pink">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-200">The Problem We Solve</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Standard ride-hailing services often leave women feeling vulnerable, especially during late-night hours or in unfamiliar areas. Traditional safety measures are often reactive rather than preventative.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-safety-purple/10 text-safety-purple">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-200">The Gonari Core</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            We provide a 100% verified women-to-women ecosystem. By ensuring all drivers and riders undergo mandatory ID audits, we establish a network built on mutual respect and shared trust.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 rounded-full bg-safety-pink/10 text-safety-pink">
          <Landmark className="w-12 h-12" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-200 mb-2">Empowering Women Drivers</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Gonari is not just a platform for riders; it is an economic engine for female drivers. We offer flexible work hours, better commission splits, and above all, the peace of mind that they are only transporting women and kids.
          </p>
        </div>
      </div>
    </div>
  );
}
