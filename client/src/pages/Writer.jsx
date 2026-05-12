import React, { useContext, useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import StoreContext from "@/context/storeContext";
import { baseURL } from "@/config/Config";
import axios from "axios";

const Writer = () => {
  const { store } = useContext(StoreContext);
  const [writers, setWriters] = useState([]);
  const token = store?.token;

  useEffect(() => {
    if (!token) return;
    const writterData = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/writers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWriters(Array.isArray(data.writers) ? data.writers : []);
      } catch (error) {
        console.log(error);
      }
    };
    writterData();
  }, [token]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 p-4">
        <h2 className="text-xl font-bold text-gray-800">Writers List</h2>
        <Link to={"/dashboard/add-writers"}
          className="px-3 py-[6px] bg-[#F7941D] hover:bg-[#E07D10] text-white rounded-md text-sm">
          + Add Writer
        </Link>
      </div>

      <div className="relative overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-slate-700 border border-gray-200 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3">No</th>
              <th className="px-3 md:px-6 py-3">Name</th>
              <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Category</th>
              <th className="px-3 md:px-6 py-3 hidden md:table-cell">Role</th>
              <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Image</th>
              <th className="px-3 md:px-6 py-3 hidden lg:table-cell">Email</th>
              <th className="px-3 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {writers.map((writer, index) => (
              <tr key={writer._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-3 md:px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-3 md:px-6 py-4">{writer.name}</td>
                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{writer.category}</span>
                </td>
                <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{writer.role}</span>
                </td>
                <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                  {writer.image ? (
                    <img src={writer.image} alt={writer.name} className="w-9 h-9 md:w-10 md:h-10 object-cover rounded-full border-2 border-gray-200" />
                  ) : (
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">No Image</span>
                  )}
                </td>
                <td className="px-3 md:px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-600">{writer.email}</span>
                </td>
                <td className="px-3 md:px-6 py-4">
                  <Link to={`/dashboard/writer/${writer._id}`}>
                    <button className="text-green-600 hover:text-green-800 text-xl">
                      <FaRegEye />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Writer;