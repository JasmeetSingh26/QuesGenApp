import axios from "axios";
import { Route, Routes } from "react-router-dom";
import React from "react";
import { UserContextProvider } from "./UserContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./Header";
import IndexPage from "./pages/IndexPage";
import Gen from "./pages/Gen";

axios.defaults.withCredentials = true;
axios.defaults.timeout = 50000;

function App() {
  return (
    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/generate" element={<Gen />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
