import { Link } from 'react-router-dom';

const SERVICES = [
  'University Selection',
  'Application Processing',
  'Visa Assistance',
  'Scholarship Guidance',
  'Pre-departure Briefing',
  'Post-arrival Support',
];

const DESTINATIONS = ['United Kingdom', 'Canada', 'Australia', 'USA', 'Germany', 'Malaysia'];

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A' }} className="text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1D4ED8' }}>
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="font-bold text-lg text-white">StudyConsult</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted partner for international education. We guide students from application to arrival — making dreams a reality.
            </p>
            <div className="flex gap-3 mt-5">
              {['f', 'in', 'tw', 'yt'].map(s => (
                <span
                  key={s}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700 hover:border-blue-500 hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2">
              {SERVICES.map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4">Top Destinations</h4>
            <ul className="space-y-2">
              {DESTINATIONS.map(d => (
                <li key={d}>
                  <Link to="/universities" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p>📍 House 12, Road 5, Dhanmondi, Dhaka 1205</p>
              <p>📞 +880 1700-000000</p>
              <p>✉️ info@studyconsult.com.bd</p>
              <p>🕐 Sun–Thu: 9 AM – 6 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} StudyConsult. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
