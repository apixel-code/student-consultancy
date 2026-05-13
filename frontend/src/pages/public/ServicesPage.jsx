import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '../../components/public/PageHero';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const SERVICES = [
  {
    icon: '🎓',
    title: 'University Selection',
    tagline: 'Find your perfect academic home',
    img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=700&q=70',
    desc: 'We conduct a thorough assessment of your academic background, English proficiency, financial capacity, career aspirations, and preferred country. Based on this, we curate a personalized list of 5–10 universities with high admission probability and strong program relevance.',
    features: ['Personalized university shortlisting', 'Ranking & reputation analysis', 'Scholarship potential review', 'Course and intake guidance'],
  },
  {
    icon: '📋',
    title: 'Application Processing',
    tagline: 'Flawless applications, every time',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=70',
    desc: 'Our experts manage your entire application from start to finish — crafting compelling Statements of Purpose, coordinating Letters of Recommendation, verifying transcripts, and submitting applications before deadlines.',
    features: ['SOP & personal statement writing', 'LOR coordination', 'Transcript verification & attestation', 'Online portal submissions'],
  },
  {
    icon: '🛂',
    title: 'Visa Assistance',
    tagline: '98% approval rate — the numbers speak',
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=70',
    desc: 'Our dedicated visa team prepares a watertight visa file, conducts mock interviews, guides you through every embassy requirement, and follows up until your visa is in hand.',
    features: ['Document checklist & preparation', 'Bank statement guidance', 'Embassy interview coaching', 'Visa refusal appeals support'],
  },
  {
    icon: '💰',
    title: 'Scholarship Guidance',
    tagline: 'Fund your future, reduce your burden',
    img: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=700&q=70',
    desc: 'We help you identify government scholarships, university merit awards, and external funding opportunities. Our experts assist with scholarship essays and applications to maximize your chances of financial support.',
    features: ['Scholarship database access', 'Merit-based application strategy', 'Scholarship essay writing', 'Government scholarship applications (e.g. Chevening, DAAD)'],
  },
  {
    icon: '✈️',
    title: 'Pre-departure Briefing',
    tagline: 'Arrive prepared, not overwhelmed',
    img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=700&q=70',
    desc: 'Before you fly, we conduct comprehensive group and individual briefing sessions covering accommodation, banking, cultural norms, student rights, weather, and practical travel tips for your destination country.',
    features: ['Country-specific orientation', 'Accommodation search support', 'Airport and travel planning', 'Cultural adjustment tips'],
  },
  {
    icon: '🏡',
    title: 'Post-arrival Support',
    tagline: 'Your home away from home',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=70',
    desc: "Our support doesn't end when you land. We assist with airport coordination, university enrollment, SIM card and banking setup, and connect you with our alumni network in your destination city.",
    features: ['Airport coordination', 'University enrollment support', 'Banking & SIM setup guidance', 'Alumni community access'],
  },
];

const FAQS = [
  { q: 'How long does the full application process take?', a: 'The typical process from initial consultation to offer letter takes 4–8 weeks, depending on the university and your document readiness. We recommend starting at least 6 months before the intake date.' },
  { q: 'Do I need IELTS/TOEFL to apply?', a: 'Most universities require an English language test (IELTS, TOEFL, or Duolingo English Test). Some universities offer conditional admission pending test results. We guide you on which test suits you best.' },
  { q: 'What is your fee structure?', a: 'Our consultation is free. Service fees vary by destination and complexity. We provide a transparent fee breakdown during the first session — no hidden charges ever.' },
  { q: 'Can you help if I got a visa rejection before?', a: 'Yes. We specialize in visa refusal cases. Our team analyzes the rejection reason and builds a stronger application addressing every weakness in the previous file.' },
  { q: 'Do you guarantee university admission?', a: 'No ethical consultancy can guarantee admission — and we will never make false promises. However, our strategic shortlisting and strong application preparation result in a very high success rate.' },
  { q: 'Is there support for students already abroad?', a: 'Yes — through our alumni network and post-arrival support program, students can reach out for guidance on academic, social, or administrative challenges even after they have settled in.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold transition-colors hover:bg-blue-50"
        style={{ color: '#0F172A' }}>
        <span>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-xl flex-shrink-0 ml-3" style={{ color: '#1D4ED8' }}>+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="px-6 pb-5 text-slate-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="End-to-end study abroad support — from choosing a university to settling in your new country."
        breadcrumb="Services"
        image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
      />

      {/* ── Service Cards ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map(s => (
              <motion.div key={s.title} variants={fadeUp}
                className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow group bg-white">

                {/* card image */}
                <div className="relative overflow-hidden" style={{ height: '180px' }}>
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-white font-bold text-base">{s.title}</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm font-semibold mb-3" style={{ color: '#1D4ED8' }}>{s.tagline}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="flex-shrink-0 font-bold" style={{ color: '#1D4ED8' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Got Questions?</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="space-y-3">
            {FAQS.map(faq => (
              <motion.div key={faq.q} variants={fadeUp}><FAQItem q={faq.q} a={faq.a} /></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0F172A' }}>Ready to start your journey?</h2>
          <p className="text-slate-500 mb-8">Book a free consultation and let us map your path to a world-class education.</p>
          <Link to="/contact"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
            style={{ background: '#1D4ED8' }}>
            Book Free Consultation
          </Link>
        </motion.div>
      </section>
    </>
  );
}
