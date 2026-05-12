import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import StoreContext from "@/context/storeContext";
import { baseURL } from "@/config/Config";

const WriterDetails = () => {
  const { writer_id } = useParams();
  const { store } = useContext(StoreContext);
  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const token = store?.token;

  useEffect(() => {
    if (!token || !writer_id) return;
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/writers/${writer_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ignore) return;
        setWriter(data?.writer || null);
      } catch (error) {
        if (!ignore) setErrorMessage(error?.response?.data?.message || "Failed to load writer details");
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 0);
    return () => { ignore = true; clearTimeout(timer); };
  }, [token, writer_id]);

  return (
    <div className="bg-white rounded-md p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <h2 className="text-xl font-semibold text-slate-700">Writer Details</h2>
        <Link to="/dashboard/writer"
          className="px-3 py-[6px] bg-[#F7941D] hover:bg-[#E07D10] text-white rounded-md text-sm">
          Back to Writers
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : errorMessage ? (
        <div className="text-red-500">{errorMessage}</div>
      ) : writer ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
            {writer.image ? (
              <img src={writer.image} alt={writer.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50">No Image</div>
            )}
          </div>
          <div className="space-y-3 text-slate-700 text-sm md:text-base">
            <p><span className="font-semibold">Name:</span> {writer.name}</p>
            <p><span className="font-semibold">Email:</span> {writer.email}</p>
            <p><span className="font-semibold">Category:</span> {writer.category}</p>
            <p><span className="font-semibold">Role:</span> {writer.role}</p>
            <p><span className="font-semibold">Joined:</span> {writer.createdAt ? new Date(writer.createdAt).toLocaleDateString() : "-"}</p>
          </div>
        </div>
      ) : (
        <div className="text-slate-500">No writer data found.</div>
      )}
    </div>
  );
};

export default WriterDetails;