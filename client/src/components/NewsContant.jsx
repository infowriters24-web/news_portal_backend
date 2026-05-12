import React, { useState, useEffect, useContext, useCallback } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { baseURL } from "@/config/Config";
import StoreContext from "@/context/storeContext";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const NewsContant = () => {
  const { store } = useContext(StoreContext);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const get_news = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/api/news`, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setNewsData(data.news || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [store.token]);

  useEffect(() => { get_news(); }, [get_news]);

  const handleStatusChange = async (news_id, newStatus) => {
    try {
      const { data } = await axios.patch(
        `${baseURL}/api/news/status/${news_id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${store.token}` } }
      );
      setNewsData((prev) =>
        prev.map((item) => item._id === news_id ? { ...item, status: data.news.status } : item)
      );
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const filteredData = newsData.filter((news) => {
    const matchStatus = filterStatus ? news.status === filterStatus : true;
    const matchSearch = searchText ? news.title?.toLowerCase().includes(searchText.toLowerCase()) : true;
    return matchStatus && matchSearch;
  });

  useEffect(() => { setCurrentPage(1); }, [filterStatus, searchText]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "deactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (news_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This news will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#F7941D",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${baseURL}/api/news/${news_id}`, {
          headers: { Authorization: `Bearer ${store.token}` },
        });
        if (response.status === 200) {
          setNewsData((prev) => prev.filter((n) => n._id !== news_id));
          await Swal.fire({
            title: "Deleted!",
            text: "News and image deleted successfully.",
            icon: "success",
            confirmButtonColor: "#F7941D",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.log(error);
        await Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#F7941D",
        });
      }
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        <select
          className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#F7941D] h-10 w-full sm:w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">--- Select type ---</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        <input
          type="text"
          placeholder="Search news..."
          className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-[#F7941D] h-10 w-full sm:w-64"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto p-4">
        <table className="w-full text-sm text-left text-slate-700 border border-gray-200 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-3 md:px-6 py-3">No</th>
              <th className="px-3 md:px-6 py-3">Title</th>
              <th className="px-3 md:px-6 py-3 hidden sm:table-cell">Image</th>
              <th className="px-3 md:px-6 py-3 hidden md:table-cell">Category</th>
              <th className="px-3 md:px-6 py-3 hidden lg:table-cell">Description</th>
              <th className="px-3 md:px-6 py-3 hidden lg:table-cell">Date</th>
              <th className="px-3 md:px-6 py-3">Status</th>
              <th className="px-3 md:px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">No news found</td></tr>
            ) : (
              currentItems.map((news, index) => (
                <tr key={news._id || index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-4 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-3 md:px-6 py-4 max-w-[120px] md:max-w-none truncate">{news.title}</td>
                  <td className="px-3 md:px-6 py-4 hidden sm:table-cell">
                    {news.image ? (
                      <img src={news.image} alt={news.title} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-md" />
                    ) : (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">No Image</span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{news.category}</span>
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden lg:table-cell max-w-xs truncate">
                    {news.description?.replace(/<[^>]*>/g, "")}
                  </td>
                  <td className="px-3 md:px-6 py-4 hidden lg:table-cell">{news.date}</td>
                  <td className="px-3 md:px-6 py-4">
                    {store?.userinfo?.role === "admin" ? (
                      <select
                        value={news.status}
                        onChange={(e) => handleStatusChange(news._id, e.target.value)}
                        className={`${getStatusColor(news.status)} px-2 py-1 rounded-full text-xs border-0 outline-none cursor-pointer font-medium`}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="deactive">Deactive</option>
                      </select>
                    ) : (
                      <span className={`${getStatusColor(news.status)} px-2 py-1 rounded-full text-xs`}>
                        {news.status}
                      </span>
                    )}
                  </td>
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(news._id)} className="text-red-500 hover:text-red-700 text-xl">
                        <MdDelete />
                      </button>
                      <Link to={`/dashboard/edit/${news._id}`}>
                        <button className="text-yellow-500 hover:text-yellow-700 text-xl">
                          <FaEdit />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end px-4 md:px-10 gap-x-3 text-[#6b7280]">
        <p className="px-4 py-3 font-semibold text-sm">Pages</p>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
    </div>
  );
};

export default NewsContant;