import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-lightGray text-darkText">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Mahalla Xizmatlari
        </h1>
        <p className="text-lg text-darkText mb-8">
          Hush kelibsiz! Tizim orqali kommunal va boshqa masalalar bo'yicha arizalaringizni oson va qulay tarzda yuboring.
        </p>
        <Link
          to="/login"
          className="px-8 py-3 bg-primary text-white font-bold rounded-md shadow-md hover:bg-primaryDark transition-colors duration-300"
        >
          Kirish
        </Link>
      </div>
      <div className="absolute bottom-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Mahalla Digital. Barcha huquqlar himoyalangan.</p>
      </div>
    </div>
  );
};

export default Home;