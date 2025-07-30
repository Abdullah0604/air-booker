import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { jwtDecode } from "jwt-decode";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();

  // Token থেকে userId decode
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  console.log(decoded);
  const userId = decoded?.id;

  // User bookings fetch
  const {
    data: bookings = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/bookings/user/${userId}`);
      return res.data.data;
    },
    enabled: !!userId, // userId থাকলেই run করবে
  });

  if (!token)
    return (
      <p className="text-center text-lg mt-10 text-red-500">
        Please login to see your bookings!
      </p>
    );

  if (isPending)
    return (
      <p className="text-center text-lg mt-10 text-gray-500">
        Loading your bookings...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-lg mt-10 text-red-500">
        Failed to load bookings!
      </p>
    );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Bookings</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white text-sm ">
            <tr>
              <th className="p-3 py-5 text-left">Flight</th>
              <th className="p-3 text-left">Flight ID</th>
              <th className="p-3 text-left">Destination</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-b-gray-200 hover:bg-gray-50 transition text-sm text-gray-500"
                >
                  <td className="p-3 py-5">{booking.flightId.airline}</td>
                  <td className="p-3">({booking.flightId.flight_number})</td>
                  <td className="p-3">{booking.flightId.destination}</td>
                  <td className="p-3">{booking.flightId.date}</td>
                  <td className="p-3">{booking.flightId.time}</td>
                  <td className="p-3">
                    {booking.seatsBooked.map((s) => s.seatNumber).join(", ")}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      booking.bookingStatus === "Confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {booking.bookingStatus}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      booking.paymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {booking.paymentStatus}
                  </td>
                  <td className="p-3">${booking.totalPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="p-3 text-center text-gray-500 text-sm"
                >
                  You have no bookings yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
