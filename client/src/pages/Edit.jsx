import React, { useState, useRef, useContext, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdCloudUpload } from "react-icons/io";
import { MdDelete, MdDescription, MdCategory, MdDateRange } from "react-icons/md";
import EditorProps from "../components/EditorProps";
import axios from "axios";
import StoreContext from "@/context/storeContext";
import { baseURL } from "@/config/Config";
import toast from "react-hot-toast";

const Edit = () => {
  const [dateMode, setDateMode] = useState("manual");
    const [manualDate, setManualDate] = useState("");
  const { news_id } = useParams();
  const { store } = useContext(StoreContext);
  const [loader, setLoader] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [formData, setFormData] = useState({
    title: "", category: "", sourceType: "সংগৃহীত", description: "", date: "", image: null,
  });

  const get_news = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/api/news/${news_id}`, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setFormData({
        title: data.news.title,
        category: data.news.category,
        sourceType: data.news.sourceType || "সংগৃহীত",
        description: data.news.description,
        date: data.news.date,
        image: null,
      });
      setImagePreview(data.news.image);
      setOldImage(data.news.image);
    } catch (error) {
      console.log(error);
    }
  }, [news_id, store.token]);

  useEffect(() => { get_news(); }, [get_news]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const form = new FormData();
      form.append("title", formData.title);
      form.append("category", formData.category);
      form.append("sourceType", formData.sourceType);
      form.append("description", formData.description);
      form.append("date", formData.date);
      form.append("old_image", oldImage);
      if (formData.image) form.append("image", formData.image);
      const { data } = await axios.put(`${baseURL}/api/news/${news_id}`, form, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setLoader(false);
      toast.success(data.message);
      setTimeout(() => { window.location.href = "/dashboard/news"; }, 2500);
    } catch (error) {
      setLoader(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const getRealtimeDate = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${hours}:${minutes}`;
    };
  
    useEffect(() => {
      if (dateMode !== "realtime") {
        setFormData((prev) => ({ ...prev, date: manualDate }));
        return;
      }
      const syncRealtimeDate = () =>
        setFormData((prev) => ({ ...prev, date: getRealtimeDate() }));
      syncRealtimeDate();
      const interval = setInterval(syncRealtimeDate, 1000);
      return () => clearInterval(interval);
    }, [dateMode, manualDate]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-2 p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1 h-8 bg-[#F7941D] rounded-full"></span>
          Edit News
        </h2>
        <Link to={"/dashboard/news"}
          className="px-4 py-2 bg-[#F7941D] hover:bg-[#E07D10] text-white rounded-md transition-all duration-200 flex items-center gap-2 text-sm">
          <span>←</span> Back to News
        </Link>
      </div>

      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-[#F7941D]">📝</span>
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="Enter news title" required
              className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all duration-200" />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-y-2">
              <label className="text-sm font-medium text-gray-700">
                Date Type
              </label>
              <select
                value={dateMode}
                onChange={(e) => setDateMode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all duration-200"
              >
                <option value="manual">Manual Date</option>
                <option value="realtime">Realtime</option>
              </select>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MdCategory className="text-[#F7941D]" />
                Category <span className="text-red-500">*</span>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="sourceType"
                value={formData.sourceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all duration-200"
              >
                <option value="সংগৃহীত">সংগৃহীত</option>
                <option value="এ আই">এ আই</option>
              </select>
              <select name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all duration-200">
                <option value="">Select Category</option>
                <option value="সত্তা">সত্তা</option>
                <option value="রাষ্ট্র ও নীতি">রাষ্ট্র ও নীতি</option>
                <option value="বিশ্বপরিক্রমা">বিশ্বপরিক্রমা</option>
                <option value="অর্থ-কড়ি">অর্থ-কড়ি</option>
                <option value="মেঠোপথ ">মেঠোপথ</option>
                <option value="স্কোরবোর্ড ">স্কোরবোর্ড</option>
                <option value="দীপ্তাঙ্গন ">দীপ্তাঙ্গন</option>
                <option value="শিল্প-শৈলী ও যত্ন">শিল্প-শৈলী ও যত্ন</option>
                <option value="যান্ত্রিক">যান্ত্রিক</option>
                <option value="উভয় জগত">উভয় জগত</option>
              </select>
            </div>

             <div className="flex flex-col gap-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MdDateRange className="text-[#F7941D]" />
                            Date <span className="text-red-500">*</span>
                          </label>
                          {dateMode === "manual" ? (
                            <input
                              type="date"
                              name="date"
                              value={manualDate}
                              onChange={(e) => {
                                setManualDate(e.target.value);
                                setFormData((prev) => ({ ...prev, date: e.target.value }));
                              }}
                              required
                              className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all duration-200"
                            />
                          ) : (
                            <>
                              <input
                                type="text"
                                value={formData.date}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg outline-none border border-gray-300 bg-gray-50 text-gray-700"
                              />
                              <p className="text-xs text-gray-500">
                                Realtime format: d/m/yyyy, hh:mm
                              </p>
                            </>
                          )}
                        </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MdDescription className="text-[#F7941D]" />
              Description <span className="text-red-500">*</span>
            </label>
            <EditorProps initialContent={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
              <IoMdCloudUpload className="text-[#F7941D] text-lg" />
              Featured Image
            </label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-[#F7941D] transition-all duration-200">
                <label htmlFor="img"
                  className="w-full h-36 md:h-48 rounded-lg text-slate-700 gap-3 justify-center items-center cursor-pointer flex flex-col">
                  <IoMdCloudUpload className="text-5xl md:text-6xl text-gray-400" />
                  <span className="text-gray-600 font-medium text-sm md:text-base">Click to upload image</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                </label>
                <input type="file" id="img" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            ) : (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-36 md:h-48 w-auto object-cover rounded-lg border-2 border-[#F7941D]" />
                <button type="button" onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 shadow-md">
                  <MdDelete className="text-lg" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
            <Link to={"/dashboard/news"}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm">
              Cancel
            </Link>
            <button type="submit"
              className="px-5 py-2.5 bg-[#F7941D] hover:bg-[#E07D10] text-white rounded-lg transition-all duration-200 shadow-sm text-sm">
              {loader ? "Updating..." : "Update News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;