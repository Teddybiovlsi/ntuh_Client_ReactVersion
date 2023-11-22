import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { clearUserSession } from './js/userAction';

export default function AuthProtected({ user, redirectPath = '/', children }) {
  // const user = JSON.parse(localStorage?.getItem("user"));
  const nowTime = new Date();

  if (!user) {
    clearUserSession();

    return <Navigate to='/' replace />;
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
