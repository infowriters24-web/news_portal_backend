import React, { useContext, useEffect, useMemo, useState } from "react";
import NewsContant from "../components/NewsContant";
import axios from "axios";
import { baseURL } from "@/config/Config";
import StoreContext from "@/context/storeContext";

const AdminIndex = () => {
  const { store } = useContext(StoreContext);
  const [newsData, setNewsData] = useState([]);
  const [writersCount, setWritersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = store?.token;

  useEffect(() => {
    if (!token) return;
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        const [newsRes, writersRes] = await Promise.all([
          axios.get(`${baseURL}/api/news`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseURL}/api/writers`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (ignore) return;
        setNewsData(Array.isArray(newsRes?.data?.news) ? newsRes.data.news : []);
        setWritersCount(Array.isArray(writersRes?.data?.writers) ? writersRes.data.writers.length : 0);
      } catch (error) {
        if (!ignore) console.error(error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 0);
    return () => { ignore = true; clearTimeout(timer); };
  }, [token]);

  const stats = useMemo(() => ({
    totalNews: newsData.length,
    pendingNews: newsData.filter((i) => i.status === "pending").length,
    activeNews: newsData.filter((i) => i.status === "active").length,
    deactiveNews: newsData.filter((i) => i.status === "deactive").length,
  }), [newsData]);

  const statCards = [
    { label: "Total News", value: stats.totalNews },
    { label: "Pending News", value: stats.pendingNews },
    { label: "Active News", value: stats.activeNews },
    { label: "Deactive News", value: stats.deactiveNews },
    { label: "Writers", value: writersCount },
  ];

  return (
    <div className="mt-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="flex justify-center flex-col rounded-md items-center p-4 gap-y-1 bg-white text-slate-700">
            <span className="text-xl font-bold">{loading ? "..." : card.value}</span>
            <span className="text-xs md:text-sm text-center">{card.label}</span>
          </div>
        ))}
      </div>
      <div className="bg-white p-3 md:p-4 mt-5 rounded-md">
        <h2 className="text-xl font-bold text-slate-700 pb-4">Latest News</h2>
        <NewsContant />
      </div>
    </div>
  );
};

export default AdminIndex;