import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const TasklistLayout = () => {
  const lastUpdate = useSelector((state: any) => state.adminThemes.lastUpdate)
  return (
    <>
      <Navbar />
      <div className="main container-fluid bg-light">
        <Outlet />
      </div>
      <link rel="stylesheet" type="text/css" href={"http://localhost:8080/api/themes/current?v=" + lastUpdate} />
    </>
  );
};

export default TasklistLayout;
