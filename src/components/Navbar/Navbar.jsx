import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Token check (User logged in or not)
  const token = localStorage.getItem("token");

  // Dummy decode role (later use jwt-decode)
  const role = localStorage.getItem("role"); // USER / ADMIN

  // Logout Handler
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });
  };

  // Nav Links
  const links = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-medium" : "hover:text-blue-500"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/all-flights"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-medium" : "hover:text-blue-500"
        }
      >
        All Flights
      </NavLink>
      {token && (
        <NavLink
          to={
            role === "ADMIN"
              ? "/dashboard/admin/flights"
              : "/dashboard/my-bookings"
          }
          className={({ isActive }) =>
            isActive ? "text-blue-500 font-medium" : "hover:text-blue-500"
          }
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Air<span className="text-black">Booker</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {links}
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Logout
            </button>
          ) : (
            <div className="space-x-2 auth-btns">
              <NavLink
                to="/login"
                className=" text-gray-800 px-4 py-1 rounded border-2 border-gray-200"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className=" text-gray-800 px-4 py-1 rounded border-2 border-gray-200"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-4 ">
          <ul className="flex flex-col gap-y-2">{links}</ul>
          {token ? (
            <button
              onClick={handleLogout}
              className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-y-2 mt-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-medium" : "hover:text-blue-500"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-blue-500 font-medium" : "hover:text-blue-500"
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
