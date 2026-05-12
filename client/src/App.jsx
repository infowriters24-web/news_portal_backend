import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import Mainlayout from "./layouts/Mainlayout";
import AdminIndex from "./pages/AdminIndex";
import Login from "./pages/Login";
import ProtectDashboard from "./middleware/ProtectDashboard";
import Protectrole from "./middleware/Protectrole";
import Unable from "./pages/Unable";
import AddWriter from "./pages/AddWriter";
import Writer from "./pages/Writer";
import News from "./pages/News";
import Profile from "./pages/Profile";
import CreateNews from "./pages/CreateNews";
import WriterIndex from "./pages/WriterIndex";
import Edit from "./pages/Edit";
import WriterDetails from "./pages/WriterDetails";
import StoreContext from "./context/storeContext";

function App() {
  const { store } = useContext(StoreContext);
  const role = store?.userinfo?.role;
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectDashboard />}>
          <Route path="" element={<Mainlayout />}>
            <Route
              index
              element={
                role === "admin" ? (
                  <Navigate to="/dashboard/admin" replace />
                ) : role === "writer" ? (
                  <Navigate to="/dashboard/writer-index" replace />
                ) : (
                  <Navigate to="/dashboard/unable-access" replace />
                )
              }
            />
            <Route path="unable-access" element={<Unable />} />
            <Route path="news" element={<News />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit/:news_id" element={<Edit />} />

            {/* admin routes */}
            <Route path="" element={<Protectrole role="admin" />}>
              <Route path="admin" element={<AdminIndex />} />
              <Route path="add-writers" element={<AddWriter />} />
              <Route path="writer" element={<Writer />} />
              <Route path="writer/:writer_id" element={<WriterDetails />} />
            </Route>

            {/* writer routes */}
            <Route path="" element={<Protectrole role="writer" />}>
              <Route path="writer-index" element={<WriterIndex />} />
              <Route path="create-news" element={<CreateNews />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
