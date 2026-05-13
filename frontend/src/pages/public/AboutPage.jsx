import { motion } from 'framer-motion';
import PageHero from '../../components/public/PageHero';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const TEAM = [
  { name: 'Dr. Arif Hossain', role: 'Founder & CEO', edu: 'PhD, University of Manchester', avatar: 'AH',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80', color: '#1D4ED8' },
  { name: 'Nusrat Jahan', role: 'Head of Visa Affairs', edu: 'LLB, University of Dhaka', avatar: 'NJ',
    photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=300&q=80', color: '#7C3AED' },
  { name: 'Tanvir Ahmed', role: 'Senior Counselor — Europe', edu: 'MSc, TU Berlin', avatar: 'TA',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', color: '#059669' },
  { name: 'Sadia Islam', role: 'Scholarship Specialist', edu: 'MBA, University of Toronto', avatar: 'SI',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80', color: '#B45309' },
];

const VALUES = [
  { icon: '🎯', title: 'Student-First', desc: 'Every decision we make is guided by what is best for the student — not commission or quotas.' },
  { icon: '🔍', title: 'Transparency', desc: 'Clear, honest communication at every stage. No hidden fees, no false promises.' },
  { icon: '🤝', title: 'Long-term Partnership', desc: 'We are with you from the first consultation through your entire study abroad journey and beyond.' },
  { icon: '🏆', title: 'Excellence', desc: 'We maintain the highest standards of service, backed by AIRC certification and ISO compliance.' },
];

const REASONS = [
  { stat: '10+', label: 'Years of Experience' },
  { stat: '500+', label: 'Successful Placements' },
  { stat: '50+', label: 'Partner Universities' },
  { stat: '98%', label: 'Visa Approval Rate' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About StudyConsult"
        subtitle="We are Bangladesh's most trusted study abroad consultancy — dedicated to turning international education dreams into reality."
        breadcrumb="About Us"
      />

      {/* ── Our Story ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* text */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0F172A' }}>
              From a Small Office in Dhanmondi to a National Success Story
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                StudyConsult was founded in 2015 by Dr. Arif Hossain, who himself studied abroad and experienced firsthand the challenges Bangladeshi students face — confusing application processes, visa rejections, and a lack of reliable guidance.
              </p>
              <p>
                Starting from a single room in Dhanmondi, we have grown into a full-service consultancy with a dedicated team of 20+ professionals. We have placed over 500 students in leading universities across 15+ countries, with partnerships spanning the UK, Canada, Australia, the USA, Germany, and Malaysia.
              </p>
              <p>
                Today, StudyConsult is accredited by the American International Recruitment Council (AIRC) and recognized by universities worldwide as a trusted recruitment partner — but our focus remains the same: one student at a time.
              </p>
            </div>
          </motion.div>

          {/* image + stats overlay */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                alt="Consultancy counseling session"
                className="w-full object-cover"
                style={{ height: '460px' }}
                loading="lazy"
              />
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 55%)' }} />
            </div>

            {/* stats overlay card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg grid grid-cols-2 gap-4">
              {REASONS.map(r => (
                <div key={r.label} className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: '#1D4ED8' }}>{r.stat}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{r.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              label: 'Our Mission', icon: '🚀',
              text: "To democratize access to world-class international education for Bangladeshi students — by providing expert, ethical, and end-to-end consultancy services that remove barriers and maximize every student's potential.",
            },
            {
              label: 'Our Vision', icon: '🌍',
              text: "To become South Asia's most trusted study abroad partner — where every student who walks through our doors walks out with the confidence, knowledge, and support to succeed on a global stage.",
            },
          ].map(item => (
            <motion.div key={item.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#0F172A' }}>{item.label}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>The People Behind Your Success</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>Meet Our Expert Team</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map(member => (
              <motion.div key={member.name} variants={fadeUp}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group hover:shadow-md transition-shadow">
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.45) 0%, transparent 60%)' }} />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base" style={{ color: '#0F172A' }}>{member.name}</h3>
                  <p className="text-sm font-semibold mb-1" style={{ color: member.color }}>{member.role}</p>
                  <p className="text-xs text-slate-400 mb-3">{member.edu}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#F59E0B' }}>Why Us?</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>The StudyConsult Difference</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <motion.div key={v.title} variants={fadeUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#0F172A' }}>{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
