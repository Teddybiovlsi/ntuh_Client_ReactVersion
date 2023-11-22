import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function PermissionProtected({
  permission,
  redirectPath = '/',
  children,
}) {
  if (permission === 'ylhGuest') {
    return <Navigate to={redirectPath} replace />;
  } else {
    return children ?? <Outlet />;
  }
}
