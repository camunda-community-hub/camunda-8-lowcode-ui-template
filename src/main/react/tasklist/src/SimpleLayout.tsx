import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";

const SimpleLayout = () => {
  const lastUpdate = useSelector((state: any) => state.adminThemes.lastUpdate)
  return (
    <>
      <Outlet />

      <link rel="stylesheet" type="text/css" href={"http://localhost:8080/api/themes/current?v=" + lastUpdate} />
    </>
  );
};

export default SimpleLayout;
