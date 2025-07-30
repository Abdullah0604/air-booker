import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLocation } from "react-router";

const AddNewFlight = () => {
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  console.log(location);
  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // TanStack Mutation for adding flight
  const { mutate: addFlight, isPending } = useMutation({
    mutationFn: async (newFlight) => {
      return await axiosSecure.post("/api/flights", newFlight);
    },
    onSuccess: () => {
      Swal.fire("Success!", "Flight added successfully!", "success");
      reset();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to add flight",
        "error"
      );
    },
  });

  // Submit handler
  const onSubmit = (data) => {
    // seats string → array
    const seatsArray = data.seats.split(",").map((seat) => seat.trim());
    const newFlightInfo = {
      airline: data.airline,
      flight_number: data.flight_number,
      origin: data.origin,
      destination: data.destination,
      date: data.date,
      time: data.time,
      price: parseFloat(data.price),
      seats: seatsArray,
    };
    addFlight(newFlightInfo);
    console.log(newFlightInfo);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-8 text-center">Add New Flight</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Airline */}
        <div>
          <input
            type="text"
            placeholder="Airline"
            {...register("airline", { required: "Airline name is required" })}
            className="w-full p-2 border rounded-md text-sm"
          />
          {errors.airline && (
            <p className="text-red-500 text-sm">{errors.airline.message}</p>
          )}
        </div>

        {/* Flight Number */}
        <div>
          <input
            type="text"
            placeholder="Flight Number"
            {...register("flight_number", {
              required: "Flight number is required",
            })}
            className="w-full p-2 border rounded-md text-sm"
          />
          {errors.flight_number && (
            <p className="text-red-500 text-sm">
              {errors.flight_number.message}
            </p>
          )}
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Origin"
              {...register("origin", { required: "Origin is required" })}
              className="w-full p-2 border rounded-md text-sm"
            />
            {errors.origin && (
              <p className="text-red-500 text-sm">{errors.origin.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Destination"
              {...register("destination", {
                required: "Destination is required",
              })}
              className="w-full p-2 border rounded-md text-sm"
            />
            {errors.destination && (
              <p className="text-red-500 text-sm">
                {errors.destination.message}
              </p>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full p-2 border rounded-md text-sm"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          <div>
            <input
              type="time"
              {...register("time", { required: "Time is required" })}
              className="w-full p-2 border rounded-md text-sm"
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            step="0.01"
            placeholder="Price ($)"
            {...register("price", { required: "Price is required" })}
            className="w-full p-2 border rounded-md text-sm"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Seats */}
        <div>
          <textarea
            placeholder="Seats (comma separated, e.g. 1A,1B,2A)"
            {...register("seats", { required: "Seats are required" })}
            className="w-full p-2 border rounded-md text-sm"
            rows="2"
          ></textarea>
          {errors.seats && (
            <p className="text-red-500 text-sm">{errors.seats.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isPending ? "Adding Flight..." : "Add Flight"}
        </button>
      </form>
    </div>
  );
};

export default AddNewFlight;
