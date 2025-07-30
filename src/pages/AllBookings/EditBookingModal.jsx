import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const EditBookingModal = ({ booking, isOpen, onClose, refetch }) => {
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (booking) {
      const seats = booking.seatsBooked
        .map((seat) => seat.seatNumber)
        .join(", ");
      setValue("newSeatNumbers", seats);
    }
  }, [booking, setValue]);

  // Update booking seat numbers
  const { mutate: updateSeats, isPending } = useMutation({
    mutationFn: async (data) => {
      return await axiosSecure.patch(`/api/bookings/${booking._id}`, data);
    },
    onSuccess: (res) => {
      Swal.fire(
        "Updated!",
        res?.data?.data?.message || "Seats updated successfully!",
        "success"
      );
      refetch();
      onClose();
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        err?.response?.data?.message || "Failed to update seats",
        "error"
      );
    },
  });

  const onSubmit = (data) => {
    const seatsArray = data.newSeatNumbers
      .split(",")
      .map((seat) => seat.trim());

    updateSeats({ newSeatNumbers: seatsArray });
  };

  if (!isOpen) return null;
  console.log(booking);
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Update Seats for Booking
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Seat Numbers */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Seat Numbers (comma separated)
            </label>
            <input
              type="text"
              {...register("newSeatNumbers", { required: true })}
              className="w-full border rounded-md p-2 text-sm"
              placeholder="e.g. 1A,2B"
            />
            {errors.newSeatNumbers && (
              <p className="text-red-500 text-sm">
                Please enter at least one seat number
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              {isPending ? "Updating..." : "Update Seats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
