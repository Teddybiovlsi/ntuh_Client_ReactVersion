import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function RewritePasswordProtected({
  verifyCode,
  redirectPath = "/",
  children,
}) {
  if (!verifyCode) {
    return <Navigate to={redirectPath} replace />;
  } else {
    return children ?? <Outlet />;
  }
}
