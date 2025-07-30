import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UpdatedFlightForm = ({ flightInfo, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();

  // React Hook Form with defaultValues (update mode)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      airline: flightInfo.airline,
      flight_number: flightInfo.flight_number,
      origin: flightInfo.origin,
      destination: flightInfo.destination,
      date: flightInfo.date,
      time: flightInfo.time,
      price: flightInfo.price,
    },
  });

  // Mutation for updating flight
  const { mutate: updateFlight, isPending } = useMutation({
    mutationFn: async (updatedFlight) => {
      return await axiosSecure.put(
        `/api/flights/${flightInfo._id}`,
        updatedFlight
      );
    },
    onSuccess: (data) => {
      Swal.fire(
        "Success!",
        data?.data?.message || "Flight updated successfully!",
        "success"
      );
      reset();
      refetch();
      onClose();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to update flight!",
        "error"
      );
    },
  });

  const onSubmit = (data) => {
    const updatedFlight = {
      ...data,
      price: parseFloat(data.price),
    };
    updateFlight(updatedFlight);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-8 text-center">Update Flight</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Airline */}
        <input
          type="text"
          {...register("airline", { required: "Airline is required" })}
          className="w-full p-2 border rounded-md text-sm"
        />
        {errors.airline && (
          <p className="text-red-500 text-sm">{errors.airline.message}</p>
        )}

        {/* Flight Number */}
        <input
          type="text"
          {...register("flight_number", {
            required: "Flight number is required",
          })}
          className="w-full p-2 border rounded-md text-sm"
        />
        {errors.flight_number && (
          <p className="text-red-500 text-sm">{errors.flight_number.message}</p>
        )}

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            {...register("origin", { required: "Origin is required" })}
            className="w-full p-2 border rounded-md text-sm"
          />
          <input
            type="text"
            {...register("destination", {
              required: "Destination is required",
            })}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full p-2 border rounded-md text-sm"
          />
          <input
            type="time"
            {...register("time", { required: "Time is required" })}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        {/* Price */}
        <input
          type="number"
          step="0.01"
          {...register("price", { required: "Price is required" })}
          className="w-full p-2 border rounded-md text-sm"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          {isPending ? "Updating..." : "Update Flight"}
        </button>
      </form>
    </div>
  );
};

export default UpdatedFlightForm;
