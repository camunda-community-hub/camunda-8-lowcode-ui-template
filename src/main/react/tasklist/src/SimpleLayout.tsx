import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import { env } from "./env"

const SimpleLayout = () => {
  const lastUpdate = useSelector((state: any) => state.adminThemes.lastUpdate)
  return (
    <>
      <Outlet />

      <link rel="stylesheet" type="text/css" href={env.backend +"/api/themes/current?v=" + lastUpdate} />
    </>
  );
};

export default SimpleLayout;
