import { createBrowserRouter } from "react-router";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import AllFlights from "../pages/AllFlights/AllFlights";
import AddNewFlight from "../pages/AddNewFlight/AddNewFlight";
import FlightDetails from "../pages/FlightDetails/FlightDetails";

const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "all-flights",
        Component: AllFlights,
      },
      {
        path: "add-flight",
        Component: AddNewFlight,
      },
      {
        path: "flight-details/:id",
        Component: FlightDetails,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "login",
        Component: Login,
      },
    ],
  },
]);

export default router;
