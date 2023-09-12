import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function RewritePasswordProtected({
  info,
  redirectPath = "/",
  children,
}) {
  if (!info) {
    return <Navigate to={redirectPath} replace />;
  } else {
    return children ?? <Outlet />;
  }
}
