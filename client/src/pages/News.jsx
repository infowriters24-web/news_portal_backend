import React, { useContext } from "react";
import { Link } from "react-router-dom";
import NewsContant from "../components/NewsContant";
import StoreContext from "@/context/storeContext";

const News = () => {
  const { store } = useContext(StoreContext);
  return (
    <div className="bg-white rounded-md">
      <div className="flex flex-wrap justify-between items-center gap-2 p-4">
        <h2 className="text-xl font-medium">News</h2>
        {store.userinfo && store.userinfo.role !== "admin" && (
          <Link to={"/dashboard/create-news"}
            className="px-3 py-[6px] bg-btnColor hover:bg-hoverbtnColor text-white rounded-md text-sm">
            Create News
          </Link>
        )}
      </div>
      <NewsContant />
    </div>
  );
};

export default News;