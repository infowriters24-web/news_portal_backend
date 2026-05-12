import { baseURL } from "@/config/Config";
import StoreContext from "@/context/storeContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AddWriter = () => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({ name: "", email: "", password: "", category: "" });

  const inputHandler = (e) => setState({ ...state, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const { data } = await axios.post(`${baseURL}/api/add-writer`, state, {
        headers: { Authorization: `Bearer ${store.token}` },
      });
      setLoader(false);
      toast.success(data.message);
      navigate("/dashboard/writer");
    } catch (error) {
      setLoader(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-2 p-4">
        <h2 className="text-xl font-xl">Add Writer</h2>
        <Link to={"/dashboard/writer"}
          className="px-3 py-[6px] bg-btnColor hover:bg-hoverbtnColor text-white rounded-md text-sm">
          Writers
        </Link>
      </div>
      <div className="p-4">
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-y-2">
              <label htmlFor="name" className="text-sm md:text-md font-medium text-gray-600">Name</label>
              <input onChange={inputHandler} value={state.name} required type="text" name="name"
                placeholder="Writer name"
                className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10" id="name" />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="category" className="text-sm md:text-md font-medium text-gray-600">Category</label>
              <select onChange={inputHandler} value={state.category} required name="category" id="category"
                className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10">
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
              <label htmlFor="email" className="text-sm md:text-md font-medium text-gray-600">Email</label>
              <input onChange={inputHandler} value={state.email} required type="email" name="email"
                placeholder="Writer email"
                className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10" id="email" />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="password" className="text-sm md:text-md font-medium text-gray-600">Password</label>
              <input onChange={inputHandler} value={state.password} required type="password" name="password"
                placeholder="Writer password"
                className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10" id="password" />
            </div>
          </div>
          <div className="mt-4">
            <button disabled={loader}
              className="px-3 py-[6px] bg-btnColor hover:bg-hoverbtnColor text-white rounded-md text-sm">
              {loader ? "Loading..." : "Add Writer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWriter;