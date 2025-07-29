import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-10">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Air<span className="text-black">Booker</span>
        </Link>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <Link to="/" className="hover:text-blue-500 duration-300">
            Home
          </Link>
          <Link to="/all-flights" className="hover:text-blue-500 duration-300">
            All Flights
          </Link>
          <Link to="/dashboard" className="hover:text-blue-500 duration-300">
            Dashboard
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AirBooker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
