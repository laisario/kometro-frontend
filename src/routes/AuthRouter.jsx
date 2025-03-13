import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import AuthLayout from '../layouts/auth/AuthLayout'
import LoginPage from '../auth/pages/LoginPage'
import RegisterBasicsPage from '../auth/pages/RegisterBasicsPage'
import RegisterAuthPage from '../auth/pages/RegisterAuthPage'
import RegisterLocationPage from '../auth/pages/RegisterLocationPage'
import SimpleLayout from '../layouts/simple/SimpleLayout'
import Page404 from '../dashboard/pages/Page404'

function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
      <Route index element={<Navigate to="/login" />} />
      <Route path="login" element={<LoginPage />} />
    </Route>
    <Route path="/register" element={<AuthLayout />}>
      <Route index element={<Navigate to="/register/basics" />} />
      <Route path="basics" element={<RegisterBasicsPage />} />
      <Route path="auth" element={<RegisterAuthPage />} />
      <Route path="location" element={<RegisterLocationPage />} />
    </Route>


    <Route element={<SimpleLayout />}>
      <Route index element={<Navigate to="/dashboard/app" />} />
      <Route path="404" element={<Page404 />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Route>
    </Routes>
  )
}

export default AuthRouter