import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import EditBookingModal from "./EditBookingModal";

const AllBookings = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  get all bookings
  const {
    data: bookings = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/bookings");
      return res.data.data;
    },
  });

  // Delete booking
  const { mutate: deleteBooking } = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/api/bookings/${id}`);
    },
    onSuccess: (res) => {
      refetch();
      Swal.fire(
        "Deleted!",
        res?.data?.data?.message || "Booking deleted successfully!",
        "success"
      );
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err?.response?.data?.message || "Failed to delete booking",
        "error"
      );
    },
  });

  // Delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(id);
      }
    });
  };

  // Edit handler
  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  if (isPending)
    return (
      <p className="text-center text-lg mt-10 text-gray-500">
        Loading all bookings...
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
      <h2 className="text-2xl font-semibold mb-6 text-center">All Bookings</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white text-sm ">
            <tr>
              <th className="p-3 py-4 text-left">User ID</th>
              <th className="p-3 text-left">Flight</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-b-gray-200 hover:bg-gray-50 transition text-sm text-gray-500"
                >
                  <td className="p-3 py-4">{booking.userId}</td>
                  <td className="p-3">
                    {booking.flightId?.airline} (
                    {booking.flightId?.flight_number})
                  </td>
                  <td className="p-3">
                    {booking.seatsBooked.map((s) => s.seatNumber).join(", ")}
                  </td>
                  <td className="p-3">{booking.bookingStatus}</td>
                  <td className="p-3">{booking.paymentStatus}</td>
                  <td className="p-3">${booking.totalPrice}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Booking"
                      onClick={() => handleEdit(booking)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Delete Booking"
                      onClick={() => handleDelete(booking._id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-3 text-center text-gray-500 text-sm"
                >
                  No bookings found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default AllBookings;
