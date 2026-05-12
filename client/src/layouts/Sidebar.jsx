import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaNewspaper } from "react-icons/fa";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { FiUser, FiUsers } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { RiAddLine } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StoreContext from "@/context/storeContext";
import { useContext } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { store, dispatch } = useContext(StoreContext);

  const logout = () => {
    localStorage.removeItem("news_token");
    dispatch({ type: "logout", payload: null });
    navigate("/login");
  };

  const linkClass = (path) =>
    `${pathname === path ? "bg-indigo-500 text-white" : "bg-white text-[#404040f6]"} px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white`;

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="md:hidden fixed top-5 left-4 z-[100] bg-white p-2 rounded-md shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`w-[250px] h-screen fixed left-0 top-0 bg-white z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-[70px] flex justify-center items-center">
          <Link to={"/"} onClick={() => setIsOpen(false)}>
            <h1 className="text-2xl font-bold text-headerColor">
              Writers<span className="text-btnColor">24</span>
            </h1>
          </Link>
        </div>

        <ul className="px-3 flex flex-col gap-y-1 font-medium">
          {store.userinfo?.role === "admin" ? (
            <>
              <li>
                <Link to="/dashboard/admin" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/admin")}>
                  <RxDashboard /><span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/add-writers" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/add-writers")}>
                  <AiOutlinePlusSquare /><span>Add Writer</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/writer" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/writer")}>
                  <FiUsers /><span>Writer</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard/writer-index" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/writer-index")}>
                  <RxDashboard /><span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard/create-news" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/create-news")}>
                  <RiAddLine /><span>Create News</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/dashboard/news" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/news")}>
              <FaNewspaper /><span>News</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/profile" onClick={() => setIsOpen(false)} className={linkClass("/dashboard/profile")}>
              <FiUser /><span>Profile</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full bg-white text-[#404040f6] px-3 py-2 hover:shadow-lg hover:shadow-indigo-500/20 rounded-sm flex gap-x-2 justify-start items-center hover:bg-indigo-500 hover:text-white"
            >
              <IoIosLogOut /><span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;