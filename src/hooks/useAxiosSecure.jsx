import axios from "axios";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const axiosSecure = axios.create({
  baseURL: "https://flight-server-six.vercel.app",
  // baseURL: "http://localhost:5000",
});

function useAxiosSecure() {
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Attach Authorization header
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;

        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // Cleanup on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosSecure;
}

export default useAxiosSecure;
