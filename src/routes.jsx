import { Routes, Route, Navigate } from 'react-router';
import CommonLayout from './layouts/common/CommonLayout.jsx';
import AuthLayout from './layouts/auth/AuthLayout.jsx';
import SimpleLayout from './layouts/simple/SimpleLayout.jsx';
import App from './App';
import AssetsPage from './assets/pages/AssetsPage.jsx';
import AssetDetailPage from './assets/pages/AssetDetailPage.jsx';
import DashboardPage from './dashboard/pages/DashboardPage.jsx';
import OrdersPage from './proposals/pages/OrdersPage.jsx';
import OrderDetailsPage from './proposals/pages/OrderDetailsPage.jsx';
import LoginPage from './auth/pages/LoginPage.jsx';
import RegisterBasicsPage from './auth/pages/RegisterBasicsPage.jsx';
import RegisterAuthPage from './auth/pages/RegisterAuthPage.jsx';
import RegisterLocationPage from './auth/pages/RegisterLocationPage.jsx';
import Page404 from './dashboard/pages/Page404.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/dashboard"  element={<CommonLayout />}>
        <Route index element={<Navigate to="/dashboard/app" />} />
        <Route path="app" element={<DashboardPage />} />
        <Route path="instrumentos" element={<AssetsPage />} />
        <Route path="instrumento/:id" element={<AssetDetailPage />} />
        <Route path="propostas" element={<OrdersPage />} />
        <Route path="proposta/:id" element={<OrderDetailsPage />} />
      </Route>

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

      {/* <Route path="/admin" element={<CommonLayout />}>
        <Route index element={<Navigate to="/admin/app" />} />
        <Route path="app" element={<DashboardApp />} />
        <Route path="propostas" element={<Orders />} />
        <Route path="proposta/:id/:idClient" element={<OrderDetails />} />
        <Route path="documentos" element={<Documents />} />
        <Route path="documento/:id/:idRevisao" element={<DocumentsDetails />} />
        <Route path="documento/:id/revisoes" element={<DocumentRevisions />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="cliente/:id" element={<ClientDetails />} />
      </Route> */}

      <Route element={<SimpleLayout />}>
        <Route index element={<Navigate to="/dashboard/app" />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} /> 
    </Routes>
  );
}
