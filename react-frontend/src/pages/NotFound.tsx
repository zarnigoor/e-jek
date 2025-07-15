import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-2xl mt-4 mb-8">Sahifa topilmadi</p>
      <Link to="/" className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFound;
