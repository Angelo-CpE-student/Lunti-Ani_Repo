import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RiskDetails from "./pages/RiskDetails";
import Weather from "./pages/Weather";
import CropManagement from "./pages/CropManagement";
import History from "./pages/History";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import DevMode from "./pages/DevMode";

function Protected({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useApp();
  if (!loggedIn) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useApp();
  if (loggedIn) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/risk-details" element={<Protected><RiskDetails /></Protected>} />
      <Route path="/weather" element={<Protected><Weather /></Protected>} />
      <Route path="/crop" element={<Protected><CropManagement /></Protected>} />
      <Route path="/history" element={<Protected><History /></Protected>} />
      <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="/dev-mode" element={<Protected><DevMode /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
