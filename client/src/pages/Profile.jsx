import { useState, useEffect, useContext } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import axios from "axios";
import StoreContext from "@/context/storeContext";
import { baseURL } from "@/config/Config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const { store } = useContext(StoreContext);
  const token = store?.token;

  useEffect(() => {
    if (!token) return;
    axios.get(`${baseURL}/api/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user))
      .catch((error) => console.log(error));
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await axios.put(`${baseURL}/api/profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data.user);
      setMessage({ type: "success", text: "Profile image updated!" });
      setImageFile(null);
      setPreviewImage(null);
    } catch {
      setMessage({ type: "error", text: "Image upload failed!" });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/change-password`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: "success", text: res.data.message });
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed!" });
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
      {message.text && (
        <div className={`col-span-1 md:col-span-2 p-3 rounded text-white text-sm mb-2 ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message.text}
        </div>
      )}

      {/* LEFT: Image + Info */}
      <div className="bg-white p-6 rounded flex flex-col sm:flex-row justify-center items-center gap-6">
        <div className="flex flex-col items-center gap-y-3">
          <label htmlFor="img"
            className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-dashed border-slate-300 cursor-pointer flex justify-center items-center">
            {previewImage || user?.image ? (
              <img src={previewImage || user?.image} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <HiOutlineUserCircle className="text-6xl md:text-7xl" />
                <span className="text-xs">Select Image</span>
              </div>
            )}
          </label>
          <input type="file" id="img" className="hidden" accept="image/*" onChange={handleImageChange} />
          {imageFile && (
            <button onClick={handleImageUpload} disabled={uploading}
              className="px-4 py-1 bg-btnColor text-white rounded text-sm">
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </div>

        <div className="text-slate-700 flex flex-col gap-y-2 text-sm md:text-base">
          <span><b>Name:</b> {user?.name || "..."}</span>
          <span><b>Email:</b> {user?.email || "..."}</span>
          <span><b>Category:</b> {user?.category || "..."}</span>
          <span><b>Role:</b> {user?.role || "..."}</span>
        </div>
      </div>

      {/* RIGHT: Password Change */}
      <div className="bg-white py-4 px-6 text-slate-700 rounded">
        <h2 className="pb-3 text-center font-semibold">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="flex flex-col gap-y-2 mb-3">
            <label className="text-sm md:text-md font-medium text-gray-600">Old Password</label>
            <input type="password" value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              placeholder="Old password"
              className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10" />
          </div>
          <div className="flex flex-col gap-y-2 mb-3">
            <label className="text-sm md:text-md font-medium text-gray-600">New Password</label>
            <input type="password" value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="New password"
              className="px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-indigo-400 h-10" />
          </div>
          <div className="mt-4">
            <button type="submit"
              className="px-3 py-[6px] bg-btnColor hover:bg-hoverbtnColor text-white rounded-md text-sm">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;