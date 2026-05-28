import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AccessDeniedPage from '../pages/dashboard/AccessDeniedPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserRequestsPage from '../pages/admin/AdminUserRequestsPage';
import AssignedRequestsPage from '../pages/admin/AssignedRequestsPage';
import CreatedRequestsPage from '../pages/admin/CreatedRequestsPage';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import NotFoundPage from '../pages/dashboard/NotFoundPage';
import CreateRequestPage from '../pages/requests/CreateRequestPage';
import MyRequestsPage from '../pages/requests/MyRequestsPage';
import RequestDetailsPage from '../pages/requests/RequestDetailsPage';
import ReviewsPage from '../pages/reviews/ReviewsPage';
import CreateUserPage from '../pages/super-admin/CreateUserPage';
import SearchUserPage from '../pages/super-admin/SearchUserPage';
import SuperAdminDashboardPage from '../pages/super-admin/SuperAdminDashboardPage';
import UserManagementPage from '../pages/super-admin/UserManagementPage';
import ProfilePage from '../pages/profile/ProfilePage';
import DashboardRedirect from './DashboardRedirect';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { ROLES } from '../utils/roles';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardRedirect />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/requests/:requestId" element={<RequestDetailsPage />} />

        <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requests" element={<MyRequestsPage />} />
          <Route path="/requests/create" element={<CreateRequestPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />}>
          <Route path="/admin/reviews" element={<ReviewsPage />} />
          <Route path="/admin/created-requests" element={<CreatedRequestsPage />} />
          <Route path="/admin/assigned-requests" element={<AssignedRequestsPage />} />
          <Route path="/admin/user-requests" element={<AdminUserRequestsPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboardPage />} />
          <Route path="/super-admin/users" element={<UserManagementPage />} />
          <Route path="/super-admin/users/create" element={<CreateUserPage />} />
          <Route path="/super-admin/users/search" element={<SearchUserPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

export default AppRouter;

