import React, { useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import UpdatedFlightForm from "../FlightUpdatedForm/FlightUpdatedForm";

const AllFlights = ({ role = "USER" }) => {
  const [filter, setFilter] = useState("");
  const axiosSecure = useAxiosSecure();

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  // Fetch Flights
  const {
    data: flights = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["flights"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/flights");
      return res.data.data.flights; // backend থেকে flights array আসছে
    },
  });

  // Delete Flight
  const { mutate: deleteFlight } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/flights/${id}`);
      return res.data; // full response return করবো
    },
    onSuccess: (data) => {
      // API থেকে আসা message দেখানো হবে
      refetch();
      Swal.fire(
        "Deleted!",
        data?.data?.message || "Flight deleted successfully",
        "success"
      );
    },
    onError: (error) => {
      // Error হলে API এর error message দেখানো হবে
      const errMessage =
        error?.response?.data?.message || "Something went wrong!";
      Swal.fire("Error!", errMessage, "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This flight will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFlight(id);
      }
    });
  };

  // open modal for edit
  const handleEdit = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  if (isPending)
    return (
      <p className="text-center mt-10 text-lg text-gray-500">
        Loading flights...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        Failed to load flights!
      </p>
    );

  console.log(flights);
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by flight no. or airline..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* {role === "ADMIN" && ( */}
        <Link to="/add-flight">
          <button
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            onClick={() => console.log("Add new flight")}
          >
            <FaPlus /> Add New Flight
          </button>
        </Link>

        {/* )} */}
      </div>

      {/* Flights Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse p-8">
          <thead className="bg-gray-800 text-white text-sm ">
            <tr>
              <th className="p-3 text-left">Flight No.</th>
              <th className="p-3 text-left">Airline</th>
              <th className="p-3 text-left">Origin</th>
              <th className="p-3 text-left">Destination</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Price ($)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <tr
                  key={flight._id}
                  className="border-b border-b-gray-300 hover:bg-gray-50 transition text-sm md:text-base"
                >
                  <td className="p-3 text-gray-500 text-sm py-5">
                    {flight.flight_number}
                  </td>
                  <td className="p-3 text-gray-500 text-sm">
                    {flight.airline}
                  </td>
                  <td className="p-3 text-gray-500 text-sm">{flight.origin}</td>
                  <td className="p-3 text-gray-500 text-sm">
                    {flight.destination}
                  </td>
                  <td className="p-3 text-gray-500 text-sm">{flight.date}</td>
                  <td className="p-3 text-gray-500 text-sm">{flight.time}</td>
                  <td className="p-3 text-gray-500 text-sm">${flight.price}</td>
                  <td className="p-3 text-gray-500 text-sm flex justify-center gap-2">
                    {/* View button */}

                    <button
                      className="text-green-600 hover:text-green-800"
                      title="View Details"
                    >
                      <Link to={`/flight-details/${flight._id}`}>
                        <FaEye size={20} />
                      </Link>
                    </button>
                    {/* Admin Only */}
                    {/* {role === "ADMIN" && ( */}
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Flight"
                        onClick={() => handleEdit(flight)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(flight._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Flight"
                      >
                        <FaTrash size={20} />
                      </button>
                    </>
                    {/* )} */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
                  No flights found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl ">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-100 p-2 px-3.5 rounded-full bg-red-500 shadow-md hover:text-gray-200"
            >
              ✕
            </button>

            <UpdatedFlightForm
              flightInfo={selectedFlight}
              onClose={() => {
                setShowModal(false);
                refetch();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFlights;
