import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaArrowLeft, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const role = localStorage.getItem("role");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [countdown, setCountdown] = useState(null);

  // Fetch single flight
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["flight", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/flights/${id}`);
      return res.data.data;
    },
  });

  // Seat booking (Pending)
  const { mutate: reserveSeats } = useMutation({
    mutationFn: async (seatNumbers) => {
      console.log({
        flightId: id,
        seatIds: seatNumbers,
      });
      return await axiosSecure.post("/api/bookings", {
        flightId: id,
        seatIds: seatNumbers,
      });
    },
    onSuccess: () => {
      Swal.fire(
        "Seats Reserved!",
        "Please confirm your booking in 2 minutes",
        "info"
      );
      setCountdown(120); // 2 minutes countdown
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to reserve seats",
        "error"
      );
    },
  });

  // Confirm booking
  const { mutate: confirmBooking } = useMutation({
    mutationFn: async (seatNumbers) => {
      console.log({
        flightId: id,
        seatIds: seatNumbers,
      });
      return await axiosSecure.post("/api/bookings/confirm", {
        flightId: id,
        seatIds: seatNumbers,
      });
    },
    onSuccess: () => {
      Swal.fire("Success!", "Your booking is confirmed!", "success");
      setCountdown(null);
      setSelectedSeats([]);
      refetch();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to confirm booking",
        "error"
      );
    },
  });

  // Handle seat selection
  const toggleSeat = (seatNumber, isBooked) => {
    if (isBooked) return; // can't select booked seat

    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((seat) => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleReserveSeats = (seatNumbers) => {
    if (role === "ADMIN") {
      Swal.fire(
        "Not Allowed!",
        "Admins are not permitted to book seats.",
        "warning"
      );
      return; // এখানেই থেমে যাবে, request যাবে না
    }

    // USER হলে mutation কল হবে
    reserveSeats(seatNumbers);
  };
  // Countdown Timer Effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      Swal.fire(
        "Time Out!",
        "Your seat reservation has expired. Please book again.",
        "warning"
      );
      setCountdown(null);
      setSelectedSeats([]);
      refetch();
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, refetch]);

  if (isPending)
    return (
      <p className="text-center mt-10 text-lg text-gray-500">
        Loading flight details...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        Failed to load flight details!
      </p>
    );

  const flight = data.flight;
  const seats = data.seats;
  console.log(seats);
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Flight Info Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {flight.airline} ({flight.flight_number})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="text-blue-500" />
            <span>
              <strong>Origin:</strong> {flight.origin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaPlaneArrival className="text-green-500" />
            <span>
              <strong>Destination:</strong> {flight.destination}
            </span>
          </div>
          <div>
            <strong>Date:</strong> {flight.date}
          </div>
          <div>
            <strong>Time:</strong> {flight.time}
          </div>
          <div>
            <strong>Price:</strong> ${flight.price}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-white text-sm ${
                flight.availability ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {flight.availability ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Select Seats</h3>

        {seats.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {seats.map((seat) => (
              <button
                key={seat._id}
                onClick={() => toggleSeat(seat._id, seat.isBooked)}
                disabled={seat.isBooked}
                className={`p-3 border rounded-lg text-center text-sm transition ${
                  seat.isBooked
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : selectedSeats.includes(seat._id)
                    ? "bg-blue-600 text-white"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No seats available for this flight.</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!countdown && (
            <button
              onClick={() => handleReserveSeats(selectedSeats)}
              disabled={selectedSeats.length === 0}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              Book Seats
            </button>
          )}

          {countdown !== null && (
            <>
              <button
                onClick={() => confirmBooking(selectedSeats)}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Confirm Booking
              </button>
              <span className="text-red-500 font-medium">
                Time Left: {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, "0")}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
