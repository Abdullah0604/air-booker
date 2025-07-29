import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";

function MainLayout() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="min-h-screen max-w-[1300px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10 pt-28">
        <Outlet />
      </div>
    </div>
  );
}
export default MainLayout;
