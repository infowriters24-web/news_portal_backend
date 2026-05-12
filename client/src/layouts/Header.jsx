import StoreContext from "@/context/storeContext";
import { useContext, useEffect, useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import axios from "axios";

const Header = () => {
  const { store } = useContext(StoreContext);
  const [profileImage, setProfileImage] = useState("");
  const token = store?.token;

  useEffect(() => {
    if (!token) return;
    axios
      .get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfileImage(res.data.user?.image || ""))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <div className="fixed top-0 md:top-4 left-0 md:left-[250px] right-0 z-50 px-3 md:px-4">
      <div className="w-full rounded h-[70px] flex justify-between items-center px-4 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10 w-40 md:w-56"
        />
        <div className="ml-auto">
          <div className="flex gap-x-2 items-center">
            <div className="flex flex-col justify-center items-end">
              <span className="text-sm font-medium">{store.userinfo?.name}</span>
              <span className="text-xs text-gray-500">{store.userinfo?.role}</span>
            </div>
            {profileImage ? (
              <img
                src={profileImage}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <HiOutlineUserCircle className="text-4xl text-slate-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;