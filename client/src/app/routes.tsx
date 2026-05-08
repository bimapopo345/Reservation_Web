import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { HistoryPage } from "./pages/HistoryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ShuffleTablesPage } from "./pages/ShuffleTablesPage";
import { MonitoringPage } from "./pages/MonitoringPage";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { ViewMapPage } from "./pages/ViewMapPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminHomePage } from "./pages/AdminHomePage";
import { ManageFloorPage } from "./pages/ManageFloorPage";
import { ManageDeskPage } from "./pages/ManageDeskPage";
import { ManageDeskTypePage } from "./pages/ManageDeskTypePage";
import { ManageUserPage } from "./pages/ManageUserPage";
import { ReportAnalyticPage } from "./pages/ReportAnalyticPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "shuffle", element: <ShuffleTablesPage /> },
      { path: "monitoring", element: <MonitoringPage /> },
      { path: "employee-list", element: <EmployeeListPage /> },
      { path: "floor-map", element: <ViewMapPage /> },
      { path: "admin-home", element: <ProtectedRoute requireAdmin><AdminHomePage /></ProtectedRoute> },
      { path: "manage-floor", element: <ProtectedRoute requireAdmin><ManageFloorPage /></ProtectedRoute> },
      { path: "manage-desk", element: <ProtectedRoute requireAdmin><ManageDeskPage /></ProtectedRoute> },
      { path: "manage-desk-type", element: <ProtectedRoute requireAdmin><ManageDeskTypePage /></ProtectedRoute> },
      { path: "manage-user", element: <ProtectedRoute requireAdmin><ManageUserPage /></ProtectedRoute> },
      { path: "report-analytic", element: <ProtectedRoute requireAdmin><ReportAnalyticPage /></ProtectedRoute> },
    ],
  },
]);
