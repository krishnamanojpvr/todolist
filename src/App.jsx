import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import UserHome from "./components/UserHome";
import UserProfile from "./components/UserProfile";
import UserAddTasks from "./components/UserAddTasks";
import UserManageTasks from "./components/UserManageTasks";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/useraddtasks" element={<UserAddTasks />} />
          <Route path="/usermanagetasks" element={<UserManageTasks />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
