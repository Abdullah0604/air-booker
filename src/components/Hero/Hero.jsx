import { Link } from "react-router";
import flightImg from "../../assets/flight.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative h-[70vh] md:h-[80vh] bg-cover bg-center rounded-xl overflow-hidden"
      style={{
        backgroundImage: `url('${flightImg}')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Fly With <span className="text-blue-400">AirBooker</span>
        </h1>
        <p className="text-gray-200 mt-4 text-sm md:text-base max-w-2xl">
          Hassle-free flight booking with the best deals and a smooth user
          experience. Your journey starts here.
        </p>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <Link
            to="/all-flights"
            className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Explore Flights
          </Link>
          <Link
            to="/register"
            className="bg-white text-gray-800 px-6 py-2.5 rounded hover:bg-gray-200 text-sm font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
