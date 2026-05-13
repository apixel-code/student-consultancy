import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageHero from '../../components/public/PageHero';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const COUNTRY_IMGS = {
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=65',
  'Canada':         'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=600&q=65',
  'Australia':      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=65',
  'Germany':        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=65',
  'USA':            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=65',
  'Malaysia':       'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=65',
};

const UNIVERSITIES = [
  { id: 1, name: 'University of Manchester', country: 'United Kingdom', flag: '🇬🇧', ranking: '#28 World',
    programs: ['Computer Science', 'Business', 'Engineering', 'Medicine'], intake: 'Sep / Jan', tuition: '£18,000–£26,000/yr', ielts: '6.5', logo: 'UM', color: '#7C3AED' },
  { id: 2, name: 'University of Toronto', country: 'Canada', flag: '🇨🇦', ranking: '#21 World',
    programs: ['AI & Machine Learning', 'Law', 'Public Health', 'Engineering'], intake: 'Sep / Jan', tuition: 'CAD 35,000–55,000/yr', ielts: '6.5', logo: 'UT', color: '#1D4ED8' },
  { id: 3, name: 'University of Melbourne', country: 'Australia', flag: '🇦🇺', ranking: '#33 World',
    programs: ['Architecture', 'Commerce', 'Science', 'Arts'], intake: 'Feb / Jul', tuition: 'AUD 38,000–50,000/yr', ielts: '6.5', logo: 'ME', color: '#065F46' },
  { id: 4, name: 'TU Munich (TUM)', country: 'Germany', flag: '🇩🇪', ranking: '#37 World',
    programs: ['Mechanical Engineering', 'Informatics', 'Physics', 'Chemistry'], intake: 'Oct / Apr', tuition: 'Free (€129 admin fee)', ielts: '6.5', logo: 'TM', color: '#0F172A' },
  { id: 5, name: 'University of British Columbia', country: 'Canada', flag: '🇨🇦', ranking: '#45 World',
    programs: ['Forestry', 'Education', 'Applied Science', 'Commerce'], intake: 'Sep', tuition: 'CAD 30,000–48,000/yr', ielts: '6.5', logo: 'UB', color: '#1D4ED8' },
  { id: 6, name: 'University of Birmingham', country: 'United Kingdom', flag: '🇬🇧', ranking: '#90 World',
    programs: ['Computer Science', 'Business', 'Psychology', 'Law'], intake: 'Sep / Jan', tuition: '£19,000–£25,000/yr', ielts: '6.0', logo: 'UB', color: '#B45309' },
  { id: 7, name: 'University of Sydney', country: 'Australia', flag: '🇦🇺', ranking: '#41 World',
    programs: ['Medicine', 'Law', 'Business', 'Engineering'], intake: 'Feb / Jul', tuition: 'AUD 40,000–52,000/yr', ielts: '7.0', logo: 'US', color: '#B91C1C' },
  { id: 8, name: 'Universiti Malaya (UM)', country: 'Malaysia', flag: '🇲🇾', ranking: '#65 Asia',
    programs: ['Engineering', 'Medicine', 'Computer Science', 'Economics'], intake: 'Sep / Mar', tuition: 'MYR 18,000–28,000/yr', ielts: '6.0', logo: 'UM', color: '#0369A1' },
  { id: 9, name: 'Northeastern University', country: 'USA', flag: '🇺🇸', ranking: '#185 USA',
    programs: ['Co-op Programs', 'Business Analytics', 'CS', 'Engineering'], intake: 'Sep / Jan', tuition: 'USD 58,000–62,000/yr', ielts: '6.5', logo: 'NU', color: '#C2410C' },
  { id: 10, name: 'LMU Munich', country: 'Germany', flag: '🇩🇪', ranking: '#59 World',
    programs: ['Medicine', 'Law', 'Psychology', 'Economics'], intake: 'Oct / Apr', tuition: 'Free (€130 admin fee)', ielts: '7.0', logo: 'LM', color: '#7C3AED' },
];

const COUNTRIES = ['All', 'United Kingdom', 'Canada', 'Australia', 'USA', 'Germany', 'Malaysia'];

export default function UniversitiesPage() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');

  const filtered = useMemo(() => UNIVERSITIES.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.programs.some(p => p.toLowerCase().includes(search.toLowerCase()));
    const matchCountry = country === 'All' || u.country === country;
    return matchSearch && matchCountry;
  }), [search, country]);

  return (
    <>
      <PageHero
        title="Partner Universities"
        subtitle="Explore our network of 50+ partner universities across 15+ countries — find the right fit for your goals."
        breadcrumb="Universities"
      />

      {/* ── Filters ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input type="text" placeholder="Search by university or program..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={country === c
                  ? { background: '#1D4ED8', color: '#fff' }
                  : { background: '#F1F5F9', color: '#475569' }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-slate-400 mb-6">{filtered.length} universities found</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-medium">No universities matched your search.</p>
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(u => (
                <motion.div key={u.id} variants={fadeUp}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">

                  {/* country banner image */}
                  <div className="relative overflow-hidden" style={{ height: '110px' }}>
                    <img
                      src={COUNTRY_IMGS[u.country]}
                      alt={u.country}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.15) 70%, transparent 100%)' }} />
                    <div className="absolute bottom-2 left-3 flex items-center gap-2">
                      <span className="text-lg">{u.flag}</span>
                      <span className="text-white text-xs font-semibold">{u.country}</span>
                    </div>
                    {/* logo badge */}
                    <div className="absolute top-2 right-3 w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ background: u.color }}>
                      {u.logo}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base leading-snug mb-3" style={{ color: '#0F172A' }}>{u.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                        {u.ranking}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#FFFBEB', color: '#92400E' }}>
                        IELTS {u.ielts}+
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tuition</span>
                        <span className="font-medium text-slate-700 text-right max-w-[60%] text-xs">{u.tuition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Intake</span>
                        <span className="font-medium text-slate-700">{u.intake}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {u.programs.slice(0, 3).map(p => (
                        <span key={p} className="px-2 py-1 rounded-md text-xs" style={{ background: '#F1F5F9', color: '#475569' }}>{p}</span>
                      ))}
                      {u.programs.length > 3 && (
                        <span className="px-2 py-1 rounded-md text-xs" style={{ background: '#F1F5F9', color: '#475569' }}>+{u.programs.length - 3}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
