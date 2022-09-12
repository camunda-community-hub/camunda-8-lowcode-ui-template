import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="container-fluid bg-light">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
