import Sidebar from '../components/common/Sidebar.jsx';

const DashboardLayout = ({ children, title }) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        )}
        {children}
      </div>
    </main>
  </div>
);

export default DashboardLayout;
