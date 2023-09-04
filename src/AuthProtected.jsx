import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function AuthProtected({ user, redirectPath = '/', children }) {
  // const user = JSON.parse(localStorage?.getItem("user"));
  const nowTime = new Date();


  if (!user) {
    localStorage.getItem('user') && localStorage.clear();
    sessionStorage.getItem('user') && sessionStorage.clear();

    return <Navigate to="/" replace />;
  } else {
    // if (new Date(user.expTime) < nowTime) {
    //   // console.log("憑證過期");
    //   localStorage.removeItem("client");
    //   return <Navigate to={redirectPath} />;
    // } else {
    //   // console.log("憑證未過期", user.expTime, nowTime);
    //   return children ?? <Outlet />;
    // }
    return children ?? <Outlet />;
  }
}
