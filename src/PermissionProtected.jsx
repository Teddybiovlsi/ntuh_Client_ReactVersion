import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

/** 具備完整功能存取權的權限值 */
const ALLOWED_PERMISSIONS = ['ylhClient'];

/**
 * 權限保護路由（fail-closed）。
 *
 * 採白名單：只有明確列於 ALLOWED_PERMISSIONS 的權限才放行，
 * 未知或空值一律導回，避免因權限值拼錯或缺漏而意外開放。
 */
export default function PermissionProtected({
  permission,
  redirectPath = '/',
  children,
}) {
  if (!ALLOWED_PERMISSIONS.includes(permission)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ?? <Outlet />;
}
