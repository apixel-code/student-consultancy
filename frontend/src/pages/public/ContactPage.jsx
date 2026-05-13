import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../../components/public/PageHero';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const CONTACT_INFO = [
  { icon: '📍', label: 'Address', value: 'House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh' },
  { icon: '📞', label: 'Phone', value: '+880 1700-000000' },
  { icon: '✉️', label: 'Email', value: 'info@studyconsult.com.bd' },
  { icon: '🕐', label: 'Office Hours', value: 'Sunday – Thursday: 9:00 AM – 6:00 PM' },
];

const DESTINATIONS = ['United Kingdom', 'Canada', 'Australia', 'USA', 'Germany', 'Malaysia', 'Other'];
const SERVICES_LIST = ['University Selection', 'Application Processing', 'Visa Assistance', 'Scholarship Guidance', 'Pre-departure Briefing', 'Post-arrival Support'];

const INITIAL = { fullName: '', email: '', phone: '', destination: '', service: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Contact form submitted:', form);
    setSubmitted(true);
    setForm(INITIAL);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Have questions? Our counselors are ready to help you start your international education journey."
        breadcrumb="Contact"
      />

      {/* ── Office Photo Banner ── */}
      <div className="relative overflow-hidden" style={{ height: '280px' }}>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=75"
          alt="StudyConsult office"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.55) 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-2xl font-bold drop-shadow-lg">Visit Our Dhanmondi Office</p>
            <p className="text-slate-200 text-sm mt-1 drop-shadow">Walk-ins welcome Sun – Thu, 9 AM – 6 PM</p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* ── Form ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>Book a Free Consultation</h2>
            <p className="text-slate-500 text-sm mb-8">Fill in the form and one of our counselors will reach out within 24 hours.</p>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border-2 border-green-100 bg-green-50 p-10 text-center">
                <p className="text-5xl mb-3">✅</p>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Received!</h3>
                <p className="text-green-700 text-sm mb-5">Thank you for reaching out. A counselor will contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="text-sm font-medium underline" style={{ color: '#1D4ED8' }}>
                  Submit another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input type="text" name="fullName" required value={form.fullName} onChange={handleChange}
                      placeholder="e.g. Rafiq Islam"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <input type="email" name="email" required value={form.email} onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+880 1X00-000000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Preferred Destination</label>
                    <select name="destination" value={form.destination} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select country</option>
                      {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Needed</label>
                  <select name="service" value={form.service} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select a service</option>
                    {SERVICES_LIST.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Message *</label>
                  <textarea name="message" required rows={4} value={form.message} onChange={handleChange}
                    placeholder="Tell us about your academic background, which course you want to study, and any specific questions..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <button type="submit"
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:brightness-110"
                  style={{ background: '#1D4ED8' }}>
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* ── Agency Info ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>Get In Touch</h2>
            <p className="text-slate-500 text-sm mb-8">Drop by for a walk-in consultation or reach us through any of the channels below.</p>

            {/* contact info cards */}
            <div className="space-y-3 mb-8">
              {CONTACT_INFO.map(info => (
                <motion.div key={info.label} variants={fadeUp}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>
                  <span className="text-2xl flex-shrink-0">{info.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{info.label}</p>
                    <p className="font-medium text-slate-700 mt-0.5 text-sm">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* consultation photo */}
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden shadow-sm mb-6" style={{ height: '200px' }}>
              <img
                src="https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=800&q=75"
                alt="Consultation in progress"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* social */}
            <motion.div variants={fadeUp}>
              <p className="text-sm font-semibold text-slate-600 mb-3">Follow us on social media</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Facebook', color: '#1877F2' },
                  { label: 'LinkedIn', color: '#0A66C2' },
                  { label: 'YouTube', color: '#FF0000' },
                  { label: 'Instagram', color: '#E4405F' },
                ].map(s => (
                  <span key={s.label}
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: s.color }}>
                    {s.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
