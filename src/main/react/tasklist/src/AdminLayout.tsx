import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import { env } from "./env"

const AdminLayout = () => {

  const lastUpdate = useSelector((state: any) => state.adminThemes.lastUpdate)
  return (
    <>
      <AdminNavbar />
      <div className="container-fluid bg-light main">
        <Outlet />
      </div>
      <link rel="stylesheet" type="text/css" href={env.backend+"/api/themes/current?v="+lastUpdate} />
    </>
  );
};

export default AdminLayout;
