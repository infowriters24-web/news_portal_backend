import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Mainlayout = () => {
  return (
    <div className="w-full min-h-screen bg-slate-100 overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-[250px] w-full md:w-[calc(100vw-250px)] min-h-screen">
        <Header />
        <div className="p-3 md:p-4">
          <div className="pt-[85px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainlayout;