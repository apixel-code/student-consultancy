import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div className="text-center">
      <p className="text-8xl font-black text-gray-200">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h1>
      <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block btn-primary px-6 py-2.5">
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
