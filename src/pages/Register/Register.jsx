import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Mutation using TanStack Query
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/api/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.ok) {
        // Token save
        localStorage.setItem("token", data.data.token);
        // payload decode
        const payload = jwtDecode(data.data.token);
        // payload.role -> role পাওয়া যাবে
        localStorage.setItem("role", payload.role);

        console.log("role", payload.role);
        console.log("token", data.data.token);
        Swal.fire("Success!", "Account created successfully!", "success");
        navigate("/"); // Redirect to home বা dashboard
      }
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Registration failed!",
        "error"
      );
    },
  });

  const onSubmit = (formData) => {
    console.log(formData);
    registerMutation.mutate(formData);
  };

  return (
    <div className="py-5 flex items-center justify-center">
      <div className="bg-white   border-2 border-gray-200 shadow-md rounded-lg w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Full name is required" })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="johndoe@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Phone
            </label>
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Gender
            </label>
            <select
              {...register("gender", { required: "Gender is required" })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: 6,
              })}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="******"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
