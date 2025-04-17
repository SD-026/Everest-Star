import { Link } from 'react-router-dom';
import logo from '../assets/everesrar.jpg'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link to="/" className="flex items-center gap-x-1.5 py-4 px-2">
            <img src={logo} alt="" className='size-8  object-contain' />
              <span className="font-semibold text-gray-500 text-lg max-md:text-sm " >
                Everestar Employee Registration System</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/admin/login" className="py-2 px-2 max-md:text-sm font-medium text-gray-500 rounded hover:bg-blue-500 hover:text-white transition duration-300">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;