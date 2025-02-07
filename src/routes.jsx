import { Routes, Route, Navigate } from 'react-router';
import CommonLayout from './layouts/common/CommonLayout.jsx';
import AuthLayout from './layouts/auth/AuthLayout.jsx';
import SimpleLayout from './layouts/simple/SimpleLayout.jsx';
import AssetsPage from './assets/pages/AssetsPage.jsx';
import AssetDetailPage from './assets/pages/AssetDetailPage.jsx';
import DashboardPage from './dashboard/pages/DashboardPage.jsx';
import ProposalsPage from './proposals/pages/ProposalsPage.jsx';
import ProposalDetailsPage from './proposals/pages/ProposalDetailsPage.jsx';
import LoginPage from './auth/pages/LoginPage.jsx';
import RegisterBasicsPage from './auth/pages/RegisterBasicsPage.jsx';
import RegisterAuthPage from './auth/pages/RegisterAuthPage.jsx';
import RegisterLocationPage from './auth/pages/RegisterLocationPage.jsx';
import Page404 from './dashboard/pages/Page404.jsx';
import DocumentsPage from './documents/pages/DocumentsPage.jsx';
import DocumentDetailPage from './documents/pages/DocumentDetailPage.jsx';
import DocumentRevisions from './documents/pages/DocumentRevisions.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/dashboard"  element={<CommonLayout />}>
        <Route index element={<Navigate to="/dashboard/app" />} />
        <Route path="app" element={<DashboardPage />} />
        <Route path="instrumentos" element={<AssetsPage />} />
        <Route path="instrumento/:id" element={<AssetDetailPage />} />
        <Route path="propostas" element={<ProposalsPage />} />
        <Route path="proposta/:id" element={<ProposalDetailsPage />} />
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

      <Route path="/admin" element={<CommonLayout />}>
        <Route index element={<Navigate to="/admin/app" />} />
        <Route path="app" element={<DashboardPage />} />
        <Route path="propostas" element={<ProposalsPage />} />
        <Route path="proposta/:id/:idClient" element={<ProposalDetailsPage />} />
        <Route path="documentos" element={<DocumentsPage />} />
        <Route path="documento/:id/:idRevisao" element={<DocumentDetailPage />} />
        <Route path="documento/:id/revisoes" element={<DocumentRevisions />} />
        {/* <Route path="clientes" element={<Clients />} />
        <Route path="cliente/:id" element={<ClientDetails />} /> */}
      </Route>

      <Route element={<SimpleLayout />}>
        <Route index element={<Navigate to="/dashboard/app" />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} /> 
    </Routes>
  );
}
