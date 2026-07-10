import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Heart, Mail, MapPin } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
);
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#040f1c] border-t border-white/5 pt-16 pb-8 px-6 mt-auto text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
        
        {/* About column - span 4 */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <Link to="/" className="flex items-center gap-2.5 w-fit group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-safety-pink to-safety-purple text-white shadow-glow-pink group-hover:scale-105 transition-all duration-300">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-safety-pink to-safety-purple bg-clip-text text-transparent">
              GONARI
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            India's premier, verified, and empowering ride-hailing ecosystem built exclusively for women, girls, and families. Driving dignity and ultimate safety in every single mile.
          </p>
          <div className="flex items-center gap-3.5 mt-2">
            {[
              { icon: FacebookIcon, href: 'https://facebook.com' },
              { icon: TwitterIcon, href: 'https://twitter.com' },
              { icon: InstagramIcon, href: 'https://instagram.com' },
              { icon: LinkedinIcon, href: 'https://linkedin.com' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-safety-pink/10 hover:text-safety-pink border border-white/5 hover:border-safety-pink/20 flex items-center justify-center transition-all duration-300"
              >
                <social.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links - span 2 */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-gray-200 text-sm tracking-wider uppercase">Platform</h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-safety-pink transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-safety-pink transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/options" className="hover:text-safety-pink transition-colors">Ride Options</Link>
            </li>
            <li>
              <Link to="/why" className="hover:text-safety-pink transition-colors">Why Choose Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-safety-pink transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact/Support - span 3 */}
        <div className="md:col-span-3 flex flex-col gap-4 text-sm">
          <h3 className="font-bold text-gray-200 text-sm tracking-wider uppercase">Contact Support</h3>
          <p className="text-gray-400 leading-relaxed">
            Our 24/7 dedicated safety response desk is here to assist with any booking or verification queries.
          </p>
          <div className="flex flex-col gap-2.5 mt-1">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Mail className="w-4.5 h-4.5 text-safety-pink" />
              <a href="mailto:safety@gonari.com" className="hover:text-safety-pink transition-colors">safety@gonari.com</a>
            </div>
            <div className="flex items-center gap-2.5 text-gray-300">
              <MapPin className="w-4.5 h-4.5 text-safety-pink" />
              <span>Bangalore, Karnataka, India</span>
            </div>
          </div>
        </div>

        {/* Safety helplines - span 3 */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <h3 className="font-bold text-gray-200 text-sm tracking-wider uppercase">Emergency Hotline</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click these numbers directly to open your phone dialer or call helper applications instantly.
          </p>
          <div className="flex flex-col gap-3 mt-1">
            <a
              href="tel:112"
              className="flex items-center gap-3 text-sm text-red-400 font-extrabold bg-red-500/10 hover:bg-red-500/15 px-4 py-3 rounded-2xl border border-red-500/20 hover:border-red-500/35 transition-all duration-300 shadow-md group"
            >
              <Phone className="w-4 h-4 animate-bounce group-hover:scale-110 transition-transform" />
              <span>Emergency SOS: 112</span>
            </a>
            <a
              href="tel:1091"
              className="flex items-center gap-3 text-sm text-safety-pink font-extrabold bg-safety-pink/10 hover:bg-safety-pink/15 px-4 py-3 rounded-2xl border border-safety-pink/20 hover:border-safety-pink/35 transition-all duration-300 shadow-md group"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Women Helpline: 1091</span>
            </a>
          </div>
        </div>

      </div>

      <hr className="border-white/5 mb-8" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Gonari Platform. All rights reserved.</span>
          <span className="hidden sm:inline text-white/5">|</span>
          <a href="#terms" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#privacy" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-safety-pink fill-current" />
          <span>for a safer, unified future.</span>
        </div>
      </div>
    </footer>
  );
}
