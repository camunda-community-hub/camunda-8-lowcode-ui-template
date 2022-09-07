import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;