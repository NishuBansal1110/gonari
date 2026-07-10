import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Sparkles, MapPin, CheckCircle, Users, ArrowRight, Lock, 
  ShieldAlert, Smartphone, Search, Award, Star, HelpCircle, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, PhoneCall, ShieldCheck
} from 'lucide-react';
import heroIllustration from '../assets/hero_illustration.png';

export default function Home() {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      quote: "Gonari has completely changed how I travel for work late at night. The verification process is thorough, and knowing both the rider and driver are verified women gives me ultimate peace of mind.",
      name: "Ananya Sharma",
      role: "Software Engineer, Bangalore",
      rating: 5,
      avatar: "A"
    },
    {
      quote: "As a female driver, finding a platform that values my safety as much as the rider's is incredibly rare. The admin approval and OTP verification prevent any unauthorized booking.",
      name: "Priya Patel",
      role: "GoNari Partner Driver, Mumbai",
      rating: 5,
      avatar: "P"
    },
    {
      quote: "I use GoNari to book safe rides for my daughter when she returns from college. The live tracking share link lets me monitor her location in real time without any stress.",
      name: "Meera Nair",
      role: "Mother of a college student, Kochi",
      rating: 5,
      avatar: "M"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000);
    return () => clearInterval(timer);
  }, []);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is GoNari really open only to women and girls?",
      answer: "Yes, absolutely. GoNari is a strict women-and-girls-only ride platform. Registration requires gender selection, government ID verification, and a matching selfie check. Only verified female riders and approved female drivers can access the platform."
    },
    {
      question: "How does the ID verification process work?",
      answer: "During signup, all users (and particularly drivers) upload a government-issued photo ID along with a live selfie. Our administrators manually review every driver application before they can go online. Verified drivers will display a green 'Verified' badge in the app."
    },
    {
      question: "What happens if I press the SOS button?",
      answer: "In the event of an emergency, pressing the floating SOS button instantly captures your live GPS coordinates, logs the active ride ID, and immediately dispatches alerts to your registered emergency contacts while notifying our 24/7 safety operations desk."
    },
    {
      question: "How does the OTP Ride Start prevent wrong pickups?",
      answer: "When a ride is accepted, a unique 4-digit OTP code is generated in the rider's app. The driver must physically input this code into their device to start the ride. This guarantees you are boarding the correct vehicle with the correct driver."
    }
  ];

  return (
    <div className="relative w-full bg-safety-dark text-slate-100 overflow-hidden font-sans">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-safety-pink/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-[5%] w-[600px] h-[600px] bg-safety-purple/10 rounded-full blur-[140px] -z-10"></div>
      <div className="absolute bottom-1/4 left-[5%] w-[500px] h-[500px] bg-safety-pink/5 rounded-full blur-[100px] -z-10"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:pr-6">
            
            {/* Startup Banner Tag */}
            <div className="flex items-center gap-2 px-4 py-2 w-fit rounded-full bg-[#102F54] border border-safety-pink/20 text-xs font-bold text-safety-pink uppercase tracking-widest animate-fade-in shadow-glow-pink/5">
              <Sparkles className="w-4 h-4 text-safety-pink" />
              <span>India's Premium Women-Only Safety Platform</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Empowering Journeys With{' '}
              <span className="bg-gradient-to-r from-safety-pink via-[#ff8e8e] to-safety-purple bg-clip-text text-transparent">
                Uncompromising Safety
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              GoNari connects verified female riders with approved female drivers. Engineered with Government ID checks, live STOMP WebSocket tracking, and instant panic protocols to ensure you never ride alone.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto">
              {user ? (
                user.role === 'RIDER' ? (
                  <Link
                    to="/book"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
                  >
                    <span>Book Your Safe Ride</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : user.role === 'DRIVER' ? (
                  <Link
                    to="/driver"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
                  >
                    <span>Go to Driver Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    to="/admin"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
                  >
                    <span>Go to Admin Panel</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )
              ) : (
                <>
                  <Link
                    to="/signup?role=rider"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
                  >
                    <span>Register as Rider</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/signup?role=driver"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white transition-all duration-300 text-center"
                  >
                    Apply as Driver
                  </Link>
                </>
              )}
            </div>

            {/* Micro Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
              {[
                { number: '50,000+', label: 'Safe Rides' },
                { number: '10,000+', label: 'Verified Women' },
                { number: '100+', label: 'Served Cities' },
                { number: '99.9%', label: 'Safety Rating' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-extrabold text-white bg-gradient-to-r from-[#ffffff] to-safety-pink bg-clip-text">{stat.number}</span>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Graphics Column (span 5) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual background circle accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[450px] h-[350px] md:w-[450px] bg-gradient-to-tr from-safety-pink/15 to-safety-purple/15 rounded-full blur-2xl -z-10 animate-pulse-glow"></div>
            
            {/* Premium Illustration Frame */}
            <div className="relative max-w-md w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl p-3 bg-[#0B2440]/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.01] hover:border-safety-pink/25">
              <img 
                src={heroIllustration} 
                alt="GoNari Safe Commute Illustration" 
                className="w-full h-auto rounded-[32px] object-cover shadow-inner"
              />
              
              {/* Floating micro indicators */}
              <div className="absolute top-8 left-8 glass-panel px-4 py-2.5 rounded-2xl border border-green-500/20 flex items-center gap-2 text-xs font-bold text-green-400 shadow-lg animate-bounce">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Verified Female Drivers Only</span>
              </div>

              <div className="absolute bottom-8 right-8 glass-panel px-4 py-2.5 rounded-2xl border border-safety-pink/20 flex items-center gap-2 text-xs font-bold text-safety-pink shadow-lg">
                <Smartphone className="w-4 h-4 text-safety-pink" />
                <span>24/7 Safety Command Desk</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= TIMELINE SECTION ================= */}
      <section className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-safety-pink bg-safety-pink/10 px-3.5 py-1.5 rounded-full">Secure Operations</span>
            <h2 className="text-3xl md:text-5xl font-black text-white max-w-xl leading-tight">How GoNari Protects You</h2>
            <p className="text-sm text-gray-400 max-w-lg mt-1">A transparent, 4-step workflow designed to enforce privacy, identity checks, and location integrity.</p>
          </div>

          {/* Timeline Steps Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative mt-4">
            {[
              { 
                step: '01', 
                title: 'ID & Selfie Onboarding', 
                desc: 'Every driver must submit official government documents and a matching live selfie. Registration is restricted to females only.' 
              },
              { 
                step: '02', 
                title: 'Admin Background Check', 
                desc: 'Accounts start as PENDING. Our administrative staff manually validates verification documents before enabling driver matching.' 
              },
              { 
                step: '03', 
                title: 'Geospatial Driver Match', 
                desc: 'Our backend triggers a specialized 2dsphere $near spatial query to discover the closest available verified drivers within a 10km radius.' 
              },
              { 
                step: '04', 
                title: 'OTP Verified Commute', 
                desc: 'Provide your driver with the secure 4-digit code. The app validates the OTP payload to unlock real-time map pathing.' 
              }
            ].map((item, index) => (
              <div key={index} className="glass-card p-6.5 rounded-3xl flex flex-col gap-4 relative group">
                <div className="absolute top-4 right-6 text-5xl font-black text-white/5 group-hover:text-safety-pink/10 transition-colors duration-300">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-safety-pink to-safety-purple text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-200 mt-2">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= WHY WOMEN TRUST GONARI ================= */}
      <section className="py-24 px-6 bg-[#040e1b]/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <span className="text-xs font-bold text-safety-pink uppercase tracking-wider bg-safety-pink/10 px-3 py-1 rounded-full w-fit">Strict Policies</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Why Women and Girls Trust GoNari</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Generic ride-hailing networks treat safety as a passive review parameter. At GoNari, safety is compiled directly into our system logic and database rules:
            </p>
            <ul className="flex flex-col gap-3.5 mt-2">
              {[
                "Strict Female-Only Gender Filters",
                "Manual Admin Verification Checkpoints",
                "Built-in Instant Geolocation Dispatch desk",
                "No Shared Pools with Unverified Accounts"
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                  <CheckCircle className="w-5 h-5 text-safety-purple shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right features grid (span 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { 
                icon: Shield, 
                title: "100% Verified Community", 
                desc: "No mock data or bypassed uploads. Admin reviews government credentials and selfie metadata before approval." 
              },
              { 
                icon: Lock, 
                title: "Cryptographic OTP Starts", 
                desc: "Rider starts are locked behind a cryptographic 4-digit token matching algorithm. Prevents wrong car boarding." 
              },
              { 
                icon: MapPin, 
                title: "Geospatial 2dsphere Indices", 
                desc: "High-performance mongo geospatial radius matches find drivers within 10km, sorting results strictly by distance." 
              },
              { 
                icon: Smartphone, 
                title: "Family Tracker Broadcast", 
                desc: "Generate custom tracking URL links to broadcast coordinates with family via standard messengers." 
              }
            ].map((feat, index) => (
              <div key={index} className="glass-card p-6 rounded-3xl flex items-start gap-4 border border-white/5">
                <div className="p-3 rounded-2xl bg-safety-pink/10 text-safety-pink shrink-0">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-200">{feat.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= LIVE DEMO / WEBSOCKET MODULE ================= */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-5">
            <span className="text-xs font-bold text-safety-purple uppercase tracking-wider bg-safety-purple/10 px-3 py-1 rounded-full w-fit">Live Technologies</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">STOMP WebSockets Tracking Demo</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We leverage real-time STOMP over SockJS communication protocols. Drivers broadcast location coordinates which immediately update the rider's Leaflet mapping markers dynamically.
            </p>
            <div className="flex gap-4 items-center p-4 bg-safety-slate/30 border border-white/5 rounded-2xl">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
              <div className="text-xs">
                <strong className="block text-gray-200 font-semibold">Active Websocket Channel</strong>
                <span className="text-gray-500">Connected to /topic/ride/&#123;rideId&#125;/location</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Live mockup window */}
            <div className="w-full rounded-3xl bg-[#091f36] border border-white/10 shadow-2xl p-5 flex flex-col gap-4 text-xs font-mono text-gray-400 relative">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] text-gray-500">stomp_connection_pool.log</span>
              </div>
              <div className="flex flex-col gap-2 leading-relaxed text-[11px]">
                <p className="text-green-400">&gt; Connecting to SockJS fallback websocket: http://localhost:8080/ws</p>
                <p className="text-green-400">&gt; STOMP connection negotiated. Session ID: ws_sess_827ab29</p>
                <p className="text-gray-300">&gt; Subscribing to driver coordinates: /topic/ride/6a4ff2a16c/location</p>
                <div className="p-3 bg-[#061525] rounded-xl border border-white/5 flex flex-col gap-1 text-[10px] text-gray-400 mt-1">
                  <p className="text-yellow-400 font-bold">&#123;</p>
                  <p className="pl-4">"driverId": "6a4febb98a3a43bca088b3d7",</p>
                  <p className="pl-4">"lat": 12.9716, "lng": 77.5946,</p>
                  <p className="pl-4">"rideId": "6a4ff2a16c9dc6ca6543d632",</p>
                  <p className="pl-4">"timestamp": "2026-07-10T10:41:24.090"</p>
                  <p className="text-yellow-400 font-bold">&#125;</p>
                </div>
                <p className="text-safety-pink">&gt; Broadcast: Leaflet map marker latlng re-rendered successfully.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= EMERGENCY HELPLINE CALL CARDS ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#040e1b] to-safety-dark border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3.5 py-1.5 rounded-full">SOS Panic Deck</span>
            <h2 className="text-3xl md:text-5xl font-black text-white max-w-xl">Emergency Calling Center</h2>
            <p className="text-sm text-gray-400 max-w-lg">Click the emergency buttons below to instantly dial national safety desks from your mobile device or calling software.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full mt-4">
            
            <a
              href="tel:112"
              className="glass-card p-8 rounded-[32px] border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-300 flex items-start gap-6 group shadow-lg"
            >
              <div className="p-4.5 rounded-2xl bg-red-500/10 text-red-500 group-hover:scale-105 transition-transform duration-300">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="text-[10px] text-red-400 font-black uppercase tracking-widest">National SOS Desk</div>
                <h3 className="text-2xl font-black text-white">Call National Safety (112)</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">Instant dispatch of police, ambulance, and safety vehicles to your active location coordinate.</p>
              </div>
            </a>

            <a
              href="tel:1091"
              className="glass-card p-8 rounded-[32px] border border-safety-pink/20 hover:border-safety-pink/40 hover:bg-safety-pink/5 transition-all duration-300 flex items-start gap-6 group shadow-lg"
            >
              <div className="p-4.5 rounded-2xl bg-safety-pink/10 text-safety-pink group-hover:scale-105 transition-transform duration-300">
                <PhoneCall className="w-8 h-8" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="text-[10px] text-safety-pink font-black uppercase tracking-widest">Women Safety Line</div>
                <h3 className="text-2xl font-black text-white">Women Helpline (1091)</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">National specialized rescue helpline counseling services and response coordinators for women safety.</p>
              </div>
            </a>

          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS CAROUSEL ================= */}
      <section className="py-24 px-6 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto flex flex-col gap-12 items-center text-center">
          
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-safety-pink uppercase tracking-widest bg-safety-pink/10 px-3.5 py-1.5 rounded-full w-fit mx-auto">Feedback</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">Voice of the Community</h2>
          </div>

          {/* Testimonial Active Display */}
          <div className="w-full glass-card p-8 md:p-12 rounded-[40px] border border-white/5 relative shadow-xl min-h-[250px] flex flex-col justify-center animate-fade-in">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic">
              "{testimonials[activeTestimonial].quote}"
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-safety-pink to-safety-purple flex items-center justify-center font-bold text-white text-lg shadow-md uppercase">
                {testimonials[activeTestimonial].avatar}
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-sm text-white">{testimonials[activeTestimonial].name}</h4>
                <p className="text-xs text-gray-500 font-semibold">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
            
            {/* Stars rating */}
            <div className="flex gap-1.5 justify-center mt-4">
              {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-safety-gold fill-current" />
              ))}
            </div>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevTestimonial}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
              title="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-safety-pink w-6' : 'bg-gray-700 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
              title="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
          </div>

        </div>
      </section>

      {/* ================= CITIES WE SERVE ================= */}
      <section className="py-24 px-6 bg-[#040e1b]/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-safety-purple uppercase tracking-widest bg-safety-purple/10 px-3.5 py-1.5 rounded-full">Locations</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">Active Served Cities</h2>
            <p className="text-sm text-gray-400 max-w-lg mt-1">Deploying female driver networks and safe transport links across India's largest metropolitan hubs.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto w-full mt-4">
            {[
              { city: "Bangalore", desc: "Karnataka hub" },
              { city: "Mumbai", desc: "Maharashtra desk" },
              { city: "Delhi NCR", desc: "Capital region" },
              { city: "Hyderabad", desc: "Telangana network" },
              { city: "Pune", desc: "Student zones" },
              { city: "Chennai", desc: "Coastal transit" }
            ].map((item, index) => (
              <div key={index} className="glass-card p-5 rounded-2xl text-center flex flex-col gap-1 hover:border-safety-pink/20 transition-all border border-white/5 shadow-sm">
                <span className="font-extrabold text-sm text-gray-200">{item.city}</span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">{item.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= DOWNLOAD APP BANNER ================= */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-tr from-[#0F3156] via-[#061b32] to-safety-pink/15 border border-white/10 shadow-2xl p-8 md:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
          
          {/* Decorative circular glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-safety-pink/10 rounded-full blur-[80px]"></div>

          <div className="flex-1 flex flex-col gap-5 text-center lg:text-left">
            <span className="text-xs font-bold text-safety-pink uppercase tracking-widest w-fit mx-auto lg:mx-0">Mobile App</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-md">Get GoNari on Your Mobile Device</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Download the application to register your government ID, manage trusted emergency contacts, and access mapping pathing features instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 mt-2 justify-center lg:justify-start">
              <a
                href="#download-ios"
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-extrabold flex items-center gap-3 transition-all"
              >
                <Smartphone className="w-5 h-5 text-gray-300" />
                <div className="text-left">
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Download on the</span>
                  <span className="block text-sm text-white font-bold font-sans">App Store</span>
                </div>
              </a>
              <a
                href="#download-android"
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-extrabold flex items-center gap-3 transition-all"
              >
                <Smartphone className="w-5 h-5 text-gray-300" />
                <div className="text-left">
                  <span className="block text-[9px] text-gray-500 uppercase font-semibold">Get it on</span>
                  <span className="block text-sm text-white font-bold font-sans">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* App Preview Mock Graphic */}
          <div className="flex-1 relative flex justify-center w-full max-w-sm">
            <div className="w-64 h-[350px] rounded-[36px] bg-[#071A2F] border-4 border-white/10 shadow-2xl p-4 flex flex-col gap-4 text-[10px] text-gray-400 font-sans relative overflow-hidden">
              <div className="w-24 h-4 bg-white/5 rounded-full mx-auto mb-2"></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-extrabold text-white">GoNari Active SOS</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center animate-pulse shadow-lg">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-200">SOS Panic Protocol Triggered</h4>
                  <p className="text-[9px] text-gray-500 mt-1 max-w-[150px] leading-relaxed">Dispatching coordinates and alerting safety response networks.</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold uppercase tracking-wider text-[9px]">Cancel Panic Alert</button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-24 px-6 bg-[#040e1b]/40 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          
          <div className="text-center flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-safety-pink uppercase tracking-widest bg-safety-pink/10 px-3.5 py-1.5 rounded-full w-fit">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="flex flex-col gap-4.5 mt-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left text-gray-200 hover:text-white font-bold transition-colors"
                >
                  <span className="text-sm md:text-base flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-safety-pink shrink-0" />
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-safety-pink shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 pt-1 text-xs md:text-sm text-gray-400 leading-relaxed border-t border-white/5 bg-safety-slate/10 animate-slide-down">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-t from-[#040f1c] to-safety-dark relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-6 items-center">
          <span className="text-xs font-bold text-safety-pink uppercase tracking-widest bg-safety-pink/10 px-3.5 py-1.5 rounded-full w-fit">Join Gonari Today</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">Empower Your Commute</h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed">
            Choose a space where identity checks and safety protocols are designed to serve you. Signup in minutes to access the validated female rider & driver pool.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
            {user ? (
              <Link
                to={user.role === 'RIDER' ? '/book' : user.role === 'DRIVER' ? '/driver' : '/admin'}
                className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup?role=rider"
                  className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-extrabold bg-gradient-to-r from-safety-pink to-safety-purple hover:from-safety-pink/90 hover:to-safety-purple/90 text-white shadow-glow-pink hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2.5"
                >
                  <span>Register as Rider</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/signup?role=driver"
                  className="w-full sm:w-auto px-8 py-4.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white transition-all duration-300 text-center"
                >
                  Apply to Drive
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
