import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { clearUserSession } from './js/userAction';

/**
 * 登入保護路由。
 *
 * 注意：這只是前端的導流，無法取代後端授權。
 * 使用者仍可自行竄改 localStorage 繞過，因此後端必須對每個 token 獨立驗證。
 */
export default function AuthProtected({ user, redirectPath = '/', children }) {
  if (!user) {
    clearUserSession();
    return <Navigate to={redirectPath} replace />;
  }

  // 憑證過期檢查。後端可能以 expTime 或 expires_in 回傳，兩者皆支援。
  const expiration = user.expTime ?? user.expires_in;
  if (expiration) {
    const expirationDate = new Date(expiration);
    // 無法解析的日期視為未設定，不因格式問題把使用者踢出
    if (!Number.isNaN(expirationDate.getTime()) && expirationDate < new Date()) {
      clearUserSession();
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children ?? <Outlet />;
}
