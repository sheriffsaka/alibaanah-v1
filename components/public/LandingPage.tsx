
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LOGO_URL, 
  INTAKE_FEATURES, 
  ASSESSMENT_FAQS, 
  CONTACT_INFO, 
  INSTITUTION_NAME,
  OFFICIAL_SITE_URL,
  BRAND_COLORS
} from '../../constants.tsx';

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* Strategic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-ibaana-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/di7okmjsx/image/upload/v1769972834/alibaanahlogo_gw0pef.png" 
            alt="Islamic Architecture" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ibaana-primary/90 to-ibaana-primary"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center py-20">
          <div className="text-white space-y-8 animate-fade-in">
            <div className="inline-block bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Assessment & Intake Portal</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Your Journey <br />
              <span className="text-amber-400 font-light italic">Starts On Campus</span>
            </h1>
            <p className="text-xl text-emerald-100/80 font-light max-w-lg leading-relaxed">
              Welcome to the Al-Ibaanah IntakeFlow. Secure your mandatory placement assessment slot and streamline your arrival at our Cairo campus.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/enroll" 
                className="px-10 py-5 bg-white text-emerald-950 font-black rounded-2xl shadow-2xl transition transform hover:-translate-y-1 hover:bg-amber-400"
              >
                Book My Assessment
              </Link>
              <a 
                href={OFFICIAL_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-ibaana-primary border-2 border-white/20 hover:border-white text-white font-bold rounded-2xl transition flex items-center"
              >
                Official Website <i className="fas fa-external-link-alt ml-3 text-xs opacity-50"></i>
              </a>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-md shadow-2xl relative overflow-hidden">
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-emerald-900 font-bold text-xl italic">1</div>
                    <p className="font-bold text-emerald-50">Register at ibaanah.com</p>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-emerald-900 font-bold text-xl italic">2</div>
                    <p className="font-bold text-emerald-50">Book Slot on this Portal</p>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/40">
                    <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center text-emerald-900 font-bold text-xl italic">3</div>
                    <p className="font-bold text-emerald-50">Arrive for Evaluation</p>
                  </div>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-10">
                 <i className="fas fa-calendar-alt text-[15rem]"></i>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use IntakeFlow */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black text-gray-900">Digital Intake Benefits</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We've modernized our arrival process to ensure your first day at Al-Ibaanah is smooth and efficient.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {INTAKE_FEATURES.map((feature, idx) => (
              <div key={idx} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:border-ibaana-primary/30 transition group">
                <div className="w-16 h-16 bg-white shadow-md text-ibaana-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-ibaana-primary group-hover:text-white transition duration-300">
                  <i className={`fas ${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-extrabold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Specific FAQs */}
      <section className="py-24 bg-emerald-950 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Assessment Day FAQ</h2>
            <div className="h-1.5 w-20 bg-amber-400 mx-auto rounded-full mt-4"></div>
          </div>
          <div className="space-y-4">
            {ASSESSMENT_FAQS.map((faq, idx) => (
              <details key={idx} className="group bg-white/5 border border-white/10 rounded-2xl">
                <summary className="list-none p-6 font-bold cursor-pointer flex justify-between items-center hover:bg-white/10 transition">
                  {faq.q}
                  <i className="fas fa-plus text-[10px] group-open:rotate-45 transition"></i>
                </summary>
                <div className="px-6 pb-6 text-emerald-100/70 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section id="contact" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl font-black text-gray-900">Visit Our Campus</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Assessment and enrollment happen on-site at our Nasr City headquarters. Please ensure you have your digital intake slip ready on your phone upon arrival.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <i className="fas fa-map-marker-alt text-ibaana-primary text-xl mb-4 block"></i>
                <h5 className="font-bold text-gray-900 mb-1">Address</h5>
                <p className="text-xs text-gray-500 leading-relaxed">{CONTACT_INFO.address}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <i className="fas fa-clock text-ibaana-primary text-xl mb-4 block"></i>
                <h5 className="font-bold text-gray-900 mb-1">Operating Hours</h5>
                <p className="text-xs text-gray-500 leading-relaxed">{CONTACT_INFO.hours}</p>
              </div>
            </div>
            <div className="pt-6">
              <Link to="/enroll" className="bg-ibaana-primary text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-900 transition shadow-xl shadow-emerald-900/20 inline-block">
                Ready to Book Assessment?
              </Link>
            </div>
          </div>
          <div className="relative">
             <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-50 h-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover grayscale" 
                  alt="Al-Ibaanah Campus"
                />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-ibaana-primary text-center min-w-[200px]">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Direct Assistance</p>
                  <p className="text-lg font-bold text-ibaana-primary">{CONTACT_INFO.mobile}</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Simple Footer with External Links */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <img src={LOGO_URL} alt="Al-Ibaanah" className="h-10 grayscale opacity-40" />
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <a href={OFFICIAL_SITE_URL} target="_blank" className="hover:text-ibaana-primary">Home</a>
            <a href={`${OFFICIAL_SITE_URL}arabic-courses/`} target="_blank" className="hover:text-ibaana-primary">Programs</a>
            <a href={`${OFFICIAL_SITE_URL}registration/`} target="_blank" className="hover:text-ibaana-primary">Registration</a>
            <a href={`${OFFICIAL_SITE_URL}contact/`} target="_blank" className="hover:text-ibaana-primary">Help Center</a>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} IntakeFlow System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
