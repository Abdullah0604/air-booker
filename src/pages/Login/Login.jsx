import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";

import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Login = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // TanStack Mutation
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/api/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.ok) {
        // Token save
        localStorage.setItem("token", data.data.token);
        Swal.fire("Success!", "Login successful!", "success");
        navigate("/"); // Redirect to Home (or dashboard)
      }
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid email or password!",
        "error"
      );
    },
  });

  const onSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className=" flex items-center justify-center pt-16 ">
      <div className="bg-white border-2 border-gray-200 shadow-md rounded-lg w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
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
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Option */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
